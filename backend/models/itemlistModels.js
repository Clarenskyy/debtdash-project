const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { collection: "inventories" }
); // Explicitly specify the collection name

module.exports = mongoose.model("Inventory", inventorySchema);
