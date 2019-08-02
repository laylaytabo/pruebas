'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING
  }, {});
  Role.associate = function(models) {
    Role.belongsToMany(models.User,{
      through: 'UseRole',
      as: 'user',
      foreignKey: 'role_id'
    })
  };
  return Role;
};