const pool = require("../db/connection");

const getAllItems = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT * FROM items;");
    res.status(200).json({
      success: true,
      message: "Items found",
      items: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

const getItemById = async (req, res) => {
  let client;
  const { id } = req.params;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT * FROM items WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Item found",
      item: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

const getItemsByCategory = async (req, res) => {
  let client;
  const { categoryId } = req.params;
  try {
    client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM items WHERE category_id = $1",
      [categoryId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No items found in this category",
      });
    }
    res.status(200).json({
      success: true,
      message: "Items found in category",
      items: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

// TODO: improve search functionality so that for name = pork we get some result i.e name do not have be specific
const getItemByName = async (req, res) => {
  let client;
  const { name } = req.query;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT * FROM items WHERE name = $1", [
      name,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Item(s) found",
      items: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

const getItemsByCategoryName = async (req, res) => {
  let client;
  const { categoryName } = req.query;
  try {
    client = await pool.connect();
    const result = await client.query(
      `SELECT items.* FROM items
       JOIN categories ON items.category_id = categories.id
       WHERE categories.name = $1`,
      [categoryName]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No items found in this category",
      });
    }
    res.status(200).json({
      success: true,
      message: "Item(s) found in category",
      items: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllItems,
  getItemById,
  getItemsByCategory,
  getItemByName,
  getItemsByCategoryName,
};
