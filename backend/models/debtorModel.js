const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const debtorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    totalBalance: {
      type: Number,
      default: 0,
    },
    debts: {
      type: [Object], // Expecting an array of debt objects
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Debtor", debtorSchema);
