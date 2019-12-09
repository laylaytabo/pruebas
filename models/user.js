'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    estado: DataTypes.BOOLEAN,
    perso_id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    
  }, {});
  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });
  User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
  };
  User.associate = function(models) {
    User.belongsTo(models.Registro_personal, {
      foreignKey: 'perso_id',
      onDelete: 'CASCADE'
    });
    /*User.belongsTo(models.Registro_personal, {
      foreignKey: 'perso_id',
      as: 'personal'
    });*/
    User.belongsToMany(models.Role,{
      through:'UseRole',
      as: 'role',
      foreignKey:'user_id'
    });
  };
  return User;
};
