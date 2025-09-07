import { FileCheckIcon, FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { createApiCall } from "@/config/api";

// Create CSRF-enabled API instance
const api = createApiCall(axios);

const ProductImageUpload =  ({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) => {
  const inputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);


  const handleImageFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setImageFile(selectedFile);
      setUploadError(null); // Clear any previous errors
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };        

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    
    if (droppedFile) {
      setImageFile(droppedFile);
      setUploadError(null); // Clear any previous errors
    }
  };        

  const handleRemoveImage = () => {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadImageToCloudinary = async () => {
    setImageLoadingState(true);
    setUploadError(null); // Clear any previous errors
    
    let timeoutId = null;
    
    try {
      // Validate file before upload
      if (!imageFile) {
        console.error("No file selected for upload");
        throw new Error("No file selected");
      }

      // Check file size (max 10MB)
      if (imageFile.size > 10 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 10MB.");
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error("Invalid file type. Please upload JPEG, PNG, or WebP images only.");
      }

      const data = new FormData();
      data.append("my_file", imageFile);
      
      // Add timeout to the request
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      const response = await api.post(
        `${backendUrl}/api/admin/products/upload-image`,
        data,
        {
          signal: controller.signal,
          timeout: 60000,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      clearTimeout(timeoutId);

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
      } else {
        console.error("Upload failed:", response?.data?.message);
        setUploadError(response?.data?.message || "Upload failed");
        setImageLoadingState(false);
      }
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      console.error("Upload error:", error);
      setImageLoadingState(false);
      
      if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
        console.error("Upload timed out");
        setUploadError("Upload timed out. Please try again.");
      } else if (error.response?.status === 401) {
        console.error("Authentication failed");
        setUploadError("Authentication failed. Please log in again.");
      } else if (error.response?.status === 403) {
        console.error("Access denied");
        setUploadError("Access denied. Admin role required.");
      } else if (error.response) {
        console.error("Server error:", error.response.data);
        setUploadError(error.response.data?.message || "Server error occurred");
      } else if (error.message) {
        setUploadError(error.message);
      } else {
        console.error("Network error:", error.message);
        setUploadError("Network error. Please check your connection.");
      }
    }
  }

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
    
    // Cleanup function to reset loading state if component unmounts during upload
    return () => {
      setImageLoadingState(false);
    };
  }, [imageFile]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <div className="flex flex-col items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <span className="text-sm text-muted-foreground">Uploading image...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32">
            <div className="flex items-center mb-2">
              <FileCheckIcon className="w-8 text-green-600 mr-2 h-8" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            {uploadedImageUrl && (
              <div className="mb-2">
                <p className="text-xs text-green-600 font-medium">✓ Upload successful!</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        )}
      </div>
      
      {/* Image Preview */}
      {uploadedImageUrl && (
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2 block">Image Preview:</Label>
          <div className="border rounded-lg p-2 bg-gray-50">
            <img 
              src={uploadedImageUrl} 
              alt="Uploaded product" 
              className="w-full h-32 object-cover rounded"
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600 mb-2">{uploadError}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setUploadError(null);
              if (imageFile) {
                uploadImageToCloudinary();
              }
            }}
            className="text-red-600 border-red-300 hover:bg-red-100"
          >
            Retry Upload
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;