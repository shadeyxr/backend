const { test, describe } = require("node:test");
const assert = require("node:assert");

const average = require("./testing").average;

describe("averaging", () => {
  test("Averaging an array of nums", () => {
    assert.strictEqual(average([7, 2, 1, 8, 12]), 6);
  });

  test("Averaging an empty array", () => {
    assert.strictEqual(average([]), 0);
  });
});
