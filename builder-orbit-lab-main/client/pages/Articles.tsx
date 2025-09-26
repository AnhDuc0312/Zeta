import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid3X3,
  Grid2X2,
  Search,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Layout from "../components/Layout";

interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  tags: string[];
}

export default function Articles() {
  const navigate = useNavigate();
  const [gridLayout, setGridLayout] = useState<"2x2" | "3x3">("2x2");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Articles | ZetaScript";
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    
    // Xây dựng query string cho API
    const params = new URLSearchParams({
      type: "article",
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
    });
    
    // Thêm search query nếu có
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    // Thêm category filter nếu không phải "all"
    if (selectedCategory !== "all") {
      params.append('category', selectedCategory);
    }
    
    // Thêm sort parameter
    params.append('sort', sortBy);
    
    fetch(`/api/content?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setArticles(data.data || []);
        setTotalArticles(data.total || 0);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setError("Failed to fetch articles");
        setArticles([]);
        setTotalArticles(0);
      })
      .finally(() => setLoading(false));
  }, [currentPage, itemsPerPage, searchQuery, selectedCategory, sortBy]);

  const categories = [
    "all",
    ...Array.from(new Set(articles.map((a) => a.category))),
  ];

  const totalPages = Math.ceil(totalArticles / itemsPerPage);
  const paginatedArticles = articles; // Đã phân trang và filter ở backend

  const gridCols =
    gridLayout === "2x2"
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout showSearch={false}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Articles</h1>
          <p className="text-gray-600">
            Discover thought-provoking articles and stories from our community
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {totalArticles} articles available
          </p>
        </div>

        {/* Layout Controls */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setGridLayout("2x2")}
              className={`p-2 rounded transition-colors ${
                gridLayout === "2x2"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
              title="2x2 Grid"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridLayout("3x3")}
              className={`p-2 rounded transition-colors ${
                gridLayout === "3x3"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
              title="3x3 Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="mostLiked">Most Liked</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium text-gray-700">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing{" "}
          {Math.min(
            (currentPage - 1) * itemsPerPage + 1,
            totalArticles,
          )}{" "}
          to {Math.min(currentPage * itemsPerPage, totalArticles)} of{" "}
          {totalArticles} articles
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Articles Grid */}
      <div className={`grid ${gridCols} gap-6 mb-8`}>
        {paginatedArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => navigate(`/articles/${article.id}`)}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            {/* Featured Badge */}
            {article.featured && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                  Featured
                </span>
              </div>
            )}

            {/* Article Image */}
            <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative">
              <img 
                src="/unnamed.png" 
                alt={article.title || "Article image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Article Content */}
            <div className="p-6">
              {/* Category and Date */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded font-medium">
                  {article.category}
                </span>
                <span className="text-xs text-gray-500">{article.date}</span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors line-clamp-2">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {article.description}
              </p>

              {/* Author and Read Time */}
              <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                <span>By {article.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(article.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {formatNumber(article.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {article.comments}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                      currentPage === pageNum
                        ? "bg-black text-white border-black"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {articles.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? `No articles found matching "${searchQuery}"`
              : "No articles match your current filters"}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </Layout>
  );
}
