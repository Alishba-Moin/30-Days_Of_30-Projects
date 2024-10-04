"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";
import { ArrowLeftRight  } from "lucide-react"; // Import Lucide Icons
import Image from "next/image";

// Define types for currency and exchange rates
type ExchangeRates = { 
  [key: string]: number 
};

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR";

// List of supported currencies
const supportedCurrencies: Currency[] = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "PKR"];

// Mapping of currencies to their respective flag images
const countryFlags: { [key in Currency]: string } = {
  USD: '/flags/us.svg', // United States
  EUR: '/flags/eu.svg', // European Union
  GBP: '/flags/uk.svg', // United Kingdom
  JPY: '/flags/jp.svg', // Japan
  AUD: '/flags/au.svg', // Australia
  CAD: '/flags/ca.svg', // Canada
  PKR: '/flags/pk.svg', // Pakistan
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
  const [targetCurrency, setTargetCurrency] = useState<Currency>("PKR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch exchange rates and historical data on component mount
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(parseFloat(e.target.value));
  };

  const handleSourceCurrencyChange = (value: Currency): void => {
    setSourceCurrency(value);
  };

  const handleTargetCurrencyChange = (value: Currency): void => {
    setTargetCurrency(value);
  };

  const calculateConvertedAmount = (): void => {
    if (sourceCurrency && targetCurrency && amount && exchangeRates) {
      const rate =
        sourceCurrency === "USD"
          ? exchangeRates[targetCurrency]
          : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];
      const result = amount * rate;
      setConvertedAmount(result.toFixed(2));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg p-2 bg-white rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-red-400">Currency Converter</CardTitle>
          <CardDescription className="text-gray-600 text-md">
            Convert between currencies with real-time exchange rates.
          </CardDescription>
        </CardHeader>
        <CardContent>
        {loading ? (
            <div className="flex justify-center gap-4">
              <ClipLoader className="w-6 h-6 text-blue-500" />
            </div>
             ) : error ? (
              <div className="text-red-600 text-center">{error}</div>
            ) : (
              <div className="bg-red-400 rounded-lg p-4 ">
          {/* Amount Input */}
          <div className="grid grid-cols-[1fr_auto] items-center">
            <Label htmlFor="amount" className="block text-md font-bold text-white">Amount:</Label>
            <Input
              id="amount"
              type="number"
              onChange={handleAmountChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-red-400 rounded-md shadow-sm"
              placeholder="Enter amount"
            />
          </div>

          {/* Source Currency Selector */}
          <div className="mt-3">
            <Label htmlFor="source-currency" className="block text-sm font-bold text-white">From:</Label>
            <Select onValueChange={handleSourceCurrencyChange} defaultValue="USD">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {supportedCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      <div className="flex items-center">
                        <Image
                          src={countryFlags[currency]}
                          alt={`${currency} Flag`}
                          width="20"
                          height="15"
                          className="mr-2"
                        />
                        {currency}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Exchange Arrow */}
          <div className="flex flex-col items-center mt-6">
            <ArrowLeftRight  className="text-4xl text-white animate-pulse mb-2" />
          </div>

          {/* Target Currency Selector */}
          <div className="mb-4">
            <Label htmlFor="target-currency" className="block text-md font-bold text-white">To:</Label>
            <Select onValueChange={handleTargetCurrencyChange} defaultValue="PKR">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {supportedCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      <div className="flex items-center">
                        <Image
                          src={countryFlags[currency]}
                          alt={`${currency} Flag`}
                          width="20"
                          height="15"
                          className="mr-2"
                        />
                        {currency}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          </div>
            )}
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button
            onClick={calculateConvertedAmount}
            className="w-full bg-gradient-to-r from-red-400 to-yellow-400 text-white  hover:to-yellow-400"
          >
            Convert

          </Button>
            <div className="mt-4 text-lg font-bold text-gray-800">
              Converted Amount: <span className="text-yellow-600">{convertedAmount}</span> {targetCurrency}
              </div>
        </CardFooter>
      </Card>

    </div>
  );
}
