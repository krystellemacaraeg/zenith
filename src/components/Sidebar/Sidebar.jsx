import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Sidebar.module.css";

// Nav items - icon + label + id for active tracking
// "href" is a placeholder until React Router is added in Phase 4
const NAV_ITEMS = [
  { id: "quests",  icon: "⚔️",  label: "Quest Board"  },
  { id: "armory",  icon: "🛡️",  label: "The Armory"   },
  { id: "history", icon: "📜",  label: "History"      },
  { id: "settings",icon: "⚙️",  label: "Settings"     },
];

export default function Sidebar() {
  // Active nav item tracked locally - routing will replace this in Phase 4
  const [activeId, setActiveId] = useState("quests");

  return (
    <aside className={styles.sidebar}>
      {/* Branding */}
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🏔️</span>
        <span className={styles.brandName}>Zenith</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeId === item.id ? styles.navItemActive : ""}`}
            onClick={() => setActiveId(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>

            {/* Animated active indicator pill */}
            {activeId === item.id && (
              <motion.div
                className={styles.activePill}
                layoutId="activePill"
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom tagline */}
      <div className={styles.sidebarFooter}>
        <p>Conquer your day,</p>
        <p>level your soul.</p>
      </div>
    </aside>
  );
}