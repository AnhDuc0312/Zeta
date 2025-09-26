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
  Eye,
  EyeOff,
} from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Account() {
  const navigate = useNavigate();
  const { user, isLoggedIn, loading, logout, login } = useAuth();
  
  console.log("Account component - user:", user, "isLoggedIn:", isLoggedIn, "loading:", loading); // Debug log

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "", // Có thể lấy từ backend nếu muốn
    location: "",
    website: "",
  });
  const [editData, setEditData] = useState(profileData);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Two-Factor Authentication modal state
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Profile update state
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Stats state
  const [stats, setStats] = useState({
    articles: 0,
    documents: 0,
    notes: 0,
    totalViews: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Favorites state
  const [favorites, setFavorites] = useState({
    articles: [],
    documents: [],
    notes: [],
  });
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [activeFavoritesTab, setActiveFavoritesTab] = useState<'articles' | 'documents' | 'notes'>('articles');

  useEffect(() => {
    document.title = "My Account - ZetaScript";
  }, []);

  // Load user stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/users/stats", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Load user favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/users/favorites", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setFavoritesLoading(false);
      }
    };

    loadFavorites();
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
              email: data.email || prev?.email || "",
              bio: data.bio || "",
              location: data.location || "",
              website: data.website || "",
            }));
            setEditData({
              name: data.name || fallbackName,
              email: data.email || prev?.email || "",
              bio: data.bio || "",
              location: data.location || "",
              website: data.website || "",
            });
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

  const handleSave = async () => {
    setProfileError("");
    setProfileLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editData.name,
          bio: editData.bio,
          location: editData.location,
          website: editData.website,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - update local state
        setProfileData(editData);
        setIsEditing(false);
        
        // Update user in AuthContext if needed
        const updatedUser = { ...user, name: editData.name };
        login(updatedUser, token || undefined);
        
        setSuccessMessage("Profile updated successfully!");
        setShowSuccessModal(true);
      } else {
        setProfileError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setProfileError("Failed to connect to server");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout(); // Gọi hàm logout từ AuthContext để xóa token và user data
    navigate("/"); // Sau đó navigate về trang home
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setPasswordLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccessMessage("Password changed successfully!");
        setShowSuccessModal(true);
      } else {
        setPasswordError(data.message || "Có lỗi xảy ra khi đổi mật khẩu");
      }
    } catch (error) {
      console.error("Change password error:", error);
      setPasswordError("Có lỗi xảy ra khi kết nối đến server");
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const resetPasswordModal = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const statsData = [
    { label: "Articles", value: stats.articles, icon: FileText, color: "text-blue-600" },
    { label: "Documents", value: stats.documents, icon: FileText, color: "text-green-600" },
    { label: "Notes", value: stats.notes, icon: StickyNote, color: "text-yellow-600" },
    {
      label: "Views",
      value: formatNumber(stats.totalViews),
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
                      disabled={profileLoading}
                      className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {profileLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={profileLoading}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-black transition-colors disabled:opacity-50"
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

              {/* Error Message */}
              {profileError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4">
                  {profileError}
                </div>
              )}

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
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
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

                <button 
                  onClick={() => setShow2FAModal(true)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
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
                {statsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading stats...</p>
                  </div>
                ) : (
                  statsData.map((stat) => (
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
                  ))
                )}
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-black mb-6">
                Your Favorites
              </h2>
              
              {/* Favorites Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveFavoritesTab('articles')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeFavoritesTab === 'articles'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Articles ({favorites.articles.length})
                </button>
                <button
                  onClick={() => setActiveFavoritesTab('documents')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeFavoritesTab === 'documents'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Documents ({favorites.documents.length})
                </button>
                <button
                  onClick={() => setActiveFavoritesTab('notes')}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeFavoritesTab === 'notes'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Notes ({favorites.notes.length})
                </button>
              </div>

              {/* Favorites Content */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {favoritesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading favorites...</p>
                  </div>
                ) : (
                  (() => {
                    const currentFavorites = favorites[activeFavoritesTab];
                    if (currentFavorites.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No {activeFavoritesTab} in favorites yet</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Like some {activeFavoritesTab} to see them here
                          </p>
                        </div>
                      );
                    }

                    return currentFavorites.map((item: any) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/${activeFavoritesTab}/${item.id}`)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-black mb-2 line-clamp-2 break-words">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2 break-words">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                              <span className="truncate">By {item.author_name}</span>
                              <span className="whitespace-nowrap">
                                {new Date(item.created_at).toLocaleDateString()}
                              </span>
                              <span className="whitespace-nowrap">{item.views || 0} views</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <img
                              src="/unnamed.png"
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ));
                  })()
                )}
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

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={(open) => {
        setShowPasswordModal(open);
        if (!open) resetPasswordModal();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password for your account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {passwordError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {passwordError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  resetPasswordModal();
                }}
                disabled={passwordLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="bg-black hover:bg-gray-800"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Two-Factor Authentication Coming Soon Modal */}
      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Two-Factor Authentication
            </DialogTitle>
            <DialogDescription>
              Enhanced security feature coming soon
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Feature Coming Soon
              </h3>
              <p className="text-gray-600 mb-4">
                We're working hard to bring you Two-Factor Authentication (2FA) for enhanced account security.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">What to expect:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• SMS-based authentication</li>
                  <li>• Authenticator app support</li>
                  <li>• Backup recovery codes</li>
                  <li>• Enhanced account protection</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShow2FAModal(false)}
                className="bg-black hover:bg-gray-800"
              >
                Got it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Success
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600">
                {successMessage}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="bg-black hover:bg-gray-800"
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
