const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    // Get user ID from authenticated token
    const userId = req.user.id;
    
    const { 
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

    // Sanitize inputs
    const sanitizedData = {
      addressLine1: addressLine1?.toString().trim(),
      addressLine2: addressLine2?.toString().trim(),
      city: city?.toString().trim(),
      state: state?.toString().trim(),
      postalCode: postalCode?.toString().trim(),
      country: country?.toString().trim(),
      phone: phone?.toString().trim(),
      countryCode: countryCode?.toString().trim() || "+1",
      addressType: addressType?.toString().trim(),
      deliveryInstructions: deliveryInstructions?.toString().trim() || ""
    };

    if (!sanitizedData.addressLine1 || !sanitizedData.city || !sanitizedData.state || 
        !sanitizedData.postalCode || !sanitizedData.country || !sanitizedData.phone || 
        !sanitizedData.addressType) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided! Required fields: addressLine1, city, state, postalCode, country, phone, addressType",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      addressLine1: sanitizedData.addressLine1,
      addressLine2: sanitizedData.addressLine2,
      city: sanitizedData.city,
      state: sanitizedData.state,
      postalCode: sanitizedData.postalCode,
      country: sanitizedData.country,
      phone: sanitizedData.phone,
      countryCode: sanitizedData.countryCode,
      addressType: sanitizedData.addressType,
      deliveryInstructions: sanitizedData.deliveryInstructions,
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.user.id;
    
    // Sanitize and validate the userId parameter
    const sanitizedUserId = userId?.toString().trim();
    if (!sanitizedUserId) {
      return res.status(400).json({
        success: false,
        message: "User id is required!",
      });
    }

    // Ensure user can only access their own addresses
    if (sanitizedUserId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own addresses.",
      });
    }

    const addressList = await Address.find({ userId: sanitizedUserId });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const authenticatedUserId = req.user.id;
    const formData = req.body;

    // Sanitize and validate parameters
    const sanitizedUserId = userId?.toString().trim();
    const sanitizedAddressId = addressId?.toString().trim();

    if (!sanitizedUserId || !sanitizedAddressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    // Ensure user can only edit their own addresses
    if (sanitizedUserId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only edit your own addresses.",
      });
    }

    // Sanitize form data
    const sanitizedFormData = {
      addressLine1: formData.addressLine1?.toString().trim(),
      addressLine2: formData.addressLine2?.toString().trim(),
      city: formData.city?.toString().trim(),
      state: formData.state?.toString().trim(),
      postalCode: formData.postalCode?.toString().trim(),
      country: formData.country?.toString().trim(),
      phone: formData.phone?.toString().trim(),
      countryCode: formData.countryCode?.toString().trim() || "+1",
      addressType: formData.addressType?.toString().trim(),
      deliveryInstructions: formData.deliveryInstructions?.toString().trim() || ""
    };

    // Validate required fields for update
    if (!sanitizedFormData.addressLine1 || !sanitizedFormData.city || !sanitizedFormData.state || 
        !sanitizedFormData.postalCode || !sanitizedFormData.country || !sanitizedFormData.phone || 
        !sanitizedFormData.addressType) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided! Required fields: addressLine1, city, state, postalCode, country, phone, addressType",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: sanitizedAddressId,
        userId: sanitizedUserId,
      },
      sanitizedFormData,
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
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const authenticatedUserId = req.user.id;

    // Sanitize and validate parameters
    const sanitizedUserId = userId?.toString().trim();
    const sanitizedAddressId = addressId?.toString().trim();

    if (!sanitizedUserId || !sanitizedAddressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    // Ensure user can only delete their own addresses
    if (sanitizedUserId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own addresses.",
      });
    }

    const address = await Address.findOneAndDelete({ 
      _id: sanitizedAddressId, 
      userId: sanitizedUserId 
    });

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
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };