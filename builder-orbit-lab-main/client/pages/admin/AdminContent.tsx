import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  FileText,
  FolderOpen,
  StickyNote,
  Calendar,
  User,
  TrendingUp,
  Clock,
  Tag,
  Copy,
  Archive,
  Star,
  Download,
  Upload,
  Grid3X3,
  List,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AdminLayout from "../../components/AdminLayout";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface ContentItem {
  id: string;
  title: string;
  type: "article" | "document" | "note";
  status: "published" | "draft" | "private" | "archived";
  author: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
  tags: string[];
  description: string;
  featured: boolean;
  wordCount?: number;
  fileSize?: string;
  content?: string; // Added for preview
  allowComments?: boolean; // Added for preview
  seoTitle?: string; // Added for preview
  seoDescription?: string; // Added for preview
  customUrl?: string; // Added for preview
}

export default function AdminContent() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<
    "all" | "articles" | "documents" | "notes"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAuthor, setFilterAuthor] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updated");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State cho dữ liệu thật
  const [content, setContent] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Thêm state quản lý confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });

  // Hàm mở confirm dialog
  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmDialog({ open: true, title, description, onConfirm });
  };

  // State cho popup preview content
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // State cho more menu (nếu muốn highlight item đang mở menu)
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/content?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store", // Tắt cache để luôn nhận response mới
        });
        if (res.status === 304) {
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch content");
        const data = await res.json();
        setContent(data.data || []);
        setTotal(data.total || 0);
      } catch (err: any) {
        setError(err.message || "Error fetching content");
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [currentPage, itemsPerPage]);

  // Filter/search vẫn thực hiện ở frontend
  const { filteredContent, paginatedContent, totalPages } = useMemo(() => {
    const filtered = content
      .filter((item) => {
        const matchesTab =
          activeTab === "all" || item.type === activeTab.slice(0, -1);
        const matchesSearch =
          searchQuery === "" ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          filterStatus === "all" || item.status === filterStatus;
        return matchesTab && matchesSearch && matchesStatus;
      });
    // Phân trang frontend chỉ khi backend chưa hỗ trợ
    const paginated = filtered;
    const totalPages = Math.ceil(total / itemsPerPage);
    return { filteredContent: filtered, paginatedContent: paginated, totalPages };
  }, [content, activeTab, searchQuery, filterStatus, itemsPerPage, total]);

  const stats = {
    total: content.length,
    published: content.filter((c) => c.status === "published").length,
    draft: content.filter((c) => c.status === "draft").length,
    private: content.filter((c) => c.status === "private").length,
    archived: content.filter((c) => c.status === "archived").length,
    articles: content.filter((c) => c.type === "article").length,
    documents: content.filter((c) => c.type === "document").length,
    notes: content.filter((c) => c.type === "note").length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "document":
        return <FolderOpen className="w-4 h-4 text-green-600" />;
      case "note":
        return <StickyNote className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "draft":
        return <Edit className="w-4 h-4 text-yellow-600" />;
      case "private":
        return <Eye className="w-4 h-4 text-gray-600" />;
      case "archived":
        return <Archive className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "private":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Xóa content
  const handleDeleteContent = async (id: string) => {
    showConfirm(
      "Delete Content",
      "Are you sure you want to delete this content? This action cannot be undone.",
      async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/content/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to delete content");
          setContent((prev) => prev.filter((c) => c.id !== id));
          setTotal((prev) => prev - 1);
        } catch (err: any) {
          alert(err.message || "Error deleting content");
        }
      }
    );
  };

  // Bulk delete
  const handleBulkAction = async (action: string) => {
    if (action === "delete") {
      showConfirm(
        "Delete Selected Content",
        "Are you sure you want to delete selected content? This action cannot be undone.",
        async () => {
          const token = localStorage.getItem("token");
          for (const id of selectedItems) {
            try {
              await fetch(`/api/content/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
            } catch {}
          }
          setContent((prev) => prev.filter((c) => !selectedItems.includes(c.id)));
          setTotal((prev) => prev - selectedItems.length);
          setSelectedItems([]);
        }
      );
    } else {
      setSelectedItems([]);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const tabs = [
    { id: "all", label: "All Content", count: stats.total },
    { id: "articles", label: "Articles", count: stats.articles },
    { id: "documents", label: "Documents", count: stats.documents },
    { id: "notes", label: "Notes", count: stats.notes },
  ];

  // Publish content
  const handlePublishContent = async (id: string) => {
    showConfirm(
      "Publish Content",
      "Are you sure you want to publish this content?",
      async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/content/${id}/publish`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to publish content");
          setContent((prev) => prev.map((c) => c.id === id ? { ...c, status: "published" } : c));
        } catch (err: any) {
          alert(err.message || "Error publishing content");
        }
      }
    );
  };
  // Archive content
  const handleArchiveContent = async (id: string) => {
    showConfirm(
      "Archive Content",
      "Are you sure you want to archive this content?",
      async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/content/${id}/archive`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to archive content");
          setContent((prev) => prev.map((c) => c.id === id ? { ...c, status: "archived" } : c));
        } catch (err: any) {
          alert(err.message || "Error archiving content");
        }
      }
    );
  };
  // Duplicate content
  const handleDuplicateContent = async (id: string) => {
    showConfirm(
      "Duplicate Content",
      "Are you sure you want to duplicate this content?",
      async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/content/${id}/duplicate`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to duplicate content");
          setCurrentPage(1);
        } catch (err: any) {
          alert(err.message || "Error duplicating content");
        }
      }
    );
  };
  // Edit content (chuyển trang)
  const handleEditContent = (id: string) => {
    showConfirm(
      "Edit Content",
      "Are you sure you want to edit this content? Changes will be saved.",
      () => {
        navigate(`/admin/content/edit/${id}`);
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Content Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create, edit, and manage all your content
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => navigate("/admin/content/new")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Content
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Content</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.published}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Edit className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stats.draft}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatNumber(
                    content.reduce((sum, item) => sum + item.views, 0),
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Tabs and Controls */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Tabs */}
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>

              {/* View Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="title">Title</option>
                <option value="views">Views</option>
                <option value="author">Author</option>
              </select>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="private">Private</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <select
                      value={filterAuthor}
                      onChange={(e) => setFilterAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Authors</option>
                      {Array.from(
                        new Set(content.map((c) => c.authorEmail)),
                      ).map((email) => (
                        <option key={email} value={email}>
                          {content.find((c) => c.authorEmail === email)?.author}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {Array.from(new Set(content.map((c) => c.category))).map(
                        (category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterStatus("all");
                        setFilterAuthor("all");
                        setFilterCategory("all");
                        setSearchQuery("");
                      }}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="bg-blue-50 border-b border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedItems.length} item(s) selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkAction("publish")}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    <Send className="w-3 h-3 inline mr-1" />
                    Publish
                  </button>
                  <button
                    onClick={() => handleBulkAction("archive")}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                  >
                    <Archive className="w-3 h-3 inline mr-1" />
                    Archive
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-3 h-3 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content Grid/List */}
          {loading ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading content...
              </h3>
              <p className="text-gray-600 mb-6">
                Please wait while we fetch the content from the server.
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error: {error}
              </h3>
              <p className="text-gray-600 mb-6">
                Failed to fetch content from the server. Please try again later.
              </p>
              <button
                onClick={() => navigate("/admin/content/new")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Create Content
              </button>
            </div>
          ) : viewMode === "list" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(
                              filteredContent.map((item) => item.id),
                            );
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                        checked={
                          selectedItems.length === paginatedContent.length &&
                          paginatedContent.length > 0 &&
                          paginatedContent.every((item) =>
                            selectedItems.includes(item.id),
                          )
                        }
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedContent.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {getTypeIcon(item.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {item.title}
                              </h3>
                              {item.featured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{item.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded capitalize">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded capitalize ${getStatusBadge(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {(item.author || '?').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">
                              {item.author}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-gray-400" />
                            {formatNumber(item.views)}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-gray-400" />
                            {item.likes}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <TooltipProvider>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                  onClick={() => {
                                    setPreviewContent(item);
                                    setShowPreview(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Preview</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handleEditContent(item.id)} className="p-1 text-gray-400 hover:text-green-600">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handleDuplicateContent(item.id)} className="p-1 text-gray-400 hover:text-purple-600">
                                  <Copy className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Duplicate</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleDeleteContent(item.id)}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handlePublishContent(item.id)} className="p-1 text-gray-400 hover:text-green-600">
                                  <Send className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Publish</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handleArchiveContent(item.id)} className="p-1 text-gray-400 hover:text-purple-600">
                                  <Archive className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Archive</TooltipContent>
                            </Tooltip>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  onClick={() => setMoreMenuId(item.id)}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => alert("Export feature coming soon!")}>Export</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("View log feature coming soon!")}>View Log</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TooltipProvider>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedContent.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        {getStatusIcon(item.status)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded capitalize ${getStatusBadge(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{item.author}</span>
                        <span>
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatNumber(item.views)}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {item.likes}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEditContent(item.id)} className="p-1 text-gray-400 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDuplicateContent(item.id)} className="p-1 text-gray-400 hover:text-purple-600">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredContent.length > 0 && totalPages > 1 && (
            <div className="border-t border-gray-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

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
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
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
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredContent.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No content found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ||
                filterStatus !== "all" ||
                filterAuthor !== "all" ||
                filterCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start creating your first piece of content"}
              </p>
              <button
                onClick={() => navigate("/admin/content/new")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Create Content
              </button>
            </div>
          )}
        </div>
      </div>
      <AlertDialog open={confirmDialog.open} onOpenChange={open => setConfirmDialog(c => ({ ...c, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setConfirmDialog(c => ({ ...c, open: false }));
                await confirmDialog.onConfirm();
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewContent?.title || "Preview"}</DialogTitle>
            <DialogDescription>{previewContent?.description}</DialogDescription>
          </DialogHeader>
          <div className="prose max-w-none mt-4">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(previewContent?.type || "article")}
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 capitalize">
                {previewContent?.type}
              </span>
              <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusBadge(previewContent?.status || "draft")}`}>
                {previewContent?.status}
              </span>
              {previewContent?.featured && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Featured</span>
              )}
              {!previewContent?.allowComments && (
                <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">Comments Off</span>
              )}
            </div>
            <div className="text-gray-500 mb-2 text-sm">
              <span>By <b>{previewContent?.author}</b></span>
              {previewContent?.category && <span> • {previewContent.category}</span>}
              {previewContent?.publishedAt && (
                <span> • Published: {new Date(previewContent.publishedAt).toLocaleString()}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {previewContent?.tags?.map?.((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">{tag}</span>
              ))}
            </div>
            <div className="mb-4">
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Views: <b>{previewContent?.views}</b></span>
                <span>Likes: <b>{previewContent?.likes}</b></span>
                <span>Comments: <b>{previewContent?.comments}</b></span>
              </div>
            </div>
            <hr className="my-2" />
            <div className="whitespace-pre-wrap text-base text-gray-900 mb-4">
              {previewContent?.content || <span className="italic text-gray-400">No content yet...</span>}
            </div>
            {previewContent?.fileSize && (
              <div className="mb-2 text-xs text-gray-500">File size: {previewContent.fileSize}</div>
            )}
            {/* SEO Info */}
            {(previewContent?.seoTitle || previewContent?.seoDescription || previewContent?.customUrl) && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <div className="font-semibold text-xs text-gray-700 mb-1">SEO Info</div>
                {previewContent.seoTitle && <div className="text-xs"><b>SEO Title:</b> {previewContent.seoTitle}</div>}
                {previewContent.seoDescription && <div className="text-xs"><b>SEO Description:</b> {previewContent.seoDescription}</div>}
                {previewContent.customUrl && <div className="text-xs"><b>Custom URL:</b> {previewContent.customUrl}</div>}
              </div>
            )}
            <div className="mt-4 text-xs text-gray-400">
              Last updated: {previewContent?.updatedAt ? new Date(previewContent.updatedAt).toLocaleString() : ""}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
