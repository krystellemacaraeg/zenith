import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { applyXpGain, applyHpLoss, XP_REWARDS, HP_PENALTIES } from "../utils/levelEngine";

const CharacterContext = createContext(null);

// Default starting stats for a brand new hero
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
  // Lives in regular useState — no need to persist this across refreshes
  const [levelUpData, setLevelUpData] = useState(null);

  // Tracks whether HP was just lost so the header bar can shake
  const [hpShake, setHpShake] = useState(false);

  // Called when a quest is completed — grants XP and Gold based on difficulty
  const completeQuest = (difficulty) => {
    const reward = XP_REWARDS[difficulty];
    setCharacter((prev) => {
      const afterXp   = applyXpGain(prev, reward.xp);
      const afterGold = { ...afterXp, gold: afterXp.gold + reward.gold };

      // Check if level changed — if so, queue up the level-up modal
      if (afterGold.level > prev.level) {
        setLevelUpData({ newLevel: afterGold.level });
      }

      return afterGold;
    });
  };

  // Called when a Daily quest is failed/missed — costs HP and triggers shake
  const failDailyQuest = (difficulty) => {
    const penalty = HP_PENALTIES[difficulty];
    setCharacter((prev) => applyHpLoss(prev, penalty));

    // Trigger the shake animation on the HP bar
    setHpShake(true);
    // Reset shake flag after animation completes so it can fire again next time
    setTimeout(() => setHpShake(false), 600);
  };

  // Called by the Armory when a player buys an item
  // Deducts gold cost, then applies either a stat effect or an XP grant
  const shopPurchase = (cost, effectFn, xpGrant = 0) => {
    setCharacter((prev) => {
      if (prev.gold < cost) return prev; // Safety check — can't buy what you can't afford
      const afterCost   = { ...prev, gold: prev.gold - cost };
      const afterEffect = effectFn ? effectFn(afterCost) : afterCost;
      const afterXp     = xpGrant > 0 ? applyXpGain(afterEffect, xpGrant) : afterEffect;

      // Check for level up triggered by an XP grant item
      if (afterXp.level > prev.level) {
        setLevelUpData({ newLevel: afterXp.level });
      }

      return afterXp;
    });
  };

  // Called by the modal's close button to dismiss it
  const dismissLevelUp = () => setLevelUpData(null);

  // Full reset — wipes character back to starter stats
  const resetCharacter = () => {
    setCharacter(INITIAL_CHARACTER);
    setLevelUpData(null);
  };

  const value = {
    character,
    completeQuest,
    failDailyQuest,
    shopPurchase,
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