import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { countryCodeOptions } from "@/config";
import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

const CommonForm =  ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [countrySearch, setCountrySearch] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [phoneCountrySearch, setPhoneCountrySearch] = useState("");
  const [isPhoneCountryOpen, setIsPhoneCountryOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    return countryCodeOptions.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.includes(countrySearch)
    );
  }, [countrySearch]);

  const filteredPhoneCountries = useMemo(() => {
    return countryCodeOptions.filter(country =>
      country.name.toLowerCase().includes(phoneCountrySearch.toLowerCase()) ||
      country.code.includes(phoneCountrySearch)
    );
  }, [phoneCountrySearch]);

  // Sync phone country code when country changes
  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countryCodeOptions.find(c => c.name === formData.country);
      if (selectedCountry && selectedCountry.code !== selectedCountryCode) {
        setSelectedCountryCode(selectedCountry.code);
        setFormData(prev => ({
          ...prev,
          countryCode: selectedCountry.code,
        }));
      }
    }
  }, [formData.country, selectedCountryCode, setFormData]);

  const renderInputsByComponentType = (getControlItem) => {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "countrySelect":
        element = (
          <div className="relative">
            <div
              className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            >
              <div className="flex items-center gap-2">
                {formData.country && (
                  <>
                    <span className="text-lg">
                      {countryCodeOptions.find(c => c.name === formData.country)?.flag}
                    </span>
                    <span className="text-sm">
                      {formData.country}
                    </span>
                  </>
                )}
                {!formData.country && (
                  <span className="text-gray-500">{getControlItem.placeholder}</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            
            {isCountryDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search countries..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <div
                      key={country.country}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        // Find the country code for the selected country
                        const selectedCountry = countryCodeOptions.find(c => c.country === country.country);
                        setFormData({
                          ...formData,
                          [getControlItem.name]: country.name, // Store country name instead of country code
                          countryCode: selectedCountry?.code || "+1",
                        });
                        setSelectedCountryCode(selectedCountry?.code || "+1");
                        setIsCountryDropdownOpen(false);
                        setCountrySearch("");
                      }}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{country.name}</div>
                        <div className="text-xs text-gray-500">{country.code}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

        break;
      case "phone":
        element = (
          <div className="flex gap-2">
            <div className="relative">
              <div
                className="flex items-center justify-between w-40 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={() => setIsPhoneCountryOpen(!isPhoneCountryOpen)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {countryCodeOptions.find(c => c.code === selectedCountryCode)?.flag}
                  </span>
                  <span className="text-sm">{selectedCountryCode}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              
              {isPhoneCountryOpen && (
                <div className="absolute z-50 w-80 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search countries..."
                        value={phoneCountrySearch}
                        onChange={(e) => setPhoneCountrySearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredPhoneCountries.map((country) => (
                      <div
                        key={country.code + country.country}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedCountryCode(country.code);
                          setFormData({
                            ...formData,
                            countryCode: country.code,
                            country: country.name, // Store country name instead of country code
                          });
                          setIsPhoneCountryOpen(false);
                          setPhoneCountrySearch("");
                        }}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{country.name}</div>
                          <div className="text-xs text-gray-500">{country.code}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className="flex-1"
            />
          </div>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;