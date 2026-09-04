const Note = require("../models/note");

const initialNotes = [
  {
    content: "boom",
    important: true,
  },
  { content: "lala", important: false },
];

const nonExistingId = async () => {
  const note = new Note({ content: "willremovethissoon" });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

async function getDBNotes() {
  const notes = await Note.find({});
  return notes.map((n) => n.toJSON());
}

module.exports = { initialNotes, nonExistingId, getDBNotes };
