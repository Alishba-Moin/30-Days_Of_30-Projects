"use client"; 
import { useState, ChangeEvent, FormEvent } from "react"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { CloudIcon, MapPinIcon, ThermometerIcon, XCircleIcon } from "lucide-react";

interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
  }
export default function WeatherWidget(){
const [location, setLocation] = useState<string>("");
const [weather, setWeather] = useState<WeatherData | null>(null);
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState<boolean>()

  // Function to handle the search form submission
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location."); // Set error message if location input is empty
      setWeather(null); // Clear previous weather data
      return;
    }
    setIsLoading(true); // Set loading state to true
  setError(null); // Clear any previous error messages

  try {
    // Fetch weather data from the weather API
    const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key= ${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
    );
    if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json()
      const WeatherData: WeatherData  = {
        temperature: data.current.temp_c, // Get temperature in Celsius
        description: data.current.condition.text,  // Get weather description
        location: data.location.name, // Get location name
        unit: "C" // Unit for temperature
      };
      setWeather(WeatherData)
  }catch(error){
  console.error("Error fetching weather data:", error);
  setError("City not found. Please try again."); // Set error message
  setWeather(null); // Clear previous weather data
  }finally {
    setIsLoading(false)
  }
};
function getTemperatureMessage(temperature: number, unit: string): string {
  if (unit === "C") {
      if (temperature < 0) {
          return `❄️ It's freezing at ${temperature}°C. Stay warm and cozy!`;
      } else if (temperature < 10) {
          return `🧥 It's quite cold at ${temperature}°C. Wear a warm coat!`;
      } else if (temperature < 20) {
          return `🍂 It's ${temperature}°C. A light jacket should be enough!`;
      } else if (temperature < 30) {
          return `🌞 It's ${temperature}°C. Nice weather for being outside!`;
      } else {
          return `🔥 It's very hot at ${temperature}°C. Keep cool and drink water!`;
      }
  } else {
      // Placeholder for other temperature units (e.g., Fahrenheit)
      return `${temperature}°${unit} – Have a great day!`;
  }
}
  // Function to get a weather message based on the weather description
  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase().trim()) {
        case "sunny":
            return "☀️ It's a sunny day! Great for going outside!";
        case "partly cloudy":
            return "⛅ A little cloudy but still sunny. Enjoy the nice weather!";
        case "cloudy":
            return "🌥️ It's cloudy today. Maybe rain will come later.";
        case "overcast":
            return "☁️ The sky is fully cloudy. A calm day to relax indoors.";
        case "rain":
            return "🌧️ It's raining! Don't forget your umbrella!";
        case "thunderstorm":
            return "⛈️ Thunderstorm coming! Stay safe inside!";
        case "snow":
            return "❄️ It's snowing! Time for warm clothes and hot drinks!";
        case "mist":
            return "🌫️ It's misty outside. Everything looks soft and quiet.";
        case "fog":
            return "🌁 Foggy weather! Be careful if you're going out.";
        default:
            return `Today's weather is ${description}. Have a good day!`;
    }
}

  // Function to get a location message based on the current time
function getLocationMessage(location: string): string {
    const currentHours = new Date().getHours();
    const isNight = currentHours >= 18 || currentHours <= 6; // Determine if it's night time

    return `${location} looks ${isNight ? "calm at night" : "bright during the day"}.`}

 // JSX return statement rendering the weather widget UI
 return (
  <div className="flex justify-center items-center min-h-screen bg-black">
{/* Main Weather Card */}
<Card className="bg-gray-500 shadow-lg rounded-lg p-8 max-w-lg w-full">
  <CardHeader className="text-center">
    <CardTitle className="text-3xl font-bold text-white font-serif mb-6">Weather Widget App</CardTitle>
    <CardDescription className="text-lg text-white font-serif">
      Enter a city below to find its current weather conditions.
    </CardDescription>
  </CardHeader>
    <CardContent>
      {/* Form */}
      <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="City name"
          value={location}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
          className="flex-1 bg-white"
        />
        <Button
          type="submit"
          className={`px-4 py-2 rounded-lg animate-pulse ${
            isLoading ? "bg-gray-400" : "bg-black hover:bg-zinc-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="flex items-center bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          <XCircleIcon className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Weather Data Display */}
      {weather && (
        <div className="grid grid-cols-1 gap-4">
          {/* Temperature */}
          <div className="bg-blue-100 p-4 rounded-lg flex items-center">
            <ThermometerIcon className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-lg font-medium text-gray-800">
              {getTemperatureMessage(weather.temperature, weather.unit)}
            </span>
          </div>

          {/* Description */}
          <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
            <CloudIcon className="w-6 h-6 text-yellow-600 mr-2" />
            <span className="text-lg font-medium text-gray-800">
              {getWeatherMessage(weather.description)}
            </span>
          </div>

          {/* Location */}
          <div className="bg-green-100 p-4 rounded-lg flex items-center">
            <MapPinIcon className="w-6 h-6 text-green-600 mr-2" />
            <span className="text-lg font-medium text-gray-800">
              {getLocationMessage(weather.location)}
            </span>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
</div>
);
} 
