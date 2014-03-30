var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    events: {
        reminder: {type: Number, default: 0},
        meets: {type: Number, default: 0},
        facts: {type: Number, default: 0}
    },
    date: {
        type: Date,
        default: Date.now
    },
    id: String
});

exports.Dayinfo = mongoose.model('Dayinfo', schema);