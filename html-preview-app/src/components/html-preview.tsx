"use client"
import React, { useState, ChangeEvent } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { predefinedHtml } from "./predefined-html";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faClipboard, faSave, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function HTMLPreview() {
  // State variables for managing HTML input, preview, and error handling
  const [htmlCode, setHtmlCode] = useState<string>(""); // HTML code input
  const [previewHtml, setPreviewHtml] = useState<string>(""); // HTML code preview
  const [hasError, setHasError] = useState(false); // Error state if the HTML is invalid

  // Function to validate HTML by parsing it and checking for errors
  const validateHtml = (html: string): boolean => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.getElementsByTagName("parsererror").length === 0;
  };

  // Handle preview button click: validate HTML and update preview
  const handlePreview = () => {
    if (validateHtml(htmlCode)) {
      setPreviewHtml(htmlCode);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  // Paste predefined HTML code from `predefined-html.ts`
  const handlePasteHtml = (): void => {
    setHtmlCode(predefinedHtml);
  };

  // Handle textarea input changes and validate HTML on the fly
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setHtmlCode(e.target.value);
    if (validateHtml(e.target.value)) {
      setPreviewHtml(e.target.value);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  // Save the current HTML to localStorage
  const saveToLocal = () => {
    localStorage.setItem("savedHtml", htmlCode);
    alert("Html code saved!");
  };

  // Load saved HTML from localStorage
  const loadFromLocal = () => {
    const savedHtml = localStorage.getItem("savedHtml");
    if (savedHtml) {
      setHtmlCode(savedHtml);
      setPreviewHtml(savedHtml);
    }
  };

  // Reset the form by clearing the HTML input, preview, and error state
  const resetForm = () => {
    setHtmlCode("");
    setPreviewHtml("");
    setHasError(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen bg-blue-300 text-foreground">
      {/* Main Container */}
      <div className="w-full max-w-2xl p-6 rounded-lg shadow-lg bg-card ">
        {/* Title */}
        <h1 className="text-4xl font-extrabold font-serif mb-2 text-center">HTML Previewer</h1>
        <p className="text-gray-500 mb-2 text-center font-serif">
          Enter your HTML code and see the preview.
        </p>
        
        {/* Error Message for Invalid HTML */}
        {hasError && <p className="text-red-500">Invalid HTML code!</p>}

        {/* Buttons Section */}
        <div className="flex justify-between w-full max-w-2xl p-2">
          {/* Left Side Buttons: Paste HTML, Preview */}
          <div className="flex items-start gap-3">
            {/* Button to paste predefined HTML */}
            <Button
              onClick={handlePasteHtml}
              className="transition duration-300 ease-in-out transform bg-green-600 hover:scale-105 font-serif font-semibold rounded-2xl flex items-center space-x-1"
            >
              <FontAwesomeIcon icon={faClipboard} className="h-5 w-5 text-white hover:text-gray-900" />
              <span>Paste HTML</span>
            </Button>

            {/* Button to preview entered HTML */}
            <Button
              onClick={handlePreview}
              className="transition duration-300 ease-in-out transform bg-yellow-600 hover:scale-105 font-serif font-semibold rounded-2xl flex items-center space-x-1"
            >
              <FontAwesomeIcon icon={faEye} className="h-5 w-5 text-white hover:text-gray-900" />
              <span>Preview</span>
            </Button>
          </div>

          {/* Right Side Buttons: Save, Load, Reset */}
          <div className="flex items-start gap-3">
            {/* Save HTML code to localStorage */}
            <Button onClick={saveToLocal} className="flex items-center bg-black hover:bg-gray-800 text-white font-serif p-2 rounded">
              <FontAwesomeIcon icon={faSave} className="h-5 w-5 mr-1" />
              Save
            </Button>

            {/* Load HTML code from localStorage */}
            <Button onClick={loadFromLocal} className="flex items-center bg-black hover:bg-gray-800 text-white font-serif p-2 rounded">
              <FontAwesomeIcon icon={faUpload} className="h-5 w-5 mr-1" />
              Load
            </Button>

            {/* Reset form to clear HTML code and preview */}
            <Button onClick={resetForm} className="flex items-center bg-red-500 hover:bg-red-600 text-white font-serif p-2 rounded">
              <FontAwesomeIcon icon={faTrash} className="h-5 w-5 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Middle Section: HTML Input & Preview */}
        <div className="flex col-span-2 gap-4 w-full max-w-4xl">
          {/* Textarea for inputting HTML code */}
          <Textarea
            value={htmlCode}
            onChange={handleChange}
            placeholder="Enter your HTML code here..."
            className="p-4 rounded-xl bg-white text-foreground border border-stone-500 w-full"
            rows={8}
          />

          {/* Preview Section */}
          <div className="p-6 rounded-xl border border-gray-300 shadow-xl bg-white text-gray-800 mt-2 w-full">
            <div className="overflow-auto max-h-64" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      </div>
    </div>
  );
}
