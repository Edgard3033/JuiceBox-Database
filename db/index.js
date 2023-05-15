const { Client } = require("pg");

// supply the db name and location of the database
const client = new Client("postgres://localhost:5432/juicebox-dev");

//writing helper funtions
async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username
        FROM users;
        `
  );
  return rows;
}

//helper funtion to create the users
async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
      [username, password, name, location]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=$${setString.length + 1}
      RETURNING *;
      `,
      [...Object.values(fields), id]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

//exporting
module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
};
