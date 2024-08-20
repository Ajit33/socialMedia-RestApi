const express=require("express")
const app=express()
const dotenv=require("dotenv")
const ConnectDatabse = require("./database/db")

dotenv.config()

app.listen(5000,async()=>{
    await ConnectDatabse()
    console.log("app is running port 5000")
})