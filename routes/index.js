var express = require('express');
var router = express.Router();

const role_user = require('../models').UseRole;


const personalcontroller = require('../controllers').personal;
const usercontroller = require('../controllers').user;
const rolecontroller = require('../controllers').role;
const passport = require('passport');

const Roles_user = require('../controllers').Roles_user;

require('../config/passport')(passport);

/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
               esto es para el back up
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
 */

var request = require("request");
var fs = require("fs")
const { exec } = require('child_process');

//console.log("Service online Check server")
setInterval(function(){
  console.log("make request ");
  createLog("BackUp created in ")
  backupDatabase();
}, 300*60*1000);


router.get('/ruta_para_back_up', (req,res) => {
  
   backupDatabase( () => {
    res.status(200).json("esto es el mensaje")
   })
  
})

function createLog (msn) {

  if (!fs.existsSync('./databaselog.txt')) {

    fs.writeFile("./databaselog.txt", "backupcreated ");
  }
  fs.readFile('./log.txt', (err, data) => {
      if (err) throw err;
      var date = new Date();
      var info = data + "\n" + msn + " " + date;
      fs.writeFile("./log.txt", info);
  });

}

function backupDatabase (callback) {

  console.log(" si entro no se si esta funcionando ")

  exec('sudo docker exec serviceproyecto_postgres_1 pg_dumpall -U postgres > /home/alejandro/backups/serviceproyecto_postgres_1.sql', (err, stdout, stderr) => {
    //exec('sudo exec -t serviceproyecto_postgres_1 pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql', (err, stdout, stderr) => {
    //exec('sudo docker exec -it 2263bc4a5b0d pg_dump --db serviceproyecto_postgres_1 -o /backup/serviceproyecto_postgres_1', (err, stdout, stderr) => {
    console.log(stdout, "    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")  
    if (err) {
        // node couldn't execute the command
        console.log(err, " error 3")
        return;
      }
      callback()
  });
  /* exec('sudo' , (err, stdout, stderr) => {
    console.log(" <<<<<<<<<<<<<<<<<<<<<<" )
    if(err){
      console.log(err, " error 1")

    }
    

    exec('GIRLSgeneration1' , (err, stdout, stderr) => {
      if(err){
        console.log(err, " error 2")
      }
      exec('docker exec serviceproyecto_postgres_1 pg_dumpall -U postgres > /home/alejandro/backups/serviceproyecto_postgres_1.sql', (err, stdout, stderr) => {
        //exec('sudo exec -t serviceproyecto_postgres_1 pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql', (err, stdout, stderr) => {
        //exec('sudo docker exec -it 2263bc4a5b0d pg_dump --db serviceproyecto_postgres_1 -o /backup/serviceproyecto_postgres_1', (err, stdout, stderr) => {
          if (err) {
            // node couldn't execute the command
            console.log(err, " error 3")
            return;
          }
      });

    })

  }) */
  
  
}

/* 
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/


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

router.post('/api/filter_list', personalcontroller.filter_list)///filtrar personal

router.post('/api/baja_personal/:id',personalcontroller.baja_personal )

/**user */

router.get('/api/user', usercontroller.listar);
router.get('/api/user/:id', usercontroller.getById);
router.get('/api/mostrarCuenta/:id', usercontroller.mostrarCuenta);
router.post('/api/UsuraioCuenta/:perso_id', usercontroller.add);
router.post('/api/login', usercontroller.login);
router.get('/api/allUser', usercontroller.alluser);//ruta para todos los usuarioa

router.post('/api/filter_users', usercontroller.filter_usuario)///filtrar usuarios
/**roles */

router.get('/api/role', rolecontroller.listar);
router.get('/api/role/:id', rolecontroller.getById);
router.post('/api/role', rolecontroller.add);
router.get('/api/roleall', rolecontroller.roleall);
router.get('/api/delrole/:id', rolecontroller.deleterol);
router.get('/api/allrol/:id_personal', rolecontroller.listarto);
router.get('/api/role_farmacia', rolecontroller.role_farmacia);

router.get('/api/role_alamcen', rolecontroller.role_almacen);

router.get('/api/role_hospitalizacion', rolecontroller.role_hospitalizacion);


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