const mongoose = require("mongoose")

const connectDatabase = () =>{
mongoose.connect(process.env.DB_URL ).then(()=>{
    console.log("Connection Successfull")
}).catch((err)=>{
    console.log(err);
})}


module.exports = connectDatabase