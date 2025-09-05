import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { Package, Eye, Calendar, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";

const ShoppingOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading, error } = useSelector((state) => state.shopOrder);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    if (isAuthenticated && (user?.id || user?._id)) {
      console.log("Fetching orders for user:", user?.id || user?._id);
      dispatch(getAllOrdersByUserId(user?.id || user?._id));
    } else {
      console.log("Not authenticated or no user ID available for fetching orders");
    }
  }, [dispatch, isAuthenticated, user?.id, user?._id]);

  // Temporary: Also fetch all orders to see if there are any orders in the database
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Fetching ALL orders to check database...");
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/get`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log("ALL orders in database:", data);
        if (data.success && data.data) {
          console.log("Total orders in database:", data.data.length);
          console.log("Sample order:", data.data[0]);
        }
      })
      .catch(err => console.error("Error fetching all orders:", err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log("Orders component state:", { 
    orderList, 
    orderDetails, 
    user: user?.id || user?._id,
    userObject: user,
    isLoading,
    isAuthenticated,
    orderListLength: orderList?.length,
    error
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Package className="h-5 w-5 text-gray-600" />
            </div>
            Order History
          </CardTitle>
          <CardDescription className="text-gray-600">
            View and track all your orders
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Login</h3>
              <p className="text-gray-600">You need to be logged in to view your orders.</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => dispatch(getAllOrdersByUserId(user?.id || user?._id))}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : orderList && orderList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Order Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Total Amount</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((orderItem) => (
                  <TableRow key={orderItem._id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      #{orderItem._id.slice(-8)}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(orderItem.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`flex items-center gap-1 w-fit ${getStatusColor(orderItem.orderStatus)}`}
                      >
                        {getStatusIcon(orderItem.orderStatus)}
                        {orderItem.orderStatus.charAt(0).toUpperCase() + orderItem.orderStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2 font-semibold">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      ${orderItem.totalAmount}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFetchOrderDetails(orderItem._id)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ShoppingOrders;