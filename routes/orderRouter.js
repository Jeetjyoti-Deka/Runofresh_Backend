const router = require("express").Router();
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

router.post("/", createOrder); // Create a new order
router.get("/:orderId", getOrderById); // Get order details by order ID
router.get("/user/:userId", getOrdersByUser); // Get orders by user ID
router.put("/status", updateOrderStatus); // Update order status
router.get("/", getAllOrders); // Get all orders

module.exports = router;
