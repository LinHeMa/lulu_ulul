import { marked } from 'marked';
import { format } from 'date-fns';

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  pedantic: false
});

// Parse markdown to HTML
export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}

// Format a date string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMMM d, yyyy');
}

// Get excerpt from markdown text (first 100 chars)
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