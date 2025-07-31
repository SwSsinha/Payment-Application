const express = require("express");
const mongoose= require("mongoose");
require('dotenv').config();
const rootRouter = require("./routes/index");
const cors = require('cors');
mongoose.connect(process.env.MONGODB_URL).then(() => console.log("connected to MongoDB")).catch((err) => console.log("MongoDB connection error : " , err));


const app = express();
app.use(cors())
app.use(express.json());
app.use("/api/v1" , rootRouter)



app.listen(3000);