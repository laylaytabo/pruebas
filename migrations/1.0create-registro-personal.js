'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Registro_personals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.TEXT
      },
      apellidop: {
        type: Sequelize.TEXT
      },
      apellidom: {
        type: Sequelize.TEXT
      },
      ci: {
        type: Sequelize.STRING
      },
      cargo: {
        type: Sequelize.TEXT
      },
      direcion: {
        type: Sequelize.TEXT
      },
      telefono: {
        type: Sequelize.INTEGER
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
  down: queryInterface /* , Sequelize */ =>  queryInterface.dropTable('Registro_personals')
};