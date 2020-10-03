const express = require('express');
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser');
const http = require('http').Server(app);
const server = require('./listen.js');
const MongoClient = require('mongodb').MongoClient;
const io = require('socket.io')(http);
const sockets = require('./socket.js');
const url = 'mongodb://localhost:27017';
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/../dist/chat'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
sockets.connect(io, PORT);

const ops = require('./dbOps');
app.post('/login', ops.login);
app.post('/adduser', ops.addUser);
app.post('/getuser', ops.getUser);
app.post('/deluser', ops.deleteUser);
app.post('/updateuser', ops.updateUser);
app.post('/addgroup', ops.addGroup);
app.post('/getgroup', ops.getGroup);
app.post('/delgroup', ops.delGroup);
app.post('/addroom', ops.addRoom);
app.post('/delroom', ops.delRoom);
app.post('/adduser2g', ops.addUser2G);
app.post('/deluser2g', ops.delUser2G);
app.post('/adduser2r', ops.addUser2R);
app.post('/deluser2r', ops.delUser2R);

server.listen(http, PORT);
module.exports = app;