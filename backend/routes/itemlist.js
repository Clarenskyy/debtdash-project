const express = require("express");
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  searchAndSortItems,
} = require("../controllers/itemlistController");

const router = express.Router();

// GET all items
router.get("/", getAllItems);

// SEARCH and SORT items
router.get("/search", searchAndSortItems);

// CREATE a new item
router.post("/", createItem);

// UPDATE an item by ID
router.put("/:id", updateItem);

// DELETE an item by ID
router.delete("/:id", deleteItem);

module.exports = router;
