var express = require('express');
var router = express.Router();

const personalcontroller = require('../controllers').personal;
const usercontroller = require('../controllers').user;
const rolecontroller = require('../controllers').role;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**Personal */
router.get('/api/personal', personalcontroller.list);
router.get('/api/personal/:id', personalcontroller.getById);
router.post('/api/personal', personalcontroller.add);


/**user */

router.get('/api/user', usercontroller.listar);
//router.get('/api/user/:id', usercontroller.getById);
router.post('/api/user/:perso_id', usercontroller.add);

/**roles */

router.get('/api/role', rolecontroller.listar);
router.get('/api/role/:id', rolecontroller.getById);
router.post('/api/role', rolecontroller.add);


/**agregar roles y cuentas */
router.post('/api/userrol/crearol', usercontroller.addRole);
router.post('/api/personal/pers_user', personalcontroller.addUser);


module.exports = router;
