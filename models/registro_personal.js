'use strict';
module.exports = (sequelize, DataTypes) => {
  const Registro_personal = sequelize.define('Registro_personal', {
    estado: DataTypes.BOOLEAN,
    nombre: DataTypes.TEXT,
    apellidop: DataTypes.TEXT,
    apellidom: DataTypes.TEXT,
    ci: {
      type: DataTypes.STRING,
     /* unique: {
        args: true
      },*/
    },
    cargo: DataTypes.TEXT,
    direcion: DataTypes.TEXT,
    telefono: DataTypes.INTEGER
  }, {});
 Registro_personal.associate = function(models) {
   Registro_personal.hasMany(models.User, {
      foreignKey: 'perso_id',
    });    
  };
  return Registro_personal;
};