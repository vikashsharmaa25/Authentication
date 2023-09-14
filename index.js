const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/db");
const router = require("./routes/authRoute");
dotenv.config("./.env");
const app = express();

//============================ */ cookie parser ============================//
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//============================ */ body parser ============================//
app.use(express.json());
app.use("/api/v1", router);

dbConnect();
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`server is connected on ${PORT}`);
});
