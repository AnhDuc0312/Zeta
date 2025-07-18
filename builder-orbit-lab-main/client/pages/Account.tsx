import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Settings,
  FileText,
  StickyNote,
  BarChart3,
  LogOut,
  Edit,
  Save,
  X,
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

export default function Account() {
  const navigate = useNavigate();
  const { user, isLoggedIn, loading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "", // Có thể lấy từ backend nếu muốn
    location: "",
    website: "",
  });
  const [editData, setEditData] = useState(profileData);

  useEffect(() => {
    document.title = "Account Settings | ZetaScript";
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    let fallbackName = "";
    if (savedUser) {
      try {
        fallbackName = JSON.parse(savedUser).name || "";
      } catch {}
    }
    if (token) {
      fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data) {
            setProfileData((prev) => ({
              ...prev,
              name: data.name || fallbackName,
              email: data.email || prev.email,
              // Có thể bổ sung các trường khác nếu backend trả về
            }));
          }
        });
    }
  }, []);

  // Sau khi khai báo hook, mới kiểm tra điều kiện và return
  if (!isLoggedIn && !loading) {
    navigate("/login");
    return null;
  }
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Mock logout - in real app, clear auth tokens
    navigate("/");
  };

  const stats = [
    { label: "Articles", value: 24, icon: FileText, color: "text-blue-600" },
    { label: "Documents", value: 18, icon: FileText, color: "text-green-600" },
    { label: "Notes", value: 42, icon: StickyNote, color: "text-yellow-600" },
    {
      label: "Views",
      value: "1.2k",
      icon: BarChart3,
      color: "text-purple-600",
    },
  ];

  return (
    <Layout showSearch={false}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black">Account Settings</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-black">
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-black transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-black transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Avatar */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black">
                    {profileData.name}
                  </h3>
                  <p className="text-gray-600">{profileData.email}</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{profileData.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{profileData.bio}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">
                        {profileData.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editData.website}
                        onChange={(e) =>
                          setEditData({ ...editData, website: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    ) : (
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 text-black hover:underline"
                      >
                        {profileData.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-black mb-6">
                Security Settings
              </h2>
              <div className="space-y-4">
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-black">
                        Change Password
                      </h3>
                      <p className="text-sm text-gray-600">
                        Update your password to keep your account secure
                      </p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-black">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-black mb-6">
                Your Stats
              </h2>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-gray-600">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-black">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-black mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/articles")}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-black">View Articles</div>
                  <div className="text-sm text-gray-600">
                    Manage your published content
                  </div>
                </button>
                <button
                  onClick={() => navigate("/documents")}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-black">View Documents</div>
                  <div className="text-sm text-gray-600">
                    Access your files and resources
                  </div>
                </button>
                <button
                  onClick={() => navigate("/notes")}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-black">View Notes</div>
                  <div className="text-sm text-gray-600">
                    Browse your personal notes
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
