const User = require("../models/user");

async function getDBUsers() {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
}

module.exports = { getDBUsers };
