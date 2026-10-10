import type { PollRecord } from "../data/types";
import { getRecentPolls } from "../data/polls";
import { SectionHeading } from "./SectionHeading";

interface PollStatusProps {
  polls: PollRecord[];
  error: string | null;
}

export function PollStatus({ polls, error }: PollStatusProps) {
  const newestPoll = getRecentPolls(polls).sort((left, right) =>
    right.fieldworkEnd.localeCompare(left.fieldworkEnd),
  )[0];

  return (
    <section className="panel poll-panel" id="polls" aria-labelledby="poll-heading">
      <SectionHeading
        titleId="poll-heading"
        eyebrow="最新觀測"
        title="民調概況"
        description="保留原始調查情境，支持度不等於選舉預測。"
        trailing={<span className="pill pill-muted">近 30 天</span>}
      />

      {error ? (
        <div className="empty-state empty-state-error" role="alert">
          <span className="empty-icon" aria-hidden="true">!</span>
          <div>
            <h3>資料暫時無法讀取</h3>
            <p>{error}</p>
          </div>
        </div>
      ) : newestPoll ? (
        <div className="poll-latest">
          <div className="poll-latest-meta">
            <span>{newestPoll.pollster}</span>
            <span>調查至 {newestPoll.fieldworkEnd}</span>
            {newestPoll.is_mock ? <span className="pill pill-warning">模擬資料</span> : null}
          </div>
          <p className="poll-sample-size">調查期間 {newestPoll.fieldworkStart} 至 {newestPoll.fieldworkEnd}・{newestPoll.sampleSize === null ? "樣本數未提供" : `有效樣本 ${newestPoll.sampleSize.toLocaleString()} 人`}</p>
          <h3>{newestPoll.questionText}</h3>
          <ul className="candidate-list">
            {newestPoll.candidates.map((candidate) => (
              <li key={candidate.candidateId}>
                <span>{candidate.candidateName}</span>
                <strong>{candidate.supportPercent.toFixed(1)}%</strong>
              </li>
            ))}
          </ul>
          <a className="source-link" href={newestPoll.sourceUrl} target="_blank" rel="noreferrer">
            查看原始來源 <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">—</span>
          <div>
            <h3>尚無已核實民調</h3>
            <p>資料集目前沒有符合來源與比較條件的近期調查，因此不顯示支持度數字。</p>
          </div>
        </div>
      )}

      <div className="panel-footnote">
        <span className="status-dot" aria-hidden="true" />
        僅呈現具原始報告連結及調查日期的資料
      </div>
    </section>
  );
}
