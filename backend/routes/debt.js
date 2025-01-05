const express = require("express");
const router = express.Router();
const {
  getDebtorById,
  addInventoryDebt,
  addManualDebt,
  payDebt,
} = require("../controllers/debtController");

// Fetch debtor details by ID
router.get("/:id", getDebtorById);

// Add debt (inventory)
router.post("/:id/debt/inventory", addInventoryDebt);

// Add debt (manual)
router.post("/:id/debt/manual", addManualDebt);

// Pay debt (full or partial)
router.post("/:id/pay", payDebt);

module.exports = router;
