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
} from "lucide-react";
import Layout from "../components/Layout";
import { markdownToHtml, processImageUrls, enhanceContent } from "../lib/markdown";
import { useSEO } from "../hooks/useSEO";
import { useToast } from "../hooks/use-toast";
import CommentSection from "../components/CommentSection";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // All state declarations
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const { toast } = useToast();

  // Handle share
  const handleShare = async () => {
    const shareData = {
      title: article?.title || 'Article',
      text: article?.description || '',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Article link has been copied to your clipboard.",
        });
      } catch (err) {
        console.error('Failed to copy link:', err);
        toast({
          title: "Copy failed",
          description: "Unable to copy link to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle bookmark/unbookmark
  const handleBookmark = async () => {
    if (isBookmarking) return;
    
    setIsBookmarking(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`/api/content/${id}/bookmark`, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
        toast({
          title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
          description: isBookmarked 
            ? "Article has been removed from your bookmarks." 
            : "Article has been added to your bookmarks.",
        });
      } else {
        console.error("Failed to toggle bookmark");
        toast({
          title: "Bookmark failed",
          description: "Unable to update bookmark. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Bookmark failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBookmarking(false);
    }
  };

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
        // Fetch updated article data to get correct like count
        const articleResponse = await fetch(`/api/content/${id}`);
        if (articleResponse.ok) {
          const articleData = await articleResponse.json();
          setLikeCount(articleData.likes || 0);
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

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
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
          setArticle(data);
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
          setArticle(null);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Check if user has liked this article
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

    const checkBookmarkStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`/api/content/${id}/bookmark-status`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    if (id) {
      checkLikeStatus();
      checkBookmarkStatus();
    }
  }, [id]);

  // SEO optimization
  useSEO({
    title: article?.title || "Article",
    description: article?.description || article?.content?.substring(0, 160) + "...",
    keywords: article?.tags?.join(", ") || "article, content",
    author: article?.author_name || "ZetaScript",
    publishedTime: article?.created_at,
    modifiedTime: article?.updated_at,
    type: "article",
    url: window.location.href,
    image: article?.image_url || "/favicon-v2.svg"
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

  if (!article) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
            <button
              onClick={() => navigate("/articles")}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Articles
            </button>
          </div>
        </div>
      </Layout>
    );
  }


  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <button
              onClick={() => navigate("/articles")}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Articles
            </button>

            <div className="mb-6">
              <h1 className="text-4xl font-bold text-black mb-4 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {article.category || 'Technology'}
                </span>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{Math.ceil((article.word_count || 0) / 200)} min read</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{article.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(article.created_at).toLocaleDateString("en-US", {
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
                    {article.author_name || 'Unknown Author'}
                  </h3>
                  <p className="text-sm text-gray-600">Published on {new Date(article.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div>
            {/* Main Content */}
            <article>
              {/* Featured Image */}
              <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-8 overflow-hidden">
                <img 
                  src="/unnamed.png" 
                  alt={article.title || "Article featured image"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-gray-700 prose-a:text-black hover:prose-a:underline prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ 
                  __html: enhanceContent(processImageUrls(markdownToHtml(article.content || '')))
                }}
              />

              {/* Tags */}
              {(article.tags && article.tags.length > 0) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: string) => (
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
                      <span className="font-medium">{article.comments || 0}</span>
                    </button>

                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </button>

                    <button 
                      onClick={handleBookmark}
                      disabled={isBookmarking}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isBookmarked
                          ? 'text-blue-500 bg-blue-50 hover:bg-blue-100'
                          : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                      } ${isBookmarking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <BookmarkPlus className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                      {isBookmarking && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                    </button>
                  </div>
                </div>
              </div>
            </article>

          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      {article && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <CommentSection contentId={article.id} />
        </div>
      )}
    </Layout>
  );
}