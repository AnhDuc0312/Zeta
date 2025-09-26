import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  type?: 'article' | 'document' | 'note';
  url?: string;
  image?: string;
}

export const useSEO = ({
  title,
  description,
  keywords,
  author,
  publishedTime,
  modifiedTime,
  type = 'article',
  url,
  image
}: SEOProps) => {
  useEffect(() => {
    // Set page title
    document.title = `${title} | ZetaScript`;

    // Create or update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description || `${title} - Read more on ZetaScript`);
    updateMetaTag('keywords', keywords || 'content, article, document, note, zetascript');
    updateMetaTag('author', author || 'ZetaScript');
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description || `${title} - Read more on ZetaScript`, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', url || window.location.href, true);
    updateMetaTag('og:image', image || '/favicon-v2.svg', true);
    updateMetaTag('og:site_name', 'ZetaScript', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description || `${title} - Read more on ZetaScript`);
    updateMetaTag('twitter:image', image || '/favicon-v2.svg');
    
    // Article specific tags
    if (type === 'article') {
      updateMetaTag('article:author', author || 'ZetaScript', true);
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
    }

    // Structured data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? "Article" : type === 'document' ? "Document" : "Note",
      "headline": title,
      "description": description || `${title} - Read more on ZetaScript`,
      "author": {
        "@type": "Person",
        "name": author || "ZetaScript"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ZetaScript",
        "logo": {
          "@type": "ImageObject",
          "url": "/favicon-v2.svg"
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "url": url || window.location.href,
      "image": image || "/favicon-v2.svg"
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [title, description, keywords, author, publishedTime, modifiedTime, type, url, image]);
};
