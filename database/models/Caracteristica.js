module.exports = (sequelize, DataTypes) => {
  const Caracteristica = sequelize.define('Caracteristica', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    categoria: DataTypes.ENUM('general','servicios','comodidades','seguridad'),
    icono: DataTypes.STRING(50)
  }, {
    tableName: 'caracteristicas',
    timestamps: false
  });

  Caracteristica.associate = function(models) {
    Caracteristica.belongsToMany(models.Propiedad, {
      through: 'propiedad_caracteristicas',
      foreignKey: 'caracteristica_id'
    });
  };

  return Caracteristica;
}; 