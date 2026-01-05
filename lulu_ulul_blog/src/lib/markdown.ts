import { marked } from 'marked';
import { format } from 'date-fns';
import Prism from 'prismjs';

// Import additional languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-docker';

// Initialize marked without custom renderer
marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false
});

// Create custom highlight function for attaching to marked
function highlightCode(code: string, lang: string): string {
  // If language is found in Prism, use it for highlighting
  if (lang && Prism.languages[lang]) {
    try {
      return Prism.highlight(code, Prism.languages[lang], lang);
    } catch {
      return JSON.stringify(code);
    }
  }
  // Return regular code for unknown languages
  return JSON.stringify(code);
}

const enhanceImages = (html: string): string => {
  const imageRegex = /<img([^>]*?)src="([^"]+)"([^>]*)>/gi;

  return html.replace(imageRegex, (_match, beforeSrc = '', src: string, afterSrc = '') => {
    const hasTrailingSlash = /\/\s*$/.test(afterSrc);
    const cleanedBefore = beforeSrc.trim();
    const cleanedAfter = afterSrc.replace(/\/\s*$/, '').trim();

    const existingAttributes = [cleanedBefore, `src="${src}"`, cleanedAfter].filter(Boolean);
    const attributeBlob = `${cleanedBefore} ${cleanedAfter}`.trim();
    const hasLoading = /\sloading\s*=/.test(attributeBlob);
    const hasDecoding = /\sdecoding\s*=/.test(attributeBlob);

    const additions = [
      'data-content-image="true"',
      `data-img-key="${encodeURIComponent(src)}"`,
      hasLoading ? '' : 'loading="lazy"',
      hasDecoding ? '' : 'decoding="async"'
    ].filter(Boolean);

    const finalAttributes = [...existingAttributes, ...additions].join(' ').trim();
    const closing = hasTrailingSlash ? ' />' : '>';

    return finalAttributes ? `<img ${finalAttributes}${closing}` : `<img${closing}`;
  });
};

// Parse markdown to HTML with syntax highlighting
export function parseMarkdown(markdown: string): string {
  // First pass: Parse the markdown
  const html = marked.parse(markdown);
  
  if (typeof html !== 'string') {
    return '';
  }
  
  // Apply Prism classes to code blocks
  const highlighted = html
    .replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, 
      (_match: string, lang: string, code: string) => {
        const decoded = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        const highlightedCode = highlightCode(decoded, lang);
        return `<pre class="language-${lang}"><code class="language-${lang}">${highlightedCode}</code></pre>`;
      }
    )
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, 
      (_match: string, code: string) => {
        const decoded = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        return `<pre class="language-none"><code class="language-none">${decoded}</code></pre>`;
      }
    );

  return enhanceImages(highlighted);
}

// Format a date string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMMM d, yyyy');
}

// Get excerpt from markdown text
export function getExcerpt(markdown: string, maxLength: number = 100): string {
  // Remove markdown syntax
  const text = markdown
    .replace(/#+\s+/g, '') // Remove headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just text
    .replace(/[*_~`]/g, '') // Remove emphasis markers
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
  
  // Truncate and add ellipsis if needed
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
} 
