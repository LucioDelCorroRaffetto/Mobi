module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primero cambiamos el tipo a STRING temporalmente
    await queryInterface.changeColumn('propiedades', 'tipo', {
      type: Sequelize.STRING
    });

    // Luego lo cambiamos al nuevo ENUM
    await queryInterface.changeColumn('propiedades', 'tipo', {
      type: Sequelize.ENUM('Casa', 'Departamento', 'Oficina', 'Local', 'Terreno'),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Primero cambiamos el tipo a STRING temporalmente
    await queryInterface.changeColumn('propiedades', 'tipo', {
      type: Sequelize.STRING
    });

    // Luego lo cambiamos al ENUM original
    await queryInterface.changeColumn('propiedades', 'tipo', {
      type: Sequelize.ENUM('casa','departamento','terreno','oficina','local','garage'),
      allowNull: false
    });
  }
}; 