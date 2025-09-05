import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Settings, Search, LogIn } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logoutUser, getUserProfile } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

const SearchInput = ({ isMobile = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  if (isMobile) {
    return (
      <form onSubmit={handleSearch} className="relative w-full">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-64 pr-10"
      />
      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

const MenuItems = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNavigate = (getCurrentMenuItem) => {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  if (isMobile) {
    return (
      <nav className="space-y-1">
        {shoppingViewHeaderMenuItems
          .filter((menuItem) => menuItem.id !== "search") // Remove search from menu items
          .map((menuItem) => (
            <button
              key={menuItem.id}
              onClick={() => handleNavigate(menuItem)}
              className="w-full text-left px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {menuItem.label}
            </button>
          ))}
      </nav>
    );
  }

  return (
    <nav className="flex lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems
        .filter((menuItem) => menuItem.id !== "search") // Remove search from menu items
        .map((menuItem) => (
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-sm font-medium cursor-pointer"
            key={menuItem.id}
          >
            {menuItem.label}
          </Label>
        ))}
    </nav>
  );
}

const MobileLoginButton = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) return null;

  return (
    <Button
      onClick={() => navigate("/auth/login")}
      className="inline-flex gap-2 items-center rounded-md px-3 py-2 text-sm font-medium shadow"
      size="sm"
    >
      <LogIn className="h-4 w-4" />
      Login
    </Button>
  );
}

const HeaderRightContent = ({ isMobile = false }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { guestCartItems } = useSelector((state) => state.guestCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    navigate("/shop/home");
    // Add a small delay to ensure navigation happens before state update
    setTimeout(() => {
      dispatch(logoutUser());
    }, 100);
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  // Show login button for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className={`flex ${isMobile ? 'items-center gap-2' : 'lg:items-center lg:flex-row flex-col gap-4'}`}>
        {!isMobile && <SearchInput />}
        
        {/* Guest Cart Button */}
        <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="outline"
            size="icon"
            className="relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
              {guestCartItems?.length || 0}
            </span> 
            <span className="sr-only">Guest cart</span>
          </Button>
          <UserCartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={guestCartItems || []}
            isGuest={true}
          />
        </Sheet>

        {!isMobile && (
          <Button
            onClick={() => navigate("/auth/login")}
            className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
          >
            <LogIn />
            Login
          </Button>
        )}
      </div>
    );
  }

  // Show authenticated user content
  return (
    <div className={`flex ${isMobile ? 'items-center gap-2' : 'lg:items-center lg:flex-row flex-col gap-4'}`}>
      {/* Admin Mode Button - Only show for admin users on desktop */}
      {user?.role === "admin" && !isMobile && (
        <Button
          onClick={() => navigate("/admin/dashboard")}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Admin Mode
        </Button>
      )}

      {!isMobile && <SearchInput />}

      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span> 
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
          isGuest={false}
        />
      </Sheet>  

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-gray-200 cursor-pointer">
            <AvatarImage
              src={user?.profilePicture || undefined}
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-200 text-gray-700 font-bold text-sm">
              {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" className="w-56">
          <DropdownMenuLabel>
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user?.userName || 'User'
            }
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => navigate("/shop/account")}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> 
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { guestCartItems } = useSelector((state) => state.guestCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id || user?._id) {
      dispatch(fetchCartItems(user?.id || user?._id));
      // Load complete user profile data including profile picture
      dispatch(getUserProfile());
    }
  }, [dispatch, user?.id, user?._id]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {/* Mobile Header - 2 Rows */}
      <div className="lg:hidden bg-white border-b">
        {/* Row 1: Logo, Cart, Profile, Hamburger */}
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <HousePlug className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-gray-900">Shopzy</span>
          </Link>
          
          {/* Right side: Cart, Profile/Login, Hamburger */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
              <Button
                onClick={() => setOpenCartSheet(true)}
                variant="outline"
                size="icon"
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-[-5px] right-[2px] font-bold text-xs">
                  {isAuthenticated ? (cartItems?.items?.length || 0) : (guestCartItems?.length || 0)}
                </span> 
                <span className="sr-only">Cart</span>
              </Button>
              <UserCartWrapper
                setOpenCartSheet={setOpenCartSheet}
                cartItems={
                  isAuthenticated 
                    ? (cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : [])
                    : (guestCartItems || [])
                }
                isGuest={!isAuthenticated}
              />
            </Sheet>

            {/* Profile or Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="bg-gray-200 cursor-pointer w-8 h-8">
                    <AvatarImage
                      src={user?.profilePicture || undefined}
                      alt="Profile"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-700 font-bold text-xs">
                      {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" className="w-56">
                  <DropdownMenuLabel>
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.userName || 'User'
                    }
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => navigate("/shop/account")}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      navigate("/shop/home");
                      // Add a small delay to ensure navigation happens before state update
                      setTimeout(() => {
                        dispatch(logoutUser());
                      }, 100);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate("/auth/login")}
                className="inline-flex gap-2 items-center rounded-md px-3 py-2 text-sm font-medium shadow"
                size="sm"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}

            {/* Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle header menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 px-4 pt-4">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <HousePlug className="h-6 w-6 text-blue-600" />
                      <span className="font-bold text-lg text-gray-900">Shopzy</span>
                    </Link>
                  </div>
                  
                  {/* Navigation Menu */}
                  <div className="flex-1 overflow-y-auto">
                    <MenuItems isMobile={true} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Row 2: Search Bar */}
        <div className="px-4 pb-3">
          <SearchInput isMobile={true} />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex h-16 items-center justify-between px-4 md:px-6 bg-white shadow-sm">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <HousePlug className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg text-gray-900">Shopzy</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <MenuItems isMobile={false} />
        </div>

        <div className="flex items-center">
          <HeaderRightContent isMobile={false} />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;