var express = require('express');
var router = express.Router();

const role_user = require('../models').UseRole;


const personalcontroller = require('../controllers').personal;
const usercontroller = require('../controllers').user;
const rolecontroller = require('../controllers').role;
const passport = require('passport');

const Roles_user = require('../controllers').Roles_user;

require('../config/passport')(passport);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**Personal */
router.get('/api/personal',/* passport.authenticate('jwt', { session: false}),*/ personalcontroller.listar);
router.get('/api/personal/:id', personalcontroller.getById);
router.post('/api/personal', personalcontroller.add);
router.post('/api/UpdaPersonal/:id', personalcontroller.update);
router.get('/api/list', personalcontroller.list);

router.get('/api/mostrarTodo', personalcontroller.mostrarTodo);
router.get('/api/Only_Medicos', personalcontroller.Only_Medicos);
router.get('/api/oneMOstrar/:id', personalcontroller.mostrarTodoOne); // ruta que mustra solo uno
router.get('/api/get_medico_ci/:ci_medico', personalcontroller.get_medico_ci) // ruta para sacar el personal por ci

router.get('/api/OnlyPersonal', personalcontroller.onlyPersonal);/// ruta para solo personales
router.get('/api/OnlyEnfermera', personalcontroller.onlyEnfermera);/// ruta para solo enfermeras
router.get('/api/OnlyFarma', personalcontroller.onlyFarma);/// ruta para solo farmaceuticos

/**user */

router.get('/api/user', usercontroller.listar);
router.get('/api/user/:id', usercontroller.getById);
router.get('/api/mostrarCuenta/:id', usercontroller.mostrarCuenta);
router.post('/api/UsuraioCuenta/:perso_id', usercontroller.add);
router.post('/api/login', usercontroller.login);
router.get('/api/allUser', usercontroller.alluser);//ruta para todos los usuarioa

/**roles */

router.get('/api/role', rolecontroller.listar);
router.get('/api/role/:id', rolecontroller.getById);
router.post('/api/role', rolecontroller.add);
router.get('/api/roleall', rolecontroller.roleall);
router.get('/api/delrole/:id', rolecontroller.deleterol);
router.get('/api/allrol/:id_personal', rolecontroller.listarto);

/**agregar roles y cuentas */
router.post('/api/userrol/crearol', usercontroller.addRole);
router.post('/api/personal/pers_user', personalcontroller.addUser);

router.get('/api/fecha', personalcontroller.list_fecha)

//table role user
router.get ('/roel_user', (req,res) => {
  return role_user
  .findAll()
  .then((rol) => res.status(200).send(rol))
  .catch((error) => { res.status(400).send(error); });
})

router.post('/uodate_role_user/:id', (req,res) => {
  const { id } = req.params
  const { role_id } = req.body
  console.log(role_id)
  return role_user
  .findOne({
    where:{user_id:14}
  })
  .then((data) => {
    //console.log(data, " <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", id )
    data.update({
      role_id: role_id || data.role_id         
    })
    .then(update => {
      res.status(200).send({
        success:true,
        msg: 'Datos actualizados',
        data: {                  
          role_id: role_id || update.role_id              
        }
      })
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({
        error
      })
    });
  })
  .catch(error => {
    console.log(error);
    res.status(400).json({
      error
    })
  });
})

module.exports = router