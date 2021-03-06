const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport')(passport);
const sequelize = require('sequelize');
const Op = sequelize.Op;
//const passport = require('passport');
const Personal = require('../models').Registro_personal;
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
        res.status(400).json({
          success:false,
          message:'Todos los campos son obligados.'
        })
        console.log(" Todos los campos son Obligatorios")
      }else{
        User.findOne({
          where:{
            username: req.body.username
          }
        }).then(user =>{
          //console.log(user , " esto es si hay el usuario")
          if(user != null){
            //console.log("Usuario ya esta en uso!")
            res.status(400).json({
              success: false,
              msg:"Usuario ya esta en uso!"
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
                  msg:"Email"+ " "+ req.body.email + " "+"ya esta en uso!"
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
                  message: 'Datos Ingresados Correctamente.',
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
      if(!req.body.name){
        res.status(400).json({
          success:false,
          msg:"No seleciono rol"
        })
      }else{
        Role
        .findAll({
          where: { name: req.body.name }
          //attributes: ['id', ['description', 'descripcion']]
        }).then((data) => {
           if(data != ""){
            var id_role = data[0].id
            return User
            .findByPk(req.body.user_id, {
              include: [
               {
                model: Role,
                as: 'role'
              }],
            })
            .then((user) => {
              if (!user) {
                return res.status(404).send({
                  success:false,
                  msg: 'NO FUNCIONA',
                });
              }
              Role.findByPk(id_role).then((role) => {
                return User
                .findAll({
                  where:{id: req.body.user_id},
                    include:[
                      {
                        model: Role,
                        as: 'role'
                    }],
  
                })
                .then((datas) => {
                  console.log(datas[0].role.length, "  esto es lo que quiero ver <<<<<<<<<<<<<<<")
                  
                   if( datas[0].role.length != 0 ){

                    res.status(400).json({
                      success:false,
                      msg: "El Usuraio ya tiene un rol"
                    })

                  }else{

                    if (!role) {
                      return res.status(404).send({
                        success:false,
                        msg: 'No funcions rol',
                      });
                    }
                    user.addRole(role);
                    return res.status(200).send({
                      success:true,
                      msg: "Se creo correctamente."
                    });

                  }
                })  
              })
            })
            .catch((error) => res.status(400).send(error));
          }else{
            res.status(400).json({
              success:false,
              msg : "El tipo de Usuario no existe"
            })
          } 
        })
      }
     
    },


    mostrarCuenta(req, res){
      var id = req.params.id;
      return User
      .findAll({
        where: {perso_id: id},
        include:[{
          model:Personal
        }]
        //attributes: ['id', ['description', 'descripcion']]
      })
      .then((data) => {
        res.status(200).json(data);
      })
    },
    EliminarUsuario(req, res) {
      const{id} =req.params
      return User
        .findByPk(id)
        .then(users => {
          if(!users) {
            return res.status(400).send({
              success:false,
              message: 'Ocurrio un Problema',
            });
          }
          return users
            .destroy()
            .then(() => res.status(200).send({
              success: true,
              message: 'La Cuenta sea Eliminado Correctamente'
            }))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error))
    },
/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<               Reporte solo usuarios                     <<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    alluser(req, res){
      return User
      .findAll({
        include:[{
          model:Personal, attributes:['nombre','apellidop', 'apellidom']
        }]
      })
      .then(users=> res.status(200).send(users))
      .catch((error) => {
          res.status(400).send(error);
      });
    },
    
    filter_usuario(req, res) {
      console.log(req.body, "  personal")
      const { fecha_inicio, fecha_final }  = req.body
      if(!fecha_final || !fecha_inicio){
          res.status(400).json({
              success:false,
              msg:"Inserte echa inicio y fecha final  para poder buscar un rago de fechas"
          })
      }else{
          var _q = User;
          _q.findAll({
          where: {[Op.and]: [{createdAt: {[Op.gte]: fecha_inicio }}, {createdAt: {[Op.lte]: fecha_final }}]},
          include:[
            {model: Personal}
          ]
          }
         
          )
          
          .then(datas => {
              if(datas == ""){
                  res.status(400).json({
                      success:false,
                      msg:"No hay nada que mostrar"
                  })
              }else{
                  res.status(200).json(datas)
              }
              
          }); 
      }
      
  
  }
}