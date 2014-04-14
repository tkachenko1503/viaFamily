var mongoose = require('./libs/mongoose');
var async = require('async');

async.series([
    open,
//    dropDatabase,
    requireModels,
    createUsers
], function(err) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

//function dropDatabase(callback) {
//    var db = mongoose.connection.db;
//    db.dropDatabase(callback);
//}

function requireModels(callback) {
    require('./models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {

    var users_team = [
        {username: 'Serg', password: 'pass'},
        {username: 'Ruslan', password: 'pass'}
    ];

    async.each(users_team, function(userData, callback) {
        var team_user = new mongoose.models.User(userData);
        team_user.save(callback);
    }, callback);
}
