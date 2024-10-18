"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image";

interface Recipe {
  uri: string;
  label: string;
  image: string;
  ingredientLines: string[];
  url: string;
}

const mealCategories = [
  { label: "Breakfast", type: "breakfast" },
  { label: "Lunch", type: "lunch" },
  { label: "Dinner", type: "dinner" },
  { label: "Snacks", type: "snacks" },
  { label: "Desserts", type: "dessert" },
];

export default function RecipeSearch() {
  const [query, setQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false); // Tracks if "See All" is clicked

  // Helper function to fetch recipes
  const fetchRecipes = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.edamam.com/search?q=${query}&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}`
      );
      const data = await response.json();
      return data.hits.map((hit: { recipe: Recipe }) => hit.recipe);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  };

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSearched(true);
    setRecipes([]); // Clear previous recipes
    const fetchedRecipes = await fetchRecipes(query);
    setRecipes(fetchedRecipes);
    setLoading(false);
  };

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    setShowAll(false); // Reset the "See All" state
    const categoryRecipes = await fetchRecipes(category);
    setRecommendedRecipes(categoryRecipes.slice(0, 3)); // Show only 3 initially
    setAllRecipes(categoryRecipes); // Store all recipes for "See All"
    setLoading(false);
  };

  const handleSeeAll = () => {
    setShowAll(true);
  };

  useEffect(() => {
    const fetchAllRecommendedRecipes = async () => {
      const promises = mealCategories.map((category) =>
        fetchRecipes(category.type)
      );
      const results = await Promise.all(promises);

      const selectedRecipes = results
        .map((recipes) => recipes[Math.floor(Math.random() * recipes.length)])
        .filter((recipe) => recipe);

      setRecommendedRecipes(selectedRecipes);
    };

    fetchAllRecommendedRecipes();
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-4 md:p-6 bg-white">
      {/* Header Section */}
      <header className="flex flex-col items-center mb-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold text-center text-teal-600">
          Recipe Search App
        </h1>
        <p className="text-lg mb-4 text-center text-gray-600">
          What would you like to cook today?
        </p>

        {/* Search Form */}
        <form
          className="relative w-full max-w-md mb-6"
          onSubmit={handleSearch}
        >
          <Input
            type="search"
            placeholder="Search by recipe..."
            className="pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <SearchIcon className="w-5 h-5" />
          </Button>
        </form>
      </header>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <ClipLoader size={50} color="#38B2AC" />
          <p className="ml-4 text-teal-500">Loading recipes...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {searched && recipes.length === 0 && (
            <p className="text-center text-gray-600">
              No recipes found. Try searching with different ingredients.
            </p>
          )}

          {recipes.map((recipe) => (
            <Card
              key={recipe.uri}
              className="group relative border rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <Image
                src={recipe.image}
                alt={recipe.label}
                width={400}
                height={300}
                className="rounded-t-lg object-cover w-full h-48 group-hover:opacity-50 transition-opacity"
              />
              <CardContent className="p-4">
                <h2 className="text-lg font-bold mb-2">{recipe.label}</h2>
                <p className="line-clamp-2">
                  {recipe.ingredientLines.join(", ")}
                </p>
              </CardContent>
              <Link href={recipe.url} className="absolute inset-0" prefetch={false}>
                <span className="sr-only">View Recipe</span>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {/* Meal Categories Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-teal-600">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
          {mealCategories.map((category) => (
            <div
              key={category.type}
              className="p-4 cursor-pointer bg-slate-200 rounded-xl hover:bg-teal-600 hover:text-white transition"
              onClick={() => handleCategoryClick(category.type)}
            >
              <Image
                src={`/icons/${category.type}.svg`}
                alt={category.label}
                width={64}
                height={64}
                className="mx-auto"
              />
              <h3 className="text-center mt-2">{category.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Recipes Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-teal-600">Recommended Recipes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {(showAll ? allRecipes : recommendedRecipes).map((recipe) => (
            <Card
              key={recipe.uri}
              className="group relative border rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              <Image
                src={recipe.image}
                alt={recipe.label}
                width={400}
                height={300}
                className="rounded-t-lg object-cover w-full h-48"
              />
              <CardContent className="p-4">
                <h2 className="text-lg font-bold">{recipe.label}</h2>
              </CardContent>
              <Link href={recipe.url} className="absolute inset-0" prefetch={false}>
                <span className="sr-only">View Recipe</span>
              </Link>
            </Card>
          ))}
        </div>
        {recommendedRecipes.length > 0 && !showAll && (
          <Button onClick={handleSeeAll} className="mt-4 bg-teal-600 text-white hover:bg-white hover:text-teal-600">
            See All
          </Button>
        )}
      </section>
    </div>
  );
}
