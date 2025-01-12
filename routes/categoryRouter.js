const {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
} = require("../controllers/categoryController");

const router = require("express").Router();

router.get("/", getAllCategories);
router.get("/search", getCategoryByName);
router.get("/:id", getCategoryById);

module.exports = router;
