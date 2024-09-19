"use client";
import { useState, ChangeEvent } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

export default function TipCalculator() {
  // State variables to manage the input and calculated values
  const [billAmount, setBillAmount] = useState<number | null>(null); // Stores the total bill amount
  const [tipPercentage, setTipPercentage] = useState<number | null>(null); // Stores the tip percentage
  const [people, setPeople] = useState<number | null>(null); // Stores the number of people to split the bill
  const [tipAmount, setTipAmount] = useState<number>(0); // Stores the total tip amount
  const [totalAmount, setTotalAmount] = useState<number>(0); // Stores the total amount including the tip
  const [tipPerPerson, setTipPerPerson] = useState<number>(0); // Stores the tip amount per person
  const [totalPerPerson, setTotalPerPerson] = useState<number>(0); // Stores the total amount per person

  // Event handler for updating bill amount
  const handleBillAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setBillAmount(parseFloat(e.target.value));
  };

  // Event handler for updating tip percentage
  const handleTipPercentageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTipPercentage(parseFloat(e.target.value));
  };

  // Event handler for updating number of people
  const handlePeopleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPeople(parseFloat(e.target.value));
  };

  // Function to calculate the tip and total amounts based on the inputs
  const calculateTip = (): void => {
    if (billAmount !== null && tipPercentage !== null && people !== null && people > 0) {
      const tip = billAmount * (tipPercentage / 100); // Calculate the tip amount
      const total = billAmount + tip; // Calculate the total amount
      setTipAmount(tip);
      setTotalAmount(total);
      setTipPerPerson(tip / people); // Calculate the tip amount per person
      setTotalPerPerson(total / people); // Calculate the total amount per person
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-700 to-teal-900 dark:bg-gray-900">
      <Card className="w-full max-w-md bg-transparent border border-gray-300 rounded-lg shadow-lg bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}>
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold text-black dark:text-white font-serif  text-center">
            Tip Calculator
          </CardTitle>
          <CardDescription className="text-white mt-6 font-serif">
            Enter the bill amount, tip percentage, and number of people to calculate the tip and total per person.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 bg-black bg-opacity-65 rounded-xl p-4 overflow-y-auto">
          {/* Input for bill amount */}
          <div className="grid gap-2 text-white">
            <Label htmlFor="bill-amount" className="font-bold text-sm">Bill Amount</Label>
            <Input
              id="bill-amount"
              type="number"
              placeholder="Enter bill amount"
              value={billAmount !== null ? billAmount : ""}
              onChange={handleBillAmountChange}
              className="border border-gray-200 rounded-md p-2"
            />
          </div>
          {/* Input for tip percentage */}
          <div className="grid gap-2 text-white">
            <Label htmlFor="tip-percentage" className="font-bold text-sm">Tip Percentage</Label>
            <Input
              id="tip-percentage"
              type="number"
              placeholder="Enter tip percentage"
              value={tipPercentage !== null ? tipPercentage : ""}
              onChange={handleTipPercentageChange}
              className="border border-gray-300 rounded-md p-2 "
            />
          </div>
          {/* Input for number of people */}
          <div className="grid gap-2 text-white">
            <Label htmlFor="people" className="font-bold text-sm">Number of People</Label>
            <Input
              id="people"
              type="number"
              placeholder="Enter number of people"
              value={people !== null ? people : ""}
              onChange={handlePeopleChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          {/* Button to calculate tip */}
          <Button
            onClick={calculateTip}
            className="bg-gradient-to-r from-teal-400 to-teal-950 text-white font-semibold"
          >
            Calculate
          </Button>
          {/* Display the calculated values */}
          <div className="grid gap-2 mt-4">
            <div className="flex items-center justify-between p-2 text-white">
              <span className="font-semibold font-serif">Tip Amount:</span>
              <span className="font-normal">${tipAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-2 text-white">
              <span className="font-semibold font-serif">Tip Per Person:</span>
              <span className="font-normal">${tipPerPerson.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-2 text-white">
              <span className="font-semibold font-serif">Total Per Person:</span>
              <span className="font-normal">${totalPerPerson.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-4 text-white">
              <span className="font-extrabold font-serif text-2xl">Total Amount:</span>
              <span className="font-extrabold text-2xl">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
