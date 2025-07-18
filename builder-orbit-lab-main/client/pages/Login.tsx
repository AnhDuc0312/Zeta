import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  // Chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (isLoggedIn && !loading) {
      navigate("/");
    }
  }, [isLoggedIn, loading, navigate]);

  useEffect(() => {
    document.title = isRegister ? "Register | ZetaScript" : "Login | ZetaScript";
  }, [isRegister]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoadingForm(true);
    if (isRegister) {
      // Đăng ký tài khoản mới
      if (!formData.name) {
        setError("Please enter your full name.");
        setLoadingForm(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setLoadingForm(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || data.message || "Registration failed");
          setLoadingForm(false);
          return;
        }
        // Đăng ký thành công, tự động đăng nhập để lấy token
        try {
          const loginRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });
          const loginData = await loginRes.json().catch(() => ({}));
          if (!loginRes.ok) {
            setError(loginData.error || loginData.message || "Auto-login failed");
            setLoadingForm(false);
            return;
          }
          login(loginData.user, loginData.token);
          navigate("/account");
        } catch {
          setError("Auto-login failed. Please login manually.");
        }
        setLoadingForm(false);
        return;
      } catch (err) {
        setError("Network error. Please try again.");
        setLoadingForm(false);
        return;
      }
    } else {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || data.message || "Login failed");
          setLoadingForm(false);
          return;
        }
        login(data.user, data.token); // Lưu user và token vào context
        if (data.user.email === "duc.la0312@gmail.com") {
          navigate("/admin/dashboard");
        } else {
          navigate("/account");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoadingForm(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>

          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegister
              ? "Join ZetaScript to organize and share your content"
              : "Sign in to your ZetaScript account"}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            {isRegister && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isRegister}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10"
                  placeholder="Full Name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {isRegister && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required={isRegister}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10"
                  placeholder="Confirm Password"
                />
              </div>
            )}
          </div>

          {/* Remember me / Forgot password */}
          {!isRegister && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-black hover:underline"
                  onClick={() => alert('Tính năng quên mật khẩu sẽ sớm ra mắt!')}
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
              disabled={loadingForm}
            >
              {loadingForm ? (isRegister ? "Registering..." : "Signing in...") : (isRegister ? "Create Account" : "Sign In")}
            </button>
          </div>

          {/* Toggle between login/register */}
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 font-medium text-black hover:underline"
            >
              {isRegister ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>

        {/* Social login options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={() => alert('Tính năng đăng nhập Google sẽ sớm ra mắt!')}>
              <span>Google</span>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
