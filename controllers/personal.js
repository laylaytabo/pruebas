const Personal = require('../models').Registro_personal;
const User = require('../models').User;
const UseRole = require('../models').UseRole;
const Role = require('../models').Role;

module.exports= {

    list(req, res ){
        return User
        .findAll({
           include:[
               {model: Personal,}]
        })
        .then((personal) => res.status(200).send(personal))
        .catch((error) => {
            res.status(400).send(error);
        });
    },
    mostrarTodo(req,res){
        return Personal
        .findAll({
            include:[
                {model:User,
                include:[
                    {model:Role, 
                        as:'role'
                    }
                ]}
            ]
        })
        .then((data) => res.status(200).send(data))
        .catch((error) => {
            console.log(error)
            res.status(400).send(error);
        });
    },

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
        if (!req.body.nombre || !req.body.apellidop || !req.body.apellidom || !req.body.ci || !req.body.cargo || !req.body.direcion || !req.body.telefono){
            res.status(400).send({
                message: 'Todos los espacios son requeridos'
            })
        } else{
            Personal.findOne({
                where:{
                    ci: req.body.ci
                }
            }).then(user =>{
                if(user){
                    console.log("Fallo >>> El numero de carnet ya esta en uso!")
                    res.status(400).send({
                        message: 'Fallo >>> El numero de carnet ya esta en uso!'
                    })
                    return;
                }
                else{
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
                }
            })
        }
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