'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Propiedad extends Model {
    static associate(models) {
      // Relación con Usuario (propietario)
      Propiedad.belongsTo(models.Usuario, {
        foreignKey: 'propietario_id',
        as: 'propietario',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      // Relación con Usuario (agente)
      Propiedad.belongsTo(models.Usuario, {
        foreignKey: 'agente_id',
        as: 'agente',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      // Relación con Barrio
      Propiedad.belongsTo(models.Barrio, {
        foreignKey: 'barrio_id',
        as: 'barrio',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      // Relación con Categoria
      Propiedad.belongsTo(models.Categoria, {
        foreignKey: 'categoria_id',
        as: 'categoria',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      // Relación con Direccion
      Propiedad.belongsTo(models.Direccion, {
        foreignKey: 'direccion_id',
        as: 'direccion',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Relación con Visitas
      Propiedad.hasMany(models.Visita, {
        foreignKey: 'propiedad_id',
        as: 'visitas',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Relación con Caracteristicas
      Propiedad.belongsToMany(models.Caracteristica, {
        through: 'propiedad_caracteristica',
        foreignKey: 'propiedad_id',
        otherKey: 'caracteristica_id',
        as: 'caracteristicas',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Relación con Comments
      Propiedad.hasMany(models.Comment, {
        foreignKey: 'propiedad_id',
        as: 'comments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      // Relación con Favorites
      Propiedad.hasMany(models.Favorite, {
        foreignKey: 'propiedad_id',
        as: 'favorites',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Propiedad.init({
    direccion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'direcciones',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    barrio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'barrios',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    ambientes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1
      }
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    m2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1
      }
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '/images/products/budapest.jpg'
    },
    maps_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    propietario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    agente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      validate: {
        isInt: true
      }
    },
    estado: {
      type: DataTypes.ENUM('disponible', 'reservada', 'vendida', 'alquilada'),
      allowNull: false,
      defaultValue: 'disponible'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 2000]
      }
    },
    dormitorios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0
      }
    },
    banos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0
      }
    },
    orientacion: {
      type: DataTypes.ENUM('norte','sur','este','oeste'),
      allowNull: true
    },
    tipo: {
      type: DataTypes.ENUM('venta', 'alquiler'),
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    moneda: {
      type: DataTypes.ENUM('USD', 'ARS'),
      allowNull: false,
      defaultValue: 'USD'
    }
  }, {
    sequelize,
    modelName: 'Propiedad',
    tableName: 'propiedades',
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft deletes
    indexes: [
      {
        name: 'idx_propiedad_precio',
        fields: ['precio']
      },
      {
        name: 'idx_propiedad_categoria',
        fields: ['categoria_id']
      },
      {
        name: 'idx_propiedad_barrio',
        fields: ['barrio_id']
      },
      {
        name: 'idx_propiedad_agente',
        fields: ['agente_id']
      },
      {
        name: 'idx_propiedad_propietario',
        fields: ['propietario_id']
      },
      {
        name: 'idx_propiedad_estado',
        fields: ['estado']
      }
    ]
  });

  return Propiedad;
}; 