const express = require("express");
const {
  getItemsByUser,
  createItem,
  updateItem,
  deleteItem,
  searchAndSortItems,
} = require("../controllers/itemlistController");

const router = express.Router();

// GET all items for a specific user
router.get("/:userId", getItemsByUser);

// SEARCH and SORT items for a specific user
router.get("/search/:userId", searchAndSortItems);

// CREATE a new item for a specific user
router.post("/:userId", createItem);

// UPDATE an item by ID for a specific user
router.put("/:userId/:id", updateItem);

// DELETE an item by ID for a specific user
router.delete("/:userId/:id", deleteItem);

module.exports = router;
