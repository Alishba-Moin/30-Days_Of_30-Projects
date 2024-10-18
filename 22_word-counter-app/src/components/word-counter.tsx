"use client"; // Enables client-side rendering for this component
import React, { useState, ChangeEvent } from "react"; // Import React hooks
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // Import custom Card components
import { Textarea } from "@/components/ui/textarea"; // Import custom Textarea component
import { Button } from "@/components/ui/button"; // Import custom Button component

export default function WordCounter() {
  // State to manage the input text
  const [text, setText] = useState<string>("");

  // Function to handle text input changes
  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // Function to clear the input text
  const clearText = () => {
    setText("");
  };

  // Calculate word count
  const wordCount = text.trim().split(/\s+/).filter((word) => word).length;

  // Calculate character count 
  const charCount = text.length;

  // Calculate sentence and paragraph count
  const sentenceCount = text.split(/[.!?]/).filter((s) => s.trim()).length;
  const paragraphCount = text.split(/\n+/).filter((p) => p.trim()).length;

  // Estimate reading time (assuming 200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);

  // Calculate grade level readability (using a simple formula)
  const gradeLevel = Math.round(0.39 * (wordCount / sentenceCount) + 11.8 * (charCount / wordCount) - 15.59) || 0;

  // JSX return statement rendering the Word Counter UI
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
    <Card className="w-11/12 max-w-4xl p-6 flex">
      {/* Left side: Text input area */}
      <div className="w-1/2 pr-6">
        <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-800 tracking-tight leading-snug">
  Enter or Paste Your Text
</CardTitle>
          <CardDescription className="text-lg font-normal">Analyze your text in real-time.</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 space-y-4">
          <Textarea
            id="text-input"
            placeholder="Enter your text here..."
            className="h-64 resize-none"
            value={text}
            onChange={handleTextChange}
          />
          <Button onClick={clearText} className="w-full font-bold bg-gray-700">
            Clear Text
          </Button>
        </CardContent>
      </div>

      {/* Right side: Analysis stats */}
<div className="w-1/2 p-4 space-y-4 bg-gray-700 rounded-xl ">
  <div className="grid grid-cols-2 gap-4">
    {/* Word Count */}
    <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold">Words</h3>
      <p className="text-2xl font-bold">{wordCount}</p>
    </div>

    {/* Character Count */}
    <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold">Characters</h3>
      <p className="text-2xl font-bold">{charCount}</p>
    </div>

    {/* Sentence Count */}
    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold">Sentences</h3>
      <p className="text-2xl font-bold">{sentenceCount}</p>
    </div>

    {/* Paragraph Count */}
    <div className="bg-purple-100 text-purple-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold">Paragraphs</h3>
      <p className="text-2xl font-bold">{paragraphCount}</p>
    </div>

    {/* Reading Time */}
    <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold">Reading Time</h3>
      <p className="text-2xl font-bold">{readingTime} min</p>
    </div>

    {/* Grade Level */}
    <div className="bg-indigo-100 text-indigo-800 p-4 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold">Grade Level</h3>
      <p className="text-2xl font-bold">{gradeLevel}</p>
    </div>
  </div>
</div>
    </Card>
  </div>
  );
}
