# lulu-ulul-blog

SvelteKit 部落格，文章內容來自 GitHub Issues，並新增 Supabase 留言系統、Buttondown 電子報與多種整合。

## 開發腳本

```bash
pnpm install
pnpm dev            # 啟動開發伺服器 (http://localhost:5173)
pnpm check          # svelte-check
pnpm lint           # Prettier + ESLint
pnpm build          # 產生 production bundle
pnpm preview        # 於本機預覽 build 結果
```

## 留言系統（Supabase）

1. 在 Supabase 建立 `comments` 資料表，欄位可參考：

| 欄位        | 型別        | 說明                              |
| ----------- | ----------- | --------------------------------- |
| `id`        | `uuid`      | 主鍵，預設 `gen_random_uuid()`    |
| `post_id`   | `int8`      | 對應 GitHub Issue number          |
| `author_name` | `text`    | 留言者暱稱                        |
| `author_email` | `text`   | 選填 email，可設為 `nullable`     |
| `content`   | `text`      | 留言本文                          |
| `status`    | `text`      | 預設 `pending`，可設 `approved`   |
| `created_at` | `timestamptz` | 預設 `now()`                   |

   若啟用 Row Level Security，請開放匿名讀取 `status = 'approved'` 的資料，寫入則由 Service Role key 完成。

2. 於專案環境變數（`.env`, Vercel Project Settings）設定：

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxx
```

   本地開發亦可使用 `VITE_SUPABASE_URL`、`VITE_SUPABASE_SERVICE_ROLE_KEY`。

3. 前端會向 `/api/comments` 取得/送出留言：
   - `GET /api/comments?postId=<issue number>`：讀取已核准留言
   - `POST /api/comments`：body 需包含 `postId`, `authorName`, `content`，email 選填

送出後若為待審核狀態，UI 會提示讀者稍候；你可以在 Supabase 後台修改 `status = 'approved'` 讓留言顯示在前端。

## 文章來源

- `/api/posts` 會呼叫 GitHub Issues，僅同步帶有 `published` 標籤的 issue
- 單篇頁面位於 `src/routes/blog/[id]/+page.svelte`
- Markdown 解析與 image hydration 寫在 `src/lib/markdown.ts`

## 其他整合

- Buttondown 電子報：相關 API 在 `src/routes/api/notify/+server.ts`
- 天氣小工具與 Neon banner 放在 `src/lib/components`
- RSS feed (`/feed.xml`) 定義於 `src/routes/feed.xml/+server.ts`
