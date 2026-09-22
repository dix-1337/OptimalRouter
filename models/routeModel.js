'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    static associate(models) {
    }
  }
  Route.init(
    {
      origin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      distanceKm: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      durationMin: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      traffic: {
        type: DataTypes.STRING,
        defaultValue: 'low',
      },
      trafficDelayMin: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Route',
    }
  );
  return Route;
};