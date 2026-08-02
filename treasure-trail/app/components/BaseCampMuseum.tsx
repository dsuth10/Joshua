"use client";

export type RelicItem = {
  id: string;
  name: string;
  icon: string;
  region: string;
  found: boolean;
  description?: string;
  fragmentCount?: number;
  fragmentsRequired?: number;
};

export type BaseCampMuseumProps = {
  relics: RelicItem[];
  onInspectRelic?: (relicId: string) => void;
};

export function BaseCampMuseum({
  relics,
  onInspectRelic,
}: BaseCampMuseumProps) {
  const foundCount = relics.filter((relic) => relic.found).length;
  const percent = relics.length ? Math.round((foundCount / relics.length) * 100) : 0;

  return (
    <section className="tt-museum" aria-labelledby="tt-museum-title">
      <header className="tt-panel-heading">
        <div>
          <p className="tt-kicker">Base camp collection</p>
          <h2 id="tt-museum-title">Relic Museum</h2>
        </div>
        <strong>{foundCount}/{relics.length} discovered</strong>
      </header>

      <div className="tt-museum-progress">
        <div
          className="tt-progress-track"
          role="progressbar"
          aria-label="Relic collection progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <span style={{ width: `${percent}%` }} />
        </div>
        <span>{percent}% restored</span>
      </div>

      <ul className="tt-relic-grid">
        {relics.map((relic) => {
          const fragments = relic.fragmentCount ?? 0;
          const required = relic.fragmentsRequired ?? 1;
          return (
            <li className={`tt-relic-card${relic.found ? " tt-relic-card--found" : " tt-relic-card--missing"}`} key={relic.id}>
              <button
                type="button"
                disabled={!relic.found || !onInspectRelic}
                onClick={() => onInspectRelic?.(relic.id)}
                aria-label={relic.found ? `Inspect ${relic.name}` : `Undiscovered relic from ${relic.region}`}
              >
                <span className="tt-relic-icon" aria-hidden="true">{relic.found ? relic.icon : "?"}</span>
                <span>
                  <strong>{relic.found ? relic.name : "Unknown relic"}</strong>
                  <small>{relic.region}</small>
                </span>
              </button>
              {!relic.found && relic.fragmentsRequired ? (
                <div className="tt-fragment-progress" aria-label={`${fragments} of ${required} fragments found`}>
                  <span style={{ width: `${Math.min(100, (fragments / required) * 100)}%` }} />
                  <small>{fragments}/{required} fragments</small>
                </div>
              ) : relic.description ? <p>{relic.description}</p> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
