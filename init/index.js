// const mongoose = require("mongoose");
// const initdata =require("./data.js");
// const Listing = require("../models/listing.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust2";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
  
//   const correctOwnerId = '685d64adfddaabebe959ff68';
  
//   initdata.data = initdata.data.map((obj) => ({
//     ...obj,
//     owner: new mongoose.Types.ObjectId(correctOwnerId), 
//   }));
  
//   await Listing.insertMany(initdata.data);
//   console.log("Data initialized with correct owner");
// };

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust2";

main()
  .then(() => {
    console.log("Connected to DB");
    initDB();  // Call the function AFTER connection
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
  
    const correctOwnerId = "685ff9199e2a7b449878ef0b";
  
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: new mongoose.Types.ObjectId(correctOwnerId),
    }));
  
    await Listing.insertMany(initdata.data);
    console.log("Data initialized with correct owner");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
};
