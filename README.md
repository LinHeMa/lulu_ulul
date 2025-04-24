# lulu_ulul

當然可以，這是你可以直接交給工程師的版本，已整理成清楚的 Markdown 文件格式👇

⸻

🧑‍💻 軟體工程師個人部落格 MVP 規格書（使用 GitHub Issues + SvelteKit）

🎯 專案目標

建立一個使用 GitHub Issues 作為內容來源的個人部落格，透過 SvelteKit 建立前端頁面，快速部署並具備擴充性。可撰寫、展示技術文章與專案紀錄。

⸻

🧱 架構總覽

功能模組	說明
部落格文章管理	使用 GitHub Issues 作為 CMS
留言系統	使用 Giscus，基於 GitHub Comments
前端展示	使用 SvelteKit 開發
部署	推薦部署於 Vercel（或 Netlify / GCP）



⸻

📘 GitHub Issues 規格

一篇文章 = 一個 Issue
	•	Title：文章標題
	•	Body：文章內容，使用 Markdown 撰寫
	•	Labels：
	•	published: 已發佈的文章
	•	draft: 草稿
	•	額外分類標籤：如 Go, React, 心得

⸻

🔧 前端功能需求（使用 SvelteKit）

1. 首頁 /
	•	顯示已發佈（label: published）的文章列表
	•	每篇顯示：
	•	標題
	•	發佈日期（GitHub created_at 或 updated_at）
	•	標籤（GitHub Labels）
	•	內文摘要（可為前 100 字）

2. 單篇文章頁 /blog/[id]
	•	顯示完整文章內容（從 GitHub Issue 取得）
	•	支援 Markdown 語法與程式碼高亮（建議使用 marked、markdown-it、或 mdsvex）
	•	顯示發佈時間與標籤
	•	顯示留言區（整合 Giscus）

3. 標籤頁 /tags/[tag]
	•	篩選並顯示所有標籤為該 tag 的文章

4. 搜尋功能（可延後）
	•	文章標題關鍵字搜尋（可前端 filter）

5. 關於頁 /about
	•	作者介紹
	•	技術棧
	•	聯絡資訊

⸻

🔌 API 使用說明（GitHub REST API）

取得所有文章

GET https://api.github.com/repos/:owner/:repo/issues?labels=published

取得單篇文章內容

GET https://api.github.com/repos/:owner/:repo/issues/:issue_number

取得留言（若使用 Giscus 可不需自己抓）

GET https://api.github.com/repos/:owner/:repo/issues/:issue_number/comments



⸻

💬 留言系統（使用 Giscus）

整合方式
	•	安裝 @giscus/svelte
	•	在文章頁面中引入 Giscus component
	•	設定對應 GitHub repo、repoId、categoryId 等參數

⸻

📦 專案技術棧
	•	前端框架：SvelteKit
	•	UI 樣式：Tailwind CSS
	•	Markdown 處理：marked、mdsvex 或 markdown-it
	•	API 串接：fetch GitHub REST API
	•	留言功能：Giscus
	•	部署平台：Vercel（或其他支援 SvelteKit 的平台）

⸻

🚀 部署設定建議
	1.	將 GitHub API Token 設為環境變數（若需要認證）
	2.	若需 revalidate，使用 SvelteKit 的 cache-control 或手動 fetch refresh
	3.	使用 .env 管理私密資料（如 repo 名、token 等）

⸻

📌 未來擴充功能（非 MVP）
	•	RSS Feed 匯出
	•	多語系支援
	•	自訂網域
	•	SEO 強化（如 meta tags, og:image）
	•	暗黑模式切換
	•	支援草稿預覽（Draft Mode）
	•	GitHub Actions 自動建立網站內容快取

⸻

需要我幫你做成專案初始化模板（含頁面結構 + GitHub API 串接）也可以，隨時說 👌