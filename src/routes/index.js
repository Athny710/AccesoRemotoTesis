const moment = require('moment');
const express = require('express');
const route = express.Router();
const path = require('path');
const admin = require("firebase-admin");
const { firebase } = require('googleapis/build/src/apis/firebase');
const { stringify } = require('querystring');
const serviceAccount = require(path.join(__dirname, "../../serviceAccountKey.json"));
const calendario = require(path.join(__dirname, '../public/js/calendario'));
var mensaje, mensajeSucc, horaFin, tiempoReservado=0, rol;
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
    const now = new Date();
    if(now.getDay() == 0){
        now.setDate(((now.getDate()-7)+1));
    }else{
        now.setDate(((now.getDate()-now.getDay())+1));
    }
    const i = new Date(now);
    const f = new Date(now.setDate(now.getDate()+6));
    const inicio = moment(moment(i).startOf('day')).format();
    fin = moment(moment(f).endOf('day')).format();
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
        calendario.events.list({
            calendarId: 'primary',
            timeMin: inicio,
            timeMax: fin,
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const events = res.data.items;
                console.log('Reservas durante la semana: '+events.length);
                for(var i=0; i<events.length; i++){
                    for(var j=0; j<events[i].attendees.length; j++){
                        if(events[i].attendees[j].email === usuarioLogEmail){
                            const a = moment(moment(events[i].start.dateTime).format('HH:mm:ss'), 'HH:mm:ss');
                            const b = moment(moment(events[i].end.dateTime).format('HH:mm:ss'), 'HH:mm:ss');
                            tiempoReservado = tiempoReservado+ parseInt(b.diff(a, 'seconds'));                            
                        };
                    };
                };
        });    
        
});


route.get('/reservar', (req,res1) => {
    const now = new Date();
    if(now.getDay() == 0){
        now.setDate(((now.getDate()-7)+1));
    }else{
        now.setDate(((now.getDate()-now.getDay())+1));
    }
    const f = new Date(now.setDate(now.getDate()+6));
    const finSemana = moment(moment(f).endOf('day')).format('YYYY-MM-DD');
    const fechaActual = moment().format("YYYY-MM-DD");
    const lista = req.query.colaborador;
    const dia = moment(req.query.dia).format('YYYY-MM-DD');
    const horaInicio = moment(req.query.horaInicio, 'HH:mm');
    const horaFin = moment(req.query.horaFin, 'HH:mm');
    const horaActual = moment(moment().format('HH:mm'), 'HH:mm');
    const inicio = moment(dia+'T'+ req.query.horaInicio +':00').format();
    const fin = moment(dia+'T'+ req.query.horaFin + ':00').format();
    const a = moment(moment(inicio).format('HH:mm:ss'), 'HH:mm:ss');
    const b = moment(moment(fin).format('HH:mm:ss'), 'HH:mm:ss');
    const duracion = parseInt(b.diff(a, 'seconds'));
    
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
        mensaje='Fecha ingresada no válida(1)';
        res1.redirect('/reserva');
    }else if(dia>finSemana){
        mensaje='Solo puede reservar en esta semana';
        res1.redirect('/reserva');
    }else if(dia=== fechaActual && (horaInicio>=horaFin || horaInicio<horaActual)){ 
        mensaje='Fecha ingresada no válida(2)';
        res1.redirect('/reserva');
    }else if(dia >fechaActual && horaInicio>= horaFin){
        mensaje='Fecha ingresada no válida(3)';
        res1.redirect('/reserva');
    }else if(rol==='alumno' && (tiempoReservado>=14000 || duracion>14000)){
        mensaje = 'Máximo 4hrs semanales';
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
                            const horaActual = moment().format("HH:mm:ss");
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
                                mensaje='Usted no cuenta con reservacion en este momento(2)';
                                resp.redirect('/inicio');
                            }        
                        });
                    } else {
                        mensaje='Usted no cuenta con reservacion en este momento(3)';
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
    rol = req.body.rol.toString();
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

route.get("/recuperarPass", (req, res) => {
    res.render(path.join(__dirname, '../html/password.html'));
})

module.exports = route;