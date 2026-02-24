import { useState } from "react";
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
  // Controls whether the sidebar drawer is open on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <CharacterProvider>
        <QuestProvider>
          <div className={styles.appShell}>
            <HeroHeader onMenuToggle={() => setSidebarOpen((o) => !o)} />

            <div className={styles.appBody}>
              {/* Backdrop - tapping it closes the sidebar on mobile */}
              {sidebarOpen && (
                <div
                  className={styles.backdrop}
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

              <main className={styles.mainContent}>
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