import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "moderator" | "user";
  // ... các trường khác nếu có
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (userData: User, tokenValue?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm lấy profile từ backend
  const fetchProfile = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Lấy name từ localStorage nếu API không trả về
        let name = data.name;
        if (!name) {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            try {
              name = JSON.parse(savedUser).name || "";
            } catch {}
          }
        }
        const userWithName = { ...data, name };
        setUser(userWithName);
        localStorage.setItem('user', JSON.stringify(userWithName));
      } else {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, tokenValue?: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (tokenValue) {
      setToken(tokenValue);
      localStorage.setItem("token", tokenValue);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Check if user is admin (role)
  const isAdmin = user?.role === "admin";

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchProfile(savedToken); // Luôn fetch lại profile từ backend
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
