import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useCharacter } from "./CharacterContext";
import { HP_PENALTIES } from "../utils/levelEngine";

const QuestContext = createContext(null);

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

function createQuest(title, difficulty, isDaily = false) {
  return {
    id: Date.now() + Math.random(),
    title,
    difficulty,
    isDaily,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

const INITIAL_QUESTS = [
  createQuest("Meditate for 10 minutes", "Easy", true),
  createQuest("Study React for 1 hour", "Medium", false),
  createQuest("Build the QuestBoard component", "Hard", false),
  createQuest("Drink 8 glasses of water", "Easy", true),
];

export function QuestProvider({ children }) {
  const [quests, setQuests] = useLocalStorage("zenith-quests", INITIAL_QUESTS);
  // Completed quests history — persisted so it survives refresh
  const [completedQuests, setCompletedQuests] = useLocalStorage("zenith-history", []);
  const { completeQuest, failDailyQuest } = useCharacter();

  const addQuest = (title, difficulty, isDaily) => {
    const newQuest = createQuest(title, difficulty, isDaily);
    setQuests((prev) => [newQuest, ...prev]);
  };

  const completeQuestById = (id) => {
    const quest = quests.find((q) => q.id === id);
    if (!quest) return;
    completeQuest(quest.difficulty);

    // Log the completed quest to history before removing it from the board
    const completedEntry = { ...quest, completedAt: new Date().toISOString() };
    setCompletedQuests((prev) => [completedEntry, ...prev]);
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const discardQuest = (id) => {
    const quest = quests.find((q) => q.id === id);
    if (!quest) return;
    if (quest.isDaily) {
      failDailyQuest(quest.difficulty);
    }
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  // Wipe the history log — available in Settings page
  const clearHistory = () => setCompletedQuests([]);

  const value = { quests, addQuest, completeQuestById, discardQuest, completedQuests, clearHistory };

  return (
    <QuestContext.Provider value={value}>
      {children}
    </QuestContext.Provider>
  );
}

export function useQuests() {
  const context = useContext(QuestContext);
  if (!context) throw new Error("useQuests must be used inside a <QuestProvider>.");
  return context;
}