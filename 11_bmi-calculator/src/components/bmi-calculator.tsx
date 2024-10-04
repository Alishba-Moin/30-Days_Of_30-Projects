"use client"; // Ensures client-side rendering

import { useState, ChangeEvent, useEffect } from "react"; // Import necessary hooks from React
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card"; // Import UI components for Card layout
import { Label } from "@/components/ui/label"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { FaFemale, FaMale } from "react-icons/fa"; 
import { SunIcon } from '@heroicons/react/24/outline';
import { MoonIcon } from '@heroicons/react/24/outline';

// Interface to define the structure of BMI result
interface BmiResult {
  bmi: string;
  category: string;
  info: string; // Additional info based on BMI
}

export default function BmiCalculator() {
  // useState hooks for managing height, weight, age, gender, result, error, and dark mode state
  const [height, setHeight] = useState<number>(170); // Default height in cm
  const [weight, setWeight] = useState<number>(60); // Default weight in kg
  const [age, setAge] = useState<number>(25); // Default age
  const [gender, setGender] = useState<"male" | "female">("male"); // Gender selection
  const [result, setResult] = useState<BmiResult | null>(null); // Stores the result of BMI calculation
  const [error, setError] = useState<string>(""); // Stores any error message
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Controls dark mode

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setHeight(Number(e.target.value)); // Update height state
  };

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setWeight(Number(e.target.value)); // Update weight state
  };

  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAge(Number(e.target.value)); // Update age state
  };

  const handleGenderChange = (newGender: "male" | "female") => {
    setGender(newGender);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const calculateBmi = (): void => {
    if (!height || !weight) {
      setError("Please enter both height and weight.");
      return;
    }

    const heightInMeters = height / 100;

    if (heightInMeters <= 0) {
      setError("Height must be a positive number.");
      return;
    }

    if (weight <= 0) {
      setError("Weight must be a positive number.");
      return;
    }

    const bmiValue = weight / (heightInMeters * heightInMeters);
    let category = "";
    let info = "";

    if (bmiValue < 18.5) {
      category = "Underweight";
      info = "You are under the recommended weight range.";
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      category = "Normal";
      info = "You are within the normal weight range.";
    } else if (bmiValue >= 25 && bmiValue < 30) {
      category = "Overweight";
      info = "You are above the normal weight range.";
    } else {
      category = "Obese";
      info = "You are in the obese category. Consider consulting a doctor.";
    }

    setResult({ bmi: bmiValue.toFixed(1), category, info });
    setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-1">
      {/* Card component to contain the form */}
      <Card className="w-full max-w-md  bg-white shadow-xl shadow-gray-900 dark:shadow-slate-100 rounded-xl border border-gray-300 dark:bg-black">
        <CardHeader>
          <Button
            onClick={toggleDarkMode}
            className="w-1/2 flex justify-start text-lg text-start bg-transparent hover:bg-transparent  text-gray-600  dark:text-lime-300 font-semibold text:"
          >
             {isDarkMode ? (
            <>
              <SunIcon className="w-5 h-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <MoonIcon className="w-5 h-5" />
              <span>Dark Mode</span>
            </>
          )}
          </Button>

          <CardTitle className="text-xl font-extrabold text-center dark:text-white">BMI Calculator</CardTitle>
          <CardDescription className="text-gray-600 mt-2 text-lg font-semibold text-center">
            Enter your details to calculate your BMI.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 overflow-auto">
          {/* Gender Selection */}
          <div className="flex justify-center space-x-6 mx-4">
            <div
              className={`p-2 cursor-pointer ${
                gender === "male" ? "bg-lime-300 text-black" : "text-lime-300"
              } rounded-xl`}
              onClick={() => handleGenderChange("male")}
            >
              <FaMale size={110} />
              <Label className="text-start font-semibold">Male</Label>
            </div>
            <div
              className={`p-2 cursor-pointer ${
                gender === "female" ? "bg-gray-400 text-white" : "bg-white text-gray-400"
              } rounded-xl`}
              onClick={() => handleGenderChange("female")}
            >
              <FaFemale size={110} />
              <Label className="text-center font-semibold">Female</Label>
            </div>
          </div>

          {/* Height Input */}
          <div className="grid gap-2 border bg-gray-400 dark:bg-neutral-800 p-1 rounded-xl">
            <div className="text-xl font-bold text-start dark:text-white ">Height (cm)</div>
            <Label className="font-extrabold text-2xl text-center dark:text-white">
              {height} cm
            </Label>
            <Input
              id="height"
              type="range"
              min="100"
              max="250"
              value={height}
              onChange={handleHeightChange}
            />
          </div>

          {/* Weight and Age Inputs */}
          <div className="flex gap-4">
            {/* Weight Input */}
            <div className="border bg-gray-400 dark:bg-neutral-800 p-4 rounded-xl">
              <Label htmlFor="weight" className="font-bold text-lg dark:text-white">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter your weight"
                value={weight}
                onChange={handleWeightChange}
                className="border-2 border-black dark:border-white text-lg"
              />
            </div>

            {/* Age Input */}
            <div className="border bg-gray-400 dark:bg-neutral-800 p-4 rounded-xl">
              <Label htmlFor="age" className="font-bold text-lg dark:text-white">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={handleAgeChange}
                className="border-2 border-black dark:border-white text-lg"
              />
            </div>
          </div>

          <Button
            onClick={calculateBmi}
            className="w-full rounded-xl bg-gray-400 hover:bg-gray-600 dark:bg-lime-400 dark:hover:bg-lime-500 font-bold p-3 text-xl"
          >
            Calculate
          </Button>

          {error && <div className="text-red-500 text-center font-bold">{error}</div>}

          {result && (
            <CardFooter className="grid gap-2 mt-2 bg-gray-400 rounded-xl p-2">
              <Label className="text-xl font-extrabold text-center">Result</Label>
              <div className="flex justify-between text-xl font-semibold">
                <div className="text-left">Your BMI: {result.bmi}</div>
                <div className="text-right">
                  Category: <span className="text-muted-foreground dark:text-gray-700">{result.category}</span>
                </div>
              </div>

              <div className="text-center text-gray-600 font-semibold">
                {result.info}
              </div>
            </CardFooter>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
