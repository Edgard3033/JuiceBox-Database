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

//exporting
module.exports = {
  client,
  getAllUsers,
};
