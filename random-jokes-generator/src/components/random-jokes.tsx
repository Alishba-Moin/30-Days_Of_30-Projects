"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

// Joke Response Interface to type the joke response structure
interface JokeResponse {
  setup: string;
  punchline: string;
}

// Web Speech API function to speak the joke aloud
function speakJoke(joke: string) {
  const synth = window.speechSynthesis; // Get the SpeechSynthesis API
  const utterance = new SpeechSynthesisUtterance(joke); // Create an utterance object
  synth.speak(utterance); // Speak the joke
}

// Hardcoded joke categories (you can add more categories if needed)
const categories = ["Programming", "Dad Jokes"];

export default function RandomJokes() {
  // State to store the current joke, category, favorite jokes, and rating
  const [joke, setJoke] = useState<string>(""); // Stores the joke text
  const [category, setCategory] = useState("Programming"); // Selected category
  const [favorites, setFavorites] = useState<string[]>([]); // Array of favorite jokes
  const [rating, setRating] = useState<number>(0); // Rating value (1-5)

  // Fetch a new joke whenever the category changes
  useEffect(() => {
    fetchJokes(); // Calls the joke fetching function
  }, [category]); // Effect runs when 'category' changes

  // Function to fetch a joke based on the selected category
  async function fetchJokes(): Promise<void> {
    let url = "https://official-joke-api.appspot.com/random_joke"; // Default URL for General jokes
    if (category === "Programming") {
      url = "https://official-joke-api.appspot.com/jokes/programming/random"; // Programming jokes URL
    } else if (category === "Dad Jokes") {
      url = "https://official-joke-api.appspot.com/jokes/dad/random"; // Dad jokes URL
    }

    try {
      const response = await fetch(url); // Fetch the joke from API
      const data: JokeResponse[] = await response.json(); // Parse the response to JSON
      setJoke(`${data[0].setup} ${data[0].punchline}`); // Set the joke text combining setup and punchline
      setRating(0); // Reset rating when a new joke is fetched
    } catch (error) {
      console.log("Error fetching joke", error); // Log errors if fetch fails
      setJoke("Failed to fetch joke. Please try again later."); // Error message for the user
    }
  }

  // Function to add or remove a joke from the favorites list
  const toggleFavorite = () => {
    if (favorites.includes(joke)) {
      // If joke is already in favorites, remove it
      const updatedFavorites = favorites.filter(favJoke => favJoke !== joke); // Filter out the joke
      setFavorites(updatedFavorites); // Update the state with the new list
    } else {
      // If not in favorites, add the joke
      const updatedFavorites = [...favorites, joke]; // Add the current joke to the list
      setFavorites(updatedFavorites); // Update the state with the new list
    }
  };

  // Check if the current joke is in the favorites list
  const isFavorite = favorites.includes(joke);

  // Function to handle rating (1-5 stars)
  const handleRating = (rating: number) => {
    setRating(rating); // Update the state with the selected rating
    console.log(`Joke rated: ${rating} stars`); // Log the rating for debugging
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image for visual effect */}
        <img 
          src="https://plus.unsplash.com/premium_photo-1684979565684-e350fc89a29d?q=80&w=1486&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Background" 
          className="w-full h-full object-cover blur-md" 
        />
      </div>

      {/* Main content box */}
      <div className="relative z-10 bg-black shadow-lg rounded-xl p-4 mb-2 mt-2 max-w-md w-full">
        {/* Dropdown to select a joke category */}
        <label className="block text-lg font-semibold text-white mb-2 font-sans">
          Select a Joke Category
        </label>
        <div className="relative mb-6">
          {/* Dropdown for category selection */}
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)} // Change category when selected
            className="w-full bg-stone-100 p-3 rounded-lg text-gray-700 border border-gray-300  focus:border-orange-500 transition duration-300 ease-in-out"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Joke display and interaction section */}
        <div className="bg-white hover:bg-stone-200 rounded-2xl shadow-lg p-8 ">
          {/* Button to add/remove the joke to/from favorites */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={toggleFavorite} // Toggle favorite status when clicked
              className="flex items-center text-lg font-semibold text-gray-800 focus:outline-none bg-white"
              aria-label="Add to Favorites"
            >
              {/* Show heart icon based on favorite status */}
              {isFavorite ? "❤️" : "🤍"}
              <span className="ml-2">Add to Favorites</span>
            </Button>
          </div>

          {/* Joke header */}
          <h1 className="text-3xl font-extrabold mb-4 text-gray-800">
            😂 Random Joke 👈
          </h1>

          {/* Display the joke or loading message */}
          <div className="bg-gray-100 rounded-lg p-6 mb-6 text-gray-800 text-lg">
            {joke || "Loading..."} {/* Show joke or "Loading" when fetching */}
          </div>

          {/* Button to fetch a new joke */}
          <Button
            onClick={fetchJokes} // Fetch a new joke when clicked
            className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
          >
            😂 Get New Joke 😂
          </Button>

          {/* Button to listen to the joke using Web Speech API */}
          <Button
            onClick={() => speakJoke(joke)} // Speak the joke when clicked
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full mt-4"
          >
            🔊 Listen to Joke 🔊
          </Button>

          {/* Rating system for the joke */}
          <div className="mt-4">
            <span className="text-lg font-bold text-[#333]">Rate this joke:</span>
            <div className="flex space-x-2 mt-2">
              {/* Star rating system */}
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)} // Handle rating selection
                  className={`${
                    rating >= star ? "text-yellow-500" : "text-gray-300"
                  } text-2xl`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display saved favorite jokes */}
        {favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white font-sans">Favorites</h2>
            <ul className="bg-white rounded-lg shadow-lg p-4">
              {favorites.map((fav, index) => (
                <li key={index} className="mb-2">
                  {fav} {/* Display each favorite joke */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
