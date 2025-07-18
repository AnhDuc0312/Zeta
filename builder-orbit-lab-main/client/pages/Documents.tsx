import { useEffect, useState, useMemo } from "react";
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
  id: number;
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
  const [gridLayout, setGridLayout] = useState<"2x2" | "3x3">("2x2");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Extensive mock data for documents
  const documents: Document[] = Array.from({ length: 128 }, (_, i) => {
    const types = ["PDF", "DOCX", "XLSX", "PPTX", "TXT", "CSV"];
    const categories = [
      "Technical",
      "Legal",
      "Business",
      "Education",
      "Research",
      "Templates",
      "Reports",
      "Guides",
      "Presentations",
      "Specifications",
    ];
    const authors = [
      "Admin Team",
      "Legal Department",
      "HR Department",
      "Engineering Team",
      "Marketing Team",
      "Finance Team",
      "Research Division",
      "Design Team",
      "Operations Team",
      "Strategy Team",
    ];

    const documentTitles = [
      "API Documentation v2.1",
      "Employee Handbook 2024",
      "Project Requirements Specification",
      "User Privacy Policy",
      "Financial Report Q4 2023",
      "Software Architecture Guide",
      "Brand Guidelines",
      "Security Protocols Manual",
      "Training Material Template",
      "Compliance Guidelines",
      "Product Roadmap 2024",
      "Quarterly Business Review",
      "Technical Standards Document",
      "Marketing Strategy Plan",
      "Database Schema Documentation",
      "Risk Assessment Report",
      "Code Review Guidelines",
      "Meeting Minutes Template",
      "Proposal Template",
      "System Requirements Document",
      "Quality Assurance Checklist",
      "Onboarding Guide",
      "Performance Metrics Report",
      "Budget Allocation Spreadsheet",
      "Client Presentation Template",
    ];

    const type = types[i % types.length];
    const category = categories[i % categories.length];
    const baseTitle = documentTitles[i % documentTitles.length];
    const title =
      i < documentTitles.length
        ? baseTitle
        : `${baseTitle} - Version ${Math.floor(i / documentTitles.length) + 1}`;

    const sizeValue = Math.random() * 10 + 0.1;
    const sizeUnit = sizeValue > 5 ? "MB" : "KB";
    const size = `${(sizeValue > 5 ? sizeValue : sizeValue * 1000).toFixed(1)} ${sizeUnit}`;

    return {
      id: i + 1,
      title,
      description: `Comprehensive ${category.toLowerCase()} document covering ${title.toLowerCase()}. Contains detailed information, guidelines, and procedures. Essential resource for team members and stakeholders.`,
      type,
      category,
      size,
      date: new Date(
        2024 - Math.floor(i / 40),
        (i * 2) % 12,
        (i % 28) + 1,
      ).toLocaleDateString(),
      author: authors[i % authors.length],
      downloads: Math.floor(Math.random() * 1000) + 50,
      views: Math.floor(Math.random() * 2000) + 100,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
      featured: i < 6, // First 6 documents are featured
      tags: [
        category.toLowerCase(),
        type.toLowerCase(),
        i % 3 === 0 ? "essential" : i % 3 === 1 ? "reference" : "template",
      ],
    };
  });

  const categories = [
    "all",
    ...Array.from(new Set(documents.map((d) => d.category))),
  ];
  const types = ["all", ...Array.from(new Set(documents.map((d) => d.type)))];

  const { filteredDocuments, paginatedDocuments, totalPages } = useMemo(() => {
    let filtered = documents.filter((document) => {
      const matchesSearch =
        searchQuery === "" ||
        document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        document.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        document.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || document.category === selectedCategory;

      const matchesType =
        selectedType === "all" || document.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });

    // Sort documents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "popular":
          return b.downloads - a.downloads;
        case "mostViewed":
          return b.views - a.views;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      filteredDocuments: filtered,
      paginatedDocuments: paginated,
      totalPages,
    };
  }, [
    documents,
    searchQuery,
    selectedCategory,
    selectedType,
    sortBy,
    currentPage,
    itemsPerPage,
  ]);

  const gridCols =
    gridLayout === "2x2"
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  const getFileIcon = (type: string) => {
    const colorMap = {
      PDF: "text-red-600 bg-red-100",
      DOCX: "text-blue-600 bg-blue-100",
      XLSX: "text-green-600 bg-green-100",
      PPTX: "text-orange-600 bg-orange-100",
      TXT: "text-gray-600 bg-gray-100",
      CSV: "text-purple-600 bg-purple-100",
    };
    return (
      colorMap[type as keyof typeof colorMap] || "text-gray-600 bg-gray-100"
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Layout showSearch={false}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Documents</h1>
          <p className="text-gray-600">
            Access important documents and resources from our library
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {filteredDocuments.length} documents available
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
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type}
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
              <option value="popular">Most Downloads</option>
              <option value="mostViewed">Most Viewed</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A-Z)</option>
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
            filteredDocuments.length,
          )}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredDocuments.length)} of{" "}
          {filteredDocuments.length} documents
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Documents Grid */}
      <div className={`grid ${gridCols} gap-6 mb-8`}>
        {paginatedDocuments.map((document) => (
          <div
            key={document.id}
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

            {/* Document Icon */}
            <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors relative">
              <div
                className={`w-20 h-20 rounded-lg flex items-center justify-center ${getFileIcon(document.type)}`}
              >
                <FileText className="w-10 h-10" />
              </div>
              <div className="absolute top-4 right-4">
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${getFileIcon(document.type)}`}
                >
                  {document.type}
                </span>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-6">
              {/* Category and Size */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded font-medium">
                  {document.category}
                </span>
                <span className="text-xs text-gray-500">{document.size}</span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors line-clamp-2">
                {document.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {document.description}
              </p>

              {/* Author and Date */}
              <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {document.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {document.date}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(document.rating)}
                </div>
                <span className="text-xs text-gray-500">
                  {document.rating.toFixed(1)}
                </span>
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(document.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {formatNumber(document.downloads)}
                  </span>
                </div>
                <button className="p-2 text-gray-400 hover:text-black transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
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
      {filteredDocuments.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No documents found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? `No documents found matching "${searchQuery}"`
              : "No documents match your current filters"}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedType("all");
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
