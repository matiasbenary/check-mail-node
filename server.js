require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const Usuario = require('./models/usuario');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/usuario', function(req, res) {

    let body = req.body;

    let dominio = body.email.split('@', 2)[1];

    axios.get(`https://dns-api.org/MX/${dominio}`)
        .then(resp => {

            let respuesta = resp.data;

            if (respuesta.error != 'NXDOMAIN') {

                let usuario = new Usuario({
                    email: body.email,
                });

                usuario.save((err, usuarioDB) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        msj: 'usuario creado'
                    });
                });

            } else {
                res.status(400).json({
                    ok: false,
                    error: "dominio inexistente"
                });
            }

        })
        .catch(e => {
            res.status(400).json({
                ok: false,
                error: e
            });
        });

});




mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});