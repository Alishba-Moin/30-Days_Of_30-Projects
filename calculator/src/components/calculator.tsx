"use client"; // Enables client-side rendering for this component

import { useState, ChangeEvent, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SunIcon } from '@heroicons/react/24/outline';
import { MoonIcon } from '@heroicons/react/24/outline';

type LanguageKey = 'en' | 'es' | 'fr';

// Multi-language support labels with the LanguageKey type
const labels: Record<LanguageKey, { num1: string; num2: string; result: string; clear: string; history: string }> = {
  en: { 
    num1: "Number 1", 
    num2: "Number 2", 
    result: "Result", 
    clear: "Clear", 
    history: "History" 
  },
  es: { 
    num1: "Número 1", 
    num2: "Número 2", 
    result: "Resultado", 
    clear: "Borrar", 
    history: "Historial" 
  },
  fr: { 
    num1: "Numéro 1", 
    num2: "Numéro 2", 
    result: "Résultat", 
    clear: "Effacer", 
    history: "Historique" 
  },
};

// Default export of the CalculatorComponent function
export default function Calculator() {
  // State hooks for managing input numbers, result, history, darkmode, and languages
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguageKey>("en");

  // Function to toggle dark mode
  const DarkModeButton = () => 
    setIsDarkMode(!isDarkMode);

  // Function to change language (English, Spanish, French)
  const changeLanguage = (lang: LanguageKey) => 
    setLanguage(lang);

  // Handler for updating num1 state on input change
  const handleNum1Change = (e: ChangeEvent<HTMLInputElement>): void => 
    setNum1(e.target.value);

  // Handler for updating num2 state on input change
  const handleNum2Change = (e: ChangeEvent<HTMLInputElement>): void => 
    setNum2(e.target.value);

  // Function to perform operations and set the result
  const calculate = (operation: string): void => {
    let res: number = 0;
    if (operation === "add") 
      res = parseFloat(num1) + parseFloat(num2);
    if (operation === "subtract") 
      res = parseFloat(num1) - parseFloat(num2);
    if (operation === "multiply") 
      res = parseFloat(num1) * parseFloat(num2);
    if (operation === "divide") 
      res = parseFloat(num2) !== 0 ? parseFloat(num1) / parseFloat(num2) : NaN;

    const resultString = `${num1}
     ${operation === "add" ? "+" : 
     operation === "subtract" ? "-" : 
     operation === "multiply" ? "*" : 
     "/"} 
     ${num2} = ${res}`;
    setResult(res.toString());
    setHistory([resultString, ...history]); // Add result to history
  };

  // Function to clear inputs and result
  const clear = (): void => {
    setNum1("");
    setNum2("");
    setResult("");
    setHistory([]);
  };

  // Keyboard shortcuts for customizable operations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a") calculate("add");
      if (e.key === "s") calculate("subtract");
      if (e.key === "m") calculate("multiply");
      if (e.key === "d") calculate("divide");
      if (e.key === "c") clear();
    window.addEventListener("keydown", handleKeyDown);
     return () => window.removeEventListener("keydown", handleKeyDown);
   }, [num1, num2]);
 

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
    {/* Header with Dark Mode Button and Language Selector */}
    <div className="w-full max-w-6xl mb-6 mx-auto p-5">
      <div className="flex items-center justify-between space-x-4">
        {/* Dark Mode Toggle Button */}
        <Button
          className="flex items-center space-x-2 bg-gray-900 text-white hover:bg-gray-800 transition duration-300"
          onClick={DarkModeButton}
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

        {/* Language Selector */}
        <select
         className={`px-6 py-2 rounded-lg transition-colors duration-300 ease-in-out ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"} ${!isDarkMode ? "focus:outline-none focus:ring-2 focus:ring-blue-300" : ""}`}
          onChange={(e) => changeLanguage(e.target.value as LanguageKey)}
          value={language}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </div>
     {/* Calculator UI */}
  <Card className="w-full max-w-md p-6 bg-white shadow-2xl shadow-slate-900 rounded-xl border border-gray-300 transition-transform duration-300 ease-in-out transform hover:scale-105">
  <CardHeader>
    <CardTitle className="text-4xl font-bold text-gray-900">Simple Calculator</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Input fields for numbers */}
    <div className="grid grid-cols-2 gap-4 ">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="num1" className="text-gray-700 font-medium">{labels[language].num1}</Label>
        <Input
          id="num1"
          type="number"
          value={num1}
          onChange={handleNum1Change}
          placeholder="Enter a number"
          className="bg-gray-200 border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="num2" className="text-gray-700 font-medium">{labels[language].num2}</Label>
        <Input
          id="num2"
          type="number"
          value={num2}
          onChange={handleNum2Change}
          placeholder="Enter a number"
          className="bg-gray-200 border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>

    {/* Buttons for arithmetic operations */}
    <div className="grid grid-cols-4 gap-2">
      <Button className="bg-green-500 text-white hover:bg-green-600 rounded-xl text-xl" 
      onClick={() => calculate("add")}
      >+</Button>
      <Button className="bg-red-500 text-white hover:bg-red-600 rounded-xl text-xl" 
      onClick={() => calculate("subtract")}
      >-</Button>
      <Button className="bg-yellow-500 text-white hover:bg-yellow-600 rounded-xl text-xl" 
      onClick={() => calculate("multiply")}
      >*</Button>
      <Button className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl text-xl" 
      onClick={() => calculate("divide")}
      >/</Button>
    </div>

    {/* Display the result */}
    <div className="flex flex-col space-y-2">
      <Label htmlFor="result" className="text-xl font-medium text-gray-700">{labels[language].result}</Label>
      <Input
        id="result"
        type="text"
        value={result}
        placeholder="Result"
        readOnly
        className="bg-gray-200 text-gray-900 border border-gray-400 rounded-xl p-3"
      />
    </div>

    {/* History */}
    <div className="flex flex-col space-y-2">
      <Label className="text-gray-700 font-medium">{labels[language].history}</Label>
      <ul className="text-gray-700 text-xl">
        {history.map((entry, index) => (
          <li
            key={index}
            className="cursor-pointer hover:text-blue-600"
            onClick={() => setResult(entry.split(" = ")[1])}
          >
            {entry}
          </li>
        ))}
      </ul>
    </div>

    {/* Clear button */}
    <Button variant="outline" className={`flex justify-items-center text-white hover:bg-gray-500 border border-gray-300  ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900" }` }
     onClick={clear}>
      {labels[language].clear}
    </Button>
  </CardContent>
</Card>
</div>
  )
}
