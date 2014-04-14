var slideModel = require('../models/slide').Slide;
var dayinfo = require('../models/dayinfo').Dayinfo;
var calendar = require('node-calendar');
var User = require('../models/user').User;

function increment(type, date, decr){
    var slideType = 'events.'+type;
    var action = {};
    action[slideType] = decr ? -1 : 1;
    var slideObject = {date: new Date(date), id: new Date(date).toDateString()};
    dayinfo.update(slideObject, {$inc: action },{upsert: true},
        function(err, day){
            if(err) next(err);
        });
}


exports.getAll = function(req, res, next) {
    var day = new Date(req.query.day);
    slideModel.find({'schedule': {'$gte': day, '$lt': new Date(Number(day)+(3600*24*1000))} }, function(err, docs){
        if(err) next(err);

        res.send(docs);
    });
};

exports.add = function(req, res, next) {
    var form = req.body.data;
    slideModel.create({
        name: form.name,
        description: form.description,
        whosee: form.whosee,
        type: form.type,
        schedule: new Date(form.schedule)
    }, function(err, slide){
        if(err) next(err);

        increment(slide.type, slide.schedule, false);
        res.send('ok');
    });

};

exports.viewData = function(req, res, next){
    var month = Number(req.body.data.month),
        year = req.body.data.year;

    var start = new Date(year, month, "1");
    var end = new Date(year, String(Number(month)+1), "1");
    dayinfo.find({date: {$gte: start, $lt: end} }, function(err, data){
        if(err) next(err);

        res.send(data);
    });
};

exports.update = function(req, res, next){
    var form = req.body.data;
    slideModel.find({_id: req.params.id}, function(err, result){
        increment(result[0].type, result[0].schedule, true);
    });
    var forSave = {
        name: form.name,
        description: form.description,
        whosee: form.whosee,
        type: form.type,
        schedule: new Date(form.schedule)
    };
    slideModel.update(
        {
            _id: req.params.id
        },
        forSave,
        function(err, slide) {
            if (err) next(err);

            increment(forSave.type, forSave.schedule, false);
            res.send('ok');
        });
};
