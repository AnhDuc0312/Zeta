import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  FolderOpen,
  StickyNote,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Settings,
  Download,
  Upload,
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

interface ContentItem {
  id: string;
  type: "article" | "document" | "note";
  title: string;
  description: string;
  category: string;
  status: "published" | "draft" | "private";
  views: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "all" | "articles" | "documents" | "notes"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    document.title = "Dashboard | ZetaScript";
  }, []);

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  // Mock content data
  const content: ContentItem[] = [
    {
      id: "1",
      type: "article",
      title: "Getting Started with ZetaScript",
      description: "A comprehensive guide to using our platform effectively.",
      category: "Tutorial",
      status: "published",
      views: 1247,
      author: user?.name || "Admin",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      tags: ["tutorial", "getting-started"],
    },
    {
      id: "2",
      type: "article",
      title: "Advanced Features Overview",
      description: "Exploring the advanced features and capabilities.",
      category: "Guide",
      status: "draft",
      views: 0,
      author: user?.name || "Admin",
      createdAt: "2024-01-18",
      updatedAt: "2024-01-22",
      tags: ["advanced", "features"],
    },
    {
      id: "3",
      type: "document",
      title: "API Documentation v2.1",
      description: "Complete API reference and examples.",
      category: "Technical",
      status: "published",
      views: 856,
      author: "Dev Team",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-25",
      tags: ["api", "documentation"],
    },
    {
      id: "4",
      type: "document",
      title: "User Privacy Policy",
      description: "Updated privacy policy and terms of service.",
      category: "Legal",
      status: "published",
      views: 245,
      author: "Legal Team",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-12",
      tags: ["legal", "privacy"],
    },
    {
      id: "5",
      type: "note",
      title: "Feature Ideas Brainstorm",
      description: "Collection of new feature ideas from the team.",
      category: "Planning",
      status: "private",
      views: 12,
      author: user?.name || "Admin",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-23",
      tags: ["ideas", "planning"],
    },
    {
      id: "6",
      type: "note",
      title: "Weekly Team Meeting Notes",
      description: "Key decisions and action items from this week.",
      category: "Meeting",
      status: "private",
      views: 8,
      author: user?.name || "Admin",
      createdAt: "2024-01-22",
      updatedAt: "2024-01-22",
      tags: ["meeting", "notes"],
    },
  ];

  const filteredContent = content.filter((item) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "articles" && item.type === "article") ||
      (activeTab === "documents" && item.type === "document") ||
      (activeTab === "notes" && item.type === "note");

    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const stats = {
    total: content.length,
    articles: content.filter((item) => item.type === "article").length,
    documents: content.filter((item) => item.type === "document").length,
    notes: content.filter((item) => item.type === "note").length,
    published: content.filter((item) => item.status === "published").length,
    drafts: content.filter((item) => item.status === "draft").length,
    totalViews: content.reduce((sum, item) => sum + item.views, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "private":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on items:`, selectedItems);
    // Implement bulk actions here
    setSelectedItems([]);
    setShowActions(false);
  };

  return (
    <Layout showSearch={false}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Content Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your articles, documents, and notes
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => alert('Tính năng Import sẽ sớm ra mắt!')}>
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => alert('Tính năng Export sẽ sớm ra mắt!')}>
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors" onClick={() => navigate('/admin/content/new')}>
              <Plus className="w-4 h-4" />
              New Content
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Content</p>
                <p className="text-2xl font-semibold text-black">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-black">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-black">
                  {stats.published}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Edit className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-black">
                  {stats.drafts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Tabs and Search */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Tabs */}
              <nav className="flex space-x-8">
                {[
                  { id: "all", label: "All Content", count: stats.total },
                  { id: "articles", label: "Articles", count: stats.articles },
                  {
                    id: "documents",
                    label: "Documents",
                    count: stats.documents,
                  },
                  { id: "notes", label: "Notes", count: stats.notes },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-black text-black"
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

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
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
                    Publish
                  </button>
                  <button
                    onClick={() => handleBulkAction("draft")}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    Move to Draft
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content Table */}
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
                        selectedItems.length === filteredContent.length &&
                        filteredContent.length > 0
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
                    Views
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
                {filteredContent.map((item) => (
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
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
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
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded capitalize ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        {item.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600" onClick={() => alert('Xem chi tiết content!')}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600" onClick={() => alert('Chỉnh sửa content!')}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600" onClick={() => alert('Xóa content!')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600" onClick={() => alert('Tính năng mở rộng sẽ sớm ra mắt!')}>
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredContent.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No content found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try adjusting your search query."
                  : "Start creating your first piece of content."}
              </p>
              <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                Create Content
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
