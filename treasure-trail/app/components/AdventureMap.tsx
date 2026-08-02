"use client";

export type TrailNodeStatus = "locked" | "available" | "current" | "completed";

export type TrailNode = {
  id: string;
  name: string;
  region: string;
  icon: string;
  facts: number[];
  status: TrailNodeStatus;
  questionCount: number;
  masteryPercent: number;
  rewardCoins?: number;
  unlockHint?: string;
};

export type AdventureMapProps = {
  nodes: TrailNode[];
  selectedNodeId?: string;
  onSelectNode: (nodeId: string) => void;
  onStartNode?: (nodeId: string) => void;
};

const statusText: Record<TrailNodeStatus, string> = {
  locked: "Locked",
  available: "Ready",
  current: "Current trail",
  completed: "Completed",
};

export function AdventureMap({
  nodes,
  selectedNodeId,
  onSelectNode,
  onStartNode,
}: AdventureMapProps) {
  const regions = nodes.reduce<string[]>((list, node) => {
    if (!list.includes(node.region)) list.push(node.region);
    return list;
  }, []);

  return (
    <section className="tt-adventure-map" aria-labelledby="tt-map-title">
      <header className="tt-panel-heading">
        <div>
          <p className="tt-kicker">Adventure trail</p>
          <h2 id="tt-map-title">Choose the next route</h2>
        </div>
        <p className="tt-panel-note">Every stop has at least 12 questions.</p>
      </header>

      <div className="tt-map-regions">
        {regions.map((region, regionIndex) => (
          <section
            className="tt-map-region"
            aria-labelledby={`tt-region-${regionIndex}`}
            key={region}
          >
            <h3 id={`tt-region-${regionIndex}`}>
              <span aria-hidden="true">{regionIndex + 1}</span>
              {region}
            </h3>
            <div className="tt-node-row">
              {nodes.filter((node) => node.region === region).map((node) => {
                const isLocked = node.status === "locked";
                const isSelected = node.id === selectedNodeId;
                const factLabel = node.facts.map((fact) => `×${fact}`).join(", ");

                return (
                  <article
                    className={[
                      "tt-trail-node",
                      `tt-trail-node--${node.status}`,
                      isSelected ? "tt-trail-node--selected" : "",
                    ].filter(Boolean).join(" ")}
                    key={node.id}
                  >
                    <button
                      type="button"
                      className="tt-node-select"
                      disabled={isLocked}
                      aria-pressed={isSelected}
                      aria-describedby={`tt-node-detail-${node.id}`}
                      onClick={() => onSelectNode(node.id)}
                    >
                      <span className="tt-node-icon" aria-hidden="true">
                        {isLocked ? "🔒" : node.icon}
                      </span>
                      <span className="tt-node-copy">
                        <strong>{node.name}</strong>
                        <span>{factLabel}</span>
                      </span>
                      <span className="tt-node-status">{statusText[node.status]}</span>
                    </button>

                    <div className="tt-node-detail" id={`tt-node-detail-${node.id}`}>
                      <span>{node.questionCount}+ questions</span>
                      <span>{node.masteryPercent}% mastery</span>
                      {node.rewardCoins ? <span>🪙 {node.rewardCoins}</span> : null}
                    </div>

                    {isLocked && node.unlockHint ? (
                      <p className="tt-unlock-hint">{node.unlockHint}</p>
                    ) : null}

                    {isSelected && !isLocked && onStartNode ? (
                      <button
                        type="button"
                        className="tt-primary-action"
                        onClick={() => onStartNode(node.id)}
                      >
                        Begin this expedition
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
