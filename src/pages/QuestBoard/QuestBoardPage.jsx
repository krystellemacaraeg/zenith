import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuests, DIFFICULTIES } from "../../context/QuestContext";
import QuestCard from "../../components/QuestCard/QuestCard";
import styles from "./QuestBoardPage.module.css";

export default function QuestBoardPage() {
  const { quests, addQuest } = useQuests();

  const [title, setTitle]           = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [isDaily, setIsDaily]       = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addQuest(title.trim(), difficulty, isDaily);
    setTitle("");
    setDifficulty("Medium");
    setIsDaily(false);
  };

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.boardHeader}>
        <h2 className={styles.boardTitle}>⚔️ Quest Board</h2>
        <span className={styles.questCount}>{quests.length} active</span>
      </div>

      <form className={styles.addQuestForm} onSubmit={handleSubmit}>
        <input
          className={styles.titleInput}
          type="text"
          placeholder="Describe your quest..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
        />
        <div className={styles.formControls}>
          <div className={styles.difficultyGroup}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                className={`${styles.difficultyOption} ${difficulty === d ? styles.selected : ""}`}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <label className={styles.dailyToggle}>
            <input
              type="checkbox"
              checked={isDaily}
              onChange={(e) => setIsDaily(e.target.checked)}
            />
            <span>Daily</span>
          </label>
          <button type="submit" className={styles.submitBtn}>+ Add Quest</button>
        </div>
      </form>

      <AnimatePresence mode="popLayout">
        {quests.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>🏆 All quests complete. The realm is at peace.</p>
          </motion.div>
        ) : (
          quests.map((quest) => <QuestCard key={quest.id} quest={quest} />)
        )}
      </AnimatePresence>
    </div>
  );
}