import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, BarChart3, Target, Shield, Info } from "lucide-react";

const CookiePolicy = () => {
  const cookieTypes = [
    {
      icon: <Shield className="h-5 w-5" />,
      name: "Essential Cookies",
      description: "These cookies are necessary for the website to function properly and cannot be disabled.",
      purpose: "Enable basic website functionality, security, and user authentication",
      examples: [
        "Session management",
        "Shopping cart functionality",
        "User login status",
        "Security features",
        "Load balancing"
      ],
      duration: "Session or up to 1 year"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      name: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website.",
      purpose: "Collect information about website usage to improve performance and user experience",
      examples: [
        "Page views and navigation patterns",
        "Time spent on pages",
        "Error tracking",
        "Performance monitoring",
        "User behavior analysis"
      ],
      duration: "Up to 2 years"
    },
    {
      icon: <Target className="h-5 w-5" />,
      name: "Marketing Cookies",
      description: "These cookies are used to deliver relevant advertisements and track marketing campaigns.",
      purpose: "Personalize advertising content and measure campaign effectiveness",
      examples: [
        "Ad targeting and personalization",
        "Campaign performance tracking",
        "Social media integration",
        "Retargeting campaigns",
        "Conversion tracking"
      ],
      duration: "Up to 1 year"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      name: "Preference Cookies",
      description: "These cookies remember your choices and preferences for a better user experience.",
      purpose: "Store user preferences and settings to customize the website experience",
      examples: [
        "Language preferences",
        "Currency selection",
        "Display settings",
        "Location preferences",
        "Accessibility options"
      ],
      duration: "Up to 1 year"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-gray-600">Last updated: January 1, 2024</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            What Are Cookies?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed mb-4">
            Cookies are small text files that are stored on your device when you visit our website. 
            They help us provide you with a better browsing experience by remembering your preferences 
            and enabling various website features.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We use cookies to improve our website functionality, analyze user behavior, and provide 
            personalized content and advertisements. By continuing to use our website, you consent 
            to our use of cookies as described in this policy.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {cookieTypes.map((cookie, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {cookie.icon}
                {cookie.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{cookie.description}</p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Purpose:</h4>
                  <p className="text-sm text-gray-600">{cookie.purpose}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Examples:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {cookie.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Duration:</h4>
                  <p className="text-sm text-gray-600">{cookie.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Managing Your Cookie Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You have control over which cookies you accept. You can manage your cookie preferences 
            through your browser settings or our cookie consent banner.
          </p>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Browser Settings:</h4>
              <p className="text-sm text-gray-600 mb-2">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Block all cookies</li>
                <li>• Allow only first-party cookies</li>
                <li>• Delete existing cookies</li>
                <li>• Set preferences for specific websites</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Cookie Consent Banner:</h4>
              <p className="text-sm text-gray-600">
                When you first visit our website, you'll see a cookie consent banner where you can 
                choose which types of cookies to accept. You can change your preferences at any time 
                by clicking the cookie settings link in our footer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Third-Party Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            We may use third-party services that set their own cookies. These services help us 
            provide better functionality and analyze website performance.
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-1">Google Analytics:</h4>
              <p className="text-sm text-gray-600">
                Helps us understand how visitors use our website and improve user experience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Social Media Platforms:</h4>
              <p className="text-sm text-gray-600">
                Enable social sharing and integration with platforms like Facebook, Twitter, and Instagram.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Payment Processors:</h4>
              <p className="text-sm text-gray-600">
                Secure payment processing and fraud prevention services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Essential Cookies</h4>
              <p className="text-sm text-yellow-700">
                Please note that disabling essential cookies may affect the functionality of our website 
                and prevent you from using certain features.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Updates to This Policy</h4>
              <p className="text-sm text-blue-700">
                We may update this Cookie Policy from time to time. Any changes will be posted on this 
                page with an updated revision date.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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

export default CookiePolicy;
