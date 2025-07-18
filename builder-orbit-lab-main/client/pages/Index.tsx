import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState({ articles: [], documents: [], notes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "ZetaScript - Organize Your Knowledge";
    setLoading(true);
    fetch("/api/content/home-preview")
      .then(res => res.json())
      .then(data => setPreview(data))
      .catch(() => setError("Failed to load preview"))
      .finally(() => setLoading(false));
  }, []);

  const PreviewSection = ({
    title,
    description,
    path,
    items,
  }: {
    title: string;
    description: string;
    path: string;
    items: any[];
  }) => (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-black mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        <button
          onClick={() => navigate(path)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {/* Preview Grid - 2 items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="col-span-2 text-center py-8 text-red-500">{error}</div>
        ) : items.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-400">No {title.toLowerCase()} found.</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/${title.toLowerCase()}/${item.id}`)}
            >
              <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                {/* Có thể thêm ảnh nếu có item.image */}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.description || item.content?.slice(0, 100) || "No description"}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{item.author || item.author_email || "Unknown"}</span>
                  <span>•</span>
                  <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
          Welcome to
          <br />
          <span className="text-gray-600">ZetaScript</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Your ultimate platform for organizing articles, documents, and notes.
          Create, discover, and share your content with the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/articles")}
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Explore Articles
          </button>
          <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Preview Sections */}
      <PreviewSection
        title="Articles"
        description="Discover thought-provoking articles and stories"
        path="/articles"
        items={preview.articles}
      />

      <PreviewSection
        title="Documents"
        description="Access important documents and resources"
        path="/documents"
        items={preview.documents}
      />

      <PreviewSection
        title="Notes"
        description="Browse personal notes and quick thoughts"
        path="/notes"
        items={preview.notes}
      />

      {/* Call to Action */}
      <div className="bg-black text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of creators who organize and share their work with
          ZetaScript.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors">
            Sign Up Free
          </button>
          <button className="px-8 py-3 border border-gray-400 text-white rounded-full hover:bg-gray-800 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </Layout>
  );
}
