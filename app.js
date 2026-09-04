const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const notesRouter = require("./controllers/notes");

const app = express();

logger.info("connecting to", config.uri);

mongoose
  .connect(config.uri, { family: 4 })
  .then(console.log("connected to mongoDB"))
  .catch((error) => logger.error(error));

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/", notesRouter);

app.use(middleware.errorHandler);

module.exports = app;
