const Inventory = require("../models/itemlistModels.js");

// GET all items for a specific user
const getItemsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const items = await Inventory.find({ userId }); // Ensure we only fetch items for the specific user
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new item for a specific user
const createItem = async (req, res) => {
  const { name, price } = req.body;
  const { userId } = req.params; // Get userId from route params

  if (!userId || !name || price == null) {
    return res
      .status(400)
      .json({ message: "UserId, name, and price are required" });
  }

  try {
    const item = await Inventory.create({ userId, name, price });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE an item by ID for a specific user
const updateItem = async (req, res) => {
  const { userId, id } = req.params;
  const { name, price } = req.body;

  try {
    const updatedItem = await Inventory.findOneAndUpdate(
      { _id: id, userId }, // Ensure we only update items for the specific user
      { name, price },
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res
        .status(404)
        .json({ message: "Item not found or unauthorized" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE an item by ID for a specific user
const deleteItem = async (req, res) => {
  const { userId, id } = req.params;

  try {
    const deletedItem = await Inventory.findOneAndDelete({ _id: id, userId }); // Ensure we only delete items for the specific user
    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Item not found or unauthorized" });
    }
    res.status(200).json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SEARCH and SORT items for a specific user
const searchAndSortItems = async (req, res) => {
  const { userId } = req.params;
  const { search, sort } = req.query;

  try {
    let query = { userId }; // Start by filtering by userId

    // Handle search filter
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search by item name
    }

    let items = await Inventory.find(query);

    // Handle sorting
    if (sort === "name") {
      items = items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "price") {
      items = items.sort((a, b) => a.price - b.price);
    }

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getItemsByUser,
  createItem,
  updateItem,
  deleteItem,
  searchAndSortItems,
};
