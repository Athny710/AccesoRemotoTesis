const express  = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const kill = require('tree-kill');
const csrfMiddleware = csrf({cookie: true}); 
const socketIO = require('socket.io');
const ioServer = require('socket.io-client');

//-------Static files
app.use(express.static(path.join(__dirname, 'public')));

//--------Setings
app.set('port', 8080);
app.engine("html", require('ejs').renderFile);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

//-------Listening server
const server = app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'))
})

//-------Routes 
app.use(require('./routes/index'));

//-------Conexion a equipos 
const io = socketIO(server);

var r1Server = ioServer('http://192.168.35.22:8080/router1');
var r1Web = io.of('/router1');

r1Web.on('connection', (socket) => {
    console.log('A new user connected to router1 Web');
    socket.on('data', (data) => { 
       r1Server.emit('data', data);
    });
});
r1Server.on('data', (data) => {
    r1Web.emit('data', data);
});
r1Server.on('prompt', (prompt) => {
    r1Web.emit('prompt', prompt);
});

module.exports=io;


