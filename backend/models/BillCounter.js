// models/BillCounter.js
module.exports = (sequelize, DataTypes) => {
    const BillCounter = sequelize.define('BillCounter', {
        prefix: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        lastNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    return BillCounter;
};
