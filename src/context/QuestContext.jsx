import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useCharacter } from "./CharacterContext";
import { HP_PENALTIES } from "../utils/levelEngine";

const QuestContext = createContext(null);

// Difficulty tags and their visual label - single source of truth
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

// Each quest gets a unique ID using Date.now() - simple, works for this scale
function createQuest(title, difficulty, isDaily = false) {
  return {
    id: Date.now() + Math.random(), // Math.random() prevents collisions if two quests are added fast
    title,
    difficulty,
    isDaily,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

// Seeded starting quests so the board isn't empty on first launch
const INITIAL_QUESTS = [
  createQuest("Meditate for 10 minutes", "Easy", true),
  createQuest("Study React for 1 hour", "Medium", false),
  createQuest("Build the QuestBoard component", "Hard", false),
  createQuest("Drink 8 glasses of water", "Easy", true),
];

export function QuestProvider({ children }) {
  // Quests persist to localStorage - survived refreshes just like character stats
  const [quests, setQuests] = useLocalStorage("zenith-quests", INITIAL_QUESTS);
  const { completeQuest, failDailyQuest } = useCharacter();

  // Add a new quest to the board
  const addQuest = (title, difficulty, isDaily) => {
    const newQuest = createQuest(title, difficulty, isDaily);
    setQuests((prev) => [newQuest, ...prev]); // New quests appear at the top
  };

  // Complete a quest - rewards XP/Gold, then removes it from the board
  const completeQuestById = (id) => {
    const quest = quests.find((q) => q.id === id);
    if (!quest) return;
    completeQuest(quest.difficulty); // Fires the XP/Gold reward from CharacterContext
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  // Discard a quest - if it was a Daily, punish HP. Non-dailies just disappear.
  const discardQuest = (id) => {
    const quest = quests.find((q) => q.id === id);
    if (!quest) return;
    if (quest.isDaily) {
      failDailyQuest(quest.difficulty); // Daily abandonment costs HP - this is the consequence mechanic
    }
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const value = { quests, addQuest, completeQuestById, discardQuest };

  return (
    <QuestContext.Provider value={value}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuests() {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error("useQuests must be used inside a <QuestProvider>.");
  }
  return context;
}