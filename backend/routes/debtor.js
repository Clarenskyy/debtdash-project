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

router.get("/test", testRoute);
router.get("/", getAllDebtors);
router.get("/:id", getDebtorById);
router.post("/", createDebtor);
router.put("/:id", updateDebtor);
router.delete("/:id", deleteDebtor);

module.exports = router;
