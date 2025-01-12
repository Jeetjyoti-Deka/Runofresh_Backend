const jwt = require("jsonwebtoken");
const pool = require("../db/connection");

const authMiddleware = async (req, res, next) => {
  const cookies = req.cookies;

  const token = cookies["jwt-token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let client;
  let user;
  try {
    client = await pool.connect();
    user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const query = `SELECT * FROM users WHERE id=$1;`;
    const result = await client.query(query, [user.id]);
    if (result.rows.length === 0 || result.rows[0].email !== user.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      // console.error("Token has expired:", error.message);
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  } finally {
    client.release();
  }

  req.user = {
    id: user.id,
    email: user.email,
  };
  next();
};

module.exports = authMiddleware;
