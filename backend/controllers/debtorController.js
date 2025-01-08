const Debtor = require("../models/debtorModel.js");

// Test route
const testRoute = (req, res) => {
  res.send("Debtor route is working!");
};

// GET all debtors
const getAllDebtors = async (req, res) => {
  try {
    const debtors = await Debtor.find();
    res.status(200).json(debtors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a single debtor by ID
const getDebtorById = async (req, res) => {
  const { id } = req.params;

  try {
    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }
    res.status(200).json(debtor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new debtor
const createDebtor = async (req, res) => {
  const { userId, name, contact } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: "UserId and Name are required" });
  }

  try {
    const debtor = await Debtor.create({ userId, name, contact });
    res.status(201).json(debtor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE an existing debtor by ID
const updateDebtor = async (req, res) => {
  const { id } = req.params;
  const { name, contact, debts } = req.body;

  try {
    const updatedDebtor = await Debtor.findByIdAndUpdate(
      id,
      { name, contact, debts },
      { new: true, runValidators: true } // Return updated doc and validate input
    );
    if (!updatedDebtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }
    res.status(200).json(updatedDebtor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a debtor by ID
const deleteDebtor = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDebtor = await Debtor.findByIdAndDelete(id);
    if (!deletedDebtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }
    res.status(200).json(deletedDebtor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  testRoute,
  getAllDebtors,
  getDebtorById,
  createDebtor,
  updateDebtor,
  deleteDebtor,
};
