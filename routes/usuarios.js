const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
//const Product = require('../models').Product;
const User = require('../models').User;
const request = require('request');

/////usuario
router.post('/userCuenta/:idReg_personal', (req, res) =>{
    //console.log(req.body);
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
            idReg_personal: req.params.idReg_personal

          }).then((user) =>{
            if(user){
              var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
              jwt.verify(token, 'nodeauthsecret', function(err, data){
                console.log(err, data);
              })
              res.json({success: true, token: 'JWT ' + token});
            }
          }).then((user) => res.status(201).send({
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

router.get('/mostrarCuentas/:id', async (req, res) =>{
  var id = req.params.id;  
  User.findAll({
           where: {idReg_personal: id}
           //attributes: ['id', ['description', 'descripcion']]
         }).then((data) => {
           res.status(200).json(data);
         }); 

  /*var id = req.params.id
  const mostrar = await User.findByPk(id);
  res.status(201).json({
    mostrar
  });*/
});

router.get('/usersAll', (req,res) => {
  User.findAll()
  .then(data => res.status(200).send(data));
});

/*router.get('/userCueCAP', (req, res) => {
  res.render('ruserCueCAP');
});
 router .post('/userCueCAP/:id', async(req , res) =>{
   var reg_user = {
    correo: req.body.correo,
    contraseña: req.body.contraseña,
    contraseña1: req.body.contraseña1,
    tipo_usuario: req.body.tipo_usuario,
    idReg_personal: req.body.idReg_personal

   }
   if(
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
   ){
    return res.json({"success": false, "msn": "Selecione el captcha"});
   }
   ///llave 
   const secretKey = '6LdxcI8UAAAAAJ-RuzN-uXXvvSLGlIoTOYJVQv_B';
   ///verificacion 
   const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
   ///verificacion URL
   request(verifyUrl, (err, response, body) =>{
     body = JSON.parse(body);
     console.log(body);
     if(body.success !== undefined && !body.success){
      return res.json({"success": false, "msn":"Fallo  la verificacion captcha"});
     }
     var user = new User(reg_user);
     if(reg_user.contraseña == reg_user.contraseña1){
      console.log(reg_user.contraseña, reg_user.contraseña1);
      User.find({correo: req.body.correo}).exec(async (err, docs) => {
        if(docs != ""){
          console.log('ya existe ese correo')
          res.status(400).json({
                  "msn" : "Ese correo ya esta en uso. Prueba con otro"
                });
          // res.send("ya existe ese email")
        }
        else{
          if(reg_user.correo == ""){
            res.status(400).json({
              'msn' : 'La dirección de correo electrónico es obligatoria.'

            })
          }
          else
          if(reg_user.contraseña.length < 6){
              res.status(400).json({
                'msn' : 'Las contraseñas deben tener al menos 6 caracteres'
              })
          }else
          if(reg_user.tipo_usuario == ""){
            res.status(400).json({
              'msn' : 'Introduzca su el tipo de usuuario'
            });
          }else {
            await user.save();
            console.log('enviado');
            res.status(200).json({
              "msn": "enviado",
            })
          }
        }
      });
     }
     else{
      console.log('las claves no son iguales');
      res.status(400).json({
              "msn" : "Las contaceñas no son iguales"
            });
     }
   }) 

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
};*/
module.exports = router;