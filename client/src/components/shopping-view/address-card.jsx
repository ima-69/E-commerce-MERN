import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, Phone, Home, Building, Map } from "lucide-react";
import { countryCodeOptions } from "@/config";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />;
      case "work":
        return <Building className="h-4 w-4" />;
      default:
        return <Map className="h-4 w-4" />;
    }
  };

  const getAddressTypeColor = (type) => {
    switch (type) {
      case "home":
        return "bg-green-100 text-green-800 border-green-200";
      case "work":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selectedId?._id === addressInfo?._id
          ? "border-blue-500 border-2 shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {getAddressTypeIcon(addressInfo?.addressType)}
            Address
          </CardTitle>
          <Badge className={`${getAddressTypeColor(addressInfo?.addressType)}`}>
            {addressInfo?.addressType?.charAt(0).toUpperCase() + addressInfo?.addressType?.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium">{addressInfo?.addressLine1}</div>
              {addressInfo?.addressLine2 && (
                <div className="text-gray-600">{addressInfo?.addressLine2}</div>
              )}
              <div className="text-gray-600">
                {addressInfo?.city}, {addressInfo?.state} {addressInfo?.postalCode}
              </div>
              <div className="text-gray-600">{addressInfo?.country}</div>
            </div>
          </div>
          
          {addressInfo?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <div className="flex items-center gap-1">
                {addressInfo?.country && (
                  <span className="text-sm">
                    {countryCodeOptions.find(opt => opt.name === addressInfo.country)?.flag}
                  </span>
                )}
                <span className="text-sm">
                  {addressInfo?.countryCode} {addressInfo?.phone}
                </span>
              </div>
            </div>
          )}
          
          {addressInfo?.deliveryInstructions && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Delivery Instructions:</strong> {addressInfo?.deliveryInstructions}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex justify-between">
        <Button 
          onClick={() => handleEditAddress(addressInfo)}
          variant="outline"
          size="sm"
        >
          Edit
        </Button>
        <Button 
          onClick={() => handleDeleteAddress(addressInfo)}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;