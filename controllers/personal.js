const Personal = require('../models').Registro_personal;
const User = require('../models').User;

module.exports= {

    /*list(req, res ){
        return Personal
        .findAll({
            include:[{
                model: User,
                as: 'user'
            }],
            order: [
                ['createdAt', 'ASC'],
                [{ model: User, as: 'user'}, 'createdAt', 'ASC'],
            ],
        })
        .then((personal) => res.status(200).send(personal))
        .catch((error) => {
            res.status(400).send(error);
        });
    },*/
    listar(req, res){
        return Personal
        .findAll()
        .then(users=> res.status(200).send(users))
        .catch((error) => {
            res.status(400).send(error);
        });
    },

    getById(req, res){
        return Personal
        .findByPk(req.params.id,/*{
            include:[{
                model: User,
                as: 'user'
            }],
        }*/)
        .then((personal) =>{
            if(!personal){
                return res.status(404).send({
                    message: 'Personal no funciona'
                });
            }
            return res.status(200).send(personal);
        })
        .catch((error) => res.status(400).send(error));
    },

    add(req, res){
        return Personal
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
    },

    addUser(req, res){
        return Personal
    
        .create({
            nombre: req.body.nombre,
            apellidop: req.body.apellidop,
            apellidom: req.body.apellidom,
            ci: req.body.ci,
            cargo: req.body.cargo,
            direcion: req.body.direcion,
            telefono: req.body.telefono,
            user: req.body.user,

        
        },{
            include: [{
                model: User,
                as: 'user'
            }]
        })
        .then((personal)=> res.status(201).send(personal))
        .catch((error)=> res.status(400).send(error));
    },

}