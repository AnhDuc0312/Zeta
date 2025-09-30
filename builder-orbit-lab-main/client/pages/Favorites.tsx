import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  Filter,
  Grid3X3,
  Grid2X2,
  Calendar,
  User,
  Eye,
  MessageCircle,
  FileText,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MoreVertical,
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

interface FavoriteItem {
  id: string;
  content_id: string;
  content: {
    id: string;
    title: string;
    description: string;
    type: 'article' | 'document' | 'note';
    author: string;
    created_at: string;
    views: number;
    likes: number;
    comments: number;
    category?: string;
  };
  favorited_at: string;
}

export default function Favorites() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [gridLayout, setGridLayout] = useState<"3x3" | "4x4">("3x3");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    document.title = "My Favorites | ZetaScript";
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, [isLoggedIn, currentPage, selectedType, sortBy]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        type: selectedType,
        sort: sortBy,
        search: searchQuery
      });

      const response = await fetch(`/api/users/favorites?${params}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setError("Failed to load favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string, contentId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/content/${contentId}/like`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(f => f.id !== favoriteId));
        toast({
          title: "Removed from favorites",
          description: "Content has been removed from your favorites.",
        });
      } else {
        toast({
          title: "Failed to remove favorite",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Failed to remove favorite",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkRemove = async () => {
    if (selectedItems.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const promises = selectedItems.map(contentId => 
        fetch(`/api/content/${contentId}/like`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
      );

      await Promise.all(promises);
      
      setFavorites(prev => prev.filter(f => !selectedItems.includes(f.content_id)));
      setSelectedItems([]);
      
      toast({
        title: "Favorites removed",
        description: `${selectedItems.length} favorites have been removed.`,
      });
    } catch (error) {
      console.error("Error removing favorites:", error);
      toast({
        title: "Failed to remove favorites",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "document":
        return <FileText className="w-5 h-5 text-green-600" />;
      case "note":
        return <StickyNote className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-blue-100 text-blue-800";
      case "document":
        return "bg-green-100 text-green-800";
      case "note":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const gridCols = gridLayout === "3x3"
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const filteredFavorites = favorites.filter(favorite => {
    const matchesSearch = searchQuery === "" || 
      favorite.content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      favorite.content.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === "all" || favorite.content.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate("/account")}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Account
              </button>
            </div>
            
            <h1 className="text-4xl font-bold text-black mb-4">My Favorites</h1>
            <p className="text-lg text-gray-600">
              Your liked articles, documents, and notes
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="article">Articles</option>
                  <option value="document">Documents</option>
                  <option value="note">Notes</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              {/* Layout Controls and Actions */}
              <div className="flex items-center gap-4">
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleBulkRemove}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove ({selectedItems.length})
                  </button>
                )}

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
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Loading favorites...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchFavorites}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedType !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Start liking content you want to save for later"
                }
              </p>
              <button
                onClick={() => navigate("/articles")}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Explore Content
              </button>
            </div>
          ) : (
            <>
              {/* Favorites Grid */}
              <div className={`grid ${gridCols} gap-6 mb-8`}>
                {filteredFavorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col"
                  >
                    {/* Content Type Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getContentTypeColor(favorite.content.type)}`}>
                        {favorite.content.type.toUpperCase()}
                      </span>
                    </div>

                    {/* Content Image/Icon */}
                    <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center relative">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getContentIcon(favorite.content.type)}
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-semibold text-black mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                        {favorite.content.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                        {favorite.content.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{favorite.content.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(favorite.favorited_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{favorite.content.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{favorite.content.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{favorite.content.comments}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-auto">
                        <button
                          onClick={() => navigate(`/${favorite.content.type}s/${favorite.content.id}`)}
                          className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                          View Content
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(favorite.id, favorite.content.id)}
                          className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
