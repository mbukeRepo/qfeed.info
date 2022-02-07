const express = require("express");
const feedRouter = require("./routes/feed.routes");
const authRouter = require("./routes/auth.routes");
const errorHandler = require("./controllers/error.handler");
const mongoose = require("mongoose");
require("./services/cache");
const app = express();

app.use(express.json());
app.use("/api/feed", feedRouter);
app.use("/api/auth", authRouter);
app.use(errorHandler);


const options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

mongoose.connect("mongodb://localhost:27017/qfeed", options)
.then(() => {
    console.log("connected to the database")
    app.listen(5000, console.log("app running on port + " + 5000));
})
