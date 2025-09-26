import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

export default function Index() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState({ articles: [], documents: [], notes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);

  useEffect(() => {
    document.title = "ZetaScript - Content Management Platform";
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
              <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src="/unnamed.png" 
                  alt={item.title || "Content image"}
                  className="w-full h-full object-cover"
                />
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
          <button 
            onClick={() => setShowLearnMore(true)}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
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
          <button 
            onClick={() => setShowSignUp(true)}
            className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            Sign Up Free
          </button>
          <button 
            onClick={() => setShowContactSales(true)}
            className="px-8 py-3 border border-gray-400 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Contact Sales
          </button>
        </div>
      </div>

      {/* Learn More Dialog */}
      <Dialog open={showLearnMore} onOpenChange={setShowLearnMore}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>About ZetaScript</DialogTitle>
            <DialogDescription>
              Learn more about our platform and features
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is ZetaScript?</h3>
              <p className="text-gray-600">
                ZetaScript is a comprehensive platform designed to help you organize, manage, and share your knowledge. 
                Whether you're a writer, researcher, student, or professional, our tools make it easy to create, 
                discover, and collaborate on content.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Create and manage articles, documents, and notes</li>
                <li>Advanced search and filtering capabilities</li>
                <li>Collaborative features for team projects</li>
                <li>Beautiful, responsive design</li>
                <li>Secure cloud storage</li>
                <li>Export and sharing options</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowLearnMore(false)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Up for Free</DialogTitle>
            <DialogDescription>
              Create your account to get started with ZetaScript
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600 text-center">
              Click the button below to go to the login page where you can create a new account.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Go to Login Page
              </button>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowSignUp(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Sales Dialog */}
      <Dialog open={showContactSales} onOpenChange={setShowContactSales}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Sales</DialogTitle>
            <DialogDescription>
              Get in touch with our sales team for enterprise solutions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                For enterprise inquiries and custom solutions, please contact us:
              </p>
              <div className="space-y-2">
                <p className="font-medium">Email: sales@zetascript.com</p>
                <p className="font-medium">Phone: +1 (555) 123-4567</p>
                <p className="font-medium">Hours: Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={() => window.open('mailto:sales@zetascript.com?subject=Enterprise Inquiry', '_blank')}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Send Email
              </button>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowContactSales(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
