import type { ElectionSummary } from "../data/types";
import { SectionHeading } from "./SectionHeading";

interface HistoryCardProps {
  election: ElectionSummary;
}

const numberFormat = new Intl.NumberFormat("zh-TW");

export function HistoryCard({ election }: HistoryCardProps) {
  return (
    <section className="panel history-panel" id="history" aria-labelledby="history-heading">
      <SectionHeading
        titleId="history-heading"
        eyebrow="歷史基準"
        title="上屆市長選舉"
        description={`${election.electionDate.replaceAll("-", ".")}・臺北市市長`}
      />

      <div className="history-winner">
        <div>
          <span className="history-label">當選人</span>
          <h3>{election.winner.name}</h3>
          <span className="history-party">{election.winner.party}</span>
        </div>
        <div className="winner-votes">
          <strong>{numberFormat.format(election.winner.votes)}</strong>
          <span>得票數</span>
        </div>
      </div>

      <div className="history-stats">
        <div>
          <span>投票率</span>
          <strong>{election.turnoutRate.toFixed(2)}%</strong>
        </div>
        <div>
          <span>選舉人數</span>
          <strong>{numberFormat.format(election.eligibleVoters)}</strong>
        </div>
        <div>
          <span>投票數</span>
          <strong>{numberFormat.format(election.votesCast)}</strong>
        </div>
      </div>

      <div className="source-list">
        {election.sources.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
            <span>{source.label}</span>
            <span className="source-supports">{source.supports}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
      <p className="history-note">本區目前呈現當選者及整體投票概況，尚未列出完整候選人得票分布。</p>
    </section>
  );
}
