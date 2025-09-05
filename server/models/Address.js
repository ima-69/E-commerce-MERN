const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
    countryCode: String,
    addressType: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home"
    },
    deliveryInstructions: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);