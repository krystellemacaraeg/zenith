import { motion } from "framer-motion";
import { useQuests } from "../../context/QuestContext";
import styles from "./QuestCard.module.css";

// Difficulty tag colors - maps difficulty string to a CSS module class name
const DIFFICULTY_CLASS = {
  Easy:   "tagEasy",
  Medium: "tagMedium",
  Hard:   "tagHard",
};

// Framer Motion variants - define named animation states for the card
// "hidden" is the starting state, "visible" is fully rendered, "exit" is when removed
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
  exit: {
    opacity: 0,
    x: -30,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export default function QuestCard({ quest }) {
  const { completeQuestById, discardQuest } = useQuests();

  return (
    // AnimatePresence (in QuestBoard) watches for this component unmounting
    // and plays the "exit" variant before actually removing it from the DOM
    <motion.div
      className={styles.card}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout // Smoothly repositions other cards when one is removed
    >
      <div className={styles.cardLeft}>
        {/* Difficulty tag - color coded by CSS class */}
        <span className={`${styles.difficultyTag} ${styles[DIFFICULTY_CLASS[quest.difficulty]]}`}>
          {quest.difficulty}
        </span>

        <div className={styles.questInfo}>
          <p className={styles.questTitle}>{quest.title}</p>
          {/* Daily badge - only shows if the quest is a daily */}
          {quest.isDaily && (
            <span className={styles.dailyBadge}>⏳ Daily</span>
          )}
        </div>
      </div>

      <div className={styles.cardActions}>
        {/* Complete button - checkmark, triggers XP reward */}
        <button
          className={`${styles.actionBtn} ${styles.completeBtn}`}
          onClick={() => completeQuestById(quest.id)}
          aria-label="Complete quest"
          title="Complete Quest - earn XP & Gold"
        >
          ✓
        </button>

        {/* Discard button - trash, costs HP if Daily */}
        <button
          className={`${styles.actionBtn} ${styles.discardBtn}`}
          onClick={() => discardQuest(quest.id)}
          aria-label="Discard quest"
          title={quest.isDaily ? "Discard Daily - this will cost HP!" : "Discard Quest"}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}