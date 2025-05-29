module.exports = (sequelize, DataTypes) => {
    const DailyBill = sequelize.define("DailyBill", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        billId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        productCodes: {
            type: DataTypes.JSON, // Store as JSON array
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('productCodes');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('productCodes', JSON.stringify(value));
            }
        },
        totalBill: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    });

    return DailyBill;
};