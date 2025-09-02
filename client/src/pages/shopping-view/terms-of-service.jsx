import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, CreditCard, Truck, Shield, AlertTriangle } from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using SHOPZY's website and services, you accept and agree to be bound by these Terms of Service",
        "If you do not agree to these terms, please do not use our services",
        "We reserve the right to modify these terms at any time without prior notice",
        "Your continued use of our services after changes constitutes acceptance of the new terms",
        "These terms apply to all users of our website, including browsers, customers, and contributors"
      ]
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: "Use of Our Services",
      content: [
        "You may use our services only for lawful purposes and in accordance with these terms",
        "You agree not to use our services in any way that could damage, disable, or impair our website",
        "You may not attempt to gain unauthorized access to any part of our website or systems",
        "You agree not to use automated systems to access our website without permission",
        "You are responsible for maintaining the confidentiality of your account information"
      ]
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Orders and Payment",
      content: [
        "All orders are subject to acceptance and availability",
        "We reserve the right to refuse or cancel any order at our discretion",
        "Prices are subject to change without notice",
        "Payment must be received before order processing begins",
        "We accept major credit cards, PayPal, and other approved payment methods",
        "All sales are final unless otherwise specified in our return policy"
      ]
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Shipping and Delivery",
      content: [
        "Shipping costs and delivery times are estimates and may vary",
        "We are not responsible for delays caused by shipping carriers",
        "Risk of loss transfers to you upon delivery to the shipping address",
        "You are responsible for providing accurate shipping information",
        "We reserve the right to change shipping methods and carriers",
        "International shipping may be subject to customs duties and taxes"
      ]
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Product Information",
      content: [
        "We strive to provide accurate product descriptions and images",
        "Product colors may vary due to monitor settings and lighting",
        "We reserve the right to correct any errors in product information",
        "Product availability is subject to change without notice",
        "We are not responsible for typographical errors in product descriptions",
        "All product specifications are approximate and subject to manufacturer variations"
      ]
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Limitation of Liability",
      content: [
        "SHOPZY shall not be liable for any indirect, incidental, or consequential damages",
        "Our total liability shall not exceed the amount paid for the specific product or service",
        "We are not responsible for any loss or damage resulting from the use of our products",
        "We do not warrant that our services will be uninterrupted or error-free",
        "You use our services at your own risk",
        "Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-600">Last updated: January 1, 2024</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to SHOPZY</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">
            These Terms of Service ("Terms") govern your use of SHOPZY's website and services. 
            By accessing or using our services, you agree to be bound by these Terms. Please 
            read them carefully before using our website or making a purchase.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            All content on our website, including text, graphics, logos, images, and software, 
            is the property of SHOPZY or its content suppliers and is protected by copyright 
            and other intellectual property laws.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              • You may not reproduce, distribute, or modify any content without our written permission
            </p>
            <p className="text-sm text-gray-600">
              • The SHOPZY name and logo are trademarks of our company
            </p>
            <p className="text-sm text-gray-600">
              • Unauthorized use of our intellectual property is strictly prohibited
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Privacy and Data Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Your privacy is important to us. Our collection and use of personal information 
            is governed by our Privacy Policy, which is incorporated into these Terms by 
            reference. By using our services, you consent to the collection and use of 
            information as described in our Privacy Policy.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Termination</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            We may terminate or suspend your account and access to our services immediately, 
            without prior notice, for any reason, including if you breach these Terms. Upon 
            termination, your right to use our services will cease immediately.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Governing Law</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            These Terms shall be governed by and construed in accordance with the laws of 
            the State of New York, without regard to its conflict of law provisions. Any 
            disputes arising from these Terms or your use of our services shall be resolved 
            in the courts of New York.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> legal@shopzy.com
            </p>
            <p className="text-sm text-gray-600">
              <strong>Phone:</strong> +1 (234) 567-890
            </p>
            <p className="text-sm text-gray-600">
              <strong>Address:</strong> 123 Fashion Street, New York, NY 10001
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;
