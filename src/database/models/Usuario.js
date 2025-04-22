'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.hasMany(models.Propiedad, {
        foreignKey: 'propietario_id',
        as: 'propiedades'
      });
      Usuario.hasMany(models.Propiedad, {
        foreignKey: 'agente_id',
        as: 'propiedadesAgente'
      });
      Usuario.hasMany(models.Visita, {
        foreignKey: 'cliente_id',
        as: 'visitas'
      });
    }

    // Método para validar la contraseña
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    // Método para obtener el nombre completo
    getFullname() {
      return [this.nombre, this.apellido].join(" ");
    }

    // Método para calcular la edad
    getAge() {
      const hoy = new Date();
      const fechaNac = new Date(this.fecha_registro);
      
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      
      const mes = hoy.getMonth() - fechaNac.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }
      
      return edad;
    }
  }

  Usuario.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: DataTypes.STRING(20),
    tipo: {
      type: DataTypes.ENUM('cliente', 'agente', 'admin'),
      defaultValue: 'cliente'
    },
    genero: {
      type: DataTypes.ENUM('masculino', 'femenino', 'otro', 'prefiero_no_decir'),
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'images/products/budapest.jpg'
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    underscored: true
  });

  return Usuario;
}; 