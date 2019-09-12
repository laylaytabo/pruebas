const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport')(passport);
//const passport = require('passport');
const User = require('../models').User;
const Role = require('../models').Role;
//const Personal = require('../models').Registro_personal;



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
}

module.exports ={

    listar(req, res){
      /*var token = getToken(req.headers)
      if(token){*/
        return User
        .findAll({
            include:[
              {
                model: Role,
                as: 'role'
            }],
            
        })
        .then((user) => res.status(200).send(user))
        .catch((error) => {
            res.status(400).send(error);
        });
      /*}else{
        return res.status(403).send({ message: 'Usuario no autorizado.'});
      }*/
        
    },

   getById(req, res) {
        return User
          .findByPk(req.params.id, {
            include: [
              {
                /*model: Personal,
                as: 'personal'
              },*/
              model: Role,
              as: 'role'
            }],
          })
          .then((user) => {
            if (!user) {
              return res.status(404).send({
                message: 'Usuario no encontrado',
              });
            }
            return res.status(200).send(user);
          })
          .catch((error) => res.status(400).send(error));
    },

    add(req, res){
      if(!req.body.username || !req.body.email || !req.body.password){
        res.status(400).send({
          message:'Todos los campos son obligados.'
        })
        console.log(" Todos los campos son Obligatorios")
      }else{
        User.findOne({
          where:{
            username: req.body.username
          }
        }).then(user =>{
          console.log(user , " esto es si hay el usuario")
          if(user != null){
            console.log("Fallo -> Username ya esta en uso!")
            res.status(400).json({
              success: false,
              msg:"Fallo -> Username ya esta en uso!"
            });
          return;
          }else{
            User.findOne({
              where: {
                email: req.body.email
              }
            }).then(user =>{
              if(user != null){
                console.log("Fallo -> Email ya esta en uso!")
                res.status(400).json({
                  success: false,
                  msg:"Fallo -> Email ya esta en uso!"
                });
              return;
              }
              else{
                return User
                .create({
                   perso_id: req.params.perso_id,
                   username: req.body.username,
                   email: req.body.email,
                   password: req.body.password,
              
                })
                .then((user) => res.status(201).send({
                  
                  success: true,
                  message: 'Datos Ingresados Correctamente',
                  user
                }))
                .catch((error) => res.status(400).send(error));
              }
            })
          }
          
        })
      }
    },


    login(req, res){
      console.log(req.path, "   esto es lo que quiero")
      User
      .findOne({
        where: {
          username: req.body.username
        }
      })
      .then((user) => {
         if (!user) {
          console.log(user, "  esto es lo que trae user")
          return res.status(401).send({
            user : false,
            message: 'Autentificacion fallida. Usuario no existe.',
          });
        }else{
          user.comparePassword(req.body.password, (err, isMatch) => {
            if(isMatch && !err) {
              var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
              jwt.verify(token, 'nodeauthsecret', function(err, data){
              console.log(err, data);
              })
              res.json({
                success: true, 
                token: 'JWT ' + token,
                user
              });
            } else {
              res.status(401).send({success: false, msg: 'Autentificacion fallida. Contraseña incorrecta'});
            }
          }) 
        }
        
      })
      .catch((error) => console.log(error, " esto es el error"));
  },


    addRole(req, res) {
        return User
          .findByPk(req.body.user_id, {
            include: [
              /*{
                model: User,
                as: 'user'
              },*/{
              model: Role,
              as: 'role'
            }],
          })
          .then((user) => {
            if (!user) {
              return res.status(404).send({
                message: 'NO FUNCIONA',
              });
            }
            Role.findByPk(req.body.role_id).then((role) => {
              if (!role) {
                return res.status(404).send({
                  message: 'No funcions rol',
                });
              }
              user.addRole(role);
              return res.status(200).send(user);
            })
          })
          .catch((error) => res.status(400).send(error));
      },
    mostrarCuenta(req, res){
        var id = req.params.id;
        User
        .findAll({
          where: {perso_id: id}
          //attributes: ['id', ['description', 'descripcion']]
        }).then((data) => {
          res.status(200).json(data);
        })
      }, 
    
}