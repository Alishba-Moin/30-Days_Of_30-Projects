"use client"; // Enables client-side rendering for this component

import { useState, ChangeEvent, useEffect } from "react"; // Import React hooks
import { Input } from "@/components/ui/input"; // Import custom Input component
import { Button } from "@/components/ui/button"; // Import custom Button component
import { CalendarIcon, StarIcon } from "lucide-react"; // Import icons from lucide-react
import Image from "next/image"; // Import Next.js Image component
import ClipLoader from "react-spinners/ClipLoader";
import { HeartIcon, Trash } from "lucide-react"; // Import heart icon from lucide-react

// Define the MovieDetails type
type MovieDetails = {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  Released: string;
};

export default function MovieSearch() {
  // -------------------
  // State Declarations
  // -------------------

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<MovieDetails[]>([]); 
  const [showHistory, setShowHistory] = useState<boolean>(false); 

  // -------------------
  // useEffect Hooks
  // -------------------

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    const storedSearchHistory = localStorage.getItem("searchHistory");
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // -------------------
  // Handler Functions
  // -------------------

  const handleSearch = async (): Promise<void> => {
    if (!searchTerm.trim()) {
      setError("Please enter a movie title.");
      return;
    }

    setLoading(true);
    setError(null);
    setMovieDetails(null);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.Response === "False") {
        throw new Error(data.Error);
      }

      setMovieDetails(data);

      if (!searchHistory.includes(searchTerm)) {
        setSearchHistory((prevHistory) => [...prevHistory, searchTerm]);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setShowHistory(true); // Show history when typing
  };

  const toggleFavorite = (movie: MovieDetails) => {
    if (favorites.find((fav) => fav.Title === movie.Title)) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.Title !== movie.Title)
      );
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, movie]);
    }
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    handleSearch()
  };

  const handleDeleteHistory = (index: number) => {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1); // Remove the item at the specified index
    setSearchHistory(updatedHistory); // Update the state with the new history
  };
  

  // -------------------
  // JSX Return Statement
  // -------------------

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-rose-500 to-teal-600 p-4">
      <div className="w-full max-w-lg p-8 bg-zinc-200 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold mb-1 text-center text-rose-600">Movie Search</h1>
        <p className="mb-6 text-center font-bold">
          Search for any movie and display its details.
        </p>

        {/* Search Input and Button */}
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Enter a movie title..."
            value={searchTerm}
            onChange={handleChange}
            className="flex-1 mr-2 px-3 py-2 border-1 rounded-md text-sm"
          />
          <Button
            onClick={handleSearch}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-400"
          >
            Search
          </Button>
        </div>
        {/* Loading Spinner */}
      {loading && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="flex flex-col items-center">
      <ClipLoader className="w-12 h-12 text-teal-600 animate-spin" />
      <p className="mt-2 text-white font-semibold">Loading, please wait...</p>
    </div>
  </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center mb-4 font-semibold">
            {error}. Please try searching for another movie.
          </div>    
        )}

        {/* Movie Details */}
        {movieDetails && (
          <div className="flex flex-col items-center">
            <Button
              onClick={() => toggleFavorite(movieDetails)}
              className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-lg z-10"
            >
              <HeartIcon
                className={`w-6 h-6 ${
                  favorites.find((fav) => fav.Title === movieDetails.Title)
                    ? "fill-red-500"
                    : "fill-none"
                }`}
                stroke="red"
              />
            </Button>

            <div className="w-full mb-4">
              <Image
                src={
                  movieDetails.Poster !== "N/A"
                    ? movieDetails.Poster
                    : "/placeholder.svg"
                }
                alt={movieDetails.Title}
                width={200}
                height={300}
                className="rounded-md shadow-md mx-auto"
                loading="lazy"
              />
            </div>

            <div className="w-full text-center">
              <h2 className="text-2xl font-bold mb-2">{movieDetails.Title}</h2>
              <p className="text-gray-600 mb-4 italic">{movieDetails.Plot}</p>

              <div className="flex justify-center items-center text-gray-500 mb-2">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span className="mr-4">{movieDetails.Year}</span>
                <StarIcon className="w-4 h-4 mr-1 fill-yellow-500" />
                <span>{movieDetails.imdbRating}</span>
              </div>

              <div className="flex justify-center items-center text-gray-500 mb-2">
                <span className="mr-4">
                  <strong>Genre:</strong> {movieDetails.Genre}
                </span>
              </div>

              <div className="flex justify-center items-center text-gray-500 mb-2">
                <span className="mr-4">
                  <strong>Director:</strong> {movieDetails.Director}
                </span>
              </div>

              <div className="flex justify-center items-center text-gray-500 mb-2">
                <span className="mr-4">
                  <strong>Actors:</strong> {movieDetails.Actors}
                </span>
              </div>

              <div className="flex justify-center items-center text-gray-500 mb-4">
                <span className="mr-4">
                  <strong>Runtime:</strong> {movieDetails.Runtime}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Search History */}
{searchHistory.length > 0 && (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">Search History:</h2>
    <div className="flex flex-wrap gap-2">
      {searchHistory.map((term, index) => (
        <div key={index} className="flex items-center">
          <Button
            onClick={() => handleHistoryClick(term)}
            variant="secondary"
            size="sm"
            className="flex items-center justify-center h-8 w-25"
          >
            {term}
          </Button>
          <Button
            onClick={() => handleDeleteHistory(index)} // Handle deletion
            variant="destructive"
            size="sm"
            className="ml-2 h-6 w-15" 
          >
            <Trash className="w-4 h-4"/>
          </Button>
        </div>
      ))}
    </div>
  </div>
)}

{/* Favorites Section */}
{favorites.length > 0 && (
  <div className="mt-6">
    <h2 className="text-xl font-bold mb-2">Favorites</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((movie, index) => (
        <div
          key={index}
          className="bg-rose-300 p-4 rounded-lg shadow-lg flex flex-col items-center"
        >
          <Image
            src={
              movie.Poster !== "N/A"
                ? movie.Poster
                : "/placeholder.svg"
            }
            alt={movie.Title}
            width={200}
            height={300}
            className="rounded-md"
          />
          <h3 className="text-lg font-bold mt-2">{movie.Title}</h3>
          <p className="text-gray-600">{movie.Year}</p>
          <Button
            onClick={() => toggleFavorite(movie)}
            className="mt-4 bg-red-500 text-white rounded-lg h-10 w-full" >
            {favorites.find((fav) => fav.Title === movie.Title)
              ? "Remove"
              : "Add"}
          </Button>
        </div>
      ))}
    </div>
  </div>
)}
  </div>
    </div>
  );
}
