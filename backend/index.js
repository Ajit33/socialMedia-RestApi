const express = require("express");
const app = express();
const dotenv = require("dotenv");
const ConnectDatabase = require("./database/db");
const rootRouter = require("./routes/index");
const cookieParser=require("cookie-parser")
const {errorHandler}=require("./middlewares/error")




dotenv.config();

app.use(express.json());
app.use(cookieParser())
app.use("/api/v1", rootRouter);
app.use(errorHandler)
app.length("/",(req,res)=>{
    res.json({
        message:"hello docker"
    })
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await ConnectDatabase();
    console.log(`App is running on port ${PORT}`);
});
