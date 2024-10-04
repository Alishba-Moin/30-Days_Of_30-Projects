"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MinusIcon, PauseIcon, PlayIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type TimerStatus = "idle" | "running" | "paused";
type SessionType = "work" | "break";

interface PomodoroState {
    workDuration: number;
    shortBreakDuration: number; 
    longBreakDuration: number;  
    currentTime: number;
    currentSession: SessionType;
    timerStatus: TimerStatus;
    completedSessions: number; 
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function PomodoroTimer(){
    const [state, setState] = useState<PomodoroState>({
        workDuration: 25 * 60, // 25 minutes converted to seconds (25 * 60 = 1500 seconds)
        shortBreakDuration: 5 * 60, // Initial short break
        longBreakDuration: 15 * 60,  // Initial long break
        currentTime: 25 * 60, // Initially set to workDuration (25 minutes)
        currentSession: "work", // Initially, the timer starts with the "work" session
        timerStatus: "idle", // Timer starts in an "idle" state, not running
        completedSessions: 1 // complete session 1

      });
      const timerRef = useRef<NodeJS.Timeout | null> (null)
      const [selectedSession, setSelectedSession] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
      const [completedPomodoros ,setCompletedPomodoros] = useState(0);
      const [tasks, setTasks] = useState<Task[]>([]);
      const [newTask, setNewTask] = useState("");
    
    useEffect(() => {
        if(state.timerStatus === "running" && state.currentTime > 0){
            timerRef.current = setInterval(() =>{
                setState((prevState) => ({
                ...prevState,
                currentTime: prevState.currentTime - 1,
            }))
        }, 1000)
    }else if(state.currentTime === 0){
        clearInterval(timerRef.current as NodeJS.Timeout)
        handleSessionSwitch();
    }
    return () => clearInterval(timerRef.current as NodeJS.Timeout);
    }, [state.timerStatus, state.currentTime]);

    const handleSessionSwitch = (): void => {
        setState((prevState) => {
          const isWorkSession = prevState.currentSession === "work";
          if (isWorkSession) {
            setCompletedPomodoros((prev) => prev + 1);
          }
          return {
            ...prevState,
            currentSession: isWorkSession ? "break" : "work",
            currentTime: isWorkSession
              ? (prevState.completedSessions % 4 === 0 ? prevState.longBreakDuration : prevState.shortBreakDuration)
              : prevState.workDuration,
          };
        })
    }
    const handleAddTask = () => {
      if (newTask.trim()) {
        setTasks((prevTasks) => [
          ...prevTasks,
          { id: Date.now(), text: newTask.trim(), completed: false }, // Create a new Task
        ]);
        setNewTask("");
      }
    };
    const handleTaskToggle = (taskId: number) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    };
    
  
    const handleTaskDelete = (taskId: number) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    };
  
    const handleStartPause = (): void => {
        if(state.timerStatus === "running"){
            setState((prevState) => ({
                ...prevState,
                timerStatus : "paused"
        }))
        clearInterval(timerRef.current as NodeJS.Timeout)
    }else{
        setState((prevState) => ({
            ...prevState,
            timerStatus: "running",
          }));
    }
  }
  const handleReset = (): void =>  {
    clearInterval(timerRef.current as NodeJS.Timeout)
    setState((prevState) => ({
        ...prevState,
        currentTime: prevState.workDuration,
        currentSession: "work",
        timerStatus: "idle"
    }))
  }
  const handleDurationChange = (type: SessionType, increment: boolean): void => {
    setState((prevState) => {
      const durationChange = increment ? 60 : -60;
      if (type === "work") {
        return {
          ...prevState,
          workDuration: Math.max(60, prevState.workDuration + durationChange),
          currentTime: prevState.currentSession === "work" ? 
          Math.max(60, prevState.workDuration + durationChange) : prevState.currentTime,
        };
      } else {
        return {
          ...prevState,
          longBreakDuration: Math.max(60, prevState.longBreakDuration + durationChange),
          currentTime: prevState.currentSession === "break"
            ? Math.max(60, prevState.longBreakDuration + durationChange)
            : prevState.currentTime,
        };        
      }
    });
  };
  const handleSessionChange = (session: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setSelectedSession(session);
    // Update the current time based on the selected session
    if (session === 'pomodoro') {
      setState((prev) => ({ ...prev, currentTime: prev.workDuration, currentSession: 'work' }));
    } else if (session === 'shortBreak') {
      setState((prev) => ({ ...prev, currentTime: prev.shortBreakDuration, currentSession: 'break' }));
    } else if (session === 'longBreak') {
      setState((prev) => ({ ...prev, currentTime: prev.longBreakDuration, currentSession: 'break' }));
    }
  };
  const formatTime = (timeInSeconds: number) => {
    const minutes = String(Math.floor(timeInSeconds / 60)).padStart(2, '0');
    const seconds = String(timeInSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  

  const progress = (
    (state.currentTime /
      (state.currentSession === "work"
        ? state.workDuration
        : (state.completedSessions % 4 === 0
          ? state.longBreakDuration
          : state.shortBreakDuration))) *
    100
  );
  
  // JSX return statement rendering the Pomodoro timer UI
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${
      selectedSession === 'pomodoro' ? 'bg-red-600' : 
      selectedSession === 'shortBreak' ? 'bg-indigo-600' : 
      'bg-teal-600'
    }`}>
       <Card className={`w-full max-w-md p-6 shadow-lg rounded-lg ${
    selectedSession === 'pomodoro' ? ' bg-red-50 bg-opacity-10' :
    selectedSession === 'shortBreak' ? 'bg-indigo-50 bg-opacity-10' : 
    'bg-teal-50 bg-opacity-10'
  }`}>
        <div className="flex flex-col items-center justify-center ">
          <h1 className="text-4xl font-extrabold">Pomodoro Timer</h1>
          <p className="text-lg font-medium m-3">A timer for the Pomodoro Technique.</p>
          {/* Buttons */}
    <div className="flex gap-4">
      <Button
        onClick={() => handleSessionChange('pomodoro')}
        className={`p-3 font-bold hover:bg-red-300 ${selectedSession === 'pomodoro' ? 'bg-red-600 text-white ' : 'bg-white text-red-500'}`}
      >
        Pomodoro
      </Button>
      <Button
        onClick={() => handleSessionChange('shortBreak')}
        className={`p-3 font-bold hover:bg-indigo-300 ${selectedSession === 'shortBreak' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-500'}`}
      >
        Short Break
      </Button>
      <Button
        onClick={() => handleSessionChange('longBreak')}
        className={`p-3 font-bold hover:bg-teal-300 ${selectedSession === 'longBreak' ? 'bg-teal-600 text-white' : 'bg-white text-teal-500'}`}
      >
        Long Break
      </Button>
          </div>
          <div className="flex flex-col items-center">
            {/* Display current session */}
            <div className="text-2xl font-bold mt-3 text-white">
              {selectedSession.charAt(0).toUpperCase() + selectedSession.slice(1)}
            </div>
            {/* Display formatted time */}
            <div className="text-8xl font-bold">
              {formatTime(state.currentTime)}
            </div>
          </div>
          {/* Progress Bar */}
      <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden shadow-md mb-4">
        <div
          className="absolute h-full bg-gradient-to-r from-green-600 to-green-900 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
          <div className="flex items-center gap-6">
            {/* Buttons to change duration, start/pause, and reset timer */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange("work", false)}
            >
              <MinusIcon className="h-7 w-7" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange("work", true)}
            >
              <PlusIcon className="h-7 w-7" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleStartPause}>
              {state.timerStatus === "running" ? (
                <PauseIcon className="h-7 w-7" />
              ) : (
                <PlayIcon className="h-7 w-7" />
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RefreshCwIcon className="h-7 w-7" />
            </Button>
          </div>
          <div className="flex flex-col items-center mt-6">
            <h2 className="text-xl font-bold">ToDo List</h2>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="p-2 border-2 border-gray-400 border-dashed rounded"
                placeholder="Add a new task"
              />
              <Button onClick={handleAddTask} className="p-2">
                <PlusIcon />
              </Button>
            </div>
            <ul className="w-full">
              {tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center p-2 border-b border-gray-300">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                      className="mr-2 text-lg"
                    />
                    <span className={task.completed ? "line-through text-lg" : ""}>{task.text}</span>
                  </label>
                  <Button onClick={() => handleTaskDelete(task.id)} className="text-red-500 p-2">
                    <MinusIcon />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center bg-gray-100 p-3 rounded-lg shadow-md">
    <p className="text-xl font-semibold text-gray-700">
        🍅 Total Pomodoros Completed: <span className="text-teal-600">{completedPomodoros}</span>
    </p>
</div>

          <div className="p-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default">What is Pomodoro Technique?</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-full max-w-2xl p-4 md:p-6">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <strong> ➡️ Explanation of Pomodoro Technique 🔥</strong>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>The Pomodoro Technique </strong>
                    {`
                      is a time management method that uses a timer to break work into 
                      intervals called Pomodoros. The Pomodoro timer is traditionally set for 25 minutes,
                      but can be customized to fit your needs. The basic steps are:
                    `}
                    <br />
                    <br />
                    <ol>
                      <strong>
                        <li>1. Select a single task to focus on.</li>
                        <li>2. Set a timer for 25-30 min. and work continuously until the timer goes off.</li>
                        <li>3. Take a productive 5 min. break - walk around, get a snack, relax.</li>
                        <li>4. Repeat steps 2 & 3 for 4 rounds.</li>
                        <li>5. Take a longer (20-30 min.) break.</li>
                      </strong>
                    </ol>
                    <br />
                    <Button>
                      <a
                        href="https://todoist.com/productivity-methods/pomodoro-technique"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click Here to Read more!
                      </a>
                    </Button>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          </div>
        </Card>
    </div>

  );
};

