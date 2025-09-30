import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Filter,
  Grid3X3,
  Grid2X2,
  SlidersHorizontal,
  X,
  FileText,
  StickyNote,
  FolderOpen,
  Calendar,
  Eye,
  Tag,
  TrendingUp,
  Award,
} from "lucide-react";
import Layout from "../components/Layout";

interface SearchFilters {
  name: string;
  year: string;
  tag: string;
  category: string;
  minViews: string;
  nomination: string;
  sortBy: string;
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gridLayout, setGridLayout] = useState<"3x3" | "4x4">("3x3");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    year: "",
    tag: "",
    category: "",
    minViews: "",
    nomination: "",
    sortBy: "recent",
  });
  const [results, setResults] = useState([]);

  useEffect(() => {
    document.title = "Search | ZetaScript";
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=20`)
        .then(res => res.json())
        .then(data => setResults(data.data || []))
        .catch(error => {
          console.error("Search error:", error);
          setResults([]);
        });
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      year: "",
      tag: "",
      category: "",
      minViews: "",
      nomination: "",
      sortBy: "recent",
    });
  };

  // Filter and sort content
  const filteredContent = results
    .filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesName =
        filters.name === "" ||
        item.title?.toLowerCase().includes(filters.name.toLowerCase());

      const matchesYear =
        filters.year === "" || 
        (item.created_at && new Date(item.created_at).getFullYear().toString() === filters.year);

      const matchesTag =
        filters.tag === "" ||
        (item.tags && item.tags.some((tag) =>
          tag.toLowerCase().includes(filters.tag.toLowerCase()),
        ));

      const matchesCategory =
        filters.category === "" || item.category === filters.category;

      const matchesViews =
        filters.minViews === "" || (item.views || 0) >= parseInt(filters.minViews);

      const matchesNomination =
        filters.nomination === "" || item.featured === (filters.nomination === "Featured");

      return (
        matchesSearch &&
        matchesName &&
        matchesYear &&
        matchesTag &&
        matchesCategory &&
        matchesViews &&
        matchesNomination
      );
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "views":
          return (b.views || 0) - (a.views || 0);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "year":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default: // recent
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  const gridCols =
    gridLayout === "3x3"
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const getContentIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "document":
        return <FolderOpen className="w-5 h-5 text-green-600" />;
      case "note":
        return <StickyNote className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getContentBorder = (type: string) => {
    switch (type) {
      case "article":
        return "border-l-4 border-l-blue-500";
      case "document":
        return "border-l-4 border-l-green-500";
      case "note":
        return "border-l-4 border-l-yellow-500";
      default:
        return "border-l-4 border-l-gray-500";
    }
  };

  return (
    <Layout showSearch={false}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Search Everything
            </h1>
            <p className="text-gray-600">
              Find articles, documents, and notes across your entire collection
            </p>
          </div>

          {/* Layout Controls */}
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setGridLayout("3x3")}
                className={`p-2 rounded transition-colors ${
                  gridLayout === "3x3"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
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
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search across all content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-4 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-black">
                  Advanced Filters
                </h3>
              </div>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600 hover:text-black"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tag
                </label>
                <input
                  type="text"
                  placeholder="Search by tag..."
                  value={filters.tag}
                  onChange={(e) => handleFilterChange("tag", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Planning">Planning</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Ideas">Ideas</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              {/* Min Views Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Eye className="w-4 h-4 inline mr-1" />
                  Min Views
                </label>
                <input
                  type="number"
                  placeholder="Minimum views..."
                  value={filters.minViews}
                  onChange={(e) =>
                    handleFilterChange("minViews", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Nomination Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="w-4 h-4 inline mr-1" />
                  Nomination
                </label>
                <select
                  value={filters.nomination}
                  onChange={(e) =>
                    handleFilterChange("nomination", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">All Content</option>
                  <option value="Featured">Featured</option>
                  <option value="Popular">Popular</option>
                  <option value="Essential">Essential</option>
                  <option value="Pinned">Pinned</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="views">Most Views</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="category">Category</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Found{" "}
            <span className="font-semibold text-black">
              {filteredContent.length}
            </span>{" "}
            results
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Results Grid */}
        <div className={`grid ${gridCols} gap-6`}>
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group ${getContentBorder(item.type)}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getContentIcon(item.type)}
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {item.type}
                    </span>
                  </div>
                  {item.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors line-clamp-2">
                  {item.title || "Untitled"}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {item.description || "No description available"}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-4">
                    <span>{item.category || "Uncategorized"}</span>
                    <span>{item.views || 0} views</span>
                    <span>{item.likes || 0} likes</span>
                  </div>
                  <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>By {item.author_name || item.author || "Unknown"}</span>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredContent.length === 0 && (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search query or filters to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                clearFilters();
              }}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredContent.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              Load More Results
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
