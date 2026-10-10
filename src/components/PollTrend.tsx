import type { PollRecord } from "../data/types";
import { getRecentPolls, groupComparablePolls } from "../data/polls";
import { SectionHeading } from "./SectionHeading";

interface PollTrendProps {
  polls: PollRecord[];
}

export function PollTrend({ polls }: PollTrendProps) {
  const recentPolls = getRecentPolls(polls);
  const series = groupComparablePolls(recentPolls);

  return (
    <section className="panel trend-panel" id="trend" aria-labelledby="trend-heading">
      <SectionHeading
        titleId="trend-heading"
        eyebrow="時間序列"
        title="民調趨勢"
        description="只有候選人組合、調查母體與題目情境一致的調查會歸在同一系列。"
        trailing={<span className="trend-window">30 日觀測窗</span>}
      />

      {series.length === 0 ? (
        <div className="chart-empty" role="status">
          <svg className="chart-empty-illustration" viewBox="0 0 520 150" role="img" aria-labelledby="chart-title chart-desc">
            <title id="chart-title">目前沒有可繪製的民調資料</title>
            <desc id="chart-desc">空白座標圖，代表尚未匯入近三十天的可比較民調。</desc>
            <path d="M34 18v104h460" className="chart-axis" />
            <path d="M34 47h460M34 76h460M34 105h460" className="chart-grid" />
            <text x="16" y="22" className="chart-label">100</text>
            <text x="22" y="80" className="chart-label">50</text>
            <text x="27" y="126" className="chart-label">0</text>
            <text x="35" y="143" className="chart-label">30 天前</text>
            <text x="464" y="143" className="chart-label">現在</text>
          </svg>
          <div className="chart-empty-copy">
            <span className="chart-empty-kicker">NO VERIFIED POLLS</span>
            <p>目前沒有近 30 天且符合比較條件的民調資料。</p>
            <span>不連線、不補值，也不推估缺少的日期。</span>
          </div>
        </div>
      ) : (
        <div className="series-list" aria-label="符合比較條件的民調系列">
          {series.map((group) => (
            <PollSeriesChart key={group.id} label={group.label} polls={group.polls} />
          ))}
        </div>
      )}

      <div className="chart-legend">
        <span><i className="legend-dot legend-poll" />民調數值</span>
        <span className="legend-note">跨機構比較時仍保留各自來源標籤</span>
      </div>
    </section>
  );
}

const candidateColors = ["#bd523b", "#326c79", "#b18a3b", "#59624f", "#78669c"];

function PollSeriesChart({ label, polls }: { label: string; polls: PollRecord[] }) {
  const chartWidth = 680;
  const chartHeight = 190;
  const left = 38;
  const right = chartWidth - 12;
  const top = 14;
  const bottom = chartHeight - 30;
  const dates = polls.map((poll) => new Date(poll.fieldworkEnd).getTime()).filter(Number.isFinite);
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const range = Math.max(maxDate - minDate, 1);
  const candidates = polls[0]?.candidates ?? [];

  const point = (index: number, support: number) => {
    const poll = polls[index];
    const x = left + ((new Date(poll.fieldworkEnd).getTime() - minDate) / range) * (right - left);
    const y = bottom - (support / 100) * (bottom - top);
    return { x, y };
  };

  return (
    <div className="series-chart">
      <div className="series-chart-header">
        <strong>{label}</strong>
        <span>{polls.length} 筆調查</span>
      </div>
      <svg className="trend-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`${label}民調趨勢圖，共 ${polls.length} 筆調查`}>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = bottom - (tick / 100) * (bottom - top);
          return (
            <g key={tick}>
              <line x1={left} y1={y} x2={right} y2={y} className="chart-grid-line" />
              <text x={left - 9} y={y + 4} textAnchor="end" className="chart-tick">{tick}</text>
            </g>
          );
        })}
        {candidates.map((candidate, candidateIndex) => {
          const color = candidateColors[candidateIndex % candidateColors.length];
          const points = polls.map((poll, pollIndex) => {
            const value = poll.candidates.find((entry) => entry.candidateId === candidate.candidateId);
            return value ? { ...point(pollIndex, value.supportPercent), poll, value } : null;
          }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);
          const path = points.map((entry, index) => `${index === 0 ? "M" : "L"}${entry.x},${entry.y}`).join(" ");

          return (
            <g key={candidate.candidateId}>
              {points.length > 1 ? <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> : null}
              {points.map((entry) => (
                <circle key={entry.poll.id} cx={entry.x} cy={entry.y} r="4.5" fill={color}>
                  <title>{`${entry.value.candidateName} ${entry.value.supportPercent.toFixed(1)}%｜${entry.poll.pollster}｜${entry.poll.fieldworkEnd}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="chart-axis-line" />
      </svg>
      <div className="series-legend">
        {candidates.map((candidate, index) => (
          <span key={candidate.candidateId}>
            <i style={{ backgroundColor: candidateColors[index % candidateColors.length] }} />
            {candidate.candidateName}
          </span>
        ))}
      </div>
      <div className="series-points">
        {polls.map((poll) => (
          <a key={poll.id} href={poll.sourceUrl} target="_blank" rel="noreferrer" title={`${poll.pollster}｜${poll.fieldworkEnd}`}>
            {poll.pollster}・{poll.fieldworkEnd.slice(5)}
          </a>
        ))}
      </div>
    </div>
  );
}
