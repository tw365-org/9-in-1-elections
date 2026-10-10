import { useEffect, useState } from "react";
import { DataNotes } from "../components/DataNotes";
import { HistoryCard } from "../components/HistoryCard";
import { PollStatus } from "../components/PollStatus";
import { PollTrend } from "../components/PollTrend";
import { ScenarioPanel } from "../components/ScenarioPanel";
import { loadElectionDataset } from "../data/history";
import { getRecentPolls, loadPollDataset } from "../data/polls";
import type { ElectionSummary, PollRecord } from "../data/types";

export function App() {
  const [polls, setPolls] = useState<PollRecord[]>([]);
  const [election, setElection] = useState<ElectionSummary | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const recentVerifiedPollCount = getRecentPolls(polls).filter((poll) => !poll.isMock).length;

  useEffect(() => {
    let active = true;

    Promise.all([loadPollDataset(), loadElectionDataset()])
      .then(([pollDataset, electionDataset]) => {
        if (!active) return;
        setPolls(pollDataset.polls);
        setElection(electionDataset.elections[0] ?? null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setPollError(error instanceof Error ? error.message : "資料讀取失敗。");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="選情觀測站首頁">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M4 24.5h24M7 20l5-6 4 3 8-10" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="7" r="2.3" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-name">選情觀測站</span>
        </a>
        <nav className="topnav" aria-label="主要導覽">
          <a href="#polls">民調</a>
          <a href="#trend">趨勢</a>
          <a href="#history">歷史結果</a>
          <a href="#scenario">情境試算</a>
        </nav>
        <div className="header-status">
          <span className="status-pulse" aria-hidden="true" />
          <span>資料可追溯優先</span>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="hero-kicker-line" />
              <span>2026 地方選舉觀測</span>
              <span className="hero-kicker-dot">／</span>
              <span>臺北市</span>
            </div>
            <h1>把選情看清楚，<br /><em>從每一筆資料開始。</em></h1>
            <p className="hero-description">民調、歷史結果與情境假設分開呈現。每個數字都有來處，每條趨勢都有比較條件。</p>
            <div className="hero-meta">
              <span className="hero-meta-icon" aria-hidden="true">◷</span>
              <a href="https://www.cec.gov.tw/central/article/61722" target="_blank" rel="noreferrer">投票日 2026.11.28 <span aria-hidden="true">↗</span></a>
              <span className="meta-separator" />
              <span>{loading ? "正在讀取資料" : "民調資料待核實匯入"}</span>
            </div>
          </div>
          <div className="hero-side" aria-label="選情資料狀態">
            <div className="hero-side-label">POLLS VERIFIED</div>
            <div className="hero-side-value">{loading ? "···" : recentVerifiedPollCount}</div>
            <div className="hero-side-caption">筆近 30 天可比較民調</div>
            <div className="hero-side-divider" />
            <div className="hero-side-bottom">
              <span className="hero-side-dot" />
              {pollError ? "資料讀取異常" : "等待來源查核"}
            </div>
          </div>
          <div className="hero-watermark" aria-hidden="true">01</div>
        </section>

        <section className="dashboard-grid" aria-label="台北市長選情儀表板">
          <div className="dashboard-main">
            <PollStatus polls={polls} error={pollError} />
            <PollTrend polls={polls} />
          </div>
          <aside className="dashboard-aside" aria-label="歷史資料與情境工具">
            {election ? <HistoryCard election={election} /> : (
              <section className="panel history-panel"><h2>尚無歷史資料</h2><p>歷史選舉資料載入後將顯示於此。</p></section>
            )}
            <ScenarioPanel />
          </aside>
        </section>

        <DataNotes />
      </main>

      <footer className="footer">
        <div className="footer-brand"><span className="footer-brand-mark">選</span><span>選情觀測站</span></div>
        <p>民調是觀測資料，情境是條件假設。兩者都不等於選舉預測。</p>
        <a href="#sources">資料方法與來源 <span aria-hidden="true">↑</span></a>
      </footer>
    </div>
  );
}
