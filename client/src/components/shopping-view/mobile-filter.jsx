import { filterOptions } from "@/config";
import { Fragment, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Filter, X } from "lucide-react";

const MobileFilter = ({ filters, handleFilter, onApplyFilters, onClearFilters }) => {
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters || {});

  const handleTempFilter = (getSectionId, getCurrentOption) => {
    let cpyFilters = { ...tempFilters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setTempFilters(cpyFilters);
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    setOpen(false);
  };

  const handleClear = () => {
    setTempFilters({});
    onClearFilters();
    setOpen(false);
  };

  const getActiveFiltersCount = () => {
    return Object.values(tempFilters).reduce((count, arr) => count + arr.length, 0);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-12">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">Tap to filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-4 border-b">
            <h2 className="text-lg font-extrabold">Filters</h2>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.keys(filterOptions).map((keyItem) => (
              <Fragment key={keyItem}>
                <div>
                  <h3 className="text-base font-bold mb-2 capitalize">
                    {keyItem}
                  </h3>
                  <div className="grid gap-2">
                    {filterOptions[keyItem].map((option) => (
                      <Label
                        key={option.id}
                        className="flex font-medium items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={
                            tempFilters &&
                            Object.keys(tempFilters).length > 0 &&
                            tempFilters[keyItem] &&
                            tempFilters[keyItem].indexOf(option.id) > -1
                          }
                          onCheckedChange={() => handleTempFilter(keyItem, option.id)}
                        />
                        <span className="text-sm">{option.label}</span>
                      </Label>
                    ))}
                  </div>
                </div>
                <Separator />
              </Fragment>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 p-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilter;
