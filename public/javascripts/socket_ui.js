define(['socket.io', 'mediator'], function(io, AppEvent){
    var Chat = function(socket) {
        this.socket = socket;
    };

    Chat.prototype.sendMessage = function(room, text) {
//        var message = {
//            room: room,
//            text: text
//        };
        this.socket.emit('message', message);
    };
    var socket = io.connect(
        'http://localhost:3000'
    );
    function init(App) {

        var chatApp = new Chat(socket);

        socket.socket.on('error', function (reason) {
            console.error('Unable to connect Socket.IO', reason);
            AppEvent.trigger('user:logIn');
        });
        socket.on('connect', function (sock) {
            console.info('successfully established a working connection \o/');
        });
        socket.on('nameResult', function (result) {
            if (result.success) {
                chatApp.selfName = result.name;
            }
        });

        socket.on('message', function (message) {

        });
    }

    AppEvent.subscribe({
        'app:ready': init
    });

    return socket;
});