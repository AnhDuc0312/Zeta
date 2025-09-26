import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Home,
  Facebook,
  Instagram,
  Youtube,
  Music,
  User,
  ChevronDown,
  Settings,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
  showSearch?: boolean;
}

export default function Layout({ children, showSearch = true }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  const getActiveTab = () => {
    if (location.pathname === "/articles") return "Articles";
    if (location.pathname === "/documents") return "Documents";
    if (location.pathname === "/notes") return "Notes";
    if (location.pathname === "/share") return "Share";
    return "Home";
  };

  const handleTabClick = (tab: string) => {
    if (tab === "Articles") navigate("/articles");
    else if (tab === "Documents") navigate("/documents");
    else if (tab === "Notes") navigate("/notes");
    else if (tab === "Share") navigate("/share");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs = ["Articles", "Documents", "Notes", "Share"];
  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Logo size="md" showText={true} />
            </button>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center bg-gray-100 rounded-full p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-black"
              >
                <Home className="w-5 h-5" />
              </button>
              {isLoggedIn && user ? (
                <div className="flex items-center gap-3">
                  {/* User Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                      <User className="w-4 h-4" />
                      {user.name}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <button
                        onClick={() => navigate("/account")}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                      >
                        Account Settings
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Dashboard Manager
                          </button>
                          <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Manager
                          </button>
                        </>
                      )}
                      <button
                        onClick={async () => {
                          await logout();
                          navigate("/");
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <nav className="flex justify-center">
            <div className="flex bg-gray-100 rounded-full p-1 w-full max-w-md">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`flex-1 py-2 rounded-full text-xs font-medium transition-all ${
                    activeTab === tab
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search all"
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button
                onClick={() => navigate("/search")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left side */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Logo size="sm" showText={true} />
              </div>
              <p className="text-sm text-gray-600">
                Email: support@zetascript.com
              </p>
              <p className="text-sm text-gray-600">Terms & conditions</p>
            </div>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-black border-b-2 border-black pb-1"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <button className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Facebook className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Instagram className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Youtube className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Music className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          {/* Copyright */}
          <div className="pt-6 mt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Copyright © 2024 ZetaScript. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}