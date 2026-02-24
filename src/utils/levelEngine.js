// XP required to reach the NEXT level. The curve gets steeper as you level up.
// Formula: each level needs (level * 100) XP. So Lvl 1 → 100xp, Lvl 5 → 500xp, etc.
export const XP_TO_NEXT_LEVEL = (level) => level * 100;

// The XP multipliers based on quest difficulty - the reward for the grind!
export const XP_REWARDS = {
  Easy:   { xp: 20,  gold: 10 },
  Medium: { xp: 50,  gold: 25 },
  Hard:   { xp: 100, gold: 60 },
};

// HP penalty when you fail/miss a Daily quest. Scales by difficulty.
export const HP_PENALTIES = {
  Easy:   5,
  Medium: 15,
  Hard:   30,
};

// The core leveling function. Pass in current stats + XP gained, get back new stats.
// Returns a fresh stats object - we never mutate state directly.
export function applyXpGain(currentStats, xpGained) {
  let { xp, level, gold } = currentStats;
  // Add the XP we just earned
  xp += xpGained;

  // Keep leveling up as long as we have enough XP (handles multi-level jumps!)
  while (xp >= XP_TO_NEXT_LEVEL(level)) {
    xp -= XP_TO_NEXT_LEVEL(level); // Carry over the leftover XP
    level += 1;
    console.log(`🎉 LEVEL UP! You are now Level ${level}`);
  }

  return { ...currentStats, xp, level };
}

// HP damage function - clamps HP so it never goes below 0 (we're not monsters)
export function applyHpLoss(currentStats, hpLost) {
  const newHp = Math.max(0, currentStats.hp - hpLost);
  return { ...currentStats, hp: newHp };
}