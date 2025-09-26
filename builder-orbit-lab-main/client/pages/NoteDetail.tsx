import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  User,
  StickyNote,
} from "lucide-react";
import Layout from "../components/Layout";
import { markdownToHtml, processImageUrls, enhanceContent } from "../lib/markdown";
import { useSEO } from "../hooks/useSEO";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // All state declarations
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  // Handle like/unlike
  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`/api/content/${id}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        // Fetch updated note data to get correct like count
        const noteResponse = await fetch(`/api/content/${id}`);
        if (noteResponse.ok) {
          const noteData = await noteResponse.json();
          setLikeCount(noteData.likes || 0);
        } else {
          // Fallback to local update if fetch fails
          setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        }
      } else {
        console.error("Failed to toggle like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/content/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Parse tags if it's a JSON string
          if (typeof data.tags === 'string') {
            try {
              data.tags = JSON.parse(data.tags);
            } catch (e) {
              data.tags = [];
            }
          }
          setNote(data);
          setLikeCount(data.likes || 0);
          
          // Increment view count
          try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            await fetch(`/api/content/${id}/view`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: user.id || null }),
            });
          } catch (viewError) {
            console.log('View tracking failed (non-critical):', viewError);
          }
        } else {
          setNote(null);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        setNote(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNote();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Check if user has liked this note
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`/api/content/${id}/like-status`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    if (id) {
      checkLikeStatus();
    }
  }, [id]);

  // SEO optimization
  useSEO({
    title: note?.title || "Note",
    description: note?.description || note?.content?.substring(0, 160) + "...",
    keywords: note?.tags?.join(", ") || "note, content, zetascript",
    author: note?.author_name || "ZetaScript",
    publishedTime: note?.created_at,
    modifiedTime: note?.updated_at,
    type: "note",
    url: window.location.href,
    image: "/favicon-v2.svg"
  });

  // Early returns after all hooks
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!note) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Note not found</h1>
            <button
              onClick={() => navigate("/notes")}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const relatedNotes = [
    {
      id: 2,
      title: "Quick React Tips",
      author: "John Doe",
      readTime: "3 min read",
    },
    {
      id: 3,
      title: "CSS Tricks Collection",
      author: "Jane Smith",
      readTime: "5 min read",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <button
              onClick={() => navigate("/notes")}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Notes
            </button>

            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <StickyNote className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-black mb-2 leading-tight">
                    {note.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {note.description}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  NOTE
                </span>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{Math.ceil((note.word_count || 0) / 200)} min read</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{note.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(note.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">
                    {note.author_name || 'Unknown Author'}
                  </h3>
                  <p className="text-sm text-gray-600">Published on {new Date(note.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-3">
              {/* Note Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-gray-700 prose-a:text-black hover:prose-a:underline prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ 
                  __html: enhanceContent(processImageUrls(markdownToHtml(note.content || '')))
                }}
              />

              {/* Tags */}
              {(note.tags && note.tags.length > 0) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Engagement Actions */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLike}
                      disabled={isLiking}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isLiked
                          ? 'text-red-500 bg-red-50 hover:bg-red-100'
                          : 'text-gray-600 hover:text-red-500 hover:bg-gray-50'
                      } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{likeCount}</span>
                      {isLiking && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">{note.comments || 0}</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200">
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200">
                      <BookmarkPlus className="w-5 h-5" />
                      <span className="font-medium">Bookmark</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Related Notes */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-black mb-4">Related Notes</h3>
                  <div className="space-y-4">
                    {relatedNotes.map((related) => (
                      <div
                        key={related.id}
                        className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors group"
                      >
                        <div className="w-16 h-16 bg-yellow-100 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
                          <StickyNote className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-black text-sm line-clamp-2 mb-1 group-hover:text-gray-600 transition-colors">
                            {related.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-1">{related.author}</p>
                          <p className="text-xs text-gray-400">{related.readTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
