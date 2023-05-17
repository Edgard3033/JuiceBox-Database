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
        INSERT INTO users(username, password, name, location)
        VALUES ($1, $2, $3, $4)
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
    WHERE id=$${Object.keys(fields).length + 1}
    RETURNING *;
    `,
      [...Object.values(fields), id]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

//getting all post
async function getAllPost() {
  try {
    const { rows } = await client.query(`
    SELECT authorId, title
    FROM posts;
    `);
  } catch (error) {}
}

//creating a post for the user
async function createPost({ authorId, title, content }) {
  try {
    const {
      row: [user],
    } = await client.query(
      `
    INSERT INTO posts(authorId, title, content)
    VALUES ($1, $2, $3)
    ON CONFLICT (authorID) DO NOTHING
    RETURNING *;
    `,
      [authorId, title, content]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

//Updating the user's post
async function updatePost(id, fields = {}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  );
  if (setString === 0) {
    return;
  }
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    UPDATE posts
    SET ${setString}
    WHERE id=${Object.keys(fields).length + 1}
    RETURNING *;
    `,
      [...Object.values(fields), id]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

//getting a post by a user
async function getPostByUser(userId) {
  try {
    const { rows } = await client.query(
      `
    SELECT * FROM posts
    WHERE "authorId"=$1;
    `,
      [userId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

//function to get a user and their post
async function getUserById(userId) {
  try {
    const { rows } = await client.query(
      `
    SELECT * FROM users
    WHERE id=$1;
    `,
      [id]
    );
    if (!{ rows }) {
      return null;
    } else {
      delete rows[0].password;
      rows.post = await getPostByUser(id);
      console.log("Rows in getUserById: ", rows);
      return rows;
    }
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
  getAllPost,
  createPost,
  updatePost,
  getPostByUser,
};
