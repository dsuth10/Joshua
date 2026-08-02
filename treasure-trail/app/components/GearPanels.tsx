"use client";

export type GearItem = {
  id: string;
  name: string;
  icon: string;
  description: string;
  effectLabel: string;
  owned: boolean;
  equipped: boolean;
  cost: number;
  rarity?: "common" | "uncommon" | "rare";
};

export type ExpeditionLoadoutProps = {
  gear: GearItem[];
  slotLimit: number;
  onEquip: (gearId: string) => void;
  onUnequip: (gearId: string) => void;
};

export function ExpeditionLoadout({
  gear,
  slotLimit,
  onEquip,
  onUnequip,
}: ExpeditionLoadoutProps) {
  const owned = gear.filter((item) => item.owned);
  const equippedCount = owned.filter((item) => item.equipped).length;

  return (
    <section className="tt-loadout" aria-labelledby="tt-loadout-title">
      <header className="tt-panel-heading">
        <div>
          <p className="tt-kicker">Backpack</p>
          <h2 id="tt-loadout-title">Expedition loadout</h2>
        </div>
        <strong className="tt-slot-count" aria-label={`${equippedCount} of ${slotLimit} gear slots filled`}>
          {equippedCount}/{slotLimit} equipped
        </strong>
      </header>

      {owned.length ? (
        <ul className="tt-gear-list">
          {owned.map((item) => {
            const atLimit = equippedCount >= slotLimit && !item.equipped;
            return (
              <li
                className={`tt-gear-card tt-gear-card--${item.rarity ?? "common"}${item.equipped ? " tt-gear-card--equipped" : ""}`}
                key={item.id}
              >
                <span className="tt-gear-icon" aria-hidden="true">{item.icon}</span>
                <div className="tt-gear-copy">
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                  <small>{item.effectLabel}</small>
                </div>
                <button
                  type="button"
                  className="tt-gear-toggle"
                  disabled={atLimit}
                  aria-pressed={item.equipped}
                  onClick={() => item.equipped ? onUnequip(item.id) : onEquip(item.id)}
                >
                  {item.equipped ? "Unequip" : atLimit ? "Backpack full" : "Equip"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="tt-empty-state">
          <span aria-hidden="true">🎒</span>
          <p>Your backpack is empty. Visit the Trading Post to find useful gear.</p>
        </div>
      )}
    </section>
  );
}

export type GearShopProps = {
  gear: GearItem[];
  coins: number;
  onBuy: (gearId: string) => void;
};

export function GearShop({ gear, coins, onBuy }: GearShopProps) {
  return (
    <section className="tt-shop" aria-labelledby="tt-shop-title">
      <header className="tt-panel-heading">
        <div>
          <p className="tt-kicker">Base camp</p>
          <h2 id="tt-shop-title">Trading Post</h2>
        </div>
        <strong className="tt-coin-balance" aria-label={`${coins} coins available`}>
          🪙 {coins}
        </strong>
      </header>

      <ul className="tt-shop-grid">
        {gear.map((item) => {
          const canAfford = coins >= item.cost;
          return (
            <li className={`tt-shop-item tt-shop-item--${item.rarity ?? "common"}`} key={item.id}>
              <span className="tt-gear-icon" aria-hidden="true">{item.icon}</span>
              <div className="tt-gear-copy">
                <strong>{item.name}</strong>
                <p>{item.description}</p>
                <small>{item.effectLabel}</small>
              </div>
              {item.owned ? (
                <span className="tt-owned-label">Owned</span>
              ) : (
                <button
                  type="button"
                  className="tt-buy-button"
                  disabled={!canAfford}
                  onClick={() => onBuy(item.id)}
                  aria-label={`Buy ${item.name} for ${item.cost} coins`}
                >
                  {canAfford ? `Buy · 🪙 ${item.cost}` : `Need 🪙 ${item.cost}`}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
