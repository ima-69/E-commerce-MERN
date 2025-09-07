import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      category: "General",
      questions: [
        {
          question: "What is SHOPZY?",
          answer: "SHOPZY is your one-stop destination for the latest fashion trends, quality products, and exceptional shopping experience. We offer a wide range of clothing, accessories, and footwear for men, women, and kids."
        },
        {
          question: "How do I create an account?",
          answer: "Creating an account is easy! Click on the 'Login' button in the top right corner to sign in with Auth0. You can use your existing social media accounts or email to create a new account."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we take your privacy and security seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent."
        }
      ]
    },
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping typically takes 3-5 business days within the United States. Express shipping options are available for faster delivery. International shipping times vary by location."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by destination. You can see shipping options and costs at checkout."
        },
        {
          question: "Can I track my order?",
          answer: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'Order Tracking' page."
        },
        {
          question: "What if my order is delayed?",
          answer: "If your order is delayed, we'll notify you via email with updated delivery information. You can also contact our customer service team for assistance."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some items marked as 'Final Sale' cannot be returned."
        },
        {
          question: "How do I return an item?",
          answer: "You can start a return by logging into your account and going to 'My Orders'. Select the items you want to return, print the prepaid return label, and ship the items back to us."
        },
        {
          question: "How long does it take to process a return?",
          answer: "Returns are typically processed within 3-5 business days after we receive your package. Refunds will appear on your original payment method within 5-10 business days."
        },
        {
          question: "Can I exchange an item for a different size?",
          answer: "Yes! You can exchange items for a different size or color. Start an exchange through your account, and we'll guide you through the process."
        }
      ]
    },
    {
      category: "Payment & Billing",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other secure payment methods. All payments are processed securely."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard encryption to protect your payment information. We never store your full credit card details on our servers."
        },
        {
          question: "Can I use multiple payment methods?",
          answer: "Currently, we only accept one payment method per order. However, you can use different payment methods for different orders."
        },
        {
          question: "Do you offer payment plans?",
          answer: "We don't currently offer payment plans, but we do accept PayPal which may offer payment options depending on your account."
        }
      ]
    },
    {
      category: "Product Information",
      questions: [
        {
          question: "How do I find the right size?",
          answer: "We provide detailed size guides for all our products. You can find size charts on each product page, or visit our comprehensive Size Guide page for detailed measurements."
        },
        {
          question: "Are your products authentic?",
          answer: "Yes, all our products are 100% authentic. We work directly with brands and authorized distributors to ensure authenticity."
        },
        {
          question: "Do you offer product warranties?",
          answer: "Product warranties vary by brand and item. Please check the product description for specific warranty information. We also offer our own quality guarantee on all purchases."
        },
        {
          question: "Can I see more photos of a product?",
          answer: "We provide multiple high-quality photos for each product. If you need additional photos or have specific questions about a product, please contact our customer service team."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600">Find answers to common questions about shopping with SHOPZY</p>
      </div>

      <div className="space-y-8">
        {faqData.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.questions.map((item, questionIndex) => {
                  const globalIndex = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItems[globalIndex];
                  
                  return (
                    <div key={questionIndex} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full text-left flex items-center justify-between py-2 hover:bg-gray-50 rounded-md px-2 -mx-2"
                      >
                        <h3 className="font-semibold text-gray-900">{item.question}</h3>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="mt-2 px-2">
                          <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Still Have Questions?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for? Our customer service team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button>
              Contact Support
            </Button>
            <Button variant="outline">
              Live Chat
            </Button>
            <Button variant="outline">
              Email Us
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
