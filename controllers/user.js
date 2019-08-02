const User = require('../models').User;
const Role = require('../models').Role;
const Personal = require('../models').Registro_personal;

module.exports ={
    listar(req, res){
        return User
        .findAll({
            include:[/*{
              model: Personal,
              as: 'personal'
            },*/
              {
                model: Role,
                as: 'role'
            }],
            
        })
        .then((user) => res.status(200).send(user))
        .catch((error) => {
            res.status(400).send(error);
        });
    },

   /* getById(req, res) {
        return User
          .findById(req.params.id, {
            include: [
              {
                model: Personal,
                as: 'personal'
              },{
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
    },*/

    add(req, res){
        return User
        .create({
            perso_id: req.params.perso_id,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            
        })
        .then((user) => res.status(201).send(user))
        .catch((error) => res.status(400).send(error));
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
    
}