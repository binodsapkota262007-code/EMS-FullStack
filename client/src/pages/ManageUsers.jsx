import { useEffect, useState } from "react";
import { KeyRoundIcon, Loader2Icon, XIcon } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/all");
      setUsers(res.data.users || []);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const openResetModal = (user) => {
    setResetModalUser(user);
    setNewPassword("");
  };

  const closeResetModal = () => {
    setResetModalUser(null);
    setNewPassword("");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setResetting(true);
    try {
      await api.post("/auth/admin-reset-password", {
        userId: resetModalUser._id,
        newPassword,
      });
      toast.success(`Password reset for ${resetModalUser.email}`);
      closeResetModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
          Manage Users
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2Icon className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Role</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-4 py-3 text-slate-900 dark:text-white">{user.email}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{user.role}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openResetModal(user)}
                        className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                      >
                        <KeyRoundIcon className="w-3.5 h-3.5" />
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RESET PASSWORD MODAL */}
      {resetModalUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-md w-full max-w-sm p-6 relative">
            <button
              onClick={closeResetModal}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              Reset Password
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Setting a new password for <span className="font-medium">{resetModalUser.email}</span>
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                required
                className="
                  w-full px-3 py-2.5
                  bg-white dark:bg-slate-800
                  text-slate-900 dark:text-white
                  border border-slate-200 dark:border-slate-700 rounded-md
                  placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
              />
              <button
                type="submit"
                disabled={resetting}
                className="
                  w-full py-2.5 rounded-md
                  bg-indigo-600 hover:bg-indigo-700
                  text-white font-medium text-sm
                  disabled:opacity-50
                  flex items-center justify-center gap-2
                "
              >
                {resetting && <Loader2Icon className="w-4 h-4 animate-spin" />}
                {resetting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;