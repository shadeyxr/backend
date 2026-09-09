const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./user_helper");
const bcrypt = require("bcrypt");

const api = supertest(app);

describe("tests for one initial user", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("mati2005", 10);
    const user = new User({ username: "shadeyxr", passwordHash });
    await user.save();
  });
  test("adding a new user", async () => {
    const startUsers = await helper.getDBUsers();
    const newUser = {
      username: "bingbong",
      name: "Lebron boobs",
      password: "blacks",
    };

    await api
      .post("/users/")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const endUsers = await helper.getDBUsers();

    assert.strictEqual(endUsers.length, startUsers.length + 1);

    const usernames = endUsers.map((user) => user.username);
    assert(usernames.includes(newUser.username));
  });
});

after(async () => {
  await mongoose.connection.close();
});
