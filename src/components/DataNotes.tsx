import type { ElectionSummary, PollRecord } from "../data/types";

interface DataNotesProps {
  pollUpdatedAt: string | null;
  polls: PollRecord[];
  election: ElectionSummary | null;
}

export function DataNotes({ pollUpdatedAt, polls, election }: DataNotesProps) {
  const pollSources = [...new Map(polls.map((poll) => [poll.sourceUrl, poll.sourceLabel])).entries()];
  const mockCount = polls.filter((poll) => poll.is_mock).length;

  return (
    <section className="data-notes" id="sources" aria-labelledby="sources-heading">
      <div className="notes-title">
        <p className="eyebrow">方法與來源</p>
        <h2 id="sources-heading">先看資料，再看解讀</h2>
      </div>
      <div className="notes-items">
        <article>
          <span className="notes-number">01</span>
          <div>
            <h3>資料更新日期與來源</h3>
            <p>民調資料更新：{pollUpdatedAt ? new Date(pollUpdatedAt).toLocaleString("zh-TW") : "尚未提供"}。</p>
            {pollSources.length > 0 ? <ul>{pollSources.map(([url, label]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">民調：{label}</a></li>)}</ul> : <p>目前沒有已匯入民調來源。</p>}
            {election?.sources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">歷史資料：{source.label}</a>（{source.supports}）</p>)}
          </div>
        </article>
        <article>
          <span className="notes-number">02</span>
          <div>
            <h3>欄位與比較規則</h3>
            <p>民調記錄包含調查機構、委託單位、調查起訖日、公布日、樣本數、母體、方法、誤差範圍、題目、候選人支持度、未決定比例與原始來源。未知欄位明確留空。</p>
            <p>候選人組合、調查母體或題目情境不同時分開呈現；僅連接同組實際調查，不補值。</p>
          </div>
        </article>
        <article>
          <span className="notes-number">03</span>
          <div>
            <h3>模擬資料與試算假設</h3>
            <p>資料列以 <code>is_mock: true</code> 標示模擬資料；目前資料集中有 {mockCount} 筆模擬資料。</p>
            <p>20–29 歲情境試算目前停用。年齡交叉支持度、人口權重、基準投票率、未決定比例處理方式與可追溯公式尚未齊備，不以全體支持度代替。</p>
          </div>
        </article>
      </div>
    </section>
  );
}
