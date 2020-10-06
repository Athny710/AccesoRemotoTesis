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

swTop.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('swTop');
});

//-------Reset-Reload
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


