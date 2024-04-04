const mongoose = require("mongoose")

const connectDatabase = () =>{
mongoose.connect("mongodb+srv://sameerriaz910:oUez61fToKOureTp@cluster0.za0ba3e.mongodb.net/").then(()=>{
    console.log("Connection Successfull")
}).catch((err)=>{
    console.log(err);
})}


module.exports = connectDatabase