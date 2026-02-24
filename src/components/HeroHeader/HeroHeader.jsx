import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useCharacter } from "../../context/CharacterContext";
import { XP_TO_NEXT_LEVEL } from "../../utils/levelEngine";
import styles from "./HeroHeader.module.css";

function HeroAvatar() {
  return (
    <div className={styles.avatarWrapper}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="10" y="4"  width="16" height="10" rx="3" fill="#8B5CF6" />
        <rect x="8"  y="12" width="20" height="14" rx="2" fill="#C4B5FD" />
        <rect x="11" y="16" width="5"  height="3"  rx="1" fill="#0D0D12" />
        <rect x="20" y="16" width="5"  height="3"  rx="1" fill="#0D0D12" />
        <rect x="12" y="26" width="12" height="5"  rx="2" fill="#8B5CF6" />
      </svg>
    </div>
  );
}

function HpBar({ value, max }) {
  const controls = useAnimation();
  const { hpShake } = useCharacter();
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (hpShake) {
      controls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    }
  }, [hpShake, controls]);

  return (
    <div className={styles.statBarGroup}>
      <span className={styles.statLabel}>HP</span>
      <motion.div animate={controls} className={styles.statTrack}>
        <motion.div
          className={`${styles.statFill} ${styles.hpFill}`}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </motion.div>
      <span className={styles.statNumbers}>{value}/{max}</span>
    </div>
  );
}

function XpBar({ value, max }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className={styles.statBarGroup}>
      <span className={styles.statLabel}>XP</span>
      <div className={styles.statTrack}>
        <motion.div
          className={`${styles.statFill} ${styles.xpFill} ${styles.xpGlow}`}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </div>
      <span className={styles.statNumbers}>{value}/{max}</span>
    </div>
  );
}

// onMenuToggle is passed down from App.jsx to control sidebar open/close on mobile
export default function HeroHeader({ onMenuToggle }) {
  const { character } = useCharacter();
  const xpNeeded = XP_TO_NEXT_LEVEL(character.level);

  return (
    <header className={styles.heroHeader}>
      <div className={styles.heroInner}>
        {/* Hamburger — only visible on mobile via CSS */}
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
          <span /><span /><span />
        </button>

        <HeroAvatar />

        <div className={styles.statsBlock}>
          <HpBar value={character.hp} max={character.maxHp} />
          <XpBar value={character.xp} max={xpNeeded} />
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