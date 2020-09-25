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
app.post('/login', require('./login.js'));
app.post('/getgroup', require('./getgroup.js'));
sockets.connect(io, PORT);

MongoClient.connect(url, {poolSize:10, useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
  if (err){
    return console.log(err);
  }
  const dbName = 'mydb';
  const db = client.db(dbName);

  require('./adduser.js')(db,app);
  require('./getuser.js')(db,app);
  require('./deluser.js')(db,app);
  require('./updateuser.js')(db,app);

  server.listen(http, PORT);
});
