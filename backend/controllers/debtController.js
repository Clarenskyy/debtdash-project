const Debtor = require("../models/debtorModel");
const Item = require("../models/itemlistModels");

// Fetch debtor details by ID for a specific user
const getDebtorById = async (req, res) => {
  const { userId, id } = req.params;

  try {
    const debtor = await Debtor.findOne({ _id: id, userId });
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }
    res.status(200).json(debtor);
  } catch (error) {
    console.error("Error fetching debtor details:", error);
    res.status(500).json({ message: "Error fetching debtor details" });
  }
};

// Add inventory debt for a specific user
const addInventoryDebt = async (req, res) => {
  const { userId, id } = req.params;
  const { itemId, quantity } = req.body;

  try {
    const debtor = await Debtor.findOne({ _id: id, userId });
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const total = item.price * quantity;

    const newDebt = {
      debtType: "inventory",
      itemId,
      quantity,
      description: `${item.name} * ${quantity}`,
      amount: total,
      date: new Date(),
    };

    debtor.debts.push(newDebt);
    debtor.totalBalance += total;

    await debtor.save();
    return res.status(200).json(debtor);
  } catch (error) {
    console.error("Error adding inventory debt:", error);
    res.status(500).json({ message: `Error adding debt: ${error.message}` });
  }
};

// Add manual debt for a specific user
const addManualDebt = async (req, res) => {
  const { userId, id } = req.params;
  const { description, amount } = req.body;

  try {
    const debtor = await Debtor.findOne({ _id: id, userId });
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const newDebt = {
      debtType: "manual",
      description,
      amount,
      date: new Date(),
    };

    debtor.debts.push(newDebt);
    debtor.totalBalance += amount;

    await debtor.save();
    return res.status(200).json(debtor);
  } catch (error) {
    console.error("Error adding manual debt:", error);
    res.status(500).json({ message: `Error adding debt: ${error.message}` });
  }
};

// Pay Debt (Full or Partial) for a specific user
const payDebt = async (req, res) => {
  const { userId, id } = req.params;
  const { amountPaid } = req.body;

  try {
    const debtor = await Debtor.findOne({ _id: id, userId });
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
          description: "Remaining Balance",
          amount: amount,
          date: new Date(),
        },
      ];
    }
    await debtor.save();

    res.status(200).json(debtor);
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
};

module.exports = {
  getDebtorById,
  addInventoryDebt,
  addManualDebt,
  payDebt,
};
