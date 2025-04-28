import { getPublishedPosts } from '$lib/github';
import { getExcerpt, parseMarkdown } from '$lib/markdown';

export const prerender = true;

export async function GET({ url }) {
  // Site configuration
  const siteUrl = 'https://lulu-ulul.vercel.app';
  const siteBaseUrl = url.origin; // 使用請求的原始URL
  const siteName = 'LinHeMa de Blog';
  const siteDescription = 'A personal tech blog powered by GitHub Issues and SvelteKit';
  const siteLanguage = 'en-us';
  const authorName = 'LinHeMa';

  try {
    // Fetch all published posts
    const posts = await getPublishedPosts();
    
    // 確保在返回XML前添加BOM標記和正確的XML宣告
    const xmlStart = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>${siteName}</title>
  <description>${siteDescription}</description>
  <link>${siteBaseUrl}</link>
  <atom:link href="${siteBaseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
  <language>${siteLanguage}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <generator>SvelteKit</generator>`;
    
    // Build the items
    let items = '';

    // Process each post to include their full content
    for (const post of posts) {
      // Generate the full HTML content for the post
      const fullHtml = parseMarkdown(post.body);
      
      // Create the item element
      items += `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${siteUrl}${post.url}</link>
    <guid isPermaLink="true">${siteUrl}${post.url}</guid>
    <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
    <dc:creator><![CDATA[${authorName}]]></dc:creator>
    <description><![CDATA[${getExcerpt(post.body, 300)}]]></description>
    <content:encoded><![CDATA[${fullHtml}]]></content:encoded>
    ${post.tags.map(tag => `<category>${tag}</category>`).join('\n    ')}
  </item>`;
    }

    // Close the XML
    const xmlEnd = `
</channel>
</rss>`;

    const fullXml = xmlStart + items + xmlEnd;

    // Return the XML with appropriate headers
    return new Response(fullXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'max-age=0, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
} 