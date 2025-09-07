import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { productList, isLoading, error } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Product title is required";
    } else if (formData.title.length < 3 || formData.title.length > 200) {
      errors.title = "Product title must be between 3 and 200 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Product description is required";
    } else if (formData.description.length < 10 || formData.description.length > 2000) {
      errors.description = "Product description must be between 10 and 2000 characters";
    }

    if (!formData.category.trim()) {
      errors.category = "Product category is required";
    } else if (formData.category.length < 2 || formData.category.length > 100) {
      errors.category = "Product category must be between 2 and 100 characters";
    }

    if (!formData.brand.trim()) {
      errors.brand = "Product brand is required";
    } else if (formData.brand.length < 2 || formData.brand.length > 100) {
      errors.brand = "Product brand must be between 2 and 100 characters";
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = "Product price must be a positive number";
    } else if (formData.price > 999999.99) {
      errors.price = "Product price cannot exceed 999999.99";
    }

    if (formData.salePrice && formData.salePrice > 0 && formData.salePrice >= formData.price) {
      errors.salePrice = "Sale price must be less than regular price";
    }

    if (!formData.totalStock || formData.totalStock < 0) {
      errors.totalStock = "Product stock must be a non-negative number";
    } else if (formData.totalStock > 999999) {
      errors.totalStock = "Product stock cannot exceed 999999";
    }

    if (!uploadedImageUrl && !currentEditedId) {
      errors.image = "Product image is required";
    }

    return errors;
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    currentEditedId !== null
              ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: {
              ...formData,
              salePrice: formData.salePrice || undefined,
            },
          })
        ).then((data) => {

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setImageFile(null);
            setUploadedImageUrl("");
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            toast.success("Product details updated successfully");
          } else {
            toast.error("Failed to update product");
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
            salePrice: formData.salePrice || undefined,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setUploadedImageUrl("");
            setFormData(initialFormData);
            toast.success("Product added successfully");
          } else {
            toast.error("Failed to add product");
          }
        });
  }

  const handleDelete = (getCurrentProductId) => {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success("Product deleted successfully");
      } else {
        toast.error("Failed to delete product");
      }
    });
  }

  const isFormValid = () => {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview" && currentKey !== "salePrice")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Error loading products: {error}</p>
        <Button onClick={() => dispatch(fetchAllProducts())}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <AdminProductTile
                  key={productItem._id}
                  setFormData={setFormData}
                  setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  setImageFile={setImageFile}
                  setUploadedImageUrl={setUploadedImageUrl}
                  product={productItem}
                  handleDelete={handleDelete}
                />    
              ))
            : (
                <div className="col-span-full flex justify-center items-center h-32">
                  <p className="text-gray-500">No products found. Add your first product!</p>
                </div>
              )} 
        </div>
      )}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl("");
        }}
      >
        <SheetContent side="right" className="overflow-auto p-4">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6 ">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
