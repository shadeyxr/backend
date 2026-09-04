const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../models/note");
const helper = require("./test_helper");

const api = supertest(app);

describe("When initial notes are saved to db", () => {
  beforeEach(async () => {
    await Note.deleteMany({});

    await Note.insertMany(helper.initialNotes);
  });

  test("check notes return as json", async () => {
    await api
      .get("/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are returned", async () => {
    const response = await api.get("/notes");

    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  test("a specific note is within returned notes", async () => {
    const response = await api.get("/notes");

    const contents = response.body.map((note) => note.content);
    assert(contents.includes("boom"));
  });

  test("adding a new note", async () => {
    const newNote = {
      content: "big joe",
      important: false,
    };

    await api
      .post("/notes")
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await helper.getDBNotes();
    const content = response.map((n) => n.content);

    assert.strictEqual(response.length, helper.initialNotes.length + 1); // check for note amount increase
    assert(content.includes("big joe")); // check if the note has the correct content added
  });

  test("A note with no content doesn't get added to db", async () => {
    const newNote = {
      important: true,
    };

    await api.post("/notes").send(newNote).expect(400);

    const response = await helper.getDBNotes();

    assert.strictEqual(response.length, helper.initialNotes.length);
  });

  test("A note's body can be fully viewed", async () => {
    const viewedNote = (await helper.getDBNotes())[0];

    const response = await api
      .get(`/notes/${viewedNote.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(response.body, viewedNote);
  });

  test("A note is deleted", async () => {
    const notesBefore = await helper.getDBNotes();
    const noteToDelete = notesBefore[0];

    await api.delete(`/notes/${noteToDelete.id}`).expect(204);

    const notesAfter = await helper.getDBNotes();

    assert.strictEqual(notesAfter.length, notesBefore.length - 1);
    assert(!notesAfter.includes(noteToDelete));
  });
});

after(async () => {
  await mongoose.connection.close();
});
