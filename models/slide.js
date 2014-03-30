var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    whosee: [String],
    type: String,
    schedule: {
        type: Date,
        default: Date.now
    }
});

exports.Slide = mongoose.model('Slide', schema);
