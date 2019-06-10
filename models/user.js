'use strict';
var bcrypt = require('bcrypt-nodejs');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    correo:{
      type: DataTypes.STRING,
      unique: {
        args: true
      },
      lowercase:true,
      validate: {
        isEmail: {
          args: false
        }
      }
    }, 
    contraseña: {
      type:  DataTypes.STRING,
      select:true,
      allowNull:{
        args: false,
      },       
    }, 
    tipo_usuario:{
      type:  DataTypes.STRING,
      allowNull:{
        args: false,
      }
    },
    idReg_personal: { 
      type: DataTypes.INTEGER,
      allowNull:{
        args: false,
      }
    }
  }, 
  {});
  User.beforeSave((user, options) => {
    if (user.changed('contraseña')) {
      user.contraseña = bcrypt.hashSync(user.contraseña, bcrypt.genSaltSync(10), null);
    }
  });
  User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.contraseña, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
  };
  User.associate = function(models) {
    User.belongsTo(models.Registro_personal, {
      foreignKey: 'idReg_personal',
      onDelete: 'CASCADE'
    });
  };
  return User;
};