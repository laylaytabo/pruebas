const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
//const Product = require('../models').Product;
const User = require('../models').User;

/////usuario
router.post('/userCuenta/:idReg_personal', function(req, res) {
    console.log(req.body);
    User.findAll({
      where: {correo: req.body.correo},
    }).then((correo) =>{
      if(correo !=""){
        res.status(200).send("ya existe el correo.")
      }else {
        User
          .create({
            correo: req.body.correo,
            contraseña: req.body.contraseña,
            estado: req.body.estado,
            tipo_usuario: req.body.tipo_usuario,
            idReg_personal: req.body.idReg_personal

          })
          .then((user) => res.status(201).send({
            success: true,
            message: 'Usuario creado correctamente.',
            user
          }))
          .catch((error) => {
            console.log(error);
            res.status(400).send(error);
          });
      }
    })
  });
///login
router.post('/login', function(req, res) {
    User.findOne({
          where: {
            correo: req.body.correo
          }
        })
        .then((user) => {
          if (!user) {
            return res.status(401).send({
              message: 'Autentificacion fallida.',
            });
          }
          user.comparePassword(req.body.contraseña, (err, isMatch) => {
            if(isMatch && !err) {
              var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
              jwt.verify(token, 'nodeauthsecret', function(err, data){
                console.log(err, data);
              })
              res.json({success: true, token: 'JWT ' + token});
            } else {
              res.status(401).send({success: false, msg: 'fallo el correo.'});
            }
          })
        })
        .catch((error) => res.status(400).send(error));
});

router.get('/mostrarCuentas/:id', (req, res) =>{
  User                
  .findAll()
  .then(data => res.status(200).send(data));
});


getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
};
module.exports = router;