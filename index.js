const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let notes = [
  {
    id: "0",
    content: "Big bob came over today",
    important: true,
  },
  {
    id: "1",
    content: "Need to buy groceries this weekend",
    important: false,
  },
  {
    id: "2",
    content: "Finish the quarterly report before Friday",
    important: true,
  },
  {
    id: "3",
    content: "Call the dentist to reschedule appointment",
    important: true,
  },
  {
    id: "4",
    content: "Watched a great documentary about space",
    important: false,
  },
  {
    id: "5",
    content: "Pay electricity bill before due date",
    important: true,
  },
  {
    id: "6",
    content: "Try that new coffee shop downtown",
    important: false,
  },
  {
    id: "7",
    content: "Backup laptop files to external drive",
    important: true,
  },
  {
    id: "8",
    content: "Read a chapter of the new novel",
    important: false,
  },
  {
    id: "9",
    content: "Renew car insurance before it expires",
    important: true,
  },
  {
    id: "10",
    content: "Plan weekend hiking trip with friends",
    important: false,
  },
  {
    id: "11",
    content: "Submit tax documents to accountant",
    important: true,
  },
  {
    id: "12",
    content: "Clean out the garage this month",
    important: false,
  },
  {
    id: "13",
    content: "Prepare slides for Monday's presentation",
    important: true,
  },
  {
    id: "14",
    content: "Water the plants before leaving for trip",
    important: false,
  },
];

app.get("/notes", (request, response) => {
  response.json(notes);
});

app.get("/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((n) => n.id === id);
  response.json(note);
});

app.post("/notes", (request, response) => {
  const newNoteContent = request.body;

  const maxID = Math.max(...notes.map((n) => n.id));

  const newNote = {
    content: newNoteContent.content,
    important: newNoteContent.important,
    id: String(maxID + 1),
  };

  notes = notes.concat(newNote);
  response.json(newNote);
});

app.put("/notes/:id", (request, response) => {
  const updatedNote = request.body;
  const id = request.params.id;

  try {
    notes = notes.map((n) => (n.id === id ? updatedNote : n));
    response.json(updatedNote);
  } catch {
    return response.status(404).json({ error: "note not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
