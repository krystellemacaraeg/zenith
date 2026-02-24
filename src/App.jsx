import { CharacterProvider } from "./context/CharacterContext";
import { QuestProvider } from "./context/QuestContext";
import HeroHeader from "./components/HeroHeader/HeroHeader";
import QuestBoard from "./components/QuestBoard/QuestBoard";
import Sidebar from "./components/Sidebar/Sidebar";
import LevelUpModal from "./components/LevelUpModal/LevelUpModal";
import styles from "./App.module.css";

export default function App() {
  return (
    <CharacterProvider>
      <QuestProvider>
        <div className={styles.appShell}>
          <HeroHeader />

          <div className={styles.appBody}>
            <Sidebar />

            {/* Main content area - will host different views in Phase 4 */}
            <main className={styles.mainContent}>
              <QuestBoard />
            </main>
          </div>

          {/* Modal lives outside the layout flow so it overlays everything */}
          <LevelUpModal />
        </div>
      </QuestProvider>
    </CharacterProvider>
  );
}