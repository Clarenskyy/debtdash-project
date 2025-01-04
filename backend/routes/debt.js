// routes/debtRoutes.js

const express = require("express");
const router = express.Router();
const debtController = require("../controllers/debtController");

// Route to fetch debtor details by ID
router.get("/:id", debtController.getDebtorById);

// Route to add a debt (manual or inventory)
router.post("/:id/debt", debtController.addDebt);

// Route to pay debt (full or partial payment)
router.post("/:id/pay", debtController.payDebt);

module.exports = router;
