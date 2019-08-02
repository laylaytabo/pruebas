'use strict';
module.exports = (sequelize, DataTypes) => {
  const UseRole = sequelize.define('UseRole', {
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER
  }, {});
  UseRole.associate = function(models) {
    // associations can be defined here
  };
  return UseRole;
};