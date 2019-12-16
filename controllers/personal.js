const Personal = require('../models').Registro_personal;
const User = require('../models').User;
const UseRole = require('../models').UseRole;
const Role = require('../models').Role;

const sequelize = require('sequelize');
const Op = sequelize.Op;

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
           // console.log(" todos los campos son requeridos  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
          
            res.status(400).send({
                success: false,
                message: 'Todos los Espacios son Requeridos!!'
            })
        } else{
            Personal.findOne({
                where:{
                    ci: req.body.ci
                }
            }).then(user =>{
                if(user){
                    //console.log("Fallo >>> El numero de carnet ya esta en uso!")
                    res.status(400).send({
                      success: false,
                        message: 'El numero de carnet '+' '+ req.body.ci+ ' '+'ya esta en uso!!'
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
                    message: 'Datos Ingresados Correctamente.',
                    personal
                 }))
                 .catch((error) => res.status(400).send(error));
                }
            })
        }
    },

    registrar_personal(req, res){

      if (!req.body.nombre || !req.body.apellidop || !req.body.apellidom || !req.body.ci || !req.body.cargo || !req.body.direcion || !req.body.telefono || !req.body.estado_adm){
          //console.log(" todos los campos son requeridos  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
        
          res.status(400).send({
              success: false,
              message: 'Todos los Espacios son Requeridos!!'
          })
      } else{
          Personal.findOne({
              where:{
                  ci: req.body.ci
              }
          }).then(user =>{
              if(user){
                  //console.log("Fallo >>> El numero de carnet ya esta en uso!")
                  res.status(400).send({
                    success: false,
                      message: 'Fallo >>> El numero de carnet ya esta en uso!'
                  })
                  return;
              }
              else{
                  return Personal
                  .create({
                    estado_adm: req.body.estado_adm,
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
                  message: 'Datos Ingresados Correctamente.',
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
        res.status(200).json({
          success: true,
          message: 'Datos  Actualizado.',
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

 },
    
    delete(req, res) {
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
    /////////////////listar fechas

  list_fecha(req,res){
    return Personal
    .findAll({
     
    })
    .then(users=> {
      var variable = [
        { num : 1},
        { num : 2},
        { num : 3},
        { num : 4},
        { num : 5},
        { num : 6},
        { num : 7},
        { num : 8},
      ]
     
        /* for (var i = 0; i < variable.length; i++) {
          
          res.status(200).json({
            data:variable[i].num
          })
          console.log(variable[i].num)
       
        } */
      //var fecha= createdAt.split("T")
      var data =[]
      for(var i = 0; i < users.length; i++){
        if(users[i].createdAt >= "2019-09-29T19:33:22.277Z" &&  users[i].createdAt <= "2019-10-02T19:23:16.097Z" ){
          console.log(users[i].id)
          data.push({data:users[i].createdAt})
        }
       
      }
      
      res.status(200).json(data)
    }) 
      .catch((error) => {
          res.status(400).send(error);
      });
  },
  /*listar_fechas(req,res){
    return Personal.findAll({
      where : {    
         gte:sequelize.fn('date_format', initDate, '%Y-%m-%dT%H:%i:%s'),
         lte:sequelize.fn('date_format', endDate, '%Y-%m-%dT%H:%i:%s')
      }
    })
  } */

  //filter datas 
  filter_list(req, res){
    /* var _q = Personal;
    _q.findAll({
        where: {[Op.and]: [{cargo: {[Op.eq]: 'medico'}}, {createdAt: {[Op.gte]: '2019-11-26' }}, {createdAt: {[Op.lte]: '2019-11-26' }}]},
    })
    .then(datas => {
        if(datas == ""){
            res.status(400).json({
                success:false,
                msg:"No hay nada que mostrar"
            })
        }else{
            res.status(200).json(datas)
        }
    }); */
    
     const { fecha_inicio, fecha_final, cargo }  = req.body
    //console.log(req.body, "  <<<<<<<<<<<<<<<<<<<<<<<<<<<<")
      if(!fecha_final || !fecha_inicio || !cargo){
          res.status(400).json({
              success:false,
              msg:"Inserte Fecha inicio y Fecha final y el tipo de personal para poder buscar un rago de fechas"
          })
      }else{
          var _q = Personal;
          _q.findAll({
              where: {[Op.and]: [{cargo: {[Op.eq]: cargo}}, {createdAt: {[Op.gte]: fecha_inicio }}, {createdAt: {[Op.lte]: fecha_final }}]},
          })
          .then(datas => {
            //console.log(datas, "  3333333333333333333333333333333333333333333")
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
  },

  //dar de baja al paciente 
  baja_personal(req, res) {
    const { estado } = req.body
    return Personal        
    .findByPk(req.params.id)
    .then((data) => {
      data.update({
        estado: estado || data.estado,
     
  })
  .then(update => {
    res.status(200).send({
      success: true,
      msg: 'Datos  Actualizado',
      data: {
        estado: estado || update.estado        
      }
    })
  })
    .catch(error => {
      console.log(error),
      res.status(400).json({
        success:false,
        msg:'no se pudo dar de baja al personal'
      })
    });
  })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        success:false,
        msg:'error'
      })
    });
  },
}
