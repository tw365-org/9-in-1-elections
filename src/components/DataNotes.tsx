export function DataNotes() {
  return (
    <section className="data-notes" id="sources" aria-labelledby="sources-heading">
      <div className="notes-title">
        <p className="eyebrow">方法與來源</p>
        <h2 id="sources-heading">先看資料，再看解讀</h2>
      </div>
      <div className="notes-items">
        <article>
          <span className="notes-number">01</span>
          <div><h3>調查情境不可混比</h3><p>候選人名單、調查母體或問題情境不同時，分開呈現。</p></div>
        </article>
        <article>
          <span className="notes-number">02</span>
          <div><h3>不補不存在的趨勢</h3><p>只畫出實際公布的調查，不以插值或平滑補點。</p></div>
        </article>
        <article>
          <span className="notes-number">03</span>
          <div><h3>來源條款先確認</h3><p>無法確認重製條件的資料，不會公開擷取數值。</p></div>
        </article>
      </div>
    </section>
  );
}
