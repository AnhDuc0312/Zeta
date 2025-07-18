import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  Activity,
  Plus,
  Bell,
  Search,
  Menu,
  X,
  Home,
  LogOut,
  User,
  Tag,
  Grid,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chỉ redirect nếu đã xác định xong trạng thái loading
  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">Loading...</div>;
  }
  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "content",
      label: "Content",
      icon: FileText,
      path: "/admin/content",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
    },
    {
      id: "activity",
      label: "Activity Logs",
      icon: Activity,
      path: "/admin/activity",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Tag,
      path: "/admin/categories",
    },
    {
      id: "tags",
      label: "Tags",
      icon: Grid,
      path: "/admin/tags",
    },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-200 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Logo size="md" showText={true} />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActiveRoute(item.path)
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              Exit Admin
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center justify-center px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16">
          <div className="flex items-center justify-between h-full px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admin panel..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Content</span>
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
