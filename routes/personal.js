const express = require('express');
const router = express.Router();
const Personal = require('../models').Registro_personal;

////registro
router.post('/registro', function(req, res) {
    console.log(req.body);
    Personal.findAll({
      where: {ci: req.body.ci},
    }).then((ci) =>{
      if(ci !=""){
        res.status(200).send("ya existe el personal.")
      }else {
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
          .then((personal) => res.status(201).send({
            success: true,
            message: 'Creado correctamente.',
            personal
          }))
          .catch((error) => {
            console.log(error);
            res.status(400).send(error);
          });
      }
    })
  });
router.get('/getpersonal', (req, res) =>{
    Personal                
    .findAll()
    .then(data => res.status(200).send(data));
});

router.get('/OnlyPersonal/:id', (req,res) =>{
    var id = req.params.id;  
    Personal.findAll({
       where: {id: id}
       //attributes: ['id', ['description', 'descripcion']]
     }).then((data) => {
       res.status(200).json(data);
     })
});


router.post('/updatePersonal/:id', (req,res) =>{
    const { nombre,apellidop,apellidom,ci,cargo,direcion,telefono } = req.body
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
  
});

    
module.exports = router;