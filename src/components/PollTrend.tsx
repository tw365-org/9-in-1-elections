import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
        <span className="legend-note">鍵盤聚焦圖表後，可用左右方向鍵逐筆查看支持度。</span>
      </div>
    </section>
  );
}

const candidateColors = ["#bd523b", "#326c79", "#b18a3b", "#59624f", "#78669c"];

function PollSeriesChart({ label, polls }: { label: string; polls: PollRecord[] }) {
  const candidates = polls[0]?.candidates ?? [];
  const chartData = polls.map((poll) => ({
    ...Object.fromEntries(poll.candidates.map((candidate) => [candidate.candidateId, candidate.supportPercent])),
    surveyLabel: `${poll.pollster}・${poll.fieldworkEnd}`,
  }));

  return (
    <div className="series-chart">
      <div className="series-chart-header">
        <strong>{label}</strong>
        <span>{polls.length} 筆調查</span>
      </div>
      <div className="trend-chart" role="group" aria-label={`${label}民調趨勢圖`}>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={chartData} margin={{ top: 12, right: 16, bottom: 24, left: 4 }}>
            <CartesianGrid stroke="#e9e8e1" vertical={false} />
            <XAxis dataKey="surveyLabel" angle={-18} textAnchor="end" height={54} tick={{ fill: "#7a8481", fontSize: 10 }} />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} width={34} tick={{ fill: "#7a8481", fontSize: 10 }} unit="%" />
            <Tooltip formatter={(value, name) => [`${Number(value).toFixed(1)}%`, String(name)]} />
            <Legend />
            {candidates.map((candidate, index) => (
              <Line
                key={candidate.candidateId}
                type="linear"
                dataKey={candidate.candidateId}
                name={candidate.candidateName}
                stroke={candidateColors[index % candidateColors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="series-points" aria-label="各筆調查的來源與情境">
        {polls.map((poll) => (
          <article className="series-point-detail" key={poll.id}>
            <a href={poll.sourceUrl} target="_blank" rel="noreferrer">
              {poll.pollster}・{poll.fieldworkStart} 至 {poll.fieldworkEnd}・{poll.sampleSize === null ? "樣本數未提供" : `樣本數 ${poll.sampleSize}`}
            </a>
            {poll.is_mock ? <strong className="series-point-mock">模擬資料</strong> : null}
            <span>{poll.questionText}</span>
            <span>{poll.method ?? "調查方法未提供"}・{poll.sourceLabel}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
