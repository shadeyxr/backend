const { test } = require("node:test");
const assert = require("node:assert");

const reverse = require("./testing").reverse;

test("reversing a string", () => {
  assert.strictEqual(reverse("blow"), "wolb");
});
