const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose');
const dns = require("node:dns/promises");

//connect to MongoDB
async function connectToDb() {
    try{
        console.log(await dns.getServers());
        dns.setServers(["1.1.1.1"]);
        await mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB")).catch(err => console.log(err));
        
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
    
}
exports.connectToDb = connectToDb;