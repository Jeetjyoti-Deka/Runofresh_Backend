const pool = require("../db/connection");

const createOrder = async (req, res) => {
  const user = req.user;
  const { items, shipping_address, razorpay_payment_id, razorpay_order_id } =
    req.body;
  let client;
  try {
    client = await pool.connect();

    const total_amount = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const result = await client.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address, razorpay_payment_id, razorpay_order_id, payment_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [
        user.id,
        total_amount,
        shipping_address,
        razorpay_payment_id,
        razorpay_order_id,
        "paid",
      ]
    );
    const orderId = result.rows[0].id;

    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, item_id, quantity, price) VALUES ($1, $2, $3, $4);",
        [orderId, item.itemId, item.quantity, item.price]
      );
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  let client;
  try {
    client = await pool.connect();
    const orderResult = await client.query(
      "SELECT * FROM orders WHERE id = $1;",
      [orderId]
    );
    if (orderResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const query = `SELECT oi.*, i.* 
                    FROM order_items oi
                    JOIN items i ON oi.item_id = i.id
                    WHERE oi.order_id = $1;`;

    const orderItemsResult = await client.query(query, [orderId]);
    res.status(200).json({
      success: true,
      order: orderResult.rows[0],
      items: orderItemsResult.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  let client;
  try {
    client = await pool.connect();
    const orderResult = await client.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [userId]
    );
    res.status(200).json({
      success: true,
      orders: orderResult.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  let client;
  try {
    client = await pool.connect();
    await client.query("UPDATE orders SET status = $1 WHERE id = $2", [
      status,
      orderId,
    ]);
    res.status(200).json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

const getAllOrders = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT * FROM orders");
    res.status(200).json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  } finally {
    client.release();
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  getAllOrders,
};
