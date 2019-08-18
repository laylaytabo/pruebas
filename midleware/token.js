const jwt = require('jsonwebtoken')
const User = require('../models').User;
const Role = require('../models').Role;


module.exports = function(req, res, next){
    console.log(req.path, "   esto es lo que quiero")
    if(req.path != '/api/login'){
        if(req.headers.authorization){
            let token = req.headers.authorization.split(' ')[1];
            console.log(token)
            jwt.verify(token,'nodeauthsecret',function(error, decoded){
                if(error)return res.status(403).json({msg:'No estas autorizado', error});
                console.log(decoded.perso_id, " <<<<<<<<<<<<<")
                
                return User
                .findByPk(decoded.id, {
                  include: [{
                    model: Role,
                    as: 'role'
                  }],
                })
                .then((user) => {
                    if (!user) {
                        return res.status(404).send({   
                          message: 'Usuario no encontrado',
                        });
                    }else{
                        console.log(req.method,"   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                        if(req.method != 'get'){
                            if(user.role[0].name == 'Almacen'){
                                next(); 
                                
                            } 
                            else {
                                res.status(400).json({message: "No tienes Permisos"})
                            }
                        }else{
                            next();
                        }
                    }                 
                  //return res.status(200).send(user);
                  
                })
                .catch((error) => res.status(400).send(error));
               
            })
           
        }
        else res.status(400).json({msg: "no tienes permisos"}) 
    }else next();
}