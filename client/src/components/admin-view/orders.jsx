import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails, isLoading, error } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);


  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-red-500 mb-4">Error loading orders: {error}</p>
            <Button onClick={() => dispatch(getAllOrdersForAdmin())}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-lg">Loading orders...</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0 && orderList.filter((orderItem) => orderItem?.orderStatus !== "delivered").length > 0
                ? orderList
                    .filter((orderItem) => orderItem?.orderStatus !== "delivered")
                    .map((orderItem) => (
                    <TableRow key={orderItem._id}>
                      <TableCell>{orderItem?._id}</TableCell>
                      <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-3 ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-black"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>${orderItem?.totalAmount}</TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            View Details
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-gray-500">
                          {orderList && orderList.length > 0 
                            ? "All orders have been delivered." 
                            : "No orders found."
                          }
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;