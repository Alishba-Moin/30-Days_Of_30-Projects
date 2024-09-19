"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeSlashIcon, ClipboardIcon, TrashIcon } from "@heroicons/react/24/solid"; 

export default function PasswordGenerator() {
  // State variables
  const [length, setLength] = useState<number>(16); // Password length
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true); // Include uppercase letters
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true); // Include lowercase letters
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true); // Include numbers
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true); // Include symbols
  const [password, setPassword] = useState<string>(""); // Generated password
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]); // History of generated passwords
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // Toggle for password visibility

  // Handle changes in password length slider
  const handleLengthChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLength(Number(e.target.value));
  };

  // Generate a random password based on selected options
  const GeneratePassword = (): void => {
    // Character sets
    const uppercasePassword = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercasePassword = "abcdefghijklmnopqrstuvwxyz";
    const numberPassword = "0123456789";
    const symbolPassword = "!@#$%^&*()_+[]{}|;:,.<>?";

    let AllChars = ""; // All characters to choose from
    if (includeUppercase) AllChars += uppercasePassword;
    if (includeLowercase) AllChars += lowercasePassword;
    if (includeNumbers) AllChars += numberPassword;
    if (includeSymbols) AllChars += symbolPassword;

    if (AllChars === "") {
      alert("Please select at least one character type."); // Alert if no character types are selected
      return;
    }

    let generatedPassword = ""; // Initialize generated password
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * AllChars.length);
      generatedPassword += AllChars[randomIndex]; // Add random character
    }

    // Update password state and history
    setPassword(generatedPassword);
    setPasswordHistory([...passwordHistory, generatedPassword]);
  };

  // Check the strength of the generated password
  const checkPasswordStrength = (password: string): string => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password)) strength++;

    // Return strength level based on score
    if (strength <= 2) return "Weak";
    if (strength === 3 || strength === 4) return "Moderate";
    return "Strong";
  };

  // Delete a password from history
  const handleDeletePassword = (indexToDelete: number) => {
    setPasswordHistory(passwordHistory.filter((_, idx) => idx !== indexToDelete));
  };

  // Copy the generated password to clipboard
  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(password).then(
      () => alert("Password copied to clipboard!"),
      () => alert("Failed to copy password to clipboard.")
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 ">
      <Card className="w-full max-w-md p-4 bg-black shadow-lg shadow-red-50 rounded-xl transform transition-transform duration-200 hover:scale-105">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-extrabold text-yellow-400">
            Password Generator
          </CardTitle>
          <CardDescription className="text-white text-lg">
            Create a secure password with just a few clicks.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mx-auto max-w-md space-y-6">
            {/* Password Display */}
            <div className="flex items-center space-x-2">
              <Input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                readOnly
                className="flex-1 border border-cyan-500 rounded-lg p-4 text-lg font-bold text-cyan-500"
              />
              <Button
                onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle password visibility
                className="p-2 bg-gray-200 hover:bg-gray-400 rounded-lg"
              >
                {isPasswordVisible ? (
                  <EyeSlashIcon className="h-6 w-6" />
                ) : (
                  <EyeIcon className="h-6 w-6" />
                )}
              </Button>
              <Button 
                onClick={copyToClipboard} // Copy password to clipboard
                className="p-2 bg-gray-200 hover:bg-gray-400 rounded-lg">
                <ClipboardIcon className="h-6 w-6" />
              </Button>
            </div>

            {/* Password Strength */}
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Strength: <span className="font-bold">{checkPasswordStrength(password)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className={`h-full rounded ${
                    checkPasswordStrength(password) === "Weak"
                      ? "bg-red-500"
                      : checkPasswordStrength(password) === "Moderate"
                      ? "bg-yellow-500"
                      : checkPasswordStrength(password) === "Strong"
                      ? "bg-green-500"
                      : ""
                  }`}
                  style={{
                    width: `${checkPasswordStrength(password)}%`, // Adjust the width based on strength
                  }}
                />
              </div>
            </div>

            {/* Password Length Slider */}
            <div className="space-y-4">
              <Label htmlFor="length" className="block text-white font-bold text-xl">
                Password Length: <span>{length}</span>
              </Label>
              <Input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={handleLengthChange} // Handle slider change
                className="w-full"
              />
            </div>

            {/* Character Types Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 font-bold">
                <input
                  id="uppercase"
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)} // Toggle uppercase option
                  className="w-6 h-6"
                />
                <label htmlFor="uppercase" className="text-yellow-500">ABC</label>
              </div>

              <div className="flex items-center space-x-2 font-bold">
                <input
                  id="lowercase"
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={() => setIncludeLowercase(!includeLowercase)} // Toggle lowercase option
                  className="w-6 h-6"
                />
                <label htmlFor="lowercase" className="text-yellow-500">abc</label>
              </div>

              <div className="flex items-center space-x-2 font-bold">
                <input
                  id="numbers"
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)} // Toggle numbers option
                  className="w-6 h-6"
                />
                <label htmlFor="numbers" className="text-yellow-500">123</label>
              </div>

              <div className="flex items-center space-x-2 font-bold">
                <input
                  id="symbols"
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={() => setIncludeSymbols(!includeSymbols)} // Toggle symbols option
                  className="w-6 h-6"
                />
                <label htmlFor="symbols" className="text-yellow-500">&#$</label>
              </div>
            </div>

            {/* Password History */}
            <div className="space-y-2">
              <Label className="text-xl font-bold text-white">Password History: </Label>
              <ul className="list-disc pl-4">
                {passwordHistory.map((pwd, idx) => (
                  <li key={idx} className="text-lg text-white flex items-center justify-between bg-red-500 p-3 rounded-lg mb-2">
                    <span>{pwd}</span>
                    <Button
                      onClick={() => handleDeletePassword(idx)} // Delete password from history
                      className="p-2 bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      <TrashIcon className="h-5 w-5 text-white" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={GeneratePassword} // Generate password
            className="w-full p-2 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-lg"
          >
            Generate Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
