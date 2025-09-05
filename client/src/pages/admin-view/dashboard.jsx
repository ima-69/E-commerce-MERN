import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CompactImageUpload from "@/components/admin-view/compact-image-upload";
import DashboardOverview from "@/components/admin-view/dashboard-overview";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleUploadFeatureImage = () => {
    if (!uploadedImageUrl) {
      toast.error("Please upload an image first");
      return;
    }
    
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        toast.success("Feature image added successfully!");
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      } else {
        toast.error("Failed to add feature image");
      }
    }).catch((error) => {
      console.error("Error adding feature image:", error);
      toast.error("Failed to add feature image");
    });
  }

  const handleRemoveFeatureImage = (imageId) => {
    setImageToDelete(imageId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    
    try {
      await dispatch(deleteFeatureImage(imageToDelete));
      toast.success("Feature image deleted successfully!");
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    } catch (error) {
      console.error("Error deleting feature image:", error);
      toast.error("Failed to delete feature image. Please try again.");
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  const handleNavigateToUserHome = () => {
    navigate("/shop/home");
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      dispatch(getFeatureImages());
    } else {
      toast.error("Admin access required");
      navigate('/auth/login');
    }
  }, [dispatch, isAuthenticated, user, navigate]);

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <DashboardOverview />

      {/* Feature Image Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Image Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CompactImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
            />
            
            <Button 
              onClick={handleUploadFeatureImage} 
              className="w-full"
              disabled={!uploadedImageUrl || imageLoadingState}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature Image
            </Button>
          </CardContent>
        </Card>

        {/* Current Feature Images */}
        <Card>
          <CardHeader>
            <CardTitle>Current Feature Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {featureImageList && featureImageList.length > 0 ? (
                featureImageList.map((featureImgItem, index) => (
                  <div key={featureImgItem._id || index} className="relative group">
                    {featureImgItem.image && featureImgItem.image.trim() !== "" ? (
                      <div className="relative">
                        <img
                          src={featureImgItem.image}
                          alt={`Feature image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => handleRemoveFeatureImage(featureImgItem._id)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Delete image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No feature images uploaded yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Feature Image"
        description="Are you sure you want to delete this feature image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

export default AdminDashboard;