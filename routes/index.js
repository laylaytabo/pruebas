var express = require('express');
var router = express.Router();

const personalcontroller = require('../controllers').personal;
const usercontroller = require('../controllers').user;
const rolecontroller = require('../controllers').role;
const passport = require('passport');
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


/**user */

router.get('/api/user', usercontroller.listar);
router.get('/api/user/:id', usercontroller.getById);
router.get('/api/mostrarCuenta/:id', usercontroller.mostrarCuenta);
router.post('/api/UsuraioCuenta/:perso_id', usercontroller.add);
router.post('/api/login', usercontroller.login);

/**roles */

router.get('/api/role', rolecontroller.listar);
router.get('/api/role/:id', rolecontroller.getById);
router.post('/api/role', rolecontroller.add);
router.get('/api/roleall', rolecontroller.roleall);
router.get('/api/delrole/:id', rolecontroller.deleterol);

/**agregar roles y cuentas */
router.post('/api/userrol/crearol', usercontroller.addRole);
router.post('/api/personal/pers_user', personalcontroller.addUser);


module.exports = router;
