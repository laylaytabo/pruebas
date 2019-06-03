'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      correo: {
        allowNull: true,
        unique: true,
        type: Sequelize.STRING
      },
      contraseña: {
        allowNull: false,
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.BOOLEAN
      },
      tipo_usuario:{
        type: Sequelize.STRING
      },
      idReg_personal:{
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Registro_personals',
          key: 'id',
          as: 'idReg_personal',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
     updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface /* , Sequelize */ =>  queryInterface.dropTable('Usuarios')
};