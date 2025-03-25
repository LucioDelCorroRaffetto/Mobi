module.exports = (sequelize, DataTypes) => {
  const Visita = sequelize.define('Visita', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente','confirmada','cancelada','realizada'),
      defaultValue: 'pendiente'
    }
  }, {
    tableName: 'visitas',
    timestamps: false
  });

  Visita.associate = function(models) {
    Visita.belongsTo(models.Propiedad, {
      foreignKey: 'propiedad_id'
    });
    Visita.belongsTo(models.Usuario, {
      as: 'cliente',
      foreignKey: 'cliente_id'
    });
    Visita.belongsTo(models.Usuario, {
      as: 'agente',
      foreignKey: 'agente_id'
    });
  };

  return Visita;
}; 