import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "sonner";
import { MapPin, Plus, Edit } from "lucide-react";

const initialAddressFormData = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
  countryCode: "+1",
  addressType: "",
  deliveryInstructions: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const handleManageAddress = (event) => {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.error("You can add up to 3 addresses only");

      return;
    }

    
    // Check if user is authenticated
    if (!user?._id && !user?.id) {
      toast.error("Please login to add an address");
      return;
    }
    
    // Check each required field
    const requiredFields = addressFormControls.filter(control => control.required);


    const userId = user?._id || user?.id;
    
    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: userId,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(userId));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast.success("Address updated successfully");
          }
        })
      : dispatch(
          addNewAddress(formData)
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(userId));
            setFormData(initialAddressFormData);
            toast.success("Address added successfully");
          }
        });
  }

  const handleDeleteAddress = (getCurrentAddress) => {
    const userId = user?._id || user?.id;
    dispatch(
      deleteAddress({ userId: userId, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(userId));
        toast.success("Address deleted successfully");
      }
    });
  }

  const handleEditAddress = (getCuurentAddress) => {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      addressLine1: getCuurentAddress?.addressLine1 || "",
      addressLine2: getCuurentAddress?.addressLine2 || "",
      city: getCuurentAddress?.city || "",
      state: getCuurentAddress?.state || "",
      postalCode: getCuurentAddress?.postalCode || "",
      country: getCuurentAddress?.country || "",
      phone: getCuurentAddress?.phone || "",
      countryCode: getCuurentAddress?.countryCode || "+1",
      addressType: getCuurentAddress?.addressType || "",
      deliveryInstructions: getCuurentAddress?.deliveryInstructions || "",
    });
  }

  const isFormValid = () => {
    // Only validate required fields
    const requiredFields = addressFormControls.filter(control => control.required);
    return requiredFields.every(control => {
      const value = formData[control.name];
      return value && value.toString().trim() !== "";
    });
  }

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      dispatch(fetchAllAddresses(userId));
    }
  }, [dispatch, user]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Saved Addresses */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gray-200 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            Saved Addresses
          </CardTitle>
          <CardDescription className="text-gray-600">
            Manage your delivery addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {addressList && addressList.length > 0 ? (
            <div className="space-y-4">
              {addressList.map((singleAddressItem) => (
                <AddressCard
                  key={singleAddressItem._id}
                  selectedId={selectedId}
                  handleDeleteAddress={handleDeleteAddress}
                  addressInfo={singleAddressItem}
                  handleEditAddress={handleEditAddress}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600">Add your first address using the form on the right</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Column - Add/Edit Address Form */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gray-200 rounded-lg">
              {currentEditedId !== null ? (
                <Edit className="h-5 w-5 text-gray-600" />
              ) : (
                <Plus className="h-5 w-5 text-gray-600" />
              )}
            </div>
            {currentEditedId !== null ? "Edit Address" : "Add New Address"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {currentEditedId !== null 
              ? "Update your address information" 
              : "Add a new delivery address to your account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId !== null ? "Update Address" : "Add Address"}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default Address;