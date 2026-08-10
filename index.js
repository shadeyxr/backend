const express = require("express");
const app = express();
require("dotenv").config();
const Note = require("./models");
const PORT = process.env.PORT || 3001;

app.use(express.static("dist"));
app.use(express.json());

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

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted request" });
  }

  next(error);
};

app.get("/notes", (request, response) => {
  Note.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/notes/:id", (request, response, next) => {
  const id = request.params.id;
  Note.findById(id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

app.post("/notes", (request, response) => {
  const newNoteContent = request.body;

  const newNote = new Note({
    content: newNoteContent.content,
    important: newNoteContent.important,
  });

  newNote.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.put("/notes/:id", (request, response, next) => {
  const id = request.params.id;

  Note.findById(id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }
      note.content = request.body.content;
      note.important = request.body.important;

      return note.save().then((result) => {
        return response.json(result);
      });
    })
    .catch(next);
});

app.delete("/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      console.log(result);
      return response.status(204).end;
    })
    .catch(next);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
