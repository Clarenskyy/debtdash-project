const Inventory = require("../models/inventoryModel");

// GET all items
const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new item
const createItem = async (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || price == null || quantity == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const item = await Inventory.create({ name, price, quantity });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE an item by ID
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { name, price, quantity },
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE an item by ID
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SEARCH and SORT items
const searchAndSortItems = async (req, res) => {
  const { search, sort } = req.query;

  try {
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    let items = await Inventory.find(query);

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
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  searchAndSortItems,
};
