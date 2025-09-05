import { UploadCloudIcon, XIcon, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const CompactImageUpload = ({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
}) => {
  const inputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);

  const handleImageFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      setUploadError(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadImageToCloudinary = async () => {
    setImageLoadingState(true);
    setUploadError(null);
    
    try {
      if (!imageFile) {
        throw new Error("No file selected");
      }
      
      if (imageFile.size > 10 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 10MB.");
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error("Invalid file type. Please upload JPEG, PNG, or WebP images only.");
      }

      const data = new FormData();
      data.append("my_file", imageFile);
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      const response = await axios.post(
        `${backendUrl}/api/admin/products/upload-image`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
        toast.success("Image uploaded successfully!");
      } else {
        setUploadError(response?.data?.message || "Upload failed");
        setImageLoadingState(false);
        toast.error(response?.data?.message || "Upload failed");
      }
    } catch (error) {
      setImageLoadingState(false);
      let errorMessage = "Upload failed";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Admin role required.";
      } else if (error.response) {
        errorMessage = error.response.data?.message || "Server error occurred";
      } else {
        errorMessage = error.message;
      }
      
      setUploadError(errorMessage);
      toast.error(errorMessage);
    }
  }

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
    
    return () => {
      setImageLoadingState(false);
    };
  }, [imageFile]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Feature Image Upload</h3>
        {uploadedImageUrl && (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Uploaded
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="hidden"
          id="compact-upload"
        />
        
        <label
          htmlFor="compact-upload"
          className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <UploadCloudIcon className="h-4 w-4" />
          <span className="text-sm">
            {imageLoadingState ? "Uploading..." : "Choose Image"}
          </span>
        </label>
        
        {imageFile && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            className="text-red-600 hover:text-red-700"
          >
            <XIcon className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      {uploadedImageUrl && (
        <div className="mt-2">
          <img 
            src={uploadedImageUrl} 
            alt="Uploaded feature" 
            className="w-full h-24 object-cover rounded-lg border"
          />
        </div>
      )}

      {uploadError && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default CompactImageUpload;
