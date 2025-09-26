import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid3X3,
  Grid2X2,
  Search,
  StickyNote,
  Plus,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  Pin,
} from "lucide-react";
import Layout from "../components/Layout";

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  color: string;
  date: string;
  author: string;
  pinned: boolean;
  tags: string[];
  wordCount: number;
}

export default function Notes() {
  const navigate = useNavigate();
  const [gridLayout, setGridLayout] = useState<"2x2" | "3x3">("2x2");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [notes, setNotes] = useState<Note[]>([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Notes | ZetaScript";
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    
    const params = new URLSearchParams({
      type: "note",
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
    });
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    if (selectedCategory !== "all") {
      params.append('category', selectedCategory);
    }
    
    if (selectedColor !== "all") {
      params.append('color', selectedColor);
    }
    
    params.append('sort', sortBy);
    
    fetch(`/api/content?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Transform API data to match Note interface
        const transformedNotes = (data.data || []).map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content || note.description || '',
          category: note.category_name || note.category || 'Uncategorized',
          color: getRandomColor(), // Mock color since backend doesn't have this field
          date: new Date(note.created_at).toLocaleDateString(),
          author: note.author_name || 'Unknown Author',
          pinned: note.featured || false,
          tags: Array.isArray(note.tags) ? note.tags : (typeof note.tags === 'string' ? JSON.parse(note.tags || '[]') : []),
          wordCount: note.word_count || 0
        }));
        setNotes(transformedNotes);
        setTotalNotes(data.total || 0);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setError("Failed to fetch notes");
        setNotes([]);
        setTotalNotes(0);
      })
      .finally(() => setLoading(false));
  }, [currentPage, itemsPerPage, selectedCategory, selectedColor, searchQuery, sortBy]);

  const getRandomColor = () => {
    const colors = ['yellow', 'blue', 'green', 'pink', 'purple', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const categories = [
    "all",
    ...Array.from(new Set(notes.map((n) => n.category))),
  ];
  const colors = ["all", ...Array.from(new Set(notes.map((n) => n.color)))];

  const totalPages = Math.ceil(totalNotes / itemsPerPage);
  const paginatedNotes = notes; // Đã phân trang và filter ở backend

  const gridCols =
    gridLayout === "2x2"
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  const getColorClasses = (color: string) => {
    const colorMap = {
      yellow: "bg-yellow-100 border-yellow-200 hover:bg-yellow-200",
      blue: "bg-blue-100 border-blue-200 hover:bg-blue-200",
      green: "bg-green-100 border-green-200 hover:bg-green-200",
      pink: "bg-pink-100 border-pink-200 hover:bg-pink-200",
      purple: "bg-purple-100 border-purple-200 hover:bg-purple-200",
      orange: "bg-orange-100 border-orange-200 hover:bg-orange-200",
    };
    return (
      colorMap[color as keyof typeof colorMap] ||
      "bg-gray-100 border-gray-200 hover:bg-gray-200"
    );
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      Personal: "bg-purple-100 text-purple-700",
      Work: "bg-blue-100 text-blue-700",
      Ideas: "bg-green-100 text-green-700",
      Todo: "bg-orange-100 text-orange-700",
      Meeting: "bg-red-100 text-red-700",
      Research: "bg-indigo-100 text-indigo-700",
      Projects: "bg-cyan-100 text-cyan-700",
      Reminders: "bg-yellow-100 text-yellow-700",
      Creative: "bg-pink-100 text-pink-700",
      Planning: "bg-gray-100 text-gray-700",
    };
    return (
      colorMap[category as keyof typeof colorMap] || "bg-gray-100 text-gray-700"
    );
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
          <h1 className="text-3xl font-bold text-black mb-2">Notes</h1>
          <p className="text-gray-600">
            Browse personal notes and quick thoughts from the community
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {totalNotes} notes available
          </p>
        </div>

        {/* Layout Controls */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {/* Đã xóa nút New Note */}
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
            placeholder="Search notes..."
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
              {categories.map((category, idx) => (
                <option key={category + '-' + idx} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Color:</span>
            <select
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {colors.map((color, idx) => (
                <option key={color + '-' + idx} value={color}>
                  {color === "all" ? "All Colors" : color}
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
              <option value="title">Title (A-Z)</option>
              <option value="category">Category</option>
              <option value="wordCount">Word Count</option>
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
          {Math.min((currentPage - 1) * itemsPerPage + 1, totalNotes)}{" "}
          to {Math.min(currentPage * itemsPerPage, totalNotes)} of{" "}
          {totalNotes} notes
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Notes Grid */}
      <div className={`grid ${gridCols} gap-6 mb-8`}>
        {paginatedNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => navigate(`/notes/${note.id}`)}
            className={`${getColorClasses(note.color)} border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group min-h-[250px] relative`}
          >
            {/* Pin indicator */}
            {note.pinned && (
              <div className="absolute top-4 right-4">
                <Pin className="w-4 h-4 text-gray-600 fill-current" />
              </div>
            )}

            {/* Category and Note Icon */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-2 py-1 text-xs rounded font-medium ${getCategoryColor(note.category)}`}
              >
                {note.category}
              </span>
              <StickyNote className="w-4 h-4 text-gray-400" />
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-black transition-colors line-clamp-2">
              {note.title}
            </h3>

            {/* Content */}
            <div 
              className="text-sm text-gray-700 line-clamp-6 mb-4 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content || '<p>No content available</p>' }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {note.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white/50 text-gray-600 text-xs rounded"
                >
                  <Tag className="w-2 h-2" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {note.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {note.wordCount} words
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {note.date}
              </span>
            </div>
          </div>
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
      {notes.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StickyNote className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No notes found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? `No notes found matching "${searchQuery}"`
              : "No notes match your current filters"}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedColor("all");
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
