module.exports = (sequelize, DataTypes) => {
    const BillProduct = sequelize.define("BillProduct", {
        // billId: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'DailyBills',
        //         key: 'id'
        //     }
        // },
        // productCode: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        // quantity: {
        //     type: DataTypes.DECIMAL(10, 3),
        //     allowNull: false
        // },
        // price: {
        //     type: DataTypes.DECIMAL(10, 2),
        //     allowNull: false
        // }
    });

    return BillProduct;
};