import React from "react";
import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/auth-slice";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser());
      // If it's not an Auth0 user, navigate after logout
      if (!result.payload?.message?.includes("Redirecting to Auth0 logout")) {
        navigate("/shop/home");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback navigation
      navigate("/shop/home");
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setOpen(true)}  
          className="lg:hidden sm:block hover:bg-gray-50 border-gray-300"
          variant="outline"
          size="icon"
        >
          <AlignJustify className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-red-50 hover:text-red-600"
          variant="outline"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
