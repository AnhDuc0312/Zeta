import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  FileText,
  Clock,
  Globe,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [topContent, setTopContent] = useState<any[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const [overviewRes, contentRes, usersRes] = await Promise.all([
          fetch("/api/admin/analytics/overview", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/analytics/content", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/analytics/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!overviewRes.ok || !contentRes.ok || !usersRes.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const overview = await overviewRes.json();
        const content = await contentRes.json();
        const users = await usersRes.json();
        setOverviewStats(overview);
        setTopContent(content.topContent || []);
        setTopUsers(users.topUsers || []);
      } catch (err: any) {
        setError(err.message || "Error fetching analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  // Mock analytics data
  // const overviewStats = [
  //   {
  //     label: "Total Page Views",
  //     value: "247,892",
  //     change: "+15.3%",
  //     trend: "up",
  //     icon: Eye,
  //     color: "blue",
  //   },
  //   {
  //     label: "Unique Visitors",
  //     value: "42,847",
  //     change: "+8.7%",
  //     trend: "up",
  //     icon: Users,
  //     color: "green",
  //   },
  //   {
  //     label: "Avg. Session Duration",
  //     value: "4m 32s",
  //     change: "+12.5%",
  //     trend: "up",
  //     icon: Clock,
  //     color: "purple",
  //   },
  //   {
  //     label: "Bounce Rate",
  //     value: "34.2%",
  //     change: "-5.1%",
  //     trend: "down",
  //     icon: Target,
  //     color: "orange",
  //   },
  // ];

  // const topPages = [
  //   {
  //     path: "/articles/getting-started-with-zetascript",
  //     title: "Getting Started with ZetaScript",
  //     views: 8247,
  //     uniqueViews: 6891,
  //     avgTime: "3m 45s",
  //     bounceRate: "28%",
  //   },
  //   {
  //     path: "/documents/api-documentation",
  //     title: "API Documentation v2.1",
  //     views: 5683,
  //     uniqueViews: 4729,
  //     avgTime: "6m 12s",
  //     bounceRate: "22%",
  //   },
  //   {
  //     path: "/articles/advanced-features-overview",
  //     title: "Advanced Features Overview",
  //     views: 4521,
  //     uniqueViews: 3847,
  //     avgTime: "4m 28s",
  //     bounceRate: "31%",
  //   },
  //   {
  //     path: "/",
  //     title: "Homepage",
  //     views: 12459,
  //     uniqueViews: 9834,
  //     avgTime: "2m 15s",
  //     bounceRate: "45%",
  //   },
  // ];

  // const deviceStats = [
  const topPages = [
    {
      path: "/articles/getting-started-with-zetascript",
      title: "Getting Started with ZetaScript",
      views: 8247,
      uniqueViews: 6891,
      avgTime: "3m 45s",
      bounceRate: "28%",
    },
    {
      path: "/documents/api-documentation",
      title: "API Documentation v2.1",
      views: 5683,
      uniqueViews: 4729,
      avgTime: "6m 12s",
      bounceRate: "22%",
    },
    {
      path: "/articles/advanced-features-overview",
      title: "Advanced Features Overview",
      views: 4521,
      uniqueViews: 3847,
      avgTime: "4m 28s",
      bounceRate: "31%",
    },
    {
      path: "/",
      title: "Homepage",
      views: 12459,
      uniqueViews: 9834,
      avgTime: "2m 15s",
      bounceRate: "45%",
    },
  ];

  const deviceStats = [
    { device: "Desktop", percentage: 58.3, visitors: 24947, color: "blue" },
    { device: "Mobile", percentage: 35.2, visitors: 15069, color: "green" },
    { device: "Tablet", percentage: 6.5, visitors: 2781, color: "purple" },
  ];

  const referralSources = [
    { source: "Google Search", visitors: 18457, percentage: 43.1 },
    { source: "Direct", visitors: 12893, percentage: 30.1 },
    { source: "Social Media", visitors: 5647, percentage: 13.2 },
    { source: "Email", visitors: 3421, percentage: 8.0 },
    { source: "Other", visitors: 2429, percentage: 5.6 },
  ];

  const userEngagement = [
    { metric: "Pages per Session", value: "3.2", change: "+8.1%" },
    { metric: "Session Duration", value: "4m 32s", change: "+12.5%" },
    { metric: "Return Visitors", value: "28.4%", change: "+5.3%" },
    { metric: "New Visitors", value: "71.6%", change: "+2.1%" },
  ];

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Desktop":
        return Monitor;
      case "Mobile":
        return Smartphone;
      case "Tablet":
        return Tablet;
      default:
        return Monitor;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics & Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Detailed insights into your content performance and user behavior
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "content", label: "Content Performance" },
              { id: "audience", label: "Audience" },
              { id: "traffic", label: "Traffic Sources" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.isArray(overviewStats) && overviewStats.length > 0 ? (
                    overviewStats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {stat.value}
                            </p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              stat.trend === "up" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {stat.change}
                          </span>
                          <span className="text-sm text-gray-500">
                            vs last period
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-center text-gray-400">No overview data</div>
                  )}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traffic Overview Chart */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Traffic Overview
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Page Views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Unique Visitors
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Traffic chart visualization</p>
                        <p className="text-sm text-gray-400">
                          Data for the last {timeRange}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Device Breakdown */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Device Breakdown
                    </h3>
                    <div className="space-y-4">
                      {deviceStats.map((device, index) => {
                        const Icon = getDeviceIcon(device.device);
                        return (
                          <div key={index} className="flex items-center gap-4">
                            <div
                              className={`p-2 bg-${device.color}-100 rounded-lg`}
                            >
                              <Icon
                                className={`w-5 h-5 text-${device.color}-600`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {device.device}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {device.percentage}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`bg-${device.color}-500 h-2 rounded-full`}
                                  style={{ width: `${device.percentage}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatNumber(device.visitors)} visitors
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* User Engagement Metrics */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    User Engagement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {userEngagement.map((metric, index) => (
                      <div key={index} className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          {metric.metric}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {metric.value}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          {metric.change}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Content Performance Tab */}
            {activeTab === "content" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Top Performing Pages
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unique Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg. Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bounce Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {topPages.map((page, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {page.title}
                                </h4>
                                <p className="text-sm text-gray-500">{page.path}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {formatNumber(page.views)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {formatNumber(page.uniqueViews)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {page.avgTime}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {page.bounceRate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Traffic Sources Tab */}
            {activeTab === "traffic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traffic Sources */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Traffic Sources
                    </h3>
                    <div className="space-y-4">
                      {referralSources.map((source, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {source.source}
                              </span>
                              <span className="text-sm text-gray-600">
                                {source.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${source.percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatNumber(source.visitors)} visitors
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Geographic Data */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Geographic Distribution
                    </h3>
                    <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">World map visualization</p>
                        <p className="text-sm text-gray-400">
                          Visitor locations for the last {timeRange}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audience Tab */}
            {activeTab === "audience" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Age Demographics */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Age Demographics
                    </h3>
                    <div className="h-64 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Age distribution chart</p>
                        <p className="text-sm text-gray-400">
                          Audience demographics data
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Behavior */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      User Behavior
                    </h3>
                    <div className="h-64 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MousePointer className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Behavior flow diagram</p>
                        <p className="text-sm text-gray-400">
                          User journey analytics
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
