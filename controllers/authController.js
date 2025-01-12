const axios = require("axios");
const jwt = require("jsonwebtoken");
const { Oauth2Client } = require("../utils/googleConfig");
const pool = require("../db/connection");

async function googleLogin(req, res) {
  let client;
  try {
    const { code } = req.query;
    let isLogin = true;

    const googleRes = await Oauth2Client.getToken(code);
    Oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    client = await pool.connect();
    let result = await client.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rowCount === 0) {
      isLogin = false;
      query =
        "INSERT INTO users (name, email, image) VALUES ($1, $2, $3) RETURNING *;";
      result = await client.query(query, [name, email, picture]);
    }

    const user = result.rows[0];

    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    res.cookie("jwt-token", token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "Lax", // Allows cross-origin requests with credentials
    });

    res.status(200).json({ message: "success", user, isLogin });
  } catch (error) {
    console.log("error in creating the user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    client.release();
  }
}

module.exports = {
  googleLogin,
};
