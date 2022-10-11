require("dotenv").config()
const mongoose = require("mongoose");
const URI = process.env.DB_URI

mongoose.connect(URI, (err)=>{
    err? console.log(err) : console.log('mongo atlas conectado ok')
})