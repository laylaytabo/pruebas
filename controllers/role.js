const Role = require('../models').Role;
const User = require('../models').User;

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
        return Role
          .create({
            name: req.body.name,
          })
          .then((role) => res.status(201).send(role))
          .catch((error) => res.status(400).send(error));
    },

}