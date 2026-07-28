const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection");

class Category extends Model {}

Category.init(
  {
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "category",
  },
);

// Export Category model
module.exports = Category;
