import { SectionHeading } from "./SectionHeading";

const missingInputs = [
  "20–29 歲候選人交叉支持度",
  "族群人口權重與基準投票率",
  "未決定比例處理方式",
  "可追溯且有版本的計算公式",
];

export function ScenarioPanel() {
  return (
    <section className="panel scenario-panel" id="scenario" aria-labelledby="scenario-heading">
      <SectionHeading
        titleId="scenario-heading"
        eyebrow="假設工具"
        title="青年投票率情境"
        description="這是條件式功能，不是勝選機率或選舉預測。"
        trailing={<span className="pill pill-warning">目前停用</span>}
      />

      <label className="slider-label" htmlFor="turnout-assumption">
        <span>20–29 歲族群投票率假設</span>
        <span className="slider-value">—</span>
      </label>
      <input
        id="turnout-assumption"
        className="assumption-slider"
        type="range"
        min="0"
        max="100"
        value="0"
        disabled
        aria-describedby="scenario-reason"
      />

      <div className="scenario-notice" id="scenario-reason">
        <span className="notice-icon" aria-hidden="true">i</span>
        <div>
          <strong>資料與計算規則尚未備齊</strong>
          <p>缺少項目補齊、來源可追溯後，才會啟用試算。</p>
        </div>
      </div>

      <ul className="missing-list">
        {missingInputs.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
