//grab our client with destructuring fromt he exprt in index.js
const { client, getAllUsers } = require("./index.js");

async function testDB() {
  try {
    console.log("Starting to test database...");
    //connect the client to the database

    //queries are promises, wo we await them
    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database test!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

//this funtion should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
        DROP TABLE IF EXISTS users;
        `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error; // we pass the error up to the funtion that calls dropTables()
  }
}

//this funtion should call a query which creates all tables for our database
async function createTables() {
  try {
    console.log("Starting to build talbes...");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
        `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error; // we pass the error up to the funtion that calls createTables()
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
  } catch (error) {
    console.error(error);
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
