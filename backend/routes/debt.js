const express = require("express");
const {
  getDebtorById,
  addInventoryDebt,
  addManualDebt,
  payDebt,
} = require("../controllers/debtController");

const router = express.Router();

// Fetch debtor details by ID for a specific user
router.get("/:userId/:id", getDebtorById);

// Add debt (inventory) for a specific user
router.post("/:userId/:id/debt/inventory", addInventoryDebt);

// Add debt (manual) for a specific user
router.post("/:userId/:id/debt/manual", addManualDebt);

// Pay debt (full or partial) for a specific user
router.post("/:userId/:id/pay", payDebt);

module.exports = router;
