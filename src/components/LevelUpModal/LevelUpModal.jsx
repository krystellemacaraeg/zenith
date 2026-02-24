import { motion, AnimatePresence } from "framer-motion";
import { useCharacter } from "../../context/CharacterContext";
import styles from "./LevelUpModal.module.css";

// Backdrop + modal animate in together, exit together
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: { duration: 0.2 },
  },
};

export default function LevelUpModal() {
  const { levelUpData, dismissLevelUp } = useCharacter();

  return (
    // AnimatePresence watches levelUpData - when it becomes null, exit animation plays
    <AnimatePresence>
      {levelUpData && (
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          // Clicking the backdrop also dismisses the modal
          onClick={dismissLevelUp}
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // Stop clicks inside the modal from bubbling up to the backdrop
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative particle burst - pure CSS animation */}
            <div className={styles.burstRing} />

            <div className={styles.levelCircle}>
              <span className={styles.levelNumber}>{levelUpData.newLevel}</span>
            </div>

            <h2 className={styles.title}>Level Up!</h2>
            <p className={styles.subtitle}>
              Reached <strong>Level {levelUpData.newLevel}</strong>. The realm trembles.
            </p>

            <button className={styles.dismissBtn} onClick={dismissLevelUp}>
              Continue the Journey ⚔️
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}