if(process.env.NODE_ENV!="production"){
    require("dotenv").config({ path: "../.env" });
}

const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");
const dbUrl=process.env.ATLASDB_URL;

main().then(() => {
    console.log("Database connected");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67063da7c2b2de4468db41e1"}));
    await Listing.insertMany(initData.data);
    console.log("data has been inserted");
}
initDB();