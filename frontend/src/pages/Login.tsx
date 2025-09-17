import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(data);
      if (data.session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Left: Branding & Resume Tip */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full p-12">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="12" fill="#2563eb" />
              <path
                d="M12 28L20 12L28 28"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="24" r="2" fill="#fff" />
            </svg>
            <span className="ml-3 text-3xl font-extrabold text-blue-700 tracking-tight">
              AI Job Matcher
            </span>
          </div>
          <p className="text-lg text-blue-900 text-center max-w-xs mb-8">
            Get personalized resume tips and land your dream job faster with
            AI-powered insights.
          </p>
          <div className="bg-white/80 rounded-xl shadow p-6 w-full max-w-xs">
            <h3 className="font-semibold text-blue-700 mb-2 text-center">
              Resume Tip of the Day
            </h3>
            <p className="text-gray-700 text-sm text-center">
              Tailor your resume for each job application by using keywords from
              the job description. This helps your resume pass AI screening
              tools!
            </p>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to access your AI-powered job matching and resume tips.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-600 text-center font-semibold">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition text-lg shadow disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-6">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
