const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/notes", async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

notesRouter.get("/notes/:id", async (request, response) => {
  const id = request.params.id;

  const note = await Note.findById(id);

  note ? response.json(note) : response.status(404).end();
});

notesRouter.post("/notes", async (request, response) => {
  const newNoteContent = request.body;

  if (!newNoteContent) {
    response.status(400).json({ error: "content is null" });
  }

  const newNote = new Note({
    content: newNoteContent.content,
    important: newNoteContent.important,
  });

  const savedNote = await newNote.save();
  response.status(201).json(savedNote);
});

notesRouter.put("/notes/:id", async (request, response) => {
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

notesRouter.delete("/notes/:id", async (request, response) => {
  const deletedNote = await Note.findByIdAndDelete(request.params.id);

  console.log(deletedNote);
  return response.status(204).end();
});

module.exports = notesRouter;
