const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
const Personal = require('../models').Registro_personal;
const User = require('../models').User;

router.post('/signup', function(req, res) {
  //console.log(req.body);
  if (!req.body.username  || !req.body.email || !req.body.password ) {
    res.status(400).json({
      success: false,
      msg: 'Todos los campos son obligados.'
    })
    console.log(" Todos los campos son Obligatorios")
  } else {
    User.findOne({
      where: {
        username: req.body.username
      } 
    }).then(user =>{
      if(user){
        console.log("Fallo -> Username ya esta en uso!")
        res.status(400).json({
          success: false,
          msg:"Fallo -> Username ya esta en uso!"
        });
			return;
      }
      User.findOne({
        where: {
          email: req.body.email
        } 
      }).then(user =>{
        if(user){
          console.log("Fallo -> Email ya esta en uso!")
          res.status(400).json({ 
            success: false,
            msg:"Fallo -> Email ya esta en uso!"
          });
				return;
        }
        else{
          User
          .create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
          })
          .then((user) => res.status(201).json(user))
          .catch((error) => {
            console.log(error);
            res.status(400).json(error);
          });
        }
      })
    })
    
  }
});

router.post('/signin', function(req, res) {
  User
      .findOne({
        where: {
          username: req.body.username
        }
      })
      .then((user) => {
        if (!user) {
          return res.status(401).send({
            user : false,
            message: 'Autentificacion fallida. Usuario no existe.',
          });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err) {
            var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
            jwt.verify(token, 'nodeauthsecret', function(err, data){
              console.log(err, data);
            })
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Autentificacion fallida. Contraseña incorrecta'});
          }
        })
      })
      .catch((error) => res.status(400).send(error));
});
router.get('/list', function(req, res) {
  
  User
      .findAll()
      .then((users) => res.status(200).send(users))
      .catch((error) => { res.status(400).send(error); });
  
});
////////////////////////////////////////////////persoanl//////////////////////////////////////////
router.get('/personal', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Personal
      .findAll()
      .then((personal) => res.status(200).send(personal))
      .catch((error) => { res.status(400).send(error); });
  } else {
    return res.status(403).send({success: false, msg: 'no autorizado.'});
  }
});

// ruta para mostrar solo los medicos 
router.get('/Only_Medicos', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if(token){
    Personal.findAll({
      where: { cargo: 'medico' }
    }).then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => { res.status(400).send(error); });   
  }else{
    return res.status(403).send({success: false, msg: 'no autorizado.'});
  }
})

router.post('/personal', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Personal
      .create({
        nombre: req.body.nombre,
        apellidop: req.body.apellidop,
        apellidom: req.body.apellidom,
        ci: req.body.ci,
        cargo: req.body.cargo,
        direcion: req.body.direcion,
        telefono: req.body.telefono
      })
      .then((personal) => res.status(201).send(personal))
      .catch((error) => res.status(400).send(error));
  } else {
    return res.status(403).send({success: false, msg: 'no Autorizado.'});
  }
});
router.get('/OnlyPersonal/:id', passport.authenticate('jwt', {session:false}), function(req,res) {
  var token=getToken(req.headers);
  var id = req.params.id;  
  if(token){
    Personal.findAll({
      where: {id: id}
      //attributes: ['id', ['description', 'descripcion']]
    }).then((data) => {
      res.status(200).json(data);
    })
  }
  else {
    return res.status(403).send({success: false, msg: 'no Autorizado.'});
  }
});

router.post('/updatePersonal/:id', passport.authenticate('jwt',{session:false}),function(req,res){
  const { nombre,apellidop,apellidom,ci,cargo,direcion,telefono } = req.body
  var token = getToken(req.headers);
  if(token){
    Personal          
    .findByPk(req.params.id)
    .then((data) => {
      data.update({
          nombre: nombre || data.nombre,
          apellidop: apellidop || data.apellidop,
          apellidom: apellidom || data.apellidom,
          ci: ci || data.ci,
          cargo: cargo || data.cargo,
          direcion: direcion || data.direcion,
          telefono: telefono || data.telefono                                          
      })
      .then(update => {
        res.status(200).send({
          message: 'Personal actualizado',
          data: {
            
              nombre: nombre || update.nombre,
              apellidop: apellidop || update.apellidop,
              apellidom: apellidom || update.apellidom,
              ci: ci || update.ci,
              cargo: cargo || update.cargo,
              direcion: direcion || update.direcion,
              telefono: telefono || update.telefono  
          }
        })
      })
      .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
  }
  else {
    return res.status(403).send({success: false, msg: 'no Autorizado.'});
  }

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
