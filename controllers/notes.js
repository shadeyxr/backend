const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

function getTokenFrom(request) {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
}

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
  const id = request.params.id;

  const note = await Note.findById(id);

  note ? response.json(note) : response.status(404).end();
});

notesRouter.post("/", async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: "userID is invalid/missing" });
  }

  if (!body) {
    return response.status(400).json({ error: "content is null" });
  }

  const newNote = new Note({
    content: body.content,
    important: body.important,
    user: user._id,
  });

  const savedNote = await newNote.save();

  user.notes = user.notes.concat(newNote._id);
  await user.save();

  return response.status(201).json(savedNote);
});

notesRouter.put("/:id", async (request, response) => {
  const id = request.params.id;

  const note = await Note.findById(id);

  if (!note) {
    return response.status(404).end();
  }
  note.content = request.body.content;
  note.important = request.body.important;

  const updatedNote = await note.save();
  return response.json(updatedNote);
});

notesRouter.delete("/:id", async (request, response) => {
  const deletedNote = await Note.findByIdAndDelete(request.params.id);

  console.log(deletedNote);
  return response.status(204).end();
});

module.exports = notesRouter;
