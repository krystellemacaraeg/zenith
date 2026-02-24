import { motion, AnimatePresence } from "framer-motion";
import { useQuests } from "../../context/QuestContext";
import styles from "./HistoryPage.module.css";

// Formats ISO date string into a readable "Feb 25, 2026 · 3:42 PM" format
function formatDate(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

const DIFFICULTY_CLASS = { Easy: "tagEasy", Medium: "tagMedium", Hard: "tagHard" };

export default function HistoryPage() {
  const { completedQuests, clearHistory } = useQuests();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>📜 Chronicle</h2>
        {completedQuests.length > 0 && (
          <button className={styles.clearBtn} onClick={clearHistory}>
            Clear History
          </button>
        )}
      </div>
      <p className={styles.pageSubtitle}>
        {completedQuests.length} quest{completedQuests.length !== 1 ? "s" : ""} completed
      </p>

      <AnimatePresence>
        {completedQuests.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>📭 No quests completed yet. Get to work, adventurer.</p>
          </motion.div>
        ) : (
          <div className={styles.historyList}>
            {completedQuests.map((quest, i) => (
              <motion.div
                key={quest.id}
                className={styles.historyEntry}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <span className={`${styles.diffTag} ${styles[DIFFICULTY_CLASS[quest.difficulty]]}`}>
                  {quest.difficulty}
                </span>
                <div className={styles.entryInfo}>
                  <p className={styles.entryTitle}>{quest.title}</p>
                  <p className={styles.entryDate}>
                    {quest.isDaily && "⏳ Daily · "}
                    Completed {formatDate(quest.completedAt)}
                  </p>
                </div>
                <span className={styles.checkmark}>✓</span>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}