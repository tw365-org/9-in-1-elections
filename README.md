# 9-in-1-elections

台灣地方選舉選情分析小工具。第一版聚焦 2026 年台北市長選舉，以可追溯的公開資料呈現民調支持度、民調趨勢與歷史選舉結果。

> 民調支持度是調查結果，不代表勝選機率或已驗證的得票預測。尚未經來源查證的民調不會加入資料集。

## 專案狀態

前端已開始建置。目前趨勢頁以空資料狀態呈現；青年投票率情境試算在可追溯輸入、計算公式及假設備妥前維持停用。

## 技術架構

- React、Vite、TypeScript
- 版本控制中的靜態 JSON
- Cloudflare Workers Static Assets
- 手寫 SVG 趨勢圖，保留鍵盤操作與文字替代資訊

## 本機開發

```sh
pnpm install
pnpm dev
```

建立正式靜態檔：

```sh
pnpm build
```

Cloudflare 部署：

```sh
pnpm deploy
```

部署前需先完成 Wrangler 登入及 Cloudflare 帳號設定。部署會先建置 Vite 靜態檔，再由 Wrangler 發佈 `dist/`。

## 資料原則

- 每筆民調保留來源、調查日期、機構及調查情境，並連結原始報告。
- 候選人組合、調查母體或題目情境不一致的民調，不得混成同一趨勢線。
- 不以插值或平滑補出不存在的民調資料；資料不足時明確標示。
- 測試資料須在資料及介面上標示為模擬資料。
- 公開資料前核對來源使用條款及必要標示；無法確認可否重製時，不公開擷取數值。
- 情境結果須顯示輸入資料、假設及公式版本，並標示「情境試算，非選舉預測」。

## 更新資料

資料以 JSON 靜態維護：民調放在 `public/data/polls.json`，歷史摘要放在 `public/data/history.json`；欄位規格位於 `src/data/schemas/`。每筆民調需附原始報告連結、調查日期與比較情境。第一版不會自動抓取或推估未提供的數字。

## 文件

- [軟體設計文件（SDD）](docs/design.md)
- [提案](docs/proposal.md)
- [需求規格](docs/specs.md)
- [實作任務清單](docs/tasks.md)
- [專案文件審查判決紀錄](docs/judgment-record.md)

## 來源

2022 年台北市長選舉當選人票數與投票概況連結於介面及 `public/data/history.json`。民調資料目前尚未匯入。
