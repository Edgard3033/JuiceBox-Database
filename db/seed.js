//grab our client with destructuring fromt he exprt in index.js
const { client } = require("./index.js");

async function testDB() {
  try {
    //connect the client to the database
    client.connect();

    //queries are promises, wo we await them
    const { rows } = await client.query(`SELECT * FROM users;`);
    console.log(rows);
  } catch (error) {
    console.error(error);
  } finally {
    //it is important to close out the client connection
    client.end;
  }
}
testDB();
