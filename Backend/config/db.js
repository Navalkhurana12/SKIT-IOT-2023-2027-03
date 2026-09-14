const mongoose = require("mongoose")

require("dotenv").config()

module.exports.MongodbConfig = () => {
  mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log("connected to mongoDB")
  })
  .catch((err)=>{
    console.log(err)
  })
}