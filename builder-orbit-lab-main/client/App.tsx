import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import Documents from "./pages/Documents";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import Account from "./pages/Account";
import ArticleDetail from "./pages/ArticleDetail";
import DocumentDetail from "./pages/DocumentDetail";
import NoteDetail from "./pages/NoteDetail";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContent from "./pages/admin/AdminContent";
import CreateContent from "./pages/admin/CreateContent";
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";
import ActivityLogs from "./pages/admin/ActivityLogs";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";
import EditContent from "./pages/admin/EditContent";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminTags from "./pages/admin/AdminTags";
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Share from "./pages/Share";

function ActivityLogger() {
  const { user } = useAuth();
  useEffect(() => {
    fetch("/api/activity-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user?.id || null,
        action: "visit",
        resource: window.location.pathname,
        status: "info",
        details: "User visited the site",
      }),
    });
  }, [user]);
  return null;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <ActivityLogger />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/content/new" element={<CreateContent />} />
            <Route path="/admin/content/edit/:id" element={<EditContent />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/activity" element={<ActivityLogs />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/tags" element={<AdminTags />} />
            <Route path="/share" element={<Share />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
