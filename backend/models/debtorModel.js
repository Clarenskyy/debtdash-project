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
      type: [
        {
          description: {
            type: String,
            required: [true, "Debt description is required"],
            trim: true,
          },
          amount: {
            type: Number,
            required: [true, "Debt amount is required"],
            min: [0, "Debt amount cannot be negative"],
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Debtor", debtorSchema);
