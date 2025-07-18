import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import {
  Save,
  Eye,
  ArrowLeft,
  Send,
  Edit,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Video,
  Code,
  FolderOpen,
  FileText,
  StickyNote,
  BookOpen,
  Settings,
  Tag,
  Upload,
} from "lucide-react";

const contentTypes = [
  {
    id: "article",
    name: "Article",
    description: "Write a blog post or article",
    icon: FileText,
  },
  {
    id: "document",
    name: "Document",
    description: "Upload or create a document",
    icon: FolderOpen,
  },
  {
    id: "note",
    name: "Note",
    description: "Quick note or memo",
    icon: StickyNote,
  },
];

const categories = [
  "Technology",
  "Design",
  "Business",
  "Tutorial",
  "Guide",
  "News",
  "Opinion",
  "Review",
  "Case Study",
  "Research",
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "article":
      return <FileText className="w-5 h-5" />;
    case "document":
      return <FolderOpen className="w-5 h-5" />;
    case "note":
      return <StickyNote className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "article":
      return "text-blue-600 bg-blue-100";
    case "document":
      return "text-green-600 bg-green-100";
    case "note":
      return "text-yellow-600 bg-yellow-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export default function EditContent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/content/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch content");
        const data = await res.json();
        // Map các trường về đúng formData
        setFormData({
          ...data,
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
          category: data.category_id || "",
          seoTitle: data.seo_title || "",
          seoDescription: data.seo_description || "",
          customUrl: data.custom_url || "",
          allowComments: typeof data.allow_comments === "boolean" ? data.allow_comments : true,
          publishDate: data.published_at ? data.published_at.slice(0, 16) : "",
        });
      } catch (err: any) {
        setError(err.message || "Error loading content");
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (status: "draft" | "published") => {
    // Chuẩn hóa tags: nếu là chuỗi thì tách thành mảng
    let tags = formData.tags;
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t);
    }
    const contentData = {
      ...formData,
      tags,
      status,
    };
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(contentData),
      });
      if (!res.ok) throw new Error("Failed to update content");
      navigate("/admin/content");
    } catch {
      alert("Failed to save content");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!formData) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/content")}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Content
            </button>
            <div className="h-6 border-l border-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
                <p className="text-gray-600">Update your content details below</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {isPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={() => handleSave("draft")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>
        {/* Form fields giống CreateContent, có thể copy/paste và đồng bộ UI */}
        {/* ... (bạn có thể copy phần form từ CreateContent.tsx vào đây để đồng bộ UI) ... */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: "content", label: "Content", icon: BookOpen },
                    { id: "settings", label: "Settings", icon: Settings },
                    { id: "seo", label: "SEO", icon: Tag },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              {/* Content Tab */}
              {activeTab === "content" && !isPreview && (
                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder={`Enter content title...`}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={`Brief description of your content...`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    {/* Editor Toolbar */}
                    <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <Bold className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <Italic className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <Underline className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="h-6 border-l border-gray-300"></div>
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <List className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <ListOrdered className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <Quote className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="h-6 border-l border-gray-300"></div>
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <Link className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <Image className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <Video className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded">
                            <Code className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Content Textarea */}
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={20}
                      placeholder={`Write your content here...\n\nYou can use Markdown syntax:\n# Heading 1\n## Heading 2\n**Bold text**\n*Italic text*\n- List item\n1. Numbered list\n> Quote\n\`code\`\n[Link](url)\n![Image](url)`}
                      className="w-full px-4 py-3 border-x border-b border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      required
                    />
                  </div>
                  {/* File Upload for Documents */}
                  {formData.type === "document" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Document
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max: 10MB)
                        </p>
                        <input type="file" className="hidden" />
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Choose File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="tag1, tag2, tag3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate tags with commas
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Publish Date
                      </label>
                      <input
                        type="datetime-local"
                        name="publishDate"
                        value={formData.publishDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Featured Content
                        </h3>
                        <p className="text-sm text-gray-500">
                          Mark this content as featured
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Allow Comments
                        </h3>
                        <p className="text-sm text-gray-500">
                          Allow users to comment on this content
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="allowComments"
                          checked={formData.allowComments}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {/* SEO Tab */}
              {activeTab === "seo" && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      placeholder="SEO optimized title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 50-60 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Meta description for search engines"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 150-160 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom URL Slug
                    </label>
                    <input
                      type="text"
                      name="customUrl"
                      value={formData.customUrl}
                      onChange={handleInputChange}
                      placeholder="custom-url-slug"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to auto-generate from title
                    </p>
                  </div>
                </div>
              )}
              {/* Preview Mode */}
              {isPreview && (
                <div className="p-6">
                  <div className="prose max-w-none">
                    <h1>{formData.title || "Untitled"}</h1>
                    {formData.description && (
                      <p className="lead text-gray-600">
                        {formData.description}
                      </p>
                    )}
                    <div className="whitespace-pre-wrap">
                      {formData.content || "No content yet..."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Sidebar, Quick Actions, Stats, Help có thể bổ sung nếu muốn */}
        </div>
      </div>
    </AdminLayout>
  );
} 