import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// 後端安全環境變數（不會暴露到前端）
const GITHUB_OWNER = process.env.GITHUB_OWNER || import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO || import.meta.env.VITE_GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN;

// API base URL
const API_BASE = 'https://api.github.com';

// GitHub API 類型定義
interface GitHubLabel {
  name: string;
  color: string;
  description?: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  labels: GitHubLabel[];
}

// 獲取 published 狀態的文章
export const GET: RequestHandler = async ({ url }) => {
  try {
    const tag = url.searchParams.get('tag');
    const id = url.searchParams.get('id');
    
    // 請求標頭
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    
    let endpoint = '';
    
    // 根據請求參數決定呼叫的 API 端點
    if (id) {
      // 獲取單篇文章
      endpoint = `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${id}`;
    } else if (tag) {
      // 獲取特定標籤的文章
      endpoint = `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=published,${tag}&state=open&sort=created&direction=desc`;
    } else {
      // 獲取所有已發佈文章
      endpoint = `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=published&state=open&sort=created&direction=desc`;
    }
    
    const response = await fetch(endpoint, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 處理回應資料
    if (Array.isArray(data)) {
      // 處理文章列表
      const posts = data.map((issue: GitHubIssue) => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        html_url: issue.html_url,
        tags: issue.labels
          .filter((label: GitHubLabel) => label.name !== 'published' && label.name !== 'draft')
          .map((label: GitHubLabel) => label.name),
        url: `/blog/${issue.number}`
      }));
      
      return json(posts);
    } else {
      // 處理單篇文章
      const issue = data as GitHubIssue;
      const post = {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        html_url: issue.html_url,
        tags: issue.labels
          .filter((label: GitHubLabel) => label.name !== 'published' && label.name !== 'draft')
          .map((label: GitHubLabel) => label.name),
        url: `/blog/${issue.number}`
      };
      
      return json(post);
    }
  } catch (error) {
    console.error('API error:', error);
    return json({ error: 'Failed to fetch data from GitHub' }, { status: 500 });
  }
}; 