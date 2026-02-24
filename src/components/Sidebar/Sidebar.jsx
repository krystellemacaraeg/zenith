import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/",         icon: "⚔️",  label: "Quest Board"  },
  { to: "/armory",   icon: "🛡️",  label: "The Armory"   },
  { to: "/history",  icon: "📜",  label: "History"      },
  { to: "/settings", icon: "⚙️",  label: "Settings"     },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    // On mobile: sidebar slides in from the left when isOpen is true
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🏔️</span>
        <span className={styles.brandName}>Zenith</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            // Close the sidebar after navigating on mobile
            onClick={onClose}
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