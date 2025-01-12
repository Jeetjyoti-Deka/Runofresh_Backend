require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const razorpayRouter = require("./routes/razorpayRouter");
const authRouter = require("./routes/authRouter");
const categoryRouter = require("./routes/categoryRouter");
const itemRouter = require("./routes/itemRouter");
const orderRouter = require("./routes/orderRouter");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const port = process.env.PORT || 3001;

// middlewares
app.use(express.json({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/razorpay", authMiddleware, razorpayRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/items", itemRouter);
app.use("/orders", authMiddleware, orderRouter);

app.listen(port, () => console.log(`server started on port ${port}`));
