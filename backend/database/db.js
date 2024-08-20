const mongoose=require("mongoose")


const ConnectDatabse=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URL)
        if(conn){
        console.log("db is connected")
        }else{
            console.log("somthing went wrong")
        }
    } catch (error) {
        console.log("db is not connected " + error)
    }
}

module.exports=ConnectDatabse