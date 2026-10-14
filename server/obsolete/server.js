const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
var bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sockets = require('../socket.js');
const server = require('../listen.js');

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../../dist/chat')));
app.post('/login', require('./login.js'));
app.post('/getuser', require('./getuser.js'));
app.post('/adduser', require('./adduser.js'));
app.post('/deluser', require('./deluser.js'));
app.post('/updateuser', require('./updateuser.js'));
app.post('/getgroup', require('./getgroup.js'));
app.post('/addgroup', require('./addgroup.js'));

sockets.connect(io);
server.listen(http, PORT);