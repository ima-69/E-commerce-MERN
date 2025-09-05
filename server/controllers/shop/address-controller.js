const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    
    const { 
      userId, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      postalCode, 
      country, 
      phone, 
      countryCode, 
      addressType, 
      deliveryInstructions 
    } = req.body;

    console.log("Extracted fields:", {
      userId, addressLine1, city, state, postalCode, country, phone, addressType
    });

    if (!userId || !addressLine1 || !city || !state || !postalCode || !country || !phone || !addressType) {
      console.log("Validation failed - missing required fields");
      return res.status(400).json({
        success: false,
        message: "Invalid data provided! Required fields: addressLine1, city, state, postalCode, country, phone, addressType",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      addressLine1,
      addressLine2: addressLine2 || "",
      city,
      state,
      postalCode,
      country,
      phone,
      countryCode: countryCode || "+1",
      addressType,
      deliveryInstructions: deliveryInstructions || "",
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required!",
      });
    }

    const addressList = await Address.find({ userId });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    // Validate required fields for update
    const { 
      addressLine1, 
      city, 
      state, 
      postalCode, 
      country, 
      phone, 
      addressType 
    } = formData;

    if (!addressLine1 || !city || !state || !postalCode || !country || !phone || !addressType) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided! Required fields: addressLine1, city, state, postalCode, country, phone, addressType",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };