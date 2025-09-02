import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: ""
    });
  };

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      details: "+1 (234) 567-890",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      details: "support@shopzy.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Address",
      details: "123 Fashion Street, New York, NY 10001",
      description: "United States"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Business Hours",
      details: "Monday - Friday: 9:00 AM - 6:00 PM",
      description: "Saturday: 10:00 AM - 4:00 PM"
    }
  ];

  const categories = [
    "General Inquiry",
    "Order Support",
    "Returns & Exchanges",
    "Product Questions",
    "Technical Support",
    "Billing & Payments",
    "Size & Fit Help",
    "Other"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600">We're here to help! Get in touch with our support team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-blue-600 mt-1">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{info.title}</h4>
                    <p className="text-sm text-gray-600">{info.details}</p>
                    <p className="text-xs text-gray-500">{info.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Track Your Order
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Start a Return
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Size Guide
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please describe your inquiry in detail..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">How long does shipping take?</h4>
              <p className="text-sm text-gray-600">
                Standard shipping takes 3-5 business days within the US. Express options are available.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What is your return policy?</h4>
              <p className="text-sm text-gray-600">
                We offer a 30-day return policy for most items in original condition.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do I track my order?</h4>
              <p className="text-sm text-gray-600">
                You'll receive a tracking number via email once your order ships.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you ship internationally?</h4>
              <p className="text-sm text-gray-600">
                Yes, we ship worldwide. International shipping costs vary by destination.
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">
              View All FAQs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUs;
