import {
  LockIcon,
  XIcon,
  Loader2Icon,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import api from "../api/axios";

const ChangePasswordModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // One state controls both password fields
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");

    try {
      const { data } = await api.post("auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (!data.success) {
        throw new Error(data.error || "Failed");
      }

      setMessage({
        type: "success",
        text: "Password updated successfully",
      });

      e.target.reset();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <LockIcon className="w-5 h-5 text-slate-400" />
              Change Password
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update your account password securely
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="group p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {message.text && (
            <div
              className={`p-3 rounded-xl text-sm flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                  message.type === "success"
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }`}
              />
              {message.text}
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              required
              className="input"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                required
                className="input pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
                            <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="group btn-secondary flex-1 flex items-center justify-center gap-2 text-slate-600 hover:text-red-600 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 active:text-red-600"
            >
              <span>Cancel</span>

              <XIcon className="w-4 h-4 transition-all duration-300 group-hover:rotate-90" />
            </button>

            <button
              type="submit"
              disabled={loading}
              className="group btn-primary flex-1 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <LockIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              )}

              <span className={loading ? "animate-pulse" : ""}>
                {loading ? "Updating..." : "Update Password"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;