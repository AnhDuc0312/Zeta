import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Link,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Video,
  FileText,
  FolderOpen,
  StickyNote,
  Calendar,
  Tag,
  Settings,
  Send,
  BookOpen,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../contexts/AuthContext";
import { markdownToHtml, processImageUrls, enhanceContent } from "../../lib/markdown";
import ImageUpload from "../../components/ImageUpload";
import ImageGallery from "../../components/ImageGallery";
// XÓA: import Select from "react-select";

// THÊM COMPONENT CUSTOM MULTI-SELECT TAGS
function TagsMultiSelect({ tags, value, onChange }: {
  tags: { id: string; name: string }[];
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const filtered = tags.filter(
    tag => tag.name.toLowerCase().includes(input.toLowerCase()) && !value.includes(tag.id)
  );
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1 mb-1">
        {value.map(id => {
          const tag = tags.find(t => t.id === id);
          return tag ? (
            <span key={id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center text-xs">
              {tag.name}
              <button type="button" className="ml-1 text-blue-500 hover:text-red-500" onClick={() => onChange(value.filter(v => v !== id))}>
                ×
              </button>
            </span>
          ) : null;
        })}
      </div>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search and select tags..."
        value={input}
        onChange={e => {
          setInput(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      {showDropdown && filtered.length > 0 && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded shadow w-full mt-1 max-h-40 overflow-auto">
          {filtered.map(tag => (
            <div
              key={tag.id}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              onMouseDown={() => {
                onChange([...value, tag.id]);
                setInput("");
              }}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreateContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Set page title
  useEffect(() => {
    document.title = "Create Content - ZetaScript";
  }, []);
  const contentType = (searchParams.get("type") || "article") as
    | "article"
    | "document"
    | "note";
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    category_id: "",
    tags: "" as string | string[],
    status: "draft",
    featured: false,
    allowComments: true,
    publishDate: "",
    seoTitle: "",
    seoDescription: "",
    customUrl: "",
    author: "",
    file_url: "",
    file_size: "",
    word_count: 0,
  });

  const [activeTab, setActiveTab] = useState("content");
  const [isPreview, setIsPreview] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [images, setImages] = useState<Array<{
    id: string;
    url: string;
    filename: string;
    metadata?: {
      width: number;
      height: number;
      size: number;
      format: string;
    };
  }>>([]);

  useEffect(() => {
    if (user && !formData.author) {
      setFormData((prev) => ({ ...prev, author: user.name }));
    }
  }, [user]);

  useEffect(() => {
    // Lấy categories và tags từ backend
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const [catRes, tagRes] = await Promise.all([
          fetch(`/api/categories`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/tags`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.data || []);
        }
        if (tagRes.ok) {
          const tagData = await tagRes.json();
          setTags(tagData.data || []);
        }
      } catch {}
    }
    fetchData();
  }, []);

  // Function to calculate word count
  const calculateWordCount = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Function to insert markdown formatting
  const insertMarkdown = (before: string, after: string) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newText = formData.content.substring(0, start) + before + selectedText + after + formData.content.substring(end);
    
    setFormData(prev => ({
      ...prev,
      content: newText,
      word_count: calculateWordCount(newText)
    }));

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsUploadingImage(true);
        try {
          // Upload to server
          const formData = new FormData();
          formData.append('file', file);
          
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:4000/api/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          if (response.ok) {
            const data = await response.json();
            // Use full URL for the image
            const imageUrl = `http://localhost:4000${data.url}`;
            insertMarkdown(`![${file.name}](${imageUrl})`, '');
          } else {
            console.error('Upload failed:', response.statusText);
            // Fallback to local URL if upload fails
            const imageUrl = URL.createObjectURL(file);
            insertMarkdown(`![${file.name}](${imageUrl})`, '');
          }
        } catch (error) {
          console.error('Upload failed:', error);
          // Fallback to local URL
          const imageUrl = URL.createObjectURL(file);
          insertMarkdown(`![${file.name}](${imageUrl})`, '');
        } finally {
          setIsUploadingImage(false);
        }
      }
    };
    input.click();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };
      
      // Calculate word count when content changes
      if (name === "content") {
        newData.word_count = calculateWordCount(value);
      }
      
      return newData;
    });
  };

  const handleSave = async (status: "draft" | "published") => {
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      alert('Content is required');
      return;
    }
    if (!formData.category) {
      alert('Category is required');
      return;
    }
    
    // Chuẩn hóa tags: nếu là chuỗi thì tách thành mảng
    let tags = formData.tags;
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
    }
    if (!Array.isArray(tags)) tags = [];
    // Find category_id from selected category
    const selectedCategory = categories.find(cat => cat.name === formData.category);
    
    const contentData = {
      ...formData,
      tags,
      status,
      type: contentType,
      author: user?.name || formData.author || "",
      category_id: selectedCategory?.id || formData.category_id || "",
      author_id: user?.id || "",
      author_email: user?.email || "",
      image_url: images.length > 0 ? images[0].url : null,
      // Remove fields that shouldn't be sent to backend
      category: undefined,
    };
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contentData),
      });
      
      if (response.ok) {
        navigate('/admin/content');
      } else {
        const errorData = await response.json();
        alert(`Failed to save content: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Save content error:', error);
      alert('Failed to save content');
    }
  };

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
              <div className={`p-2 rounded-lg ${getTypeColor(contentType)}`}>
                {getTypeIcon(contentType)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New{" "}
                  {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                </h1>
                <p className="text-gray-600">
                  Fill in the details below to create your content
                </p>
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

        {/* Content Type Selector */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Content Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => navigate(`/admin/content/new?type=${type.id}`)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  contentType === type.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <type.icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{type.name}</span>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

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
                      placeholder={`Enter ${contentType} title...`}
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
                      placeholder={`Brief description of your ${contentType}...`}
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
                          <button 
                            type="button"
                            onClick={() => insertMarkdown('**', '**')}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded"
                            title="Bold"
                          >
                            <Bold className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => insertMarkdown('*', '*')}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded"
                            title="Italic"
                          >
                            <Italic className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => insertMarkdown('<u>', '</u>')}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded"
                            title="Underline"
                          >
                            <Underline className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="h-6 border-l border-gray-300"></div>
                        <div className="flex items-center gap-1">
                          <button 
                            type="button"
                            onClick={() => insertMarkdown('- ', '')}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded"
                            title="Bullet List"
                          >
                            <List className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => insertMarkdown('1. ', '')}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded"
                            title="Numbered List"
                          >
                            <ListOrdered className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => insertMarkdown('> ', '')}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded"
                            title="Quote"
                          >
                            <Quote className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="h-6 border-l border-gray-300"></div>
                        <div className="flex items-center gap-1">
                          <button 
                            type="button"
                            onClick={() => insertMarkdown('[Link Text](', ')')}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded"
                            title="Insert Link"
                          >
                            <Link className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={handleImageUpload}
                            disabled={isUploadingImage}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title={isUploadingImage ? "Uploading..." : "Insert Image"}
                          >
                            {isUploadingImage ? (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                            ) : (
                              <Image className="w-4 h-4" />
                            )}
                          </button>
                          <button 
                            type="button"
                            onClick={() => insertMarkdown('```\n', '\n```')}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded"
                            title="Code Block"
                          >
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
                      placeholder={`Write your ${contentType} content here...

You can use Markdown syntax:
# Heading 1
## Heading 2
**Bold text**
*Italic text*
- List item
1. Numbered list
> Quote
\`code\`
[Link](url)
![Image](url)`}
                      className="w-full px-4 py-3 border-x border-b border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      required
                    />
                    {/* Word Count Display */}
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                      <span>Word count: {formData.word_count}</span>
                      <span>Characters: {formData.content.length}</span>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  <div>
                    <ImageGallery
                      images={images}
                      onImagesChange={setImages}
                      maxImages={10}
                      showUpload={true}
                    />
                  </div>

                  {/* File Upload for Documents */}
                  {contentType === "document" && (
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
                        <input 
                          type="file" 
                          className="hidden" 
                          id="file-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData(prev => ({
                                ...prev,
                                file_url: file.name,
                                file_size: file.size.toString()
                              }));
                            }
                          }}
                        />
                        <label 
                          htmlFor="file-upload"
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                        >
                          Choose File
                        </label>
                        {formData.file_url && (
                          <div className="mt-2 text-sm text-green-600">
                            Selected: {formData.file_url} ({(parseInt(formData.file_size) / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        )}
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
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <TagsMultiSelect
                        tags={tags}
                        value={Array.isArray(formData.tags) ? formData.tags : []}
                        onChange={val => setFormData(prev => ({ ...prev, tags: val }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">Bạn có thể tìm kiếm và chọn nhiều tag</p>
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
                    <h1 className="text-3xl font-bold mb-4">{formData.title || "Untitled"}</h1>
                    {formData.description && (
                      <p className="text-lg text-gray-600 mb-6">
                        {formData.description}
                      </p>
                    )}
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: enhanceContent(processImageUrls(markdownToHtml(formData.content || '')))
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleSave("draft")}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Save className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Save as Draft</span>
                </button>
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {isPreview ? "Edit Mode" : "Preview"}
                  </span>
                </button>
                <button
                  onClick={() => handleSave("published")}
                  className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Send className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Publish Now</span>
                </button>
              </div>
            </div>

            {/* Content Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Content Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Characters:</span>
                  <span className="text-sm font-medium">
                    {formData.content.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Words:</span>
                  <span className="text-sm font-medium">
                    {formData.content.split(/\s+/).filter(Boolean).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reading time:</span>
                  <span className="text-sm font-medium">
                    {Math.ceil(
                      formData.content.split(/\s+/).filter(Boolean).length /
                        200,
                    ) || 0}{" "}
                    min
                  </span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Writing Tips
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Use clear, descriptive titles</p>
                <p>• Add relevant tags for better discovery</p>
                <p>• Preview your content before publishing</p>
                <p>• Optimize SEO fields for search engines</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
