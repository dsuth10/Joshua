"use client";

export type TrailEncounterChoice = {
  id: string;
  label: string;
  description?: string;
  rewardLabel?: string;
  disabled?: boolean;
};

export type TrailEncounter = {
  id: string;
  kind: "event" | "guardian";
  icon: string;
  title: string;
  story: string;
  challengeLabel: string;
  choices: TrailEncounterChoice[];
};

export type TrailEncounterCardProps = {
  encounter: TrailEncounter;
  onChoose: (choiceId: string) => void;
  onLeave?: () => void;
};

export function TrailEncounterCard({
  encounter,
  onChoose,
  onLeave,
}: TrailEncounterCardProps) {
  return (
    <section
      className={`tt-encounter tt-encounter--${encounter.kind}`}
      aria-labelledby={`tt-encounter-${encounter.id}`}
    >
      <div className="tt-encounter-art" aria-hidden="true">{encounter.icon}</div>
      <div className="tt-encounter-content">
        <p className="tt-kicker">
          {encounter.kind === "guardian" ? "Guardian challenge" : "Trail event"}
        </p>
        <h2 id={`tt-encounter-${encounter.id}`}>{encounter.title}</h2>
        <p>{encounter.story}</p>
        <strong className="tt-challenge-label">{encounter.challengeLabel}</strong>

        <div className="tt-choice-list" role="group" aria-label="Choose what to do">
          {encounter.choices.map((choice) => (
            <button
              type="button"
              className="tt-encounter-choice"
              disabled={choice.disabled}
              key={choice.id}
              onClick={() => onChoose(choice.id)}
            >
              <span>
                <strong>{choice.label}</strong>
                {choice.description ? <small>{choice.description}</small> : null}
              </span>
              {choice.rewardLabel ? <em>{choice.rewardLabel}</em> : null}
            </button>
          ))}
        </div>

        {onLeave ? (
          <button type="button" className="tt-text-action" onClick={onLeave}>
            Return to the map
          </button>
        ) : null}
      </div>
    </section>
  );
}
