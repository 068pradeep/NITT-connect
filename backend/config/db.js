const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    //const uri = "mongodb://127.0.0.1:27017/mern";
    const uri = process.env.MONGO_URI;
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log("Mongo is Not Connected")
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

module.exports = connectDB;

