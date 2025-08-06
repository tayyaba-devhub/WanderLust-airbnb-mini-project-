const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust2";

// DB connection
main()
  .then(() => {
    console.log("✅ Connected to DB");
    initDB(); 
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Seed function
const initDB = async () => {
  try {
    await Listing.deleteMany({});
    
    const correctOwnerId = '685d64adfddaabebe959ff68';
    
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: new mongoose.Types.ObjectId(correctOwnerId),
    }));
    
    await Listing.insertMany(initdata.data);
    console.log("✅ Data initialized with correct owner");
  } catch (err) {
    console.error("❌ Data initialization failed:", err);
  } finally {
    mongoose.connection.close(); 
  }
};



