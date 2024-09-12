"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

export default function NumberGuessing(): JSX.Element {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<number | string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("");
  const [windowWidth, windowHeight] = useWindowSize();

  useEffect(() => {
    if (gameStarted && !paused) {
      const randomNum: number = Math.floor(Math.random() * 10) + 1;
      setTargetNumber(randomNum);
    }
  }, [gameStarted, paused]);

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    setLeaderboard(scores);
  }, []);

  const saveScore = (attempts: number) => {
    const scores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    scores.push(attempts);
    scores.sort((a: number, b: number) => a - b);
    localStorage.setItem("leaderboard", JSON.stringify(scores.slice(0, 5)));
  };

  const handleStartGame = (): void => {
    setGameStarted(true);
    setGameOver(false);
    setAttempts(0);
    setPaused(false);
    setMessage("");
  };

  const handlePauseGame = (): void => {
    setPaused(true);
  };

  const handleResumeGame = (): void => {
    setPaused(false);
  };

  const handleGuess = (): void => {
    if (typeof userGuess === "number") {
      if (userGuess === targetNumber) {
        setGameOver(true);
        saveScore(attempts + 1);
        setMessage("Congratulations! You've guessed the number.");
      } else {
        setAttempts(attempts + 1);
        setMessage("Try again!");
      }
    }
  };

  const handleTryAgain = (): void => {
    if (gameOver) {
      const updatedScores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
      setLeaderboard(updatedScores);
    }
    setGameStarted(false);
    setGameOver(false);
    setUserGuess("");
    setAttempts(0);
    setMessage("");
  };

  const handleUserGuessChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserGuess(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-purple-400">
      {gameOver && <Confetti width={windowWidth} height={windowHeight} />}
      <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-lg shadow-2xl p-12 w-full max-w-lg mx-auto">
     <h1 className="text-5xl font-extrabold text-center mb-6 text-gray-800">
      Number Guessing Game
      </h1>
    <p className="text-center text-gray-700 mb-6 text-lg font-medium">
    Guess the number between 1 and 10!
    </p>
        {!gameStarted && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleStartGame}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-50">
              Start Game
            </Button>
          </div>
        )}
        {gameStarted && !gameOver && (
          <div>
            <div className="flex justify-center mb-6">
              {paused ? (
                <Button
                  onClick={handleResumeGame}
                  className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                  Resume
                </Button>
              ) : (
                <Button
                  onClick={handlePauseGame}
                  className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  Pause
                </Button>
              )}
            </div>
            <div className="flex flex-col items-center mb-6">
              <Input
                type="number"
                value={userGuess}
                onChange={handleUserGuessChange}
                className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 w-full max-w-xs mb-4"
                placeholder="Enter your guess"
              />
              <Button
                onClick={handleGuess}
                className="bg-stone-600 hover:bg-stone-800 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Guess
              </Button>
            </div>
            <p className="text-center text-red-600 mb-4 font-medium">{message}</p>
            <p className="text-center text-purple-600 font-semibold">Attempts: {attempts}</p>
          </div>
        )}
        {gameOver && (
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [1.2, 1] }}
              transition={{ duration: 1 }}
              className="text-center mb-6 text-gray-800"
            >
              <h2 className="text-3xl font-bold text-red-600">Game Over!</h2>
              <p className="font-bold text-gray-800 mt-2">You guessed the number in {attempts} attempts.</p>
              <p className="text-lg font-semibold mt-4">The number was: {targetNumber}</p>
            </motion.div>
            <div className="flex justify-center mb-6">
              <Button
                onClick={handleTryAgain}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Try Again
              </Button>
            </div>
            <div className="text-center mt-6 text-gray-800">
              <h3 className="text-xl font-bold">Leaderboard:</h3>
              <ul className="list-disc list-inside">
                {leaderboard.length > 0 ? (
                  leaderboard.map((score, index) => (
                    <li key={index} className="text-lg">{index + 1}. {score} attempts</li>
                  ))
                ) : (
                  <li>No scores yet</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
