const express  = require('express');
const app = express();
const path = require('path');
const kill = require('tree-kill');
const { allowedNodeEnvironmentFlags } = require('process');
const socketIO = require('socket.io');
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const csrfMiddleware = csrf({cookie: true}); 
const spawn = require('child_process').spawn;
var process;

//static files
app.set('html', path.join(__dirname, 'html'))
app.set('html', path.join(__dirname, 'script'))
app.use(express.static(path.join(__dirname, 'public')));

// setings
app.set('port', 8080);
app.engine("html", require('ejs').renderFile);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

// listening the server
const server = app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'))
})

// routes 
app.use(require('./routes/index'));

// socket para la conexion a equipos
const io = socketIO(server);
var listaProcesos = [];
listaProcesos.length = 25;

io.on('connection', (socket) => {
    

    socket.on('actualizarReserva', () => {
        
        if(process===undefined){
            console.log('No hay procesos');
        }else{
            console.log('Se cerro la consola del equipo');
            kill(process.pid);
        }
        
    });

    socket.on('swTop', () => {
        console.log('Deberia aparecer la consola');
        var funcion = 'swTopologico';
        process = spawn('python', [path.join(__dirname, '/script/conexiones.py'), funcion], {shell: true, detached: true});
        
    });
    socket.on('resetRouter',(data) => {
        console.log('Deberia haber terminado el proceso!!!!');
        kill(process.pid);
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


