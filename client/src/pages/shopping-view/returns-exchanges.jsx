import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Clock, CheckCircle, AlertCircle } from "lucide-react";

const ReturnsExchanges = () => {
  const returnPolicy = [
    {
      title: "30-Day Return Window",
      description: "You have 30 days from the delivery date to return or exchange your items.",
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: "Free Returns",
      description: "We offer free return shipping for all orders within the United States.",
      icon: <Package className="h-5 w-5" />
    },
    {
      title: "Easy Process",
      description: "Start your return online and print a prepaid shipping label.",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      title: "Quality Guarantee",
      description: "Items must be in original condition with tags attached.",
      icon: <AlertCircle className="h-5 w-5" />
    }
  ];

  const returnSteps = [
    {
      step: 1,
      title: "Start Your Return",
      description: "Log into your account and go to 'My Orders' to initiate a return.",
      details: "Select the items you want to return and choose your reason."
    },
    {
      step: 2,
      title: "Print Return Label",
      description: "Download and print your prepaid return shipping label.",
      details: "The label will be emailed to you and can also be found in your account."
    },
    {
      step: 3,
      title: "Package Your Items",
      description: "Pack your items securely in the original packaging if possible.",
      details: "Include the return form and ensure all tags are still attached."
    },
    {
      step: 4,
      title: "Ship Your Return",
      description: "Drop off your package at any authorized shipping location.",
      details: "You can track your return package using the tracking number provided."
    },
    {
      step: 5,
      title: "Receive Refund",
      description: "Once we receive and process your return, you'll get your refund.",
      details: "Refunds are processed within 3-5 business days after we receive your return."
    }
  ];

  const exchangeSteps = [
    {
      step: 1,
      title: "Start Your Exchange",
      description: "Log into your account and go to 'My Orders' to initiate an exchange.",
      details: "Select the items you want to exchange and choose the new size or style."
    },
    {
      step: 2,
      title: "Place New Order",
      description: "Add the new items to your cart and proceed to checkout.",
      details: "You'll only pay the difference if the new items cost more."
    },
    {
      step: 3,
      title: "Return Original Items",
      description: "Follow the same return process for your original items.",
      details: "Use the prepaid return label provided in your exchange confirmation."
    },
    {
      step: 4,
      title: "Receive New Items",
      description: "Your new items will be shipped once your return is processed.",
      details: "You'll receive tracking information for your new order."
    }
  ];

  const conditions = [
    {
      item: "Original tags attached",
      required: true
    },
    {
      item: "Unworn and unwashed",
      required: true
    },
    {
      item: "Original packaging",
      required: false
    },
    {
      item: "Receipt or order confirmation",
      required: true
    },
    {
      item: "Within 30 days of delivery",
      required: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Returns & Exchanges</h1>
        <p className="text-gray-600">Easy returns and exchanges for your peace of mind</p>
      </div>

      {/* Policy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {returnPolicy.map((policy, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-3 text-blue-600">
                {policy.icon}
              </div>
              <h3 className="font-semibold mb-2">{policy.title}</h3>
              <p className="text-sm text-gray-600">{policy.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Returns Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Return Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {returnSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                    <p className="text-xs text-gray-500">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exchange Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Exchange Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {exchangeSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                    <p className="text-xs text-gray-500">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Return Conditions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Return Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center gap-3">
                <Badge variant={condition.required ? "default" : "secondary"}>
                  {condition.required ? "Required" : "Preferred"}
                </Badge>
                <span className="text-sm">{condition.item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Final Sale Items</h4>
            <p className="text-sm text-yellow-700">
              Items marked as "Final Sale" cannot be returned or exchanged. Please check product descriptions carefully before purchasing.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Refund Timeline</h4>
            <p className="text-sm text-blue-700">
              Refunds are processed within 3-5 business days after we receive your return. 
              It may take 5-10 business days for the refund to appear on your original payment method.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">International Returns</h4>
            <p className="text-sm text-green-700">
              International customers are responsible for return shipping costs. 
              We recommend using a trackable shipping method for your return.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Have questions about returns or exchanges? Our customer service team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button>
              Start a Return
            </Button>
            <Button variant="outline">
              Contact Support
            </Button>
            <Button variant="outline">
              Live Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReturnsExchanges;
