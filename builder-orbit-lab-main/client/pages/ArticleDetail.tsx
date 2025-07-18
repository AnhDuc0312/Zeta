import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  User,
} from "lucide-react";
import Layout from "../components/Layout";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock article data - in real app, fetch based on id
  const article = {
    id: parseInt(id || "1"),
    title: "The Future of Web Development: Trends to Watch in 2024",
    content: `
      <p>Web development continues to evolve at a rapid pace, with new technologies and methodologies emerging regularly. As we look toward 2024, several key trends are shaping the future of how we build and interact with web applications.</p>
      
      <h2>1. Server-Side Rendering Renaissance</h2>
      <p>Server-side rendering (SSR) is making a significant comeback, driven by frameworks like Next.js, Nuxt.js, and SvelteKit. The benefits of SSR include improved SEO, faster initial page loads, and better performance on low-powered devices.</p>
      
      <h2>2. Web Assembly Integration</h2>
      <p>WebAssembly (WASM) is enabling developers to run high-performance applications in the browser. From gaming to data visualization, WASM is opening new possibilities for web applications that were previously only possible with native software.</p>
      
      <h2>3. AI-Powered Development Tools</h2>
      <p>Artificial intelligence is transforming how we write code. Tools like GitHub Copilot and ChatGPT are becoming integral parts of the development workflow, helping developers write better code faster and catch bugs before they make it to production.</p>
      
      <h2>4. Edge Computing and CDNs</h2>
      <p>Edge computing is bringing computation closer to users, reducing latency and improving performance. Modern CDNs are becoming more intelligent, offering features like edge functions and real-time data processing.</p>
      
      <h2>5. Micro-Frontends Architecture</h2>
      <p>Large organizations are adopting micro-frontends to allow teams to work independently while maintaining a cohesive user experience. This approach enables better scalability and team autonomy.</p>
      
      <h2>Conclusion</h2>
      <p>The web development landscape continues to evolve, driven by the need for better performance, developer experience, and user satisfaction. Staying current with these trends will be crucial for developers looking to build the next generation of web applications.</p>
    `,
    author: {
      name: "Jane Smith",
      avatar: null,
      bio: "Senior Frontend Developer at TechCorp",
    },
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    views: 1247,
    likes: 89,
    comments: 12,
    tags: ["Web Development", "Technology", "Frontend", "2024 Trends"],
    category: "Technology",
  };

  const relatedArticles = [
    {
      id: 2,
      title: "Building Modern React Applications",
      author: "John Doe",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox: When to Use Which",
      author: "Sarah Wilson",
      readTime: "4 min read",
    },
    {
      id: 4,
      title: "TypeScript Best Practices for 2024",
      author: "Mike Johnson",
      readTime: "7 min read",
    },
  ];

  useEffect(() => {
    document.title = article?.title ? `${article.title} | ZetaScript` : "Article Detail | ZetaScript";
  }, [article?.title]);

  return (
    <Layout showSearch={false}>
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <button
          onClick={() => navigate("/articles")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-black mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{article.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{article.views} views</span>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-8">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-black">
                {article.author.name}
              </h3>
              <p className="text-sm text-gray-600">{article.author.bio}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Featured Image Placeholder */}
            <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-8"></div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-gray-700 prose-a:text-black hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Engagement Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>{article.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{article.comments}</span>
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                    <BookmarkPlus className="w-5 h-5" />
                    Save
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 sticky top-6">
              <h3 className="font-semibold text-black mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-2">
                <a
                  href="#"
                  className="block text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Server-Side Rendering Renaissance
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Web Assembly Integration
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-600 hover:text-black transition-colors"
                >
                  AI-Powered Development Tools
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Edge Computing and CDNs
                </a>
                <a
                  href="#"
                  className="block text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Micro-Frontends Architecture
                </a>
              </nav>
            </div>

            {/* Related Articles */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-black mb-4">
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => navigate(`/articles/${related.id}`)}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <h4 className="font-medium text-black mb-1 line-clamp-2">
                      {related.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{related.author}</span>
                      <span>•</span>
                      <span>{related.readTime}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
