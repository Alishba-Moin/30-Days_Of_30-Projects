"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { FilePenIcon, TrashIcon, StarIcon, PlusIcon } from "lucide-react";

type Note = {
  id: number;
  title: string;
  content: string;
  isFavorite: boolean;
  category: string;
  color: string; // Hex code for background color
};

// Default notes to initialize the app with
const defaultNotes: Note[] = [
  {
    id: 1,
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Apples",
    isFavorite: false,
    category: "Personal",
    color: "#fed7aa", // Orange
  },
  {
    id: 2,
    title: "Meeting Notes",
    content: "Discuss new project timeline, assign tasks to team",
    isFavorite: true,
    category: "Work",
    color: "#bfdbfe", // Blue
  },
  {
    id: 3,
    title: "Idea for App",
    content: "Develop a note-taking app with a clean and minimalist design",
    isFavorite: false,
    category: "Ideas",
    color: "#c4b5fd", // Purple
  },
];

// Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}

export default function NotesApp() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", defaultNotes);
  const [newNotes, setNewNotes] = useState<{
    title: string;
    content: string;
    category: string;
    color: string;
  }>({
    title: "",
    content: "",
    category: "",
    color: "#6ee7b7", // Default selected color
  });
  const [editNotesId, setEditNotesId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false); // State to toggle input fields

  // Define the color options with hex codes and names
  const colorOptions = [
    { code: "#fed7aa", name: "Orange" },
    { code: "#bfdbfe", name: "Blue" },
    { code: "#6ee7b7", name: "Green" },
    { code: "#c4b5fd", name: "Purple" },
    { code: "#fda4af", name: "Pink" },
  ];

  // useEffect to set the component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddNotes = (): void => {
    if (
      newNotes.title.trim() &&
      newNotes.content.trim() &&
      newNotes.category.trim()
    ) {
      const newNoteWithId = {
        id: Date.now(),
        ...newNotes,
        isFavorite: false,
      };
      setNotes([...notes, newNoteWithId]);
      setNewNotes({ title: "", content: "", category: "", color: "#f5aa42" });
      setShowInput(false); // Hide input after adding note
    }
  };

  const handleEditNotes = (id: number): void => {
    const editToNotes = notes.find((note) => note.id === id);
    if (editToNotes) {
      setNewNotes({
        title: editToNotes.title,
        content: editToNotes.content,
        category: editToNotes.category,
        color: editToNotes.color,
      });
      setEditNotesId(id);
      setShowInput(true); // Show input fields for editing
    }
  };

  const handleUpdateNotes = (): void => {
    if (
      newNotes.title.trim() &&
      newNotes.content.trim() &&
      newNotes.category.trim()
    ) {
      setNotes(
        notes.map((note) =>
          note.id === editNotesId
            ? {
                ...note,
                title: newNotes.title,
                content: newNotes.content,
                category: newNotes.category,
                color: newNotes.color,
              }
            : note
        )
      );
      setNewNotes({ title: "", content: "", category: "", color: "#f5aa42" });
      setEditNotesId(null);
      setShowInput(false); // Hide input after updating note
    }
  };

  const handleDeleteNotes = (id: number): void => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const toggleFavorite = (id: number): void => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-white text-white">
      {/* Header */}
      <header className="p-2 bg-gray-800 shadow-md">
        <h1 className="text-3xl font-extrabold font-sans text-yellow-400 text-center">
          Note Taker
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Notes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              style={{ backgroundColor: note.color }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-sans">{note.title}</h2>
                <div className="flex space-x-2">
                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(note.id)}
                    className="text-yellow-400 hover:text-yellow-500 transition-colors duration-200 bg-black hover:bg-gray-700"
                    aria-label="Toggle Favorite"
                  >
                    <StarIcon
                      className={`h-4 w-4 ${
                        note.isFavorite ? "text-yellow-400" : "text-white"
                      }`}
                    />
                  </Button>

                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNotes(note.id)}
                    className="text-blue-400 hover:text-blue-500 transition-colors duration-200 bg-black hover:bg-gray-700"
                    aria-label="Edit Note"
                  >
                    <FilePenIcon className="h-4 w-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNotes(note.id)}
                    className="text-red-400 hover:text-red-500 transition-colors duration-200 bg-black hover:bg-gray-700"
                    aria-label="Delete Note"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="mt-4 text-black font-sans font-semibold">{note.content}</p>
              <p className="mt-2 text-black font-sans font-semibold">Category: {note.category}</p>
            </Card>
          ))}
        </div>

        {/* Add/Edit Note Form */}
        {showInput && (
          <div className="mt-8 bg-gray-800 p-4 rounded-lg shadow-md font-sans">
            <div className="flex flex-col space-y-4">
              {/* Title Input */}
              <input
                type="text"
                placeholder="Title"
                value={newNotes.title}
                onChange={(e) =>
                  setNewNotes({ ...newNotes, title: e.target.value })
                }
                className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
              />

              {/* Content Input */}
              <textarea
                placeholder="Content"
                value={newNotes.content}
                onChange={(e) =>
                  setNewNotes({ ...newNotes, content: e.target.value })
                }
                className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
                rows={3}
              ></textarea>

              {/* Category Input */}
              <input
                type="text"
                placeholder="Category"
                value={newNotes.category}
                onChange={(e) =>
                  setNewNotes({ ...newNotes, category: e.target.value })
                }
                className="w-full p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
              />

              {/* Color Picker */}
              <div className="flex items-center space-x-2">
                <span>Select Color:</span>
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
                    <Button
                      key={color.code}
                      onClick={() => setNewNotes({ ...newNotes, color: color.code })}
                      className={`w-6 h-6 rounded-full border-2 ${
                        newNotes.color === color.code
                          ? "border-yellow-400"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.code }}
                    />
                  ))}
                </div>
              </div>

              {/* Add or Update Button */}
              {editNotesId === null ? (
                <Button
                  onClick={handleAddNotes}
                  className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-200 font-sans"
                >
                  Add Note
                </Button>
              ) : (
                <Button
                  onClick={handleUpdateNotes}
                  className="w-full bg-blue-400 text-gray-900 hover:bg-blue-500 transition-colors duration-200 font-sans"
                >
                  Update Note
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Floating Plus Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => {
              setShowInput(!showInput);
              if (showInput) {
                // Reset inputs when toggling off
                setNewNotes({ title: "", content: "", category: "", color: "#f5aa42" });
                setEditNotesId(null); // Reset edit mode
              }
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
          >
            <PlusIcon className="h-6 w-6" />
          </Button>
        </div>
      </main>
    </div>
  );
}
