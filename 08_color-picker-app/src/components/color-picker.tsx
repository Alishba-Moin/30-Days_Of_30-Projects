"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardTitle, CardDescription } from "./ui/card";

const ColorPicker = () => {
  const [color, setColor] = useState<string>("#000000");
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [startColor, setStartColor] = useState("#ff0000");
  const [endColor, setEndColor] = useState("#0000ff");
  const [rangeCount, setRangeCount] = useState(5);
  const [colorRange, setColorRange] = useState<string[]>([]);

  // Color Picker Handlers
  const handleChangeColor = (e: ChangeEvent<HTMLInputElement>): void => {
    setColor(e.target.value);
  };

  const handleHexInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputColor = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(inputColor)) {
      setColor(inputColor);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    alert("Copied to Clipboard!");
  };

  const resetColor = () => {
    setColor("#000000");
  };

  const saveColor = () => {
    setSavedColors(prevColors => [...prevColors, color]);
  };

  // Color Range Picker Handlers
  const handleStartColorChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setStartColor(e.target.value);
  };

  const handleEndColorChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEndColor(e.target.value);
  };

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRangeCount(Number(e.target.value));
  };

  const generateColorRange = () => {
    const startRGB = hexToRgb(startColor);
    const endRGB = hexToRgb(endColor);
    const rangeColors = [];

    for (let i = 0; i < rangeCount; i++) {
      const ratio = i / (rangeCount - 1);
      const color = interpolateColor(startRGB, endRGB, ratio);
      rangeColors.push(rgbToHex(color));
    }

    setColorRange(rangeColors);
  };

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const rgbToHex = ([r, g, b]: number[]): string => {
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
  };

  const interpolateColor = (start: number[], end: number[], ratio: number): number[] => {
    return start.map((start, i) => Math.round(start + (end[i] - start) * ratio));
  };

  const copyAllColors = () => {
    navigator.clipboard.writeText(colorRange.join(", "));
    alert("All colors copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
      <div className="flex flex-col md:flex-row w-full max-w-screen-lg mx-auto gap-8 p-2">
        <div className="flex-1">
          <Card className="p-4">
            <div className="text-center space-y-2 text-3xl font-extrabold font-serif">
              <CardTitle>Color Picker</CardTitle>
              <CardDescription>Select a color and copy the hex and RGB values.</CardDescription>
            </div>
            <div className="text-center mb-4">
              <div className="w-full h-48 rounded-lg border-4 border-gray-400" style={{ backgroundColor: color }} />
              <div className="text-center space-y-2 mt-4">
                <div className="text-2xl font-bold">{color}</div>
                <div className="text-gray-500 text-lg">
                  RGB: {parseInt(color.slice(1, 3), 16)}, 
                       {parseInt(color.slice(3, 5), 16)}, 
                       {parseInt(color.slice(5, 7), 16)}
                </div>
              </div>
            </div>
            <div className="grid gap-2 text-center">
              <Input
                type="color"
                value={color}
                onChange={handleChangeColor}
                className="w-full h-16 border-0 rounded-lg cursor-pointer"
              />
              <Input
                type="text"  
                placeholder="Enter hex code (e.g., #FF5733)"
                onChange={handleHexInput}
                value={color}
                className="w-full"
              />
              <Button 
                onClick={resetColor} 
                variant="outline" 
                className="w-full bg-gradient-to-r from-red-400 to-orange-500 text-white">
                Reset
              </Button>
              <Button 
                onClick={saveColor} 
                className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white">
                Save Color to Palette
              </Button>
              <Button 
                onClick={copyToClipboard} 
                className="w-full bg-gradient-to-r from-violet-400 to-purple-500 text-white">
                Copy Hex to Clipboard
              </Button>
            </div>
          </Card>
        </div>
        {/* Color Range Picker Section */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4 font-serif text-slate-100">Color Range Picker</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="font-semibold font-serif text-slate-100">Start Color</p>
              <Input
                type="color"
                value={startColor}
                onChange={handleStartColorChange}
                className="w-full h-16 p-0 border-0 rounded-lg cursor-pointer"
              />
              <p>{startColor}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold font-serif text-slate-100">End Color</p>
              <Input
                type="color"
                value={endColor}
                onChange={handleEndColorChange}
                className="w-full h-16 p-0 border-0 rounded-lg cursor-pointer"
              />
              <p>{endColor}</p>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="rangeCount" className="font-semibold font-serif text-slate-100">Number of Colors to Generate:</label>
            <input
              type="number"
              id="rangeCount"
              value={rangeCount}
              min="2"
              max="10"
              onChange={handleRangeChange}
              className="ml-4 w-16 text-center border-2 border-gray-300 rounded-lg"
            />
          </div>

          <Button
            onClick={generateColorRange}
            className="mt-4 bg-gradient-to-r from-orange-800 to-amber-700 text-white font-semibold py-2 px-4 rounded-md">
            Generate Range
          </Button>

          {colorRange.length > 0 && (
            <div className="mt-8 w-full max-w-lg h-16 rounded-lg shadow-md bg-gradient-to-r" style={{ background: `linear-gradient(to right, ${startColor}, ${endColor})` }} />
          )}

          <div className="grid grid-cols-5 gap-4 mt-8">
            {colorRange.map((color, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-md border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {colorRange.length > 0 && (
            <Button
              onClick={copyAllColors}
              className="mt-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold py-2 px-4 rounded-md"
            >
              Copy All Colors
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
