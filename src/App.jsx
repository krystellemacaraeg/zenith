import { CharacterProvider } from "./context/CharacterContext";
import { QuestProvider } from "./context/QuestContext";
import HeroHeader from "./components/HeroHeader/HeroHeader";
import QuestBoard from "./components/QuestBoard/QuestBoard";
import styles from "./App.module.css";

// QuestProvider is nested inside CharacterProvider because quests depend on character
// actions (completeQuest, failDailyQuest) — the inner provider can access the outer one
export default function App() {
  return (
    <CharacterProvider>
      <QuestProvider>
        <div className={styles.appShell}>
          <HeroHeader />
          {/* pageContent centers the board — will expand into a sidebar layout in Phase 3 */}
          <div className={styles.pageContent}>
            <QuestBoard />
          </div>
        </div>
      </QuestProvider>
    </CharacterProvider>
  );
}