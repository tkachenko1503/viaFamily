var slideModel = require('../models/slide').Slide;
var dayinfo = require('../models/dayinfo').Dayinfo;
var calendar = require('node-calendar');


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

        var slideType = 'events.'+slide.type;
        var action = {};
        action[slideType] = 1;
        var slideObject = {date: new Date(slide.schedule), id: new Date(slide.schedule).toDateString()};
        dayinfo.update(slideObject, {$inc: action },{upsert: true},
            function(err, day){
                if(err) next(err);
                res.send('ok');
            });
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
    slideModel.update(
        {
            _id: req.params.id
        },
        {
            name: form.name,
            description: form.description,
            whosee: form.whosee,
            type: form.type,
            schedule: new Date(form.schedule)
        }, function(err, slide) {
            if (err) next(err);

            res.send('ok');
        });
}