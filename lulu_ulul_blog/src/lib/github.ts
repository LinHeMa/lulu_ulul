import { browser } from '$app/environment';

type FetchFunction = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

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

export async function getPublishedPosts(customFetch?: FetchFunction): Promise<BlogPost[]> {
  const fetcher = customFetch ?? fetch;
  try {
    const response = await fetcher('/api/posts');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}


export async function getBlogPost(issueNumber: number, customFetch?: FetchFunction): Promise<BlogPost | null> {
  const fetcher = customFetch ?? fetch;
  try {
    const response = await fetcher(`/api/posts?id=${issueNumber}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const post = await response.json();
    
    // 檢查文章是否有published標籤
    // 現在這個檢查可以放在後端，但為了保持一致性，我們保留這裡的檢查
    if (!post.tags && !browser) {
      // 在服務器端不顯示未發布的文章
      return null;
    }
    
    return post;
  } catch (error) {
    console.error(`Error fetching blog post #${issueNumber}:`, error);
    return null;
  }
}

// 按標籤獲取文章
export async function getPostsByTag(tag: string, customFetch?: FetchFunction): Promise<BlogPost[]> {
  const fetcher = customFetch ?? fetch;
  try {
    const response = await fetcher(`/api/posts?tag=${encodeURIComponent(tag)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error(`Error fetching posts with tag ${tag}:`, error);
    return [];
  }
}

// 獲取所有已發佈文章的唯一標籤
export async function getAllTags(customFetch?: FetchFunction): Promise<string[]> {
  try {
    const posts = await getPublishedPosts(customFetch);
    const allTags = posts.flatMap(post => post.tags);
    return [...new Set(allTags)].sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
} 
