var socketio = require('socket.io');
var io;
var store = require('../libs/store');
var connect = require('connect');
var cookie = require('cookie');
var async = require('async');
var User = require('../models/user').User;
var config = require('../config');
var currentRoom = {};

function loadSession(sid, callback) {

    store.load(sid, function(err, session) {
        if (arguments.length == 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });

}
function loadUser(session, callback) {

    if (!session.user) {
        console.log("Session %s is anonymous", session.id);
        return callback(null, null);
    }
    console.log("retrieving user ", session.user);

    User.findById(session.user, function(err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null);
        }
        console.log("user findbyId result: " + user);
        callback(null, user);
    });

}

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);

//@todo user autorize chek
    io.set('authorization', function(handshake, callback) {
        async.waterfall([
            function(callback) {
                handshake.cookies = cookie.parse(handshake.headers.cookie || '');
                var sidCookie = handshake.cookies['sid'];
                var sid = connect.utils.parseSignedCookie(sidCookie, config.get('session:secret'));

                loadSession(sid, callback);
            },
            function(session, callback) {

                if (!session) {
                    callback(new Error());
                }

                handshake.session = session;
                loadUser(session, callback);
            },
            function(user, callback) {
                if (!user) {
                    callback(new Error());
                }else{
                    handshake.user = user;
                    callback(null);
                }
            }

        ], function(err) {

            if (!err) {
                return callback(null, true);
            }

            return callback(null, false);
        });

    });

    io.sockets.on('connection', function (socket) {
        guestName = assignGuestName(socket);
        joinRoom(socket, 'Lobby');
        handleMessageBroadcasting(socket);
        handleRoomJoining(socket);
        handleClientDisconnection(socket);
    });
};


function assignGuestName(socket) {
    var username = socket.handshake.user.get('username');
    socket.emit('nameResult', {
        success: true,
        name: username
    });
    return username;
}

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;

//@todo make user active
    socket.broadcast.to(room).emit('joinResult', {
        addNew: socket.handshake.user.get('username')
    });

}

function handleMessageBroadcasting(socket) {

}

//@todo load messages for room
function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

//@todo make user unactive
function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        socket.emit('nameResult')
    });
}
