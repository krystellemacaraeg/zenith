import { motion } from "framer-motion";
import { useCharacter } from "../../context/CharacterContext";
import { XP_TO_NEXT_LEVEL } from "../../utils/levelEngine";
import styles from "./HeroHeader.module.css";

// Small SVG avatar - placeholder pixel-art style icon until I design a real one
function HeroAvatar() {
  return (
    <div className={styles.avatarWrapper}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        {/* Helmet top */}
        <rect x="10" y="4" width="16" height="10" rx="3" fill="#8B5CF6" />
        {/* Face */}
        <rect x="8" y="12" width="20" height="14" rx="2" fill="#C4B5FD" />
        {/* Eye slits */}
        <rect x="11" y="16" width="5" height="3" rx="1" fill="#0D0D12" />
        <rect x="20" y="16" width="5" height="3" rx="1" fill="#0D0D12" />
        {/* Chin guard */}
        <rect x="12" y="26" width="12" height="5" rx="2" fill="#8B5CF6" />
      </svg>
    </div>
  );
}

// Reusable animated stat bar - used for both HP and XP
// Framer Motion animates the width change so bars don't just snap, they slide
function StatBar({ value, max, colorClass, label, glowClass }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={styles.statBarGroup}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statTrack}>
        <motion.div
          className={`${styles.statFill} ${styles[colorClass]} ${glowClass ? styles[glowClass] : ""}`}
          // animate width as a percentage string so it's responsive
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </div>
      <span className={styles.statNumbers}>
        {value}/{max}
      </span>
    </div>
  );
}

export default function HeroHeader() {
  const { character } = useCharacter();
  const xpNeeded = XP_TO_NEXT_LEVEL(character.level);

  return (
  <header className={styles.heroHeader}>
    {/* heroInner keeps the header content aligned with the board below */}
    <div className={styles.heroInner}>
      <HeroAvatar />
      <div className={styles.statsBlock}>
        <StatBar value={character.hp} max={character.maxHp} colorClass="hpFill" label="HP" />
        <StatBar value={character.xp} max={xpNeeded} colorClass="xpFill" glowClass="xpGlow" label="XP" />
      </div>
      <div className={styles.levelBadge}>
        <span className={styles.levelLabel}>LVL</span>
        <span className={styles.levelNumber}>{character.level}</span>
      </div>
      <div className={styles.goldCounter}>
        <span className={styles.goldIcon}>⚜</span>
        <span className={styles.goldAmount}>{character.gold}</span>
      </div>
    </div>
  </header>
);
}