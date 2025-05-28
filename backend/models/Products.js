module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    productCode: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    productQty: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return Product;
};
