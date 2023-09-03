const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const dataRouter = require("./routes/dataRoute");
const deviceRouter = require("./routes/deviceRoute");

dotenv.config();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/device",deviceRouter);



module.exports= app;