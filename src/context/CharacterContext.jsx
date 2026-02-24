import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { applyXpGain, applyHpLoss, XP_REWARDS, HP_PENALTIES } from "../utils/levelEngine";

// Step 1: Create the context (it's like an empty container for now)
const CharacterContext = createContext(null);

// The initial state for a brand new hero - default starting values
const INITIAL_CHARACTER = {
  name: "Adventurer",
  level: 1,
  xp: 0,
  hp: 100,
  maxHp: 100,
  gold: 0,
};

// Step 2: The Provider - this wraps our app and PROVIDES the state to everyone inside
export function CharacterProvider({ children }) {
  // Using our custom hook so these stats auto-save to localStorage!
  const [character, setCharacter] = useLocalStorage("zenith-character", INITIAL_CHARACTER);

  // Called when a quest is completed - grants XP and Gold based on difficulty
  const completeQuest = (difficulty) => {
    const reward = XP_REWARDS[difficulty];
    setCharacter((prev) => {
      // First apply XP (handles leveling up internally)
      const afterXp = applyXpGain(prev, reward.xp);
      // Then add the gold reward
      return { ...afterXp, gold: afterXp.gold + reward.gold };
    });
  };

  // Called when a Daily quest is failed/missed - ouch, that hurts HP
  const failDailyQuest = (difficulty) => {
    const penalty = HP_PENALTIES[difficulty];
    setCharacter((prev) => applyHpLoss(prev, penalty));
  };

  // Reset button for testing - lets me wipe my save and start fresh
  const resetCharacter = () => {
    setCharacter(INITIAL_CHARACTER);
  };

  // Step 3: Pass everything down through the context value
  const value = {
    character,
    completeQuest,
    failDailyQuest,
    resetCharacter,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

// Step 4: Custom hook to consume the context - cleaner than writing useContext everywhere
export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter must be used inside a <CharacterProvider>. Don't forget to wrap!");
  }
  return context;
}