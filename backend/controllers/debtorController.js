const Debtor = require("../models/debtorModel.js");

// Test route
const testRoute = (req, res) => {
  res.send("Debtor route is working!");
};

// GET all debtors for a specific user
const getAllDebtors = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const debtors = await Debtor.find({ userId }); // Fetch debtors associated with the userId
    res.status(200).json(debtors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a single debtor by ID for a specific user
const getDebtorById = async (req, res) => {
  const { userId, id } = req.params;

  try {
    const debtor = await Debtor.findOne({ _id: id, userId });
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }
    res.status(200).json(debtor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new debtor for a specific user
const createDebtor = async (req, res) => {
  const { userId } = req.params;
  const { name, contact } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ message: "Name and User ID are required" });
  }

  try {
    const debtor = await Debtor.create({ name, contact, userId }); // Save with userId association
    res.status(201).json(debtor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE an existing debtor by ID for a specific user
const updateDebtor = async (req, res) => {
  const { userId, id } = req.params;
  const { name, contact, totalBalance, debts } = req.body;

  try {
    const updatedDebtor = await Debtor.findOneAndUpdate(
      { _id: id, userId },
      { name, contact, totalBalance, debts },
      { new: true, runValidators: true } // Validate input and return updated document
    );
    if (!updatedDebtor) {
      return res
        .status(404)
        .json({ message: "Debtor not found or not authorized" });
    }
    res.status(200).json(updatedDebtor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a debtor by ID for a specific user
const deleteDebtor = async (req, res) => {
  const { userId, id } = req.params;

  try {
    const deletedDebtor = await Debtor.findOneAndDelete({ _id: id, userId });
    if (!deletedDebtor) {
      return res
        .status(404)
        .json({ message: "Debtor not found or not authorized" });
    }
    res.status(200).json({ message: "Debtor deleted successfully" });
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
