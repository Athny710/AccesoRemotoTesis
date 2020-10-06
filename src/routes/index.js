const moment = require('moment');
const express = require('express');
const route = express.Router();
const path = require('path');
const admin = require("firebase-admin");
const { firebase } = require('googleapis/build/src/apis/firebase');
const { stringify } = require('querystring');
const serviceAccount = require(path.join(__dirname, "../../serviceAccountKey.json"));
var horaActual;
var mensaje, mensajeSucc, horaFin;
var accesoLab = 0;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://laboratorio-v305.firebaseio.com"
});



route.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

route.get('/', (req, res) => {
    res.render(path.join(__dirname, '../html/index.html'));
});

route.get('/inicio', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
            res.render(path.join(__dirname, '../html/inicio.ejs'),{mensaje});
            mensaje=null;
        })
        .catch((error) => {
            res.redirect("/");
        });
});

route.get('/reserva', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => { 
            res.render(path.join(__dirname, '../html/reserva.ejs'),{mensaje, mensajeSucc});
            mensaje=null;
            mensajeSucc=null;
        })
        .catch((error) => {
            res.redirect("/");
        });
});


route.get('/reservar', (req,res1) => {
    const calendario = require(path.join(__dirname, '../public/js/calendario'));
    const fechaActual = moment().format("YYYY-MM-DD");
    
    const lista = req.query.colaborador;
    const dia = req.query.dia;
    const horaInicio = req.query.horaInicio;
    const horaFin = req.query.horaFin;
    const dInicio = dia+'T'+horaInicio+':00Z';
    const dFin = dia+'T'+horaFin+':00Z';
    const inicio = moment(dInicio, "YYYY-MM-DD HH:mm");
    const fin = moment(dFin, "YYYY-MM-DD HH:mm");
    if(lista === ''){
        colaboradores = [{email: usuarioLogEmail}];
    }else{
        try{
            colaboradores = lista.split(/\r\n|\r|\n/);
            colaboradores.unshift(usuarioLogEmail);
            for(var i=0; i<colaboradores.length; i++){
                colaboradores[i] = {email: colaboradores[i]};
            }
        }catch(err){
            mensaje = 'Formato inválido';
            res1.redirect('/reserva');
        }
    };
    console.log(colaboradores);
    const event = {
        summary: usuarioLogEmail,
        start:{
            dateTime: inicio,
            timeZone: "America/Lima",
        },
        end:{
            dateTime: fin,
            timeZone: "America/Lima",
        },
        attendees: colaboradores,
    };
    const sessionCookie = req.cookies.session || "";
    if(dia<fechaActual){
        mensaje='Fecha ingresada no válida';
        res1.redirect('/reserva');
        console.log('Fecha ingresada no válida');
    }else if(dia=== fechaActual && (horaInicio>=horaFin || horaInicio<horaActual)){ 
        console.log('Hora ingresada no válida');
        res1.redirect('/reserva');
    }else if(dia >fechaActual && horaInicio>= horaFin){
        console.log('Hora ingresada no válida');
        res1.redirect('/reserva');
    }
    else{
        admin
            .auth()
            .verifySessionCookie(sessionCookie, true)
            .then(() => {
                
                calendario.freebusy.query({
                    resource:{
                        timeMin: inicio,
                        timeMax: fin,
                        timeZone: "America/Lima",
                        items:[{id: 'primary'}],
                    },
                },(err, res2) => {
                    if(err) return console.log('Free busy query error: ', err);
                    const eventsArr = res2.data.calendars.primary.busy;
                    console.log('Tamañp de array de eventos:' + eventsArr.length);
                    if(eventsArr.length == 0){
                        return calendario.events.insert({calendarId:'primary', resource: event},
                            err => {
                                if(err){
                                    mensaje = 'Correos de colaboradores o formato inválidos';
                                    res1.redirect('/reserva');
                                } 
                                else{
                                    mensajeSucc = 'Se ha registrado con éxito su reserva'
                                    res1.redirect('/reserva');
                                }
                            });
                    }else{
                        mensaje = 'Ya existe una reserva en el rango de tiempo seleccionado';
                        res1.redirect('/reserva');
                    };  
                }
                );
            })
            .catch((err) => {
                res.redirect("/");
            });
    };        
})

route.get('/validacionReserva', (req, resp) => {
    const calendario = require(path.join(__dirname, '../public/js/calendario'));
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
            calendario.events.list({
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                maxResults: 1,
                singleEvents: true,
                orderBy: 'startTime',
                }, (err, res) => {
                    if (err) return console.log('The API returned an error: ' + err);
                    const events = res.data.items;
                    if (events.length) {
                        events.map((event, i) => {
                            const format = "YYYY-MM-DD";
                            const start = event.start.dateTime;
                            const end = event.end.dateTime;
                            const fechaInicio = moment(start).format(format);
                            const fechaActual = moment().format(format);
                            const horaInicio = moment(start).format("HH:mm:ss");
                            horaFin = moment(end).format("HH:mm:ss");
                            horaActual = moment().format("HH:mm:ss");
                            console.log(fechaActual);
                            console.log(fechaInicio);
                            console.log(horaActual);
                            console.log(horaInicio);
                            console.log(horaFin);
                            if(fechaInicio===fechaActual && horaActual>=horaInicio && horaActual<horaFin){
                                for(var i=0; i<event.attendees.length; i++){
                                    if(usuarioLogEmail===event.attendees[i].email){
                                        accesoLab= 1;
                                        resp.redirect('/laboratorio');
                                    }
                                }
                                if(accesoLab===0){
                                    mensaje='Usted no cuenta con reservacion en este momento(1)';
                                    resp.redirect('/inicio');
                                }
                            }else{
                                mensaje='Usted no cuenta con reservacion en este momento(2)'
                                console.log(mensaje);
                                resp.redirect('/inicio');
                            }        
                        });
                    } else {
                        mensaje='Usted no cuenta con reservacion en este momento(3)'
                        console.log(mensaje);
                        resp.redirect('/inicio');
                    }
            });
        })
        .catch((error) => {
            res.redirect("/");
        });
});

route.get('/laboratorio', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
            if(accesoLab===1){
                res.render(path.join(__dirname, '../html/laboratorio.ejs'),{horaFin});
                accesoLab = 0;
            }else{
                res.redirect('/inicio');
            }
            
        })
        .catch((error) => {
            res.redirect("/");
        });
})


route.post("/sessionLogin", (req, res) => {
    const idToken = req.body. idToken.toString();
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    usuarioLogEmail= req.body.email.toString();
    admin
        .auth()
        .createSessionCookie(idToken, {expiresIn})
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true};
                res.cookie("session", sessionCookie, options);
                res.end(JSON.stringify({status: "success"}));
            },
            (error) => {
                res.status(401).send("INGRESO NO AUTORIZADO!");
                console.log(error);
            }
        );
});
route.get("/cerrarSesion", (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
})


route.get('/laboratorio/sw1', (req, res) => {
    const spawn = require('child_process').spawn;
    const process = spawn('python', [path.join(__dirname, '../script/switch1.py')], {shell: true, detached: true});
    process.unref();
    res.render(path.join(__dirname, '../html/laboratorio.html'));
})
module.exports = route;