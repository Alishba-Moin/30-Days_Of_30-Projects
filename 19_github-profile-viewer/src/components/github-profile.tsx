"use client";

import React, {useState} from "react";
import {Input} from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "../components/ui/card";
import {ExternalLinkIcon, ForkliftIcon, LocateIcon, RecycleIcon, StarIcon, UsersIcon, LanguagesIcon, Github} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import Link from "next/link";


type UserProfile = {
    login: string,
    avatar_url: string,
    html_url: string,
    bio: string,
    followers: number,
    following: number,
    location: string
}

type UserRepos = {
    language: string;
    id: number,
    name: string,
    html_url: string,
    description: string,
    stargazers_count: number,
    forks_count: number
}
export default function GithubViewer(){
      // State for storing user input, profile data, repositories data, loading state, and error state
    const [username, setUsername] = useState<string>("");
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userRepos, setUserRepos] = useState<UserRepos[]>([]);
    const [visibleCount, setVisibleCount] = useState(6); // Initially show 6 repositories
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean | null>(null);
  
       // Function to load more repositories when the button is clicked
    const loadMoreRepos = () => {
      setVisibleCount((prevCount) => prevCount + 6); // Increase count by 6 each time Load More is clicked
    };
      // Function to fetch user data from GitHub API
    const fetchUserData = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try{
            const ProfileResponse = await fetch (`https://api.github.com/users/${username}`)
            if(!ProfileResponse.ok){
                throw new Error("User not found")
            }
             const ProfileData = await ProfileResponse.json();

             const RepoResponse = await fetch (`https://api.github.com/users/${username}/repos`)
             if(!RepoResponse.ok){
                throw new Error("Repositories not found")
             }
             const RepoData = await RepoResponse.json();

             setUserProfile(ProfileData);
             setUserRepos(RepoData)
        }
        catch(error: any){
            setError(error.message)
        }
        finally{
            setLoading(false)
        }      
    }
      // Handle form submission to fetch user data
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        fetchUserData()
    }
    // JSX return statement rendering the GitHub Profile Viewer UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 py-8">
      <Card className="w-full max-w-3xl p-6 space-y-4 shadow-lg rounded-lg bg-white">
      <CardHeader className="text-center">
      <CardTitle className="text-4xl font-extrabold mb-2 flex items-center justify-center font-sans text-gray-800">
    <Github
     size={36}
     className="text-gray-800 mr-2" /> 
    GitHub Profile Viewer
</CardTitle>
    <CardDescription className="text-gray-600 font-mono font-semibold">
        Search a GitHub username to view profile and repositories, e.g: Alishba-Moin
    </CardDescription>
</CardHeader>

        {/* Form to input GitHub username */}
        <form onSubmit={handleSubmit} className="mb-8 px-6">
          <div className="flex items-center gap-4 ">
            <Input
              type="text"
              placeholder="Enter a GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-md rounded-md bg-gray-200 px-3 py-3 font-mono text-slate-500 placeholder-neutral-400 transition duration-300 ease-in"
            />
           
            <Button
              type="submit"
              disabled={loading}
              className="text-md mx-auto h-10 rounded-md bg-gray-50 px-4 font-medium text-blue-600 shadow-xl transition duration-300 ease-in hover:bg-blue-500 hover:text-blue-100"
            >
              {loading ? <ClipLoader className="w-4 h-4 animate-spin text-white" /> : "Search"}
            </Button>
          </div>
        </form>
        {/* Display error message if any */}
        {error && <p className="text-red-500 text-center font-bold">{error}</p>}
        {/* Display user profile and repositories if data is fetched */}
        {userProfile && (
          <div className="grid gap-8 px-6 py-4 text-md rounded-md font-mono bg-gray-200 text-slate-500 ">
            {/* User profile section */}
            <div className="grid md:grid-cols-[120px_1fr] gap-6">
              <Avatar className="w-[120px] h-[120px] mt-2 ring-[5px] ring-[#3b52d4]  rounded-full ">
                <AvatarImage src={userProfile.avatar_url} />
                <AvatarFallback>
                  {userProfile.login.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{userProfile.login}</h2>
                  <Link
                    href={userProfile.html_url}
                    target="_blank"
                    className="text-gray-900"
                    prefetch={false}
                  >
                    <ExternalLinkIcon className="w-6 h-6" />
                  </Link>
                </div>
                <p className="text-gray-600">{userProfile.bio}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-5 h-5 text-blue-500 " />
                    <span>{userProfile.followers} Followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-5 h-5 text-blue-500 " />
                    <span>{userProfile.following} Following</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LocateIcon className="w-5 h-5 text-blue-500 " />
                    <span>{userProfile.location || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* User repositories section */}
            <div className="grid gap-6">
            <h3 className="text-xl font-bold">Repositories</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Map through userRepos and display the visible ones */}
        {userRepos.slice(0, visibleCount).map((repo) => (
          <Card
            key={repo.id}
            className="shadow-lg rounded-lg bg-white border"
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <RecycleIcon className="w-6 h-6" />
                <CardTitle>
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    className="hover:text-black text-blue-600"
                    prefetch={false}
                  >
                    {repo.name}
                  </Link>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 truncate">
                {repo.description || "No description available"}
              </p>
              {/* Display programming language */}
              <div className="flex items-center gap-2 mt-2">
                <LanguagesIcon className="w-4 h-4" />
                <span className="text-sm text-gray-500">{repo.language}</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <StarIcon className="w-4 h-4 text-yellow-500" />
                <span>{repo.stargazers_count}</span>
                <ForkliftIcon className="w-4 h-4 text-blue-500" />
                <span>{repo.forks_count}</span>
              </div>
              <Link
                href={repo.html_url}
                target="_blank"
                className="text-blue-600 hover:underline"
                prefetch={false}
              >
                View on GitHub
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      </div>
      {/* Load More Button */}
      {visibleCount < userRepos.length && (
        <Button
          onClick={loadMoreRepos}
          className="mt-4 py-2 text-md mx-auto h-10 rounded-md bg-blue-500 px-4 font-medium text-white shadow-xl transition duration-300 ease-in hover:bg-gray-50 hover:text-blue-500"
            >
          Load More
        </Button>
      )}
      </div>
   )}
      </Card>                
    </div>
  );
}
