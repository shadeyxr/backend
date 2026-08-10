const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, { family: 4 })
  .then(console.log("connected to mongoDB"))
  .catch((error) => console.log(error.message));

const noteSchema = new mongoose.Schema({ content: String, important: Boolean });

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("notes", noteSchema);
