require("dotenv").config();
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL;

const dbConnect = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log(`db is connected!`);
    } catch (error) {
        console.log(error.message);
        console.log(`db is not connected!`);
        process.exit(1);
    }
}

exports.dbConnect = dbConnect;