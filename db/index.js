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
async function createUser({ username, password }) {
  try {
    const result = await client.query(
      `
        INSERT INTO users(username, password)
        VALUES ($1, $2);
        `,
      [username, password]
    );
    return result;
  } catch (error) {
    throw error;
  }
}

//exporting
module.exports = {
  client,
  getAllUsers,
  createUser,
};
