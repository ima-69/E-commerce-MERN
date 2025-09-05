import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import ConfirmationDialog from "../ui/confirmation-dialog";
import { useState } from "react";

const AdminProductTile = ({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <Card className="w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[160px] object-cover"
        />
        {product?.totalStock < 10 && product?.totalStock > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-md">
              Only {product?.totalStock} items left
            </Badge>
          </div>
        )}
        {product?.totalStock === 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-md">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <h2 className="text-base font-bold text-black mb-1 line-clamp-2">{product?.title}</h2>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">
            {product?.category}
          </span>
          <span className="text-xs text-gray-500">
            {product?.brand}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through text-gray-400" : "text-lg font-bold text-black"
            }`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-lg font-bold text-black">
              ${product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-1 p-3 pt-0">
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 rounded-md"
        >
          Edit Product
        </Button>
        <Button 
          onClick={() => setDeleteDialogOpen(true)}
          variant="outline"
          className="w-full bg-white hover:bg-gray-50 text-black border-gray-300 font-medium py-2 rounded-md"
        >
          Delete Product
        </Button>
      </CardFooter>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          handleDelete(product?._id);
          setDeleteDialogOpen(false);
        }}
        title="Delete Product"
        description={`Are you sure you want to delete "${product?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </Card>
  );
};

export default AdminProductTile;
