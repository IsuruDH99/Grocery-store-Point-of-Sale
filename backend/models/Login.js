module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define("Login", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobrole: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Login;
};
