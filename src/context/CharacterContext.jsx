import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { applyXpGain, applyHpLoss, XP_REWARDS, HP_PENALTIES } from "../utils/levelEngine";

const CharacterContext = createContext(null);

const INITIAL_CHARACTER = {
  name: "Adventurer",
  level: 1,
  xp: 0,
  hp: 100,
  maxHp: 100,
  gold: 0,
};

export function CharacterProvider({ children }) {
  // Using custom hook so these stats auto-save to localStorage!
  const [character, setCharacter] = useLocalStorage("zenith-character", INITIAL_CHARACTER);

  // Tracks whether a level-up just happened so the modal can trigger
  // This lives in regular useState - no need to persist it across refreshes
  const [levelUpData, setLevelUpData] = useState(null); // null = no modal, {level} = show modal

  // Tracks whether HP was just lost so the header bar can shake
  const [hpShake, setHpShake] = useState(false);

  const completeQuest = (difficulty) => {
    const reward = XP_REWARDS[difficulty];
    setCharacter((prev) => {
      const afterXp = applyXpGain(prev, reward.xp);
      const afterGold = { ...afterXp, gold: afterXp.gold + reward.gold };

      // Check if level changed - if so, queue up the level-up modal
      if (afterGold.level > prev.level) {
        setLevelUpData({ newLevel: afterGold.level });
      }

      return afterGold;
    });
  };

  const failDailyQuest = (difficulty) => {
    const penalty = HP_PENALTIES[difficulty];
    setCharacter((prev) => applyHpLoss(prev, penalty));

    // Trigger the shake animation on the HP bar
    setHpShake(true);
    // Reset shake flag after animation completes so it can fire again next time
    setTimeout(() => setHpShake(false), 600);
  };

  // Called by the modal's close button to dismiss it
  const dismissLevelUp = () => setLevelUpData(null);

  const resetCharacter = () => {
    setCharacter(INITIAL_CHARACTER);
    setLevelUpData(null);
  };

  const value = {
    character,
    completeQuest,
    failDailyQuest,
    resetCharacter,
    levelUpData,
    dismissLevelUp,
    hpShake,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter must be used inside a <CharacterProvider>.");
  }
  return context;
}