const express = require("express");
const {
  testRoute,
  getAllDebtors,
  getDebtorById,
  createDebtor,
  updateDebtor,
  deleteDebtor,
} = require("../controllers/debtorController.js");

const router = express.Router();

// Test route
router.get("/test", testRoute);

// GET all debtors for a specific user
router.get("/:userId", getAllDebtors);

// GET a specific debtor by ID for a specific user
router.get("/:userId/:id", getDebtorById);

// CREATE a new debtor for a specific user
router.post("/:userId", createDebtor);

// UPDATE a debtor by ID for a specific user
router.put("/:userId/:id", updateDebtor);

// DELETE a debtor by ID for a specific user
router.delete("/:userId/:id", deleteDebtor);

module.exports = router;
