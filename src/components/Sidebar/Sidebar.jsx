import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/",        icon: "⚔️",  label: "Quest Board"  },
  { to: "/armory",  icon: "🛡️",  label: "The Armory"   },
  { to: "/history", icon: "📜",  label: "History"      },
  { to: "/settings",icon: "⚙️",  label: "Settings"     },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🏔️</span>
        <span className={styles.brandName}>Zenith</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            // "end" on the root route prevents it matching every route
            end={item.to === "/"}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <p>Conquer your day,</p>
        <p>level your soul.</p>
      </div>
    </aside>
  );
}