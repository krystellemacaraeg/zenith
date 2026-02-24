import { motion } from "framer-motion";
import { useCharacter } from "../../context/CharacterContext";
import styles from "./ArmoryPage.module.css";

// Shop items - cost in gold, effect describes what they do to character stats
const SHOP_ITEMS = [
  {
    id: "health_potion",
    name: "Health Potion",
    description: "Restore 25 HP. Drink up, adventurer.",
    icon: "🧪",
    cost: 30,
    effect: (char) => ({ ...char, hp: Math.min(char.hp + 25, char.maxHp) }),
  },
  {
    id: "iron_shield",
    name: "Iron Shield",
    description: "Raise max HP by 20. Permanently.",
    icon: "🛡️",
    cost: 75,
    effect: (char) => ({ ...char, maxHp: char.maxHp + 20, hp: char.hp + 20 }),
  },
  {
    id: "xp_tome",
    name: "Tome of Knowledge",
    description: "Instantly gain 50 XP. Wisdom has a price.",
    icon: "📖",
    cost: 50,
    effect: null, // Handled separately via completeQuest-style XP logic
    xpGrant: 50,
  },
  {
    id: "gold_pouch",
    name: "Adventurer's Luck",
    description: "Gain 25 bonus Gold. Fortune favors the bold.",
    icon: "💰",
    cost: 40,
    effect: (char) => ({ ...char, gold: char.gold + 25 }),
  },
];

// Card animation - staggers in on page load
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: "spring", stiffness: 200, damping: 22 },
  }),
};

export default function ArmoryPage() {
  const { character, completeQuest } = useCharacter();

  // Direct character setter needed for stat effects - imported from context
  // Using a workaround: expose setCharacter via context for shop use
  const { applyShopItem } = useArmory();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>🛡️ The Armory</h2>
        <div className={styles.goldDisplay}>
          <span>⚜</span>
          <span>{character.gold} Gold</span>
        </div>
      </div>
      <p className={styles.pageSubtitle}>Spend your hard-earned gold on buffs and boons.</p>

      <div className={styles.itemGrid}>
        {SHOP_ITEMS.map((item, i) => {
          const canAfford = character.gold >= item.cost;
          return (
            <motion.div
              key={item.id}
              className={`${styles.itemCard} ${!canAfford ? styles.itemCardDisabled : ""}`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
            >
              <div className={styles.itemIcon}>{item.icon}</div>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemDesc}>{item.description}</p>
              </div>
              <button
                className={styles.buyBtn}
                disabled={!canAfford}
                onClick={() => applyShopItem(item)}
              >
                <span className={styles.btnGold}>⚜ {item.cost}</span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Small internal hook to keep the buy logic out of the JSX
function useArmory() {
  const { character, completeQuest } = useCharacter();

  // Need direct access to setCharacter for stat mutations - add shopPurchase to context
  const { shopPurchase } = useCharacter();

  const applyShopItem = (item) => {
    if (character.gold < item.cost) return;
    // XP tome uses the existing XP engine so leveling logic still applies
    if (item.xpGrant) {
      shopPurchase(item.cost, null, item.xpGrant);
    } else {
      shopPurchase(item.cost, item.effect);
    }
  };

  return { applyShopItem };
}