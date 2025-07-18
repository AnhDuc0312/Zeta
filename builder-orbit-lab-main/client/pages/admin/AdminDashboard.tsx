import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Eye,
  MessageCircle,
  Calendar,
  Clock,
  Globe,
  Award,
  Activity,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  User as UserIcon,
  Settings,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("7d");
  // Mock data gốc
  const mockStats = {
    totalUsers: 2847,
    activeUsers: 1592,
    totalContent: 384,
    totalViews: 47293,
    userGrowth: 12.5,
    contentGrowth: 8.3,
    viewGrowth: 15.7,
    engagementRate: 24.6,
    totalComments: 1234,
  };
  const mockTopContent = [
    {
      id: 1,
      title: "Getting Started with ZetaScript",
      type: "Article",
      views: 1247,
      engagement: 34,
      author: "Admin",
    },
    {
      id: 2,
      title: "API Documentation v2.1",
      type: "Document",
      views: 856,
      engagement: 28,
      author: "Dev Team",
    },
    {
      id: 3,
      title: "Design System Guidelines",
      type: "Document",
      views: 643,
      engagement: 22,
      author: "Design Team",
    },
    {
      id: 4,
      title: "Advanced Features Overview",
      type: "Article",
      views: 521,
      engagement: 19,
      author: "Admin",
    },
  ];
  const recentActivity = [
    {
      id: 1,
      type: "user_signup",
      user: "John Smith",
      action: "signed up",
      time: "2 minutes ago",
      icon: Users,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "content_published",
      user: "Sarah Wilson",
      action: "published an article",
      time: "5 minutes ago",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "comment",
      user: "Mike Johnson",
      action: "commented on a document",
      time: "8 minutes ago",
      icon: MessageCircle,
      color: "text-purple-600",
    },
    {
      id: 4,
      type: "view",
      user: "Anonymous",
      action: "viewed 'Getting Started Guide'",
      time: "12 minutes ago",
      icon: Eye,
      color: "text-gray-600",
    },
  ];
  const userStats = [
    { label: "New Users (7d)", value: 156, change: "+23%" },
    { label: "Active Sessions", value: 89, change: "+5%" },
    { label: "Avg. Session Duration", value: "4m 32s", change: "+12%" },
    { label: "Bounce Rate", value: "34%", change: "-8%" },
  ];

  // State cho dữ liệu thật
  const [stats, setStats] = useState<any>(mockStats);
  const [topContent, setTopContent] = useState<any[]>(mockTopContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const [overviewRes, contentRes] = await Promise.all([
          fetch("/api/admin/analytics/overview", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/analytics/content", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (overviewRes.ok) {
          const overview = await overviewRes.json();
          setStats({ ...mockStats, ...overview });
        }
        if (contentRes.ok) {
          const content = await contentRes.json();
          setTopContent(content.topContent || mockTopContent);
        }
      } catch (err: any) {
        setError(err.message || "Error fetching data");
        setStats(mockStats);
        setTopContent(mockTopContent);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num?.toString() || "0";
  };

  // Chia recentActivity thành 2 nhóm
  const userActivity = recentActivity.filter(a => a.type === "user_signup");
  const contentActivity = recentActivity.filter(a => a.type !== "user_signup");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with ZetaScript.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats?.totalUsers)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                {/* Nếu có userGrowth thì hiển thị */}
                {stats?.userGrowth && (
                  <div className="flex items-center gap-2 mt-4">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      +{stats.userGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Content
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats?.totalContent)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                {stats?.contentGrowth && (
                  <div className="flex items-center gap-2 mt-4">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      +{stats.contentGrowth}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Comments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats?.totalComments)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats?.totalViews)}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Eye className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Content */}
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">Top Content</h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topContent.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatNumber(item.views)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.engagement ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.author}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {userStats.map((stat, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity + Quick Actions */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Recent Activity 70% */}
              <div className="col-span-1 lg:col-span-7">
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <div className="bg-white border border-gray-200 rounded-lg divide-y">
                  {recentActivity.length === 0 ? (
                    <div className="p-6 text-gray-400 text-center">No recent activity</div>
                  ) : (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-6">
                        <div className={`p-2 rounded-lg ${activity.color === "text-green-600"
                            ? "bg-green-100"
                            : activity.color === "text-blue-100"
                            ? "bg-blue-100"
                            : activity.color === "text-purple-600"
                            ? "bg-purple-100"
                            : "bg-gray-100"
                          }`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* Quick Actions 30% */}
              <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 justify-center items-center">
                <div className="w-full flex flex-col gap-4">
                  <button
                    onClick={() => navigate("/admin/content/new")}
                    className="flex flex-col items-center gap-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-all w-full"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-base font-semibold">New Content</span>
                    <span className="text-xs text-blue-100 mt-0.5">Add new article or document</span>
                  </button>
                  <button
                    onClick={() => navigate("/admin/users")}
                    className="flex flex-col items-center gap-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-all w-full"
                  >
                    <UserIcon className="w-6 h-6 mb-1" />
                    <span className="text-base font-semibold">Manage Users</span>
                    <span className="text-xs text-green-100 mt-0.5">View and edit user accounts</span>
                  </button>
                  <button
                    onClick={() => navigate("/admin/analytics")}
                    className="flex flex-col items-center gap-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-all w-full"
                  >
                    <Activity className="w-6 h-6 mb-1" />
                    <span className="text-base font-semibold">View Analytics</span>
                    <span className="text-xs text-purple-100 mt-0.5">Detailed reports and insights</span>
                  </button>
                  <button
                    onClick={() => navigate("/admin/settings")}
                    className="flex flex-col items-center gap-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-all w-full"
                  >
                    <Settings className="w-6 h-6 mb-1" />
                    <span className="text-base font-semibold">Site Settings</span>
                    <span className="text-xs text-gray-200 mt-0.5">Configure system preferences</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
