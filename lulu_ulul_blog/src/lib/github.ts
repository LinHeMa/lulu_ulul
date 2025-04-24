import { browser } from '$app/environment';

// Environment variables
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
console.log(import.meta.env.VITE_GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN);
// API base URL

const API_BASE = 'https://api.github.com';

// Headers for GitHub API requests
const getHeaders = () => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  
  return headers;
};

// GitHub API types
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

// Blog post type
export interface BlogPost {
  id: number;
  number: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  tags: string[];
  url: string;
}

// Fetch all published blog posts
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=published&state=open&sort=created&direction=desc`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const issues = await response.json() as GitHubIssue[];
    
    return issues.map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
      tags: issue.labels
        .filter((label) => label.name !== 'published' && label.name !== 'draft')
        .map((label) => label.name),
      url: `/blog/${issue.number}`
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Fetch a single blog post by issue number
export async function getBlogPost(issueNumber: number): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const issue = await response.json() as GitHubIssue;
    
    // Check if the issue has the 'published' label
    const isPublished = issue.labels.some((label) => label.name === 'published');
    
    if (!isPublished && !browser) {
      // Don't show unpublished posts on server
      return null;
    }
    
    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
      tags: issue.labels
        .filter((label) => label.name !== 'published' && label.name !== 'draft')
        .map((label) => label.name),
      url: `/blog/${issue.number}`
    };
  } catch (error) {
    console.error(`Error fetching blog post #${issueNumber}:`, error);
    return null;
  }
}

// Fetch posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=published,${tag}&state=open&sort=created&direction=desc`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const issues = await response.json() as GitHubIssue[];
    
    return issues.map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
      tags: issue.labels
        .filter((label) => label.name !== 'published' && label.name !== 'draft')
        .map((label) => label.name),
      url: `/blog/${issue.number}`
    }));
  } catch (error) {
    console.error(`Error fetching posts with tag ${tag}:`, error);
    return [];
  }
}

// Get all unique tags from published posts
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getPublishedPosts();
    const allTags = posts.flatMap(post => post.tags);
    return [...new Set(allTags)].sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
} 