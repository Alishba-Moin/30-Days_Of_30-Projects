"use client";

import { useEffect, useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClipLoader from "react-spinners/ClipLoader";
import React from "react";
import { getDayOfYear } from "date-fns";
import { Plus, Save, Download, RefreshCw } from 'lucide-react'; 

// Type Definitions for TypeScript
type Meme = {
  id: string;
  name: string;
  url: string;
};

type Position = {
  x: number;
  y: number;
};

type TextBox = {
  id: string;
  text: string;
  position: Position;
  style: TextStyle;
};

type TextStyle = {
  color: string;
  fontSize: number;
  fontWeight: string;
};

export default function MemeGenerator() {
  const [memes, setMemes] = useState<Meme[]>([]); // All fetched memes
  const [visibleMemes, setVisibleMemes] = useState<Meme[]>([]); // Memes currently visible in the carousel
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null); // Currently selected meme for customization
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]); // Array of text boxes added to the meme
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching memes
  const [moreLoading, setMoreLoading] = useState<boolean>(false); // Loading state for "Load More" functionality
  const memeRef = useRef<HTMLDivElement>(null); // Reference to the meme container for downloading
  const memesPerLoad = 4; // Number of memes to load initially and on each "Load More"

  // useEffect Hook to Fetch Memes from API on Component Mount
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch("https://api.imgflip.com/get_memes"); // Fetch memes from Imgflip API
        const data = await response.json(); 
        const fetchedMemes: Meme[] = data.data.memes; 
        setMemes(fetchedMemes); 
        setVisibleMemes(fetchedMemes.slice(0, memesPerLoad)); // Set initial visible memes

        // Determine Meme of the Day based on the current day of the year
        const dayOfYear = getDayOfYear(new Date());
        const memeOfTheDay = fetchedMemes[dayOfYear % fetchedMemes.length];
        setSelectedMeme(memeOfTheDay); // Set the selected meme to Meme of the Day
      } catch (error) {
        console.error("Error fetching memes:", error); 
      } finally {
        setLoading(false);
      }
    };
    fetchMemes(); 
  }, []);

  // Function to Load More Memes into the Carousel
  const loadMoreMemes = () => {
    setMoreLoading(true); 
    const newVisibleMemes = memes.slice(0, visibleMemes.length + memesPerLoad); 
    setVisibleMemes(newVisibleMemes); // Update visible memes state
    setMoreLoading(false); 
  };

  // Function to Add a New Text Box to the Meme
  const addTextBox = () => {
    const newTextBox: TextBox = {
      id: Date.now().toString(), 
      text: "",
      position: { 
        x: 50, 
        y: 50 
      }, 
      style: { 
        color: "black", 
        fontSize: 24, 
        fontWeight: "bold" 
      }, 
    };
    setTextBoxes([...textBoxes, newTextBox]); // Add new text box to state
  };

  // Function to Remove a Text Box by ID
  const removeTextBox = (id: string) => {
    setTextBoxes(textBoxes.filter((tb) => tb.id !== id)); // Filter out the text box with the specified ID
  };

  // Function to Update the Content of a Text Box
  const updateTextBox = (id: string, newText: string) => {
    setTextBoxes(
      textBoxes.map((tb) =>
        tb.id === id ? { ...tb, text: newText } : tb
      )
    ); 
  };

  // Function to Update the Style of a Text Box
  const updateTextBoxStyle = (
    id: string,
    newStyle: Partial<TextStyle>
  ) => {
    setTextBoxes(
      textBoxes.map((tb) =>
        tb.id === id ? { ...tb, style: { ...tb.style, ...newStyle } } : tb
      )
    ); 
  };

  // Function to Handle Meme Download as an Image
  const handleDownload = async (): Promise<void> => {
    if (memeRef.current) { 
      try {
        const canvas = await html2canvas(memeRef.current, {
          useCORS: true, 
        }); 
        const link = document.createElement("a"); 
        link.href = canvas.toDataURL("image/png");
        link.download = "meme.png";
        link.click(); 
      } catch (error) {
        console.error("Error downloading meme:", error); 
      }
    }
  };

  // Function to Save Current Meme as a Draft in localStorage
  const saveDraft = () => {
    if (selectedMeme) { 
      const draft = {
        meme: selectedMeme,
        textBoxes,
        timestamp: new Date().toISOString(), 
      };
      const existingDrafts =
        JSON.parse(localStorage.getItem("memeDrafts") || "[]"); 
      localStorage.setItem(
        "memeDrafts",
        JSON.stringify([...existingDrafts, draft]) // Save new draft along with existing drafts
      );
      alert("Draft saved successfully!"); 
    }
  };

  // Function to Load the Latest Draft from localStorage
  const loadDrafts = () => {
    const existingDrafts: any[] =
      JSON.parse(localStorage.getItem("memeDrafts") || "[]"); 
    if (existingDrafts.length > 0) {
      const latestDraft = existingDrafts[existingDrafts.length - 1]; 
      setSelectedMeme(latestDraft.meme); 
      setTextBoxes(latestDraft.textBoxes); 
      alert("Latest draft loaded!"); 
    } else {
      alert("No drafts found."); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold text-violet-500 drop-shadow-lg">
              Meme Generator
            </h1>
            <p className="text-lg font-semibold text-gray-200">
              Create custom memes with our easy-to-use generator.
            </p>
          </div>

          {/* Loading Spinner */}
          {loading ? (
            <ClipLoader className="w-20 h-20 text-blue-500 " /> 
          ) : (
            <>
              {/* Meme of the Day Section */}
              <div className="w-full flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Meme of the Day</h2>
                <Card
                  className="bg-violet-500 hover:bg-violet-400 text-gray-900 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 w-80 h-75 flex flex-col items-center justify-center mx-auto relative"
                  onClick={() => setSelectedMeme(selectedMeme)}
                >
                  {selectedMeme ? (
                    <>
                      {/* Display Selected Meme Image */}
                      <Image
                        src={selectedMeme.url}
                        alt={selectedMeme.name}
                        width={500}
                        height={500}
                        className="object-cover w-full h-full"
                      />
                      {/* Display Meme Name */}
                      <p className="text-center mt-2">{selectedMeme.name}</p>
                    </>
                  ) : (
                    <p className="text-center">Click to see the Meme of the Day!</p> 
                  )}
                </Card>
              </div>

              {/* Meme Carousel Section */}
              <div className="w-full overflow-x-scroll whitespace-nowrap py-2">
                {visibleMemes.map((meme) => (
                  <Card
                    key={meme.id}
                    className="inline-block bg-muted rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 mx-2 bg-violet-500"
                    onClick={() => setSelectedMeme(meme)}
                  >
                    {/* Display Meme Image */}
                    <Image
                      src={meme.url}
                      alt={meme.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                    {/* Display Meme Name */}
                    <CardContent>
                      <p className="text-center">{meme.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Memes Button */}
              {visibleMemes.length < memes.length && (
                <Button
                  onClick={loadMoreMemes} 
                  className="mt-4 bg-violet-500 hover:bg-violet-400 text-gray-900 font-bold animate-pulse flex items-center justify-center gap-2"
                  disabled={moreLoading}
                >
                  {moreLoading ? (
                    <ClipLoader className="w-6 h-6 text-white " /> 
                  ) : (
                    <>
                      <Download className="w-5 h-5" /> 
                      Load More
                    </>
                  )}
                </Button>
              )}
            </>
          )}

          {/* Meme Customization Section */}
          {selectedMeme && (
            <Card className="w-full max-w-3xl bg-gray-800">
              <CardHeader>
                <CardTitle className="font-bold text-white">Customize Your Meme</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Meme Display Area */}
                <div
                  ref={memeRef} 
                  className="relative bg-muted rounded-lg overflow-hidden w-90 h-90"
                >
                  {/* Display Selected Meme Image */}
                  <Image
                    src={selectedMeme.url}
                    alt={selectedMeme.name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                  />

                  {/* Render Text Boxes */}
                  {textBoxes.map((textBox) => (
                    <Draggable
                      key={textBox.id}
                      position={textBox.position}
                      onStop={(e, data) => {
                        setTextBoxes(
                          textBoxes.map((tb) =>
                            tb.id === textBox.id
                              ? { ...tb, position: { x: data.x, y: data.y } }
                              : tb
                          )
                        );
                      }}
                    >
                      <div
                        className="absolute cursor-move flex items-center"
                        style={{
                          left: textBox.position.x,
                          top: textBox.position.y,
                        }}
                      >
                        {/* Text Input Field */}
                        <Textarea
                           id="meme-text"
                          placeholder="Enter your meme text"
                          value={textBox.text}
                          onChange={(e) =>
                            updateTextBox(textBox.id, e.target.value) 
                          }
                          style={{
                            color: textBox.style.color, 
                            fontSize: `${textBox.style.fontSize}px`, 
                            fontWeight: textBox.style.fontWeight, 
                            background: "transparent", 
                            border: "none", 
                            outline: "none", 
                            textAlign: "center", 
                          }}
                          className="text-lg font-bold bg-transparent"
                        />
                        {/* Remove Text Box Button */}
                        <Button
                          onClick={() => removeTextBox(textBox.id)} 
                          className="ml-2 text-red-500 text-sm"
                          title="Remove Text Box"
                        >
                          ✖
                        </Button>
                      </div>
                    </Draggable>
                  ))}
                </div>

                {/* Controls Section for Customization */}
                <div className="mt-6 space-y-4">
                  {/* Add Text Box Button */}
                  <Button
                    onClick={addTextBox} 
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> 
                    Add Text Box
                  </Button>

                  {/* Text Styling Options for Each Text Box */}
                  {textBoxes.map((textBox) => (
                    <div key={textBox.id} className="bg-gray-700 p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold mb-4 text-violet-500">Text Box Styling</h3>
                      <div className="flex flex-col space-y-4">
                        
                        {/* Color Picker for Text */}
                        <div className="flex items-center">
                          <Label htmlFor={`color-${textBox.id}`} className="w-32 text-gray-300">
                            Text Color
                          </Label>
                          <input
                            type="color"
                            id={`color-${textBox.id}`}
                            value={textBox.style.color}
                            onChange={(e) =>
                              updateTextBoxStyle(textBox.id, {
                                color: e.target.value,
                              })
                            }
                            className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer"
                          />
                        </div>

                        {/* Font Size Slider */}
                        <div className="flex items-center">
                          <Label htmlFor={`fontSize-${textBox.id}`} className="w-32 text-gray-300">
                            Font Size
                          </Label>
                          <div className="flex-1 flex items-center">
                            <input
                              type="range"
                              id={`fontSize-${textBox.id}`}
                              min="12"
                              max="72"
                              value={textBox.style.fontSize}
                              onChange={(e) =>
                                updateTextBoxStyle(textBox.id, {
                                  fontSize: parseInt(e.target.value), 
                                })
                              }
                              className="flex-1 mr-4 accent-violet-500" 
                            />
                            <span className="w-12 text-right text-gray-200">
                              {textBox.style.fontSize}px {/* Display current font size */}
                            </span>
                          </div>
                        </div>

                        {/* Font Weight Selector */}
                        <div className="flex items-center">
                          <Label htmlFor={`fontWeight-${textBox.id}`} className="w-32 text-gray-300">
                            Font Weight
                          </Label>
                          <select
                            id={`fontWeight-${textBox.id}`}
                            value={textBox.style.fontWeight}
                            onChange={(e) =>
                              updateTextBoxStyle(textBox.id, {
                                fontWeight: e.target.value, 
                              })
                            }
                            className="flex-1 bg-gray-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                          >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                            <option value="bolder">Bolder</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Save & Load Drafts Buttons */}
                  <div className="flex space-x-4">
                    {/* Save Draft Button */}
                    <Button
                      onClick={saveDraft} 
                      className="w-1/2 bg-violet-500 hover:bg-violet-400 text-white flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" /> 
                      Save Draft
                    </Button>
                    {/* Load Latest Draft Button */}
                    <Button
                      onClick={loadDrafts} 
                      className="w-1/2 bg-violet-500 hover:bg-violet-400 text-white flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" /> 
                      Load Latest Draft
                    </Button>
                  </div>

                  {/* Download Meme Button */}
                  <Button
                    onClick={handleDownload} 
                    className="bg-gray-700 hover:bg-gray-600 flex items-center justify-center gap-2 text-white px-4 py-2 rounded"
                  >
                    <Download className="w-5 h-5" /> 
                    Download Meme
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
