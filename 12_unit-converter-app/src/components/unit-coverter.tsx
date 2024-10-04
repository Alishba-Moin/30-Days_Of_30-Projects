"use client"

import { useState, ChangeEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Button } from './ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRuler, faWeightScale, faTint, faTemperatureHigh, faClock, faDatabase } from '@fortawesome/free-solid-svg-icons';

// Define unit categories for better type safety
type UnitCategory = 'length' | 'weight' | 'volume' | 'temperature' | 'time' | 'data';


// Conversion rates for various units categorized by length, weight, volume, temperature, time, and data
const conversionRates: Record<string, Record<string, number | ((value: number) => number)>> = {
  length: {
    "Millimeters (mm)": 1,
    "Centimeters (cm)": 10,
    "Meters (m)": 1000,
    "Kilometers (km)": 1000000,
    "Inches (in)": 25.4,
    "Feet (ft)": 304.8,
    "Yards (yd)": 914.4,
    "Miles (mi)": 1609344,
  },
  weight: {
    "Grams (g)": 1,
    "Kilograms (kg)": 1000,
    "Ounces (oz)": 28.3495,
    "Pounds (lb)": 453.592,
  },
  volume: {
    "Milliliters (ml)": 1,
    "Liters (l)": 1000,
    "Fluid Ounces (fl oz)": 29.5735,
    "Cups (cup)": 240,
    "Pints (pt)": 473.176,
    "Quarts (qt)": 946.353,
    "Gallons (gal)": 3785.41,
  },
  temperature: {
    "Celsius (°C)": (value: number) => value,
    "Fahrenheit (°F)": (value: number) => (value - 32) * 5 / 9, // Fahrenheit to Celsius
    "Kelvin (K)": (value: number) => value - 273.15, // Kelvin to Celsius
  },
  time: {
    "Seconds (s)": 1,
    "Minutes (min)": 60,
    "Hours (h)": 3600,
    "Days (d)": 86400,
  },
  data: {
    "Bits": 1,
    "Bytes": 8,
    "Kilobytes (KB)": 8192,
    "Megabytes (MB)": 8388608,
    "Gigabytes (GB)": 8589934592,
  },
};

const unitTypes: Record<string, string[]> = {
  length: [
    "Millimeters (mm)", 
    "Centimeters (cm)", 
    "Meters (m)", 
    "Kilometers (km)", 
    "Inches (in)", 
    "Feet (ft)", 
    "Yards (yd)", 
    "Miles (mi)"
  ],
  weight: [
    "Grams (g)", 
    "Kilograms (kg)", 
    "Ounces (oz)", 
    "Pounds (lb)"
  ],
  volume: [
    "Milliliters (ml)", 
    "Liters (l)", 
    "Fluid Ounces (fl oz)", 
    "Cups (cup)", 
    "Pints (pt)", 
    "Quarts (qt)", 
    "Gallons (gal)"
  ],
  temperature: [
    "Celsius (°C)", 
    "Fahrenheit (°F)", 
    "Kelvin (K)"
  ],
  time: [
    "Seconds (s)", 
    "Minutes (min)", 
    "Hours (h)", 
    "Days (d)"
  ],
  data: [
    "Bits", 
    "Bytes", 
    "Kilobytes (KB)", 
    "Megabytes (MB)", 
    "Gigabytes (GB)"
  ],
};

// Icons for each category
const icons = {
  length: faRuler,
  weight: faWeightScale,
  volume: faTint,
  temperature: faTemperatureHigh,
  time: faClock,
  data: faDatabase,
};

