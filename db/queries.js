const pool = require("./connection");

const getUsers = async (request, response) => {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query("SELECT * FROM users");
    response.status(200).json(res.rows);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Something went wrong." });
  } finally {
    client.release();
  }
};

module.exports = {
  getUsers,
};
