import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, ShoppingBag, User, HelpCircle, FileText, Map } from "lucide-react";

const Sitemap = () => {
  const sitemapData = [
    {
      icon: <Home className="h-5 w-5" />,
      title: "Main Pages",
      links: [
        { name: "Home", url: "/shop/home" },
        { name: "All Products", url: "/shop/listing" },
        { name: "Search", url: "/shop/search" }
      ]
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Product Categories",
      links: [
        { name: "Men's Collection", url: "/shop/listing?category=men" },
        { name: "Women's Collection", url: "/shop/listing?category=women" },
        { name: "Kids Collection", url: "/shop/listing?category=kids" },
        { name: "Accessories", url: "/shop/listing?category=accessories" },
        { name: "Footwear", url: "/shop/listing?category=footwear" }
      ]
    },
    {
      icon: <User className="h-5 w-5" />,
      title: "Account & Orders",
      links: [
        { name: "My Account", url: "/shop/account" },
        { name: "Order History", url: "/shop/account" },
        { name: "Wishlist", url: "/shop/account" },
        { name: "Address Book", url: "/shop/account" },
        { name: "Order Tracking", url: "/shop/order-tracking" }
      ]
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: "Customer Service",
      links: [
        { name: "Contact Us", url: "/shop/contact-us" },
        { name: "FAQ", url: "/shop/faq" },
        { name: "Size Guide", url: "/shop/size-guide" },
        { name: "Returns & Exchanges", url: "/shop/returns-exchanges" }
      ]
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Legal & Policies",
      links: [
        { name: "Privacy Policy", url: "/shop/privacy-policy" },
        { name: "Terms of Service", url: "/shop/terms-of-service" },
        { name: "Cookie Policy", url: "/shop/cookie-policy" },
        { name: "Sitemap", url: "/shop/sitemap" }
      ]
    }
  ];

  const quickLinks = [
    { name: "Login", url: "http://localhost:5000/api/auth0/login" },
    { name: "Checkout", url: "/shop/checkout" },
    { name: "Payment Success", url: "/shop/payment-success" },
    { name: "PayPal Return", url: "/shop/paypal-return" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sitemap</h1>
        <p className="text-gray-600">Find all pages and sections of our website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sitemapData.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.url} 
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.url} 
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm text-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Website Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Navigation Structure:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Main navigation includes Home, Products, and category-specific pages</p>
                <p>• User account section accessible after login</p>
                <p>• Customer service pages available in footer</p>
                <p>• Legal pages accessible from footer links</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Search Functionality:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Global search available in header</p>
                <p>• Category-based filtering on product listing pages</p>
                <p>• Advanced search with multiple filters</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">User Experience:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Responsive design for all device types</p>
                <p>• Breadcrumb navigation for easy orientation</p>
                <p>• Quick access to account and cart from any page</p>
                <p>• Consistent footer with important links</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help Finding Something?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Use our search function or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop/search">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Search Products
              </button>
            </Link>
            <Link to="/shop/contact-us">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sitemap;
