const express  = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const kill = require('tree-kill');
const csrfMiddleware = csrf({cookie: true}); 
const socketIO = require('socket.io');


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
var r1Web = io.of('/router1');
r1Web.on('connection', (socket) => {
    console.log('a new user connected to router1');
    
});

module.exports=io;


