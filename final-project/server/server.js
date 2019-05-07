const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 4000

io.on('connection', function(socket) {
    console.log("connected")
    socket.on('user_join', function(data) {
      this.username = data;
      console.log("joined:", data)
      socket.broadcast.emit('user_join', data);
      console.log("user joined")
    });
  
    socket.on('chat_message', function(data) {
      // data.username = this.username;
      socket.broadcast.emit('chat_message', data);
      console.log("user sent a message")
    });
  
    socket.on('disconnect', function(data) {
      socket.broadcast.emit('user_leave', this.username);
      console.log("user left")
    });
    
  });
  
 http.listen(port, function () {
    console.log('Listening on *:' + port);
});