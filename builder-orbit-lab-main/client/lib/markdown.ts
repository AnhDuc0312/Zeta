import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
  sanitize: false, // Allow HTML (be careful with user input)
  headerIds: true, // Add IDs to headers
  mangle: false, // Don't mangle email addresses
  pedantic: false, // Don't be pedantic about markdown
  smartLists: true, // Use smart list behavior
  smartypants: true, // Use smart quotes and other typographic replacements
});

// Function to convert markdown to HTML
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '<p class="text-gray-500 italic">No content available</p>';
  
  try {
    return marked(markdown);
  } catch (error) {
    console.error('Markdown conversion error:', error);
    return `<p class="text-red-500">Error converting content: ${error}</p>`;
  }
};

// Function to process image URLs in content
export const processImageUrls = (html: string): string => {
  // If content contains local blob URLs, we might need to handle them differently
  // For now, just return the HTML as-is
  return html;
};

// Function to enhance content with better styling
export const enhanceContent = (html: string): string => {
  return html
    // Add classes to images
    .replace(/<img/g, '<img class="rounded-lg shadow-sm max-w-full h-auto my-4"')
    // Add classes to code blocks
    .replace(/<pre><code/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm"')
    // Add classes to inline code
    .replace(/<code(?!\s)/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono"')
    // Add classes to blockquotes
    .replace(/<blockquote/g, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4"')
    // Add classes to tables
    .replace(/<table/g, '<table class="min-w-full border-collapse border border-gray-300 my-4"')
    .replace(/<th/g, '<th class="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold"')
    .replace(/<td/g, '<td class="border border-gray-300 px-4 py-2"')
    // Add classes to lists
    .replace(/<ul/g, '<ul class="my-4 space-y-2"')
    .replace(/<ol/g, '<ol class="my-4 space-y-2"')
    .replace(/<li/g, '<li class="leading-relaxed"')
    // Add classes to paragraphs
    .replace(/<p(?!\s)/g, '<p class="my-4 leading-relaxed"')
    // Add classes to headers
    .replace(/<h1/g, '<h1 class="text-3xl font-bold my-6 text-gray-900"')
    .replace(/<h2/g, '<h2 class="text-2xl font-bold my-5 text-gray-900"')
    .replace(/<h3/g, '<h3 class="text-xl font-bold my-4 text-gray-900"')
    .replace(/<h4/g, '<h4 class="text-lg font-bold my-3 text-gray-900"')
    .replace(/<h5/g, '<h5 class="text-base font-bold my-3 text-gray-900"')
    .replace(/<h6/g, '<h6 class="text-sm font-bold my-3 text-gray-900"')
    // Add classes to links
    .replace(/<a/g, '<a class="text-blue-600 hover:text-blue-800 underline"')
    // Add classes to horizontal rules
    .replace(/<hr/g, '<hr class="my-6 border-gray-300"');
};
