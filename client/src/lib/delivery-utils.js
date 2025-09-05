// Utility functions for delivery date calculations

/**
 * Calculate the receiving date based on purchase date and delivery time
 * If purchase date is Sunday, move to next Monday
 * @param {string} purchaseDate - Purchase date in YYYY-MM-DD format
 * @param {string} preferredDeliveryTime - Preferred delivery time
 * @returns {Date} - Calculated receiving date
 */
export const calculateReceivingDate = (purchaseDate, preferredDeliveryTime) => {
  if (!purchaseDate) return null;
  
  let deliveryDate = new Date(purchaseDate);
  
  // If the purchase date is Sunday (day 0), move to next Monday
  if (deliveryDate.getDay() === 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1); // Move to Monday
  }
  
  return deliveryDate;
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDeliveryDate = (date) => {
  if (!date) return "Not specified";
  
  const deliveryDate = new Date(date);
  return deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get day name from date
 * @param {Date|string} date - Date to get day name from
 * @returns {string} - Day name
 */
export const getDayName = (date) => {
  if (!date) return "";
  
  const deliveryDate = new Date(date);
  return deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
};
