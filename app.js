
var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);
var mongoose = require('./libs/mongoose');
var HttpError = require('./error').HttpError;
var app = express();
var lessMiddleware = require('less-middleware');

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.favicon());

if(app.get('env')=='development'){
	app.use(express.logger('dev'));
}else{
	app.use(express.logger('default'));
}

app.use(express.bodyParser());
app.use(express.cookieParser());

var mongoStore = require('connect-mongo')(express);

app.use(express.session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: new mongoStore({mongoose_connection: mongoose.connection})
}));

app.use(app.router);

require('./routes')(app);

app.use(lessMiddleware({
    dest: '/css', // should be the URI to your css directory from the location bar in your browser
    src: '/less', // or '../less' if the less directory is outside of /public
    root: path.join(__dirname, 'public'),
    compress: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next){
    if(typeof err == 'number'){
        err = new HttpError(err);
    }
    if(err instanceof HttpError){
        res.sendHttpError(err);
    } else{
        if(app.get('env') == 'development'){
            var errorHandler = express.errorHandler();
            errorHandler(err, req, res, next);
        }else{
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});


var server = http.createServer(app);
server.listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});
