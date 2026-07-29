import { Link, useNavigate } from "react-router-dom";
import LoginLeftside from "./LoginLeftside";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  MailIcon,
  LockIcon,
  LogInIcon,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginForm = ({ role, title, subtitle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, role?.trim());
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950">

      {/* LEFT SIDE */}
      <LoginLeftside />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">

          {/* BACK BUTTON */}
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm mb-8 transition-all duration-300"
          >
            <ArrowLeftIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to portal selections
          </Link>

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
              {subtitle}
            </p>

            {/* animated underline */}
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full animate-grow-line" />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>

              <div className="relative group">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@gmail.com"
                  className="
                    w-full pl-10 pr-4 py-2.5
                    bg-white dark:bg-slate-900
                    text-slate-900 dark:text-white
                    border border-slate-200 dark:border-slate-700 rounded-md
                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition
                  "
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>

              <div className="relative group">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="
                    w-full pl-10 pr-11 py-2.5
                    bg-white dark:bg-slate-900
                    text-slate-900 dark:text-white
                    border border-slate-200 dark:border-slate-700 rounded-md
                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-all duration-300 hover:scale-110 active:scale-90"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD LINK */}
            <div className="flex justify-end -mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-md
                bg-gradient-to-r from-indigo-600 to-indigo-500
                text-white font-medium text-sm

                transition-all duration-300
                hover:scale-[1.02] hover:-translate-y-0.5
                hover:from-indigo-700 hover:to-indigo-600
                active:scale-95

                shadow-lg shadow-indigo-500/25
                hover:shadow-xl hover:shadow-indigo-500/40

                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <LogInIcon className="w-4 h-4" />
                )}

                <span className={loading ? "animate-pulse" : ""}>
                  {loading ? "Signing In..." : "Sign In"}
                </span>
              </div>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;