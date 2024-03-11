require("dotenv").config();
const { app } = require("./app");
const { dbConnect } = require("./config/database");
const port = process.env.PORT || 2010;


app.listen(port, async ()=>{
    console.log(`Server is running at http://localhost:${port}`);
    await dbConnect();
});