import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  MailIcon,
  KeyRoundIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  SendIcon,
  CheckCircle2Icon,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const RESEND_COOLDOWN = 30; // seconds

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown ticker for the resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // STEP 1 — request OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("If that email exists, an OTP has been sent.");
      setStep(2);
      setResendCooldown(RESEND_COOLDOWN);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 — reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", { email, newPassword });
      toast.success("Password reset successful — please sign in");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6">
      <div className="w-full max-w-md animate-fade-in">

        {/* BACK BUTTON */}
        <Link
          to="/login"
          className="group inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm mb-8 transition-all duration-300"
        >
          <ArrowLeftIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to sign in
        </Link>

        {/* STEP INDICATOR */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                s <= step ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* STEP 1 — EMAIL */}
        {step === 1 && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Forgot Password
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                Enter your email and we'll send you a code to reset your password.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-6">
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
                    <SendIcon className="w-4 h-4" />
                  )}
                  <span>{loading ? "Sending..." : "Send OTP"}</span>
                </div>
              </button>
            </form>
          </>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Enter Code
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                We sent a 6-digit code to <span className="font-medium">{email}</span>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  OTP Code
                </label>
                <div className="relative group">
                  <KeyRoundIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="123456"
                    className="
                      w-full pl-10 pr-4 py-2.5 tracking-widest
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
                    <CheckCircle2Icon className="w-4 h-4" />
                  )}
                  <span>{loading ? "Verifying..." : "Verify Code"}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || resendCooldown > 0}
                className="
                  w-full text-sm text-indigo-600 dark:text-indigo-400
                  hover:underline
                  disabled:text-slate-400 dark:disabled:text-slate-600
                  disabled:no-underline disabled:cursor-not-allowed
                "
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : "Resend code"}
              </button>
            </form>
          </>
        )}

        {/* STEP 3 — NEW PASSWORD */}
        {step === 3 && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Set New Password
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                Choose a new password for your account.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-all duration-300"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
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
                    <CheckCircle2Icon className="w-4 h-4" />
                  )}
                  <span>{loading ? "Resetting..." : "Reset Password"}</span>
                </div>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;