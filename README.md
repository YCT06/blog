# 蔡鎰群的個人筆記

記錄程式開發、數位創作、語言學習、生活隨筆與閱讀心得的個人部落格。

正式網站：<https://blog.tsaiyichiun.com>

## 技術棧

- [Astro](https://astro.build)（靜態輸出，無 SSR、無資料庫、無登入）
- [Pagefind](https://pagefind.app) 全文搜尋
- [Giscus](https://giscus.app)（GitHub Discussions 留言）
- Cloudflare Web Analytics
- 部署到 Cloudflare Workers static assets（[Wrangler](https://developers.cloudflare.com/workers/wrangler/)）

## 開發需求

- Node.js `>=22.12.0`（見 `package.json` 的 `engines`）

## 開始開發

```sh
npm install
npm run dev
```

開發伺服器預設在 `http://localhost:4321`。

## 指令

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 啟動本機開發伺服器 |
| `npm run check` | Astro 型別檢查 |
| `npm run build` | 建置正式版本到 `dist/`，並用 Pagefind 產生搜尋索引 |
| `npm run preview` | 用 Vite 預覽 `dist/`（不會套用 Cloudflare 的 headers／routing 規則） |
| `npm run preview:cf` | 用 `wrangler dev` 預覽 `dist/`，會套用 `wrangler.jsonc` 的規則與 `public/_headers`，比 `preview` 更接近正式環境 |
| `npm run og:generate` | 重新產生 `public/og/` 底下 5 張分類預設社群分享圖（只在分類配色／文案調整時需要重跑） |
| `npm run deploy` | 部署到 Cloudflare（見下方「部署」） |
| `node --test` | 執行測試（`tests/`，需要先 `npm run build`） |

## 新增文章

每篇文章是 `src/content/articles/` 底下一個獨立資料夾：

```text
src/content/articles/
└─ my-new-post/
   ├─ index.md
   └─ 圖片（需要時放在同一個資料夾）
```

`index.md` 的 frontmatter：

```yaml
---
title: 文章標題
description: 一到兩句話的摘要
slug: my-new-post
pubDate: 2026-01-01
category: development
tags:
  - astro
# 選填：
# updatedDate: 2026-01-15
# cover:
#   src: ./cover.png
#   alt: 封面圖片的文字描述
---
```

- `slug` 決定文章網址（`/articles/:slug/`），是長期契約，發布後不要更動；真的需要改，要同時規劃 redirect。
- `category` 必須是 `src/data/taxonomy.ts` 裡 `CATEGORY_IDS` 已有的值；`tags` 是 `TAG_IDS` 的子集。新分類／標籤要先加進 `taxonomy.ts` 的 registry（同時補上 `CATEGORY_LABELS`／`TAG_LABELS` 的中文顯示名稱），才能在文章裡使用。
- 沒有 `draft` 欄位——這是 public repository，未完成的文章請不要先合併到 `main`。

寫完後本機驗證：

```sh
npm run check
npm run build
node --test
```

全文搜尋索引只會收錄有 `data-pagefind-body` 標記的內容（目前只有文章頁本身），新文章會自動被下一次 `npm run build` 索引，不需要額外設定。

## 部署

部署是手動流程，不會因為 push 到 `main` 就自動上線：

```sh
npm run build
npm run deploy
```

`npm run deploy` 會用 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 把 `dist/` 上傳到 Cloudflare Workers（設定在 `wrangler.jsonc`），並更新 `blog.tsaiyichiun.com` 這個自訂網域。第一次在新機器上執行前，需要先 `npx wrangler login` 登入 Cloudflare 帳號。

### 回復（Rollback）

如果部署後發現問題，用 Wrangler 回到前一個版本，不需要重新 build 或改程式碼：

```sh
npx wrangler deployments list   # 列出最近的部署與各自的 version id
npx wrangler rollback <version-id>
```

## CI

`.github/workflows/ci.yml` 會在 push／PR 到 `main` 時自動執行型別檢查、建置與測試（跟本機 `npm run check && npm run build && node --test` 是同一組檢查）。這個檢查不會觸發部署，純粹是安全網。

`.github/dependabot.yml` 每週檢查 npm 套件與 GitHub Actions 版本更新，只會開 Pull Request，不會自動合併。

## 授權

- 程式碼採 [MIT License](./LICENSE)。
- `src/content/articles/` 底下的文章內容採 [CC BY-NC 4.0](./CONTENT_LICENSE.md)，與程式碼授權分開，使用前請詳閱該檔案的條款。
- 第三方引用、圖片、字型與讀者留言，不因出現在本站而自動適用上述授權。
