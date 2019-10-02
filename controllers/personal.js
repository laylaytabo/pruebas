const Personal = require('../models').Registro_personal;
const User = require('../models').User;
const UseRole = require('../models').UseRole;
const Role = require('../models').Role;

module.exports= {

    list(req, res ){
        return Personal
        .findAll({
           include:[
               {model: User,}]
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

    mostrarTodoOne(req,res){
      const { id  } = req.params
        return Personal
        .findAll({
           where:{id :id},
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
            console.log(" todos los campos son requeridos  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            res.status(400).send({
                success: false,
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
                      success: false,
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
                 .then((personal) => res.status(201).send({
                    success: true,
                    message: 'Datos Ingresados Correctamente',
                    personal
                 }))
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
    Only_Medicos(req, res) {
        const { nombre,apellidop,apellidom,ci,cargo,direcion,telefono } = req.body
      return Personal
        .findAll({
          where: { cargo: 'medico' }
        }).then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => { res.status(400).send(error); });

    },
    update(req, res) {
        const { nombre,apellidop,apellidom,ci,cargo,direcion,telefono } = req.body
        return Personal
            
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
            success: true,
          message: 'Datos  Actualizado',
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
},
/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<               Reporte solo personal                      <<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
 onlyPersonal(req, res){
    const { nombre,apellidop,apellidom,ci,cargo,direcion,telefono } = req.body
    return Personal
      .findAll({
        where: { cargo: 'personal' }
      }).then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => { res.status(400).send(error); });

 },
 onlyEnfermera(req, res){
    const { nombre,apellidop,apellidom,ci,cargo,direcion,telefono } = req.body
    return Personal
      .findAll({
        where: { cargo: 'enfermera' }
      }).then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => { res.status(400).send(error); });

 },
 onlyFarma(req, res){
    const { nombre,apellidop,apellidom,ci,cargo,direcion,telefono } = req.body
    return Personal
      .findAll({
        where: { cargo: 'farmaseutico' }
      }).then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => { res.status(400).send(error); });

 }
    
      /*delete(req, res) {
        return Student
          .findById(req.params.id)
          .then(student => {
            if (!student) {
              return res.status(400).send({
                message: 'Student Not Found',
              });
            }
            return student
              .destroy()
              .then(() => res.status(204).send())
              .catch((error) => res.status(400).send(error));
          })
          .catch((error) => res.status(400).send(error));
<<<<<<< HEAD
      },

      get_medico_ci(req, res) {
      return Personal
        .findAll({
          where: { ci: req.params.ci_medico }
        }).then((data) => {
          res.status(200).json(data);
        })
        .catch((error) => { res.status(400).send(error); });

    },
=======
      },*/
    
}
