import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

const DeliverySchedule = ({ purchaseDate, setPurchaseDate, preferredDeliveryTime, setPreferredDeliveryTime }) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  // Calculate minimum delivery date (2 days from today)
  const minDeliveryDate = new Date(today);
  minDeliveryDate.setDate(today.getDate() + 2);
  const minDeliveryDateString = minDeliveryDate.toISOString().split('T')[0];

  // Function to check if a date is Sunday
  const isSunday = (dateString) => {
    const date = new Date(dateString);
    return date.getDay() === 0;
  };

  // Function to validate date (not in past, not Sunday, minimum 2 days)
  const validateDate = (dateString) => {
    if (!dateString) return true;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate minimum delivery date (2 days from today)
    const minDeliveryDate = new Date(today);
    minDeliveryDate.setDate(today.getDate() + 2);
    
    return selectedDate >= minDeliveryDate && !isSunday(dateString);
  };

  // Handle date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    
    if (!selectedDate) {
      setPurchaseDate('');
      return;
    }
    
    // Check if selected date is Sunday
    if (isSunday(selectedDate)) {
      toast.error("Sundays are not available for delivery. Please select another date.");
      setPurchaseDate('');
      return;
    }
    
    // Check if selected date is within 2 days
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDeliveryDate = new Date(today);
    minDeliveryDate.setDate(today.getDate() + 2);
    
    if (selectedDateObj < minDeliveryDate) {
      const minDateString = minDeliveryDate.toISOString().split('T')[0];
      toast.error(`Minimum delivery time is 2 days. Please select a date on or after ${minDateString}.`);
      setPurchaseDate('');
      return;
    }
    
    if (validateDate(selectedDate)) {
      setPurchaseDate(selectedDate);
    } else {
      // Reset to empty if invalid
      setPurchaseDate('');
    }
  };

  // Delivery time options
  const deliveryTimeOptions = [
    { value: "10:00 AM", label: "10:00 AM" },
    { value: "11:00 AM", label: "11:00 AM" },
    { value: "12:00 PM", label: "12:00 PM" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purchase Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="purchase-date">Preferred Purchase Date</Label>
          <div className="relative">
            <Input
              id="purchase-date"
              type="date"
              value={purchaseDate}
              onChange={handleDateChange}
              min={minDeliveryDateString}
              className="w-full"
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-sm text-muted-foreground">
            Select a date at least 2 days from today (Sundays are not available)
          </p>
          {purchaseDate && !validateDate(purchaseDate) && (
            <p className="text-sm text-red-500">
              Please select a valid date (minimum 2 days from today and not a Sunday)
            </p>
          )}
        </div>

        {/* Preferred Delivery Time Selection */}
        <div className="space-y-2">
          <Label htmlFor="delivery-time">Preferred Delivery Time</Label>
          <Select value={preferredDeliveryTime} onValueChange={setPreferredDeliveryTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select delivery time" />
            </SelectTrigger>
            <SelectContent>
              {deliveryTimeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Choose your preferred delivery time slot
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliverySchedule;
