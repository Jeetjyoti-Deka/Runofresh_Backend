const {
  getAllItems,
  getItemsByCategory,
  getItemById,
  getItemsByCategoryName,
  getItemByName,
} = require("../controllers/itemController");

const router = require("express").Router();

router.get("/", getAllItems);
router.get("/category/:categoryId", getItemsByCategory);
router.get("/search", getItemByName);
router.get("/search/category", getItemsByCategoryName);
router.get("/:id", getItemById);

module.exports = router;
