const express = require('express');
const app = express();
app.use(express.static('public'));
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://127.0.0.1/SOcketImage';

mongoose
  .connect(MONGODB_URI, {  useUnifiedTopology: true })
  .then(() => console.log('Mongo connected, re baba'))
  .catch((error) => console.log('Error occurred, re baba'));

const Messkakahan = new mongoose.Schema({
  nam: String,
  kam: String,
  photo: String,
});

const Mess = mongoose.model('Mess', Messkakahan);

io.on('connection', (socket) => {
  console.log('New member came');

  Mess.find({})
    .then((messages) => {
      socket.emit('load messages', messages);
    })
    .catch((err) => {
      console.error('Error loading messages:', err);
    });

  socket.on('bandanam', (banda) => {
    console.log('Received bandanam event:', banda);
    io.emit('join_vala_functio', banda);
  });

  socket.on('band_karto', () => {
    io.emit('user_left_zala', socket.bandaname);
  });

  socket.on('image_and_chat', (ma) => {
    const message = new Mess({
      nam: ma.nam,
      kam: ma.kam,
      photo: ma.photo,
    });

    message
      .save()
      .then(() => {
        io.emit('image_and_chat', ma);
      })
      .catch((err) => console.log(err));
  });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log('App is listening on port', PORT);
});
