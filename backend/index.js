const express=require("express")
const app=express()
const dotenv=require("dotenv")
const ConnectDatabse = require("./database/db")

dotenv.config()

app.listen(process.env.PORT,async()=>{
    await ConnectDatabse()
    console.log("app is running port 5000")
})