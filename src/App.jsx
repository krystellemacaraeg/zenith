import { CharacterProvider, useCharacter } from "./context/CharacterContext";
import { XP_TO_NEXT_LEVEL } from "./utils/levelEngine";
import styles from "./App.module.css";

// Temporary debug panel - just so we can SEE the state is working before we build real UI
function CharacterDebug() {
  const { character, completeQuest, failDailyQuest, resetCharacter } = useCharacter();
  const xpNeeded = XP_TO_NEXT_LEVEL(character.level);

  return (
    <div className={styles.debugPanel}>
      <h1>🏔️ Zenith - Dev Console</h1>
      <pre>{JSON.stringify(character, null, 2)}</pre>
      <p>XP to next level: {xpNeeded - character.xp}</p>

      {/* Testing buttons - I'll rip these out once real UI exists */}
      <div className={styles.debugButtons}>
        <button onClick={() => completeQuest("Easy")}>✅ Complete Easy Quest</button>
        <button onClick={() => completeQuest("Medium")}>✅ Complete Medium Quest</button>
        <button onClick={() => completeQuest("Hard")}>✅ Complete Hard Quest</button>
        <button onClick={() => failDailyQuest("Medium")}>💀 Fail Daily (Medium)</button>
        <button onClick={resetCharacter}>🔄 Reset Hero</button>
      </div>
    </div>
  );
}

// App wraps everything in the Provider so all child components can access character state
function App() {
  return (
    <CharacterProvider>
      <div className={styles.appShell}>
        <CharacterDebug />
      </div>
    </CharacterProvider>
  );
}

export default App;