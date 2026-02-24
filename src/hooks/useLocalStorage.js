import { useState } from "react";

// Custom hook - think of it as useState, but it also saves to the browser's memory.
// This way our hero's stats survive a page refresh!
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // On first load, check if already have saved data for this key
      const item = window.localStorage.getItem(key);
      // If yes, parse it from JSON string back to a real JS object. If not, use the default.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // This is our custom "setter" - it updates state AND saves to localStorage at the same time
  const setValue = (value) => {
    try {
      // Value can be a new value OR a function (just like real useState!)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Save it to not lose our hard-earned XP on refresh
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}