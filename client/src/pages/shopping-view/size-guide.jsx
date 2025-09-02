import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Shirt, Footprints, Watch } from "lucide-react";

const SizeGuide = () => {
  const clothingSizes = {
    men: {
      shirts: [
        { size: "XS", chest: "34-36", waist: "28-30", length: "28" },
        { size: "S", chest: "36-38", waist: "30-32", length: "29" },
        { size: "M", chest: "38-40", waist: "32-34", length: "30" },
        { size: "L", chest: "40-42", waist: "34-36", length: "31" },
        { size: "XL", chest: "42-44", waist: "36-38", length: "32" },
        { size: "XXL", chest: "44-46", waist: "38-40", length: "33" }
      ],
      pants: [
        { size: "28", waist: "28", inseam: "30", length: "30" },
        { size: "30", waist: "30", inseam: "30", length: "30" },
        { size: "32", waist: "32", inseam: "32", length: "32" },
        { size: "34", waist: "34", inseam: "32", length: "32" },
        { size: "36", waist: "36", inseam: "34", length: "34" },
        { size: "38", waist: "38", inseam: "34", length: "34" }
      ]
    },
    women: {
      tops: [
        { size: "XS", bust: "32-34", waist: "24-26", length: "26" },
        { size: "S", bust: "34-36", waist: "26-28", length: "27" },
        { size: "M", bust: "36-38", waist: "28-30", length: "28" },
        { size: "L", bust: "38-40", waist: "30-32", length: "29" },
        { size: "XL", bust: "40-42", waist: "32-34", length: "30" },
        { size: "XXL", bust: "42-44", waist: "34-36", length: "31" }
      ],
      pants: [
        { size: "0", waist: "24", hip: "34", inseam: "30" },
        { size: "2", waist: "25", hip: "35", inseam: "30" },
        { size: "4", waist: "26", hip: "36", inseam: "30" },
        { size: "6", waist: "27", hip: "37", inseam: "31" },
        { size: "8", waist: "28", hip: "38", inseam: "31" },
        { size: "10", waist: "29", hip: "39", inseam: "32" }
      ]
    }
  };

  const shoeSizes = {
    men: [
      { us: "7", uk: "6", eu: "40", cm: "25.4" },
      { us: "8", uk: "7", eu: "41", cm: "26.7" },
      { us: "9", uk: "8", eu: "42", cm: "27.9" },
      { us: "10", uk: "9", eu: "43", cm: "29.2" },
      { us: "11", uk: "10", eu: "44", cm: "30.5" },
      { us: "12", uk: "11", eu: "45", cm: "31.8" }
    ],
    women: [
      { us: "5", uk: "3", eu: "36", cm: "22.9" },
      { us: "6", uk: "4", eu: "37", cm: "24.1" },
      { us: "7", uk: "5", eu: "38", cm: "25.4" },
      { us: "8", uk: "6", eu: "39", cm: "26.7" },
      { us: "9", uk: "7", eu: "40", cm: "27.9" },
      { us: "10", uk: "8", eu: "41", cm: "29.2" }
    ]
  };

  const SizeTable = ({ data, columns }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {columns.map((col, index) => (
              <th key={index} className="text-left p-3 font-semibold bg-gray-50">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {Object.values(row).map((value, cellIndex) => (
                <td key={cellIndex} className="p-3">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Size Guide</h1>
        <p className="text-gray-600">Find the perfect fit for your style</p>
      </div>

      <Tabs defaultValue="clothing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clothing" className="flex items-center gap-2">
            <Shirt className="h-4 w-4" />
            Clothing
          </TabsTrigger>
          <TabsTrigger value="shoes" className="flex items-center gap-2">
            <Footprints className="h-4 w-4" />
            Shoes
          </TabsTrigger>
          <TabsTrigger value="measurements" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            How to Measure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clothing" className="space-y-6">
          <Tabs defaultValue="men" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="men">Men's Sizes</TabsTrigger>
              <TabsTrigger value="women">Women's Sizes</TabsTrigger>
            </TabsList>

            <TabsContent value="men" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Men's Shirts & Tops</CardTitle>
                </CardHeader>
                <CardContent>
                  <SizeTable
                    data={clothingSizes.men.shirts}
                    columns={["Size", "Chest (inches)", "Waist (inches)", "Length (inches)"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Men's Pants</CardTitle>
                </CardHeader>
                <CardContent>
                  <SizeTable
                    data={clothingSizes.men.pants}
                    columns={["Size", "Waist (inches)", "Inseam (inches)", "Length (inches)"]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="women" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Women's Tops</CardTitle>
                </CardHeader>
                <CardContent>
                  <SizeTable
                    data={clothingSizes.women.tops}
                    columns={["Size", "Bust (inches)", "Waist (inches)", "Length (inches)"]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Women's Pants</CardTitle>
                </CardHeader>
                <CardContent>
                  <SizeTable
                    data={clothingSizes.women.pants}
                    columns={["Size", "Waist (inches)", "Hip (inches)", "Inseam (inches)"]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="shoes" className="space-y-6">
          <Tabs defaultValue="men" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="men">Men's Shoes</TabsTrigger>
              <TabsTrigger value="women">Women's Shoes</TabsTrigger>
            </TabsList>

            <TabsContent value="men">
              <Card>
                <CardHeader>
                  <CardTitle>Men's Shoe Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <SizeTable
                    data={shoeSizes.men}
                    columns={["US", "UK", "EU", "CM"]}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="women">
              <Card>
                <CardHeader>
                  <CardTitle>Women's Shoe Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <SizeTable
                    data={shoeSizes.women}
                    columns={["US", "UK", "EU", "CM"]}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How to Measure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Chest/Bust</h4>
                  <p className="text-sm text-gray-600">
                    Measure around the fullest part of your chest, keeping the tape measure horizontal.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Waist</h4>
                  <p className="text-sm text-gray-600">
                    Measure around your natural waistline, keeping the tape measure comfortably loose.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Hip</h4>
                  <p className="text-sm text-gray-600">
                    Measure around the fullest part of your hips, about 7-9 inches below your waist.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Inseam</h4>
                  <p className="text-sm text-gray-600">
                    Measure from the crotch to the bottom of your ankle bone.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Best Fit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use a flexible measuring tape</li>
                  <li>• Measure over light clothing or undergarments</li>
                  <li>• Keep the tape measure parallel to the floor</li>
                  <li>• Don't pull the tape too tight or too loose</li>
                  <li>• If between sizes, choose the larger size</li>
                  <li>• Consider your preferred fit (slim, regular, relaxed)</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Still Unsure?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you're still unsure about sizing, our customer service team is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Live Chat
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SizeGuide;
