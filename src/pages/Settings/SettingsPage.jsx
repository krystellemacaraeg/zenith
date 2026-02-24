import { useCharacter } from "../../context/CharacterContext";
import { useQuests } from "../../context/QuestContext";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  const { resetCharacter } = useCharacter();
  const { clearHistory }   = useQuests();

  const handleFullReset = () => {
    // Wipe character stats, quest history, and active quests from localStorage
    if (window.confirm("Reset everything? This wipes all progress permanently.")) {
      resetCharacter();
      clearHistory();
      localStorage.removeItem("zenith-quests");
      window.location.reload(); // Reload so initial quest seeds repopulate
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>⚙️ Settings</h2>
      <p className={styles.pageSubtitle}>Manage your save data and preferences.</p>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Danger Zone</h3>

        <div className={styles.settingRow}>
          <div>
            <p className={styles.settingLabel}>Clear Quest History</p>
            <p className={styles.settingDesc}>Wipes the Chronicle log. Active quests are unaffected.</p>
          </div>
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={clearHistory}>
            Clear History
          </button>
        </div>

        <div className={styles.settingRow}>
          <div>
            <p className={styles.settingLabel}>Full Reset</p>
            <p className={styles.settingDesc}>Deletes all progress — character, quests, and history. Cannot be undone.</p>
          </div>
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleFullReset}>
            Reset Everything
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>About</h3>
        <p className={styles.aboutText}>
          Zenith v1.0 — Built with React, Framer Motion, and CSS Modules.<br />
          Conquer your day, level your soul. 🏔️
        </p>
      </div>
    </div>
  );
}