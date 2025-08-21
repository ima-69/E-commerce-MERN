import { FileCheckIcon, FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

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

  console.log(isEditMode, "isEditMode");

  const handleImageFileChange = (event) => {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

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
    
    try {
      const data = new FormData();
      data.append("my_file", imageFile);
      
      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data,
        {
          signal: controller.signal,
          timeout: 30000
        }
      );
      
      clearTimeout(timeoutId);
      console.log(response, "response");

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
      } else {
        console.error("Upload failed:", response?.data?.message);
        setUploadError(response?.data?.message || "Upload failed");
        setImageLoadingState(false);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Upload error:", error);
      setImageLoadingState(false);
      
      if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
        console.error("Upload timed out");
        setUploadError("Upload timed out. Please try again.");
      } else if (error.response) {
        console.error("Server error:", error.response.data);
        setUploadError(error.response.data?.message || "Server error occurred");
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileCheckIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Error Display */}
      {uploadError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
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