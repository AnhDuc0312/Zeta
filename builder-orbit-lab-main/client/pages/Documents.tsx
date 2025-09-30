import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid3X3,
  Grid2X2,
  Search,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
} from "lucide-react";
import Layout from "../components/Layout";

interface Document {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  size: string;
  date: string;
  author: string;
  downloads: number;
  views: number;
  rating: number;
  featured: boolean;
  tags: string[];
}

export default function Documents() {
  useEffect(() => {
    document.title = "Documents | ZetaScript";
  }, []);

  const navigate = useNavigate();
  const [gridLayout, setGridLayout] = useState<"3x3" | "4x4">("3x3");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch documents from API
  useEffect(() => {
    setLoading(true);
    setError("");
    
    const params = new URLSearchParams({
      type: "document",
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
    });
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    if (selectedCategory !== "all") {
      params.append('category', selectedCategory);
    }
    
    if (selectedType !== "all") {
      params.append('file_type', selectedType);
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
        // Transform API data to match Document interface
        const transformedDocs = (data.data || []).map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          description: doc.description,
          type: doc.file_url ? doc.file_url.split('.').pop()?.toUpperCase() || 'FILE' : 'FILE',
          category: doc.category_name || doc.category || 'Uncategorized',
          size: formatFileSize(doc.file_size || 0),
          date: new Date(doc.created_at).toLocaleDateString(),
          author: doc.author_name || 'Unknown Author',
          downloads: Math.floor(Math.random() * 1000) + 50, // Mock downloads
          views: doc.views || 0,
          rating: Math.floor(Math.random() * 5) + 1, // Mock rating
          featured: doc.featured || false,
          tags: Array.isArray(doc.tags) ? doc.tags : (typeof doc.tags === 'string' ? JSON.parse(doc.tags || '[]') : [])
        }));
        setDocuments(transformedDocs);
        setTotalDocuments(data.total || 0);
      })
      .catch((err) => {
        console.error("Error fetching documents:", err);
        setError("Failed to fetch documents");
        setDocuments([]);
        setTotalDocuments(0);
      })
      .finally(() => setLoading(false));
  }, [currentPage, itemsPerPage, searchQuery, selectedCategory, selectedType, sortBy]);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const categories = [
    "all",
    ...Array.from(new Set(documents.map((d) => d.category))),
  ];
  const types = ["all", ...Array.from(new Set(documents.map((d) => d.type)))];

  const totalPages = Math.ceil(totalDocuments / itemsPerPage);
  const paginatedDocuments = documents; // Đã phân trang và filter ở backend

  const gridCols =
    gridLayout === "3x3"
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'doc':
      case 'docx':
        return 'bg-blue-100 text-blue-800';
      case 'xls':
      case 'xlsx':
        return 'bg-green-100 text-green-800';
      case 'ppt':
      case 'pptx':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-black mb-2">Documents</h1>
          <p className="text-gray-600">
            Access and download important documents and resources
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {totalDocuments} documents available
          </p>
        </div>

        {/* Layout Controls */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
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
            <button
              onClick={() => setGridLayout("4x4")}
              className={`p-2 rounded transition-colors ${
                gridLayout === "4x4"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
              title="4x4 Grid"
            >
              <Grid2X2 className="w-4 h-4" />
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
            placeholder="Search documents..."
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
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-downloaded">Most Downloaded</option>
              <option value="most-viewed">Most Viewed</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="alphabetical">Alphabetical</option>
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
            totalDocuments,
          )}{" "}
          to {Math.min(currentPage * itemsPerPage, totalDocuments)} of{" "}
          {totalDocuments} documents
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Documents Grid */}
      <div className={`grid ${gridCols} gap-6 mb-8`}>
        {paginatedDocuments.map((document) => (
          <div
            key={document.id}
            onClick={() => navigate(`/documents/${document.id}`)}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            {/* Featured Badge */}
            {document.featured && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                  Featured
                </span>
              </div>
            )}

            {/* Document Image */}
            <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative">
              <img 
                src="/unnamed.png" 
                alt={document.title || "Document image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${getFileIcon(document.type)}`}
                >
                  {document.type}
                </span>
              </div>
            </div>

            {/* Document Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                {document.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {document.description}
              </p>

              {/* Document Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{document.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{document.date}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span>{formatNumber(document.views)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4 text-gray-400" />
                    <span>{formatNumber(document.downloads)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{document.rating.toFixed(1)}</span>
                  </div>
                </div>
                <span className="text-gray-500">{document.size}</span>
              </div>

              {/* Tags */}
              {document.tags && document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {document.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{document.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {paginatedDocuments.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No documents found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== "all" || selectedType !== "all"
              ? "Try adjusting your search or filters"
              : "No documents available at the moment"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalDocuments)} of{" "}
            {totalDocuments} documents
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}