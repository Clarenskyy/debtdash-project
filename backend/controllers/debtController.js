const Debtor = require("../models/debtorModel");
const Item = require("../models/itemlistModels");

// Fetch debtor details by ID
const getDebtorById = async (req, res) => {
  try {
    const debtor = await Debtor.findById(req.params.id);
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }
    res.status(200).json(debtor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching debtor details" });
  }
};

// Add Debt (from Inventory or Manual)
const addDebt = async (req, res) => {
  const { id } = req.params;
  const { debtType, description, amount } = req.body;

  try {
    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }

    if (debtType === "inventory") {
      const items = await Item.find(); // Fetch all items
      return res.status(200).json({ items }); // Return items to the frontend for selection
    } else if (debtType === "manual") {
      const newDebt = {
        description,
        amount,
        date: new Date().toLocaleDateString(),
      };
      debtor.debts.push(newDebt);
      debtor.totalBalance += amount;
      await debtor.save();
      return res.status(200).json(debtor); // Return updated debtor
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding debt" });
  }
};

// Pay Debt (Full or Partial)
const payDebt = async (req, res) => {
  const { id } = req.params;
  const { amountPaid } = req.body;

  try {
    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }

    if (amountPaid >= debtor.totalBalance) {
      // Full payment logic
      debtor.debts = []; // Clear all debts
      debtor.totalBalance = 0; // Reset total balance
    } else {
      // Partial payment logic
      const amount = (debtor.totalBalance -= amountPaid);
      debtor.debts = [
        {
          description: "Balance",
          amount: amount,
          date: new Date().toLocaleDateString(),
        },
      ];
    }
    await debtor.save();

    res.status(200).json(debtor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing payment" });
  }
};

module.exports = {
  getDebtorById,
  addDebt,
  payDebt,
};
