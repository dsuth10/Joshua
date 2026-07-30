export type FamilyMastery = {
  family: number;
  percent: number;
  crestEarned?: boolean;
};

export type ExplorerProfileSummaryProps = {
  explorerName?: string;
  level: number;
  levelLabel?: string;
  coins: number;
  crestsEarned: number;
  crestsRequired: number;
  mastery: FamilyMastery[];
};

export function ExplorerProfileSummary({
  explorerName = "Explorer",
  level,
  levelLabel = "Trail level",
  coins,
  crestsEarned,
  crestsRequired,
  mastery,
}: ExplorerProfileSummaryProps) {
  const averageMastery = mastery.length
    ? Math.round(mastery.reduce((sum, item) => sum + item.percent, 0) / mastery.length)
    : 0;

  return (
    <aside className="tt-profile-summary" aria-labelledby="tt-profile-name">
      <div className="tt-profile-identity">
        <span className="tt-avatar" aria-hidden="true">🧭</span>
        <div>
          <strong id="tt-profile-name">{explorerName}</strong>
          <span>{levelLabel} {level}</span>
        </div>
      </div>

      <dl className="tt-profile-stats">
        <div>
          <dt>Coins</dt>
          <dd>🪙 {coins.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Trail crests</dt>
          <dd>{crestsEarned}/{crestsRequired}</dd>
        </div>
        <div>
          <dt>Average mastery</dt>
          <dd>{averageMastery}%</dd>
        </div>
      </dl>

      <div className="tt-mastery-chips" aria-label="Fact family mastery">
        {mastery.map((item) => (
          <span
            className={`${item.crestEarned ? "tt-mastery-chip--earned" : ""}`}
            title={`${item.family} times table: ${item.percent}% mastery`}
            key={item.family}
          >
            <b>×{item.family}</b>
            <small>{item.crestEarned ? "★" : `${item.percent}%`}</small>
          </span>
        ))}
      </div>
    </aside>
  );
}
