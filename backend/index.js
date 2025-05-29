const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = require('./models');

const LoginRoute = require('./routes/Login')
app.use('/login', LoginRoute)

const ProductRoute = require('./routes/Products')
app.use('/product', ProductRoute)

const DailyBillRouter = require('./routes/DailyBill');
app.use('/dailybill', DailyBillRouter);


db.sequelize.sync().then(() => {
    app.listen(5000, () => {
        console.log("Server running on port 5000");
    });
});