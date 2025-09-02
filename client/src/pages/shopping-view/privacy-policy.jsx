import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, Users, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, shipping address, billing address",
        "Account Information: Username, password, profile preferences",
        "Order Information: Purchase history, payment details, shipping preferences",
        "Usage Information: Website interactions, browsing patterns, device information",
        "Communication Data: Customer service interactions, feedback, reviews"
      ]
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders",
        "Provide customer support and respond to inquiries",
        "Send order confirmations, shipping updates, and delivery notifications",
        "Improve our website, products, and services",
        "Send promotional emails and marketing communications (with your consent)",
        "Prevent fraud and ensure security",
        "Comply with legal obligations"
      ]
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share information with trusted service providers who assist in our operations",
        "We may share information when required by law or to protect our rights",
        "We may share aggregated, non-personal information for business purposes",
        "In case of business transfers, customer information may be transferred as part of the assets"
      ]
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Data Security",
      content: [
        "We use industry-standard encryption to protect your personal information",
        "Secure servers and databases protect your data from unauthorized access",
        "Regular security audits and updates ensure ongoing protection",
        "Access to personal information is limited to authorized personnel only",
        "We use secure payment processing systems for all transactions"
      ]
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Your Rights",
      content: [
        "Access: Request a copy of the personal information we hold about you",
        "Correction: Update or correct your personal information",
        "Deletion: Request deletion of your personal information",
        "Portability: Request transfer of your data to another service",
        "Opt-out: Unsubscribe from marketing communications at any time",
        "Restriction: Request limitation of processing of your personal information"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: January 1, 2024</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">
            At SHOPZY, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
            website or make a purchase from us. By using our services, you agree to the collection and use of information 
            in accordance with this policy.
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
          <CardTitle>Cookies and Tracking Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            We use cookies and similar tracking technologies to enhance your browsing experience, 
            analyze website traffic, and personalize content. You can control cookie settings through 
            your browser preferences.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Essential Cookies:</strong> Required for basic website functionality
            </p>
            <p className="text-sm text-gray-600">
              <strong>Analytics Cookies:</strong> Help us understand how visitors use our website
            </p>
            <p className="text-sm text-gray-600">
              <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Our services are not directed to children under 13 years of age. We do not knowingly 
            collect personal information from children under 13. If you are a parent or guardian 
            and believe your child has provided us with personal information, please contact us 
            immediately.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date. 
            You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy or our privacy practices, 
            please contact us:
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> privacy@shopzy.com
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

export default PrivacyPolicy;
