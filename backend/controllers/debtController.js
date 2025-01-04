const Debtor = require("../models/Debtor"); // Assuming a Debtor model exists

// Add Debt Controller
const addDebt = async (req, res) => {
  const debtorId = req.params.id;
  const { description, amount, debtType } = req.body; // Get debt details from request body

  try {
    // Fetch debtor by ID
    const debtor = await Debtor.findById(debtorId);
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }

    // Create a new debt object
    const newDebt = {
      description,
      amount,
      date: new Date().toLocaleDateString(),
    };

    // Add the new debt to debtor's debts array
    debtor.debts.push(newDebt);

    // Update the debtor's total balance
    debtor.totalBalance += amount;

    // Save the debtor with updated data
    await debtor.save();

    // Return updated debtor details
    res.status(200).json(debtor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding debt" });
  }
};

module.exports = {
  addDebt,
};
