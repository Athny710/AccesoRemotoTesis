//--------Socket
const socket = io();

//--------TimeOut
let horaFin = document.getElementById('horaFin').value;
let now = moment();
horaFin=moment(horaFin, 'HH:mm:ss');
let tiempo = horaFin.diff(now, 'seconds');

setTimeout(function(){
    socket.emit('actualizarReserva');
    window.location = '/inicio';
}, tiempo*1000);

//--------Laboratorio Equipos
let swTop = document.getElementById('swTop');
let router1 = document.getElementById('r1');
let router2 = document.getElementById('r2');
let router3 = document.getElementById('r3');
let router4 = document.getElementById('r4');
let router5 = document.getElementById('r5');
let router6 = document.getElementById('r6');
let router7 = document.getElementById('r7');
let router8 = document.getElementById('r8');
let switch1 = document.getElementById('sw1');
let switch2 = document.getElementById('sw2');
let switch3 = document.getElementById('sw3');
let switch4 = document.getElementById('sw4');
let switch5 = document.getElementById('sw5');
let switch6 = document.getElementById('sw6');
let switch7 = document.getElementById('sw7');
let switch8 = document.getElementById('sw8');
swTop.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:0, name:'swTop'});
});
router1.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:1, name:'router1'});
});
router2.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:2, name:'router2'});
});
router3.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:3, name:'router3'});
});
router4.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:4, name:'router4'});
});
router5.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:5, name:'router5'});
});
router6.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:6, name:'router6'});
});
router7.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:7, name:'router7'});
});
router8.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:8, name:'router8'});
});
switch1.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:9, name:'switch1'});
})
switch2.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:10, name:'switch2'});
})
switch3.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:11, name:'switch3'});
})
switch4.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:12, name:'switch4'});
})
switch5.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:13, name:'switch5'});
})
switch6.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:14, name:'switch6'});
})
switch7.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:15, name:'switch7'});
})
switch8.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('acceder', {index:16, name:'switch8'});
})

//-------Configuraciones-Botones ayuda
let resetBtnR = document.getElementById('resetBtnR');
let reloadBtnR = document.getElementById('reloadBtnR');
let resetBtnS = document.getElementById('resetBtnS');
let reloadBtnS = document.getElementById('reloadBtnS');

resetBtnR.addEventListener('click', (e) => {
    const router = document.getElementById('router').value;
    e.preventDefault();
    socket.emit('resetRouter', {router});
});
reloadBtnR.addEventListener('click', (e) => {
    const router = document.getElementById('router').value;
    e.preventDefault();
    socket.emit('reloadRouter', {router});
});
resetBtnS.addEventListener('click', (e) => {
    const sw = document.getElementById('switch').value;
    e.preventDefault();
    socket.emit('resetSwitch', {sw});
});
reloadBtnS.addEventListener('click', (e) => {
    const sw = document.getElementById('switch').value;
    e.preventDefault();
    socket.emit('reloadSwitch', {sw});
});


