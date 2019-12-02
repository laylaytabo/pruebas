const Role = require('../models').Role;
const User = require('../models').User;
const Personal = require('../models').Registro_personal;


module.exports = {
    listar(req, res){
        return Role
        .findAll({
            include:[{
                model: User,
                as: 'user'
            }],
            order:[
                ['createdAt', 'ASC'],
                [{ model: User, as: 'user'}, 'createdAt', 'ASC'],
            ],
        })
        .then((role) => res.status(200).send(role))
        .catch((error) =>{
            res.status(400).send(error);
        });
    },
    getById(req, res) {
        return Role
          .findById(req.params.id, {
            include: [{
              model: Role,
              as: 'role'
            }],
          })
          .then((role) => {
            if (!role) {
              return res.status(404).send({
                message: 'Rol no funciona',
              });
            }
            return res.status(200).send(role);
          })
          .catch((error) => res.status(400).send(error));
    },
    add(req, res) {
      Role.findOne({
        where:{
          name: req.body.name
        }
      }).then(rol =>{
        if(rol !=null){
          console.log("Fallo >> El Rol ya existe...!")
          res.status(400).send({
            success:false,
            message:'Fallo >> El Rol ya existe...!'
        })
        return;
        }else{
          return Role
          .create({
            name: req.body.name,
          })
          .then((role) => res.status(201).send(role))
          .catch((error) => res.status(400).send(error));
        }
      })
        
    },
    roleall(req, res){
      Role
      .findAll()
      .then((rol) => res.status(200).send(rol))
      .catch((error) => { res.status(400).send(error); });
    },
    
    deleterol(req, res) {
      const{id} =req.params
      return Role
        .findByPk(id)
        .then(rol => {
          if(!rol) {
            return res.status(400).send({
              success:false,
              message: 'Ocurrio un Problema',
            });
          }
          return rol
            .destroy()
            .then(() => res.status(200).send({
              success: true,
              message: 'El Rol sea Eliminado Correctamente'
            }))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error))
    },
/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<               Reporte solo usuarios                     <<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    listarto(req, res){
      const { id_personal } = req.params
      return User
        .findAll({
          where:{perso_id:id_personal },
            include:[{
                model: Role,
                as: 'role'                
            }]
        })
        .then((role) => res.status(200).send(role))
        .catch((error) =>{
            res.status(400).send(error);
        });
      },

    // role farmacia
    role_farmacia(req, res){
      return Role
      .findAll({
        where:{name : "farmacia"},
        attributes:['id','name','createdAt'],
          include:[{
              model: User,
              attributes:['id','username'],
              as: 'user',
              
              include:[{
                model: Personal,
                attributes:['id','nombre', 'apellidop','apellidom']
              }]
          }],
          order:[
              ['createdAt', 'ASC'],
              [{ model: User, as: 'user'}, 'createdAt', 'ASC'],
          ],
      })
      .then((role) => res.status(200).send(role))
      .catch((error) =>{
          res.status(400).send(error);
      });
    },

    // lista las personas que tiene rol de almacen
    role_almacen(req, res){
      return Role
      .findAll({
        where:{name : "Almacen"},
        attributes:['id','name','createdAt'],
          include:[{
              model: User,
              attributes:['id','username'],
              as: 'user',
              
              include:[{
                model: Personal,
                attributes:['id','nombre', 'apellidop','apellidom']
              }]
          }],
          order:[
              ['createdAt', 'ASC'],
              [{ model: User, as: 'user'}, 'createdAt', 'ASC'],
          ],
      })
      .then((role) => res.status(200).send(role))
      .catch((error) =>{
          res.status(400).send(error);
      });
    },

    //role hospitalizacion

    role_hospitalizacion(req, res){
      return Role
      .findAll({
        where:{name : "hospitalizacion"},
        attributes:['id','name','createdAt'],
          include:[{
              model: User,
              attributes:['id','username'],
              as: 'user',
              
              include:[{
                model: Personal,
                attributes:['id','nombre', 'apellidop','apellidom', 'ci']
              }]
          }],
          order:[
              ['createdAt', 'ASC'],
              [{ model: User, as: 'user'}, 'createdAt', 'ASC'],
          ],
      })
      .then((role) => res.status(200).send(role))
      .catch((error) =>{
          res.status(400).send(error);
      });
    },

}