export default function UnitConverter() {
  // State variables for input values and units
  const [inputValue, setInputValue] = useState<number | null>(null);
  const [inputUnit, setInputUnit] = useState<string | null>(null);
  const [outputUnit, setOutputUnit] = useState<string | null>(null);
  const [convertValue, setConvertValue] = useState<number | null>(null);

  // Handle input value change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(e.target.value);
    setInputValue(!isNaN(value) ? value : null); // Set input value or null if invalid
  };

  // Handle input unit selection
  const handleInputUnitChange = (value: string): void => {
    setInputUnit(value);
  };

  // Handle output unit selection
  const handleOutputUnitChange = (value: string): void => {
    setOutputUnit(value);
  };

  // Convert value based on selected units
  const convertValueHandler = () => {
    if (inputValue !== null && inputUnit && outputUnit) {
      let unitCategory: string | null = null;

      // Determine the category based on selected units
      for (const category in unitTypes) {
        if (
          unitTypes[category].includes(inputUnit) &&
          unitTypes[category].includes(outputUnit)
        ) {
          unitCategory = category;
          break;
        }
      }

      if (unitCategory) {
        let baseValue: number;

        // Convert to base value
        if (unitCategory === "temperature") {
          const toCelsius = (conversionRates[unitCategory][inputUnit] as (value: number) => number)(inputValue);
          baseValue = toCelsius;
        } else {
          baseValue = inputValue * (conversionRates[unitCategory][inputUnit] as number);
        }

        const outputConversion = conversionRates[unitCategory][outputUnit];

        // Calculate the final converted value
        if (typeof outputConversion === 'function') {
          setConvertValue((outputConversion as (value: number) => number)(baseValue));
        } else {
          const result = baseValue / (outputConversion as number);
          setConvertValue(result);
        }
      } else {
        setConvertValue(null);
        alert("Incompatible unit types selected.");
      }
    } else {
      alert("Please fill all fields.");
    }
  };

  // Get icon for selected unit
  const getIconForUnit = (unit: string | null): UnitCategory | undefined => {
    if (unit) {
      return Object.keys(unitTypes).find((key) => unitTypes[key].includes(unit)) as UnitCategory | undefined;
    }
    return undefined;
  };

  // Clear all input fields
  const clearFields = () => {
    setInputValue(null);
    setInputUnit(null);
    setOutputUnit(null);
    setConvertValue(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 dark:bg-gray-900">
      <div className="max-w-lg w-full p-8 bg-neutral-300 dark:bg-gray-800 rounded-xl shadow-xl">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-600">
          Unit Converter
        </h1>
        <p className="text-lg font-semibold mb-6 text-center text-gray-600 dark:text-gray-400">
          Convert values between different units effortlessly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Unit Selection */}
          <div className="space-y-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300">
            <Label htmlFor="input-unit" className="text-gray-800 dark:text-gray-200 flex items-center font-bold text-lg">
              From <FontAwesomeIcon icon={icons[getIconForUnit(inputUnit) || 'length']} className="ml-2 text-lg" />
            </Label>
            <Select onValueChange={handleInputUnitChange}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg hover:shadow-xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition duration-150 ease-in-out">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="max-h-48 bg-white dark:bg-gray-800">
                {Object.entries(unitTypes).map(([category, units]) => {
                  const categoryTyped = category as UnitCategory;
                  return (
                    <SelectGroup key={category}>
                      <SelectLabel className="text-gray-600 dark:text-gray-400 flex items-center">
                        <FontAwesomeIcon icon={icons[categoryTyped]} className="mr-2" />
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectLabel>
                      {units.map((unit) => (
                        <SelectItem
                          key={unit}
                          value={unit}
                          className="bg-white dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 transition duration-100"
                        >
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Output Unit Selection */}
          <div className="space-y-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300">
            <Label htmlFor="output-unit" className="text-gray-800 dark:text-gray-200 flex items-center font-bold text-lg">
              To <FontAwesomeIcon icon={icons[getIconForUnit(outputUnit) || 'length']} className="ml-2" />
            </Label>
            <Select onValueChange={handleOutputUnitChange}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="max-h-48 bg-white dark:bg-gray-800">
                {Object.entries(unitTypes).map(([category, units]) => {
                  const categoryTyped = category as UnitCategory;
                  return (
                    <SelectGroup key={category}>
                      <SelectLabel className="text-gray-600 dark:text-gray-400 flex items-center">
                        <FontAwesomeIcon icon={icons[categoryTyped]} className="mr-2" />
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectLabel>
                      {units.map((unit) => (
                        <SelectItem
                          key={unit}
                          value={unit}
                          className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-orange-200 dark:hover:bg-orange-600 transition duration-200 rounded-md p-2"
                        >
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Input Value Field */}
          <div className="space-y-4 col-span-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300">
            <Label htmlFor="input-value" className="text-gray-800 dark:text-gray-200 font-bold text-lg">Value</Label>
            <Input
              type="number"
              value={inputValue || ''}
              onChange={handleInputChange}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-md focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
            />
          </div>

        {/* Convert Button */}
        <div className="flex space-x-4 col-span-2">
          <Button
            type="button"
            className="flex-1 bg-gradient-to-r from-orange-600 to-gray-600 text-white hover:bg-gradient-to-l focus:ring-4 focus:ring-orange-300 transition duration-200 rounded-lg shadow-xl font-bold"
            onClick={convertValueHandler}
         > Convert</Button>
        <Button
          type="button"
          className="flex-1 bg-gradient-to-r from-red-500 to-gray-600 text-white  hover:bg-gradient-to-l focus:ring-4 focus:ring-red-300 transition duration-200 rounded-lg shadow-xl font-bold"
          onClick={clearFields}
        > Clear </Button>
      </div>
    </div>
      <div className="mt-6 text-center">
        <div className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
          {convertValue !== null ? convertValue.toFixed(2) : "0"}
      </div>
      <div className="text-lg text-gray-500 dark:text-gray-400">
          {outputUnit ? outputUnit : "Select a unit"}
    </div>
  </div>
    </div>
    </div>
  );
}
