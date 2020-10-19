const express  = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const kill = require('tree-kill');
const csrfMiddleware = csrf({cookie: true}); 
const spawn = require('child_process').spawn;
const socketIO = require('socket.io');
var  swTop, r1, r2, r3, r4, r5, r6, r7, r8, sw1,sw2, sw3, sw4, sw5, sw6, sw7, sw8;
const equipos = [swTop, r1, r2, r3, r4, r5, r6, r7, r8, sw1, sw2, sw3, sw4, sw5, sw6, sw7, sw8];

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

io.on('connection', (socket) => {
    socket.on('actualizarReserva', () => {
        for(var i=0; i<equipos.length; i++){
            if(equipos[i]==undefined){
                console.log('No hay procesos.');
            }else{
                kill(equipo[i].pid);
            }
        }
    });
    socket.on('acceder', (data) => {
        equipos[data.index] = spawn('python', [path.join(__dirname, '/script/conexiones.py'), data.name], {shell: true, detached: true});
    });
    socket.on('resetRouter',(data) => {
        console.log(data.router);
    });
    socket.on('reloadRouter',(data) => {
        console.log(data.router);
    });
    socket.on('resetSwitch', (data) => {
        console.log(data.sw);
    });
    socket.on('reloadSwitch', (data) => {
        console.log(data.sw);
    });
    
});
module.exports=io;


