const { Game, Player, NullPlayer } = require('./classes.js');
const express = require("express");
const http = require("http");
const path = require("path");
const { start } = require('repl');
const socketIO = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const game = new Game();

const port = 5000;

app.set("port", port);
app.use("/static", express.static(__dirname + "/static"));

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

server.listen(port, "0.0.0.0", function () {
  console.log(`starting server at  0.0.0.0:${port}`);
  console.log('use "ipconfig" in cmd to see adress');
  console.log('http://127.0.0.1:5000');
});

io.on("connection", function (socket) {
  socket.on('new_player', () => {
    if (!game.connect(new Player('null', socket.id))) {
      socket.emit('watcher');
    };
    socket.emit('load_game', game.log(socket.id));
  });

  socket.on('disconnect', () => {
    if (game.select_player(socket.id)) {
      game.disconnect(game.select_player(socket.id));
      io.sockets.sockets.forEach((sckt) => {
        sckt.emit('load_game', game.log(sckt.id));
      });
    };
  });

  socket.on('->rename_player', (data) => {
    game.select_player(socket.id).name = data.value;
    socket.broadcast.emit('<-rename_player', {
      value: data.value, command: game.select_player(socket.id).command
    });
  });

  socket.on('start', () => {
    if (game.select_player(socket.id).command == 'red') {
      game.run();
      io.sockets.sockets.forEach((sckt) => {
        sckt.emit('load_game', game.log(sckt.id));
        sckt.emit('run_game', game.total_players);
      });
    };
  });

  socket.on('->roll', () => {
    const num = Math.floor(Math.random() * 11) + 2;
    if (game.current_turn == game.select_player(socket.id).command && !game.dice_rolled) {
      game.select_player(socket.id).move(num);
      game.dice_rolled = true
      io.sockets.sockets.forEach((sckt) => {
        sckt.emit('<-roll', {
          num: num, player: game.select_player(socket.id).command,
          command: game.select_player(sckt.id).command
        });
      });
    };
  });

  socket.on('next_turn', () => {
    if (game.next_turn()) {
      io.sockets.sockets.forEach((sckt) => {
        sckt.emit('load_game', game.log(sckt.id));
      });
    }
  });

});
