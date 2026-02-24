import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CharacterProvider } from "./context/CharacterContext";
import { QuestProvider }     from "./context/QuestContext";
import HeroHeader            from "./components/HeroHeader/HeroHeader";
import Sidebar               from "./components/Sidebar/Sidebar";
import LevelUpModal          from "./components/LevelUpModal/LevelUpModal";
import QuestBoardPage        from "./pages/QuestBoard/QuestBoardPage";
import ArmoryPage            from "./pages/Armory/ArmoryPage";
import HistoryPage           from "./pages/History/HistoryPage";
import SettingsPage          from "./pages/Settings/SettingsPage";
import styles                from "./App.module.css";

export default function App() {
  return (
    // BrowserRouter must wrap everything that uses routing hooks
    <BrowserRouter>
      <CharacterProvider>
        <QuestProvider>
          <div className={styles.appShell}>
            <HeroHeader />

            <div className={styles.appBody}>
              <Sidebar />

              <main className={styles.mainContent}>
                {/* Routes renders the first <Route> that matches the current URL */}
                <Routes>
                  <Route path="/"         element={<QuestBoardPage />} />
                  <Route path="/armory"   element={<ArmoryPage />}     />
                  <Route path="/history"  element={<HistoryPage />}    />
                  <Route path="/settings" element={<SettingsPage />}   />
                </Routes>
              </main>
            </div>

            <LevelUpModal />
          </div>
        </QuestProvider>
      </CharacterProvider>
    </BrowserRouter>
  );
}