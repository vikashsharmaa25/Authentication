const mongoose = require("mongoose");

const dbConnect = async (req, res) => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      UseUnifiedTopology: true,
    })
    .then(() => {
      console.log("successfully connected database");
    })
    .catch((err) => {
      console.log("Database Error");
      console.log(err);
      process.exit(1);
    });
};

module.exports = dbConnect;
