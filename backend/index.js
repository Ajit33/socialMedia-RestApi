const express = require("express");
const app = express();
const dotenv = require("dotenv");
const ConnectDatabase = require("./database/db");
const rootRouter = require("./routes/index");
dotenv.config();

app.use(express.json());
app.use("/api/v1", rootRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await ConnectDatabase();
    console.log(`App is running on port ${PORT}`);
});
