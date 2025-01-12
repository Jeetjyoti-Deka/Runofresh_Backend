const pool = require("../db/connection");

// route: /categories
const getAllCategories = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT * FROM categories;");
    res.status(200).json({
      success: true,
      message: "categories found",
      categories: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "internal server error" });
  } finally {
    client.release();
  }
};

//route: /categories/:id
const getCategoryById = async (req, res) => {
  let client;
  const { id } = req.params;

  try {
    client = await pool.connect();
    const result = await client.query("SELECT * FROM categories WHERE id=$1;", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category found",
      category: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "internal server error" });
  } finally {
    client.release();
  }
};

//route: /categories/search?name=chicken
const getCategoryByName = async (req, res) => {
  let client;
  const { name } = req.query;

  try {
    client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM categories WHERE name=$1;",
      [name]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category found",
      category: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "internal server error" });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
};
