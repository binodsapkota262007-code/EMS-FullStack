import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { Lock } from "lucide-react";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      const profile = res.data;

      if (profile) {
        setProfile(profile);
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      await fetchProfile();
    };
    loadProfile();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Form */}
      {profile && (
        <ProfileForm
          initialData={profile}
          onSuccess={fetchProfile}
        />
      )}

      {/* Password Card */}
      <div
        className="
          card
          max-w-md
          p-6
          mt-6

          group
          flex
          items-center
          justify-between

          transition-all
          duration-300
          ease-in-out

          hover:-translate-y-1
          hover:scale-[1.02]
          hover:shadow-xl
          hover:shadow-indigo-500/10

          active:scale-[0.98]
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              p-2.5
              rounded-lg
              bg-slate-100

              transition-all
              duration-300

              group-hover:bg-indigo-50
              group-hover:scale-110
              group-hover:rotate-6
            "
          >
            <Lock
              className="
                w-5
                h-5
                text-slate-600

                transition-colors
                duration-300

                group-hover:text-indigo-600
              "
            />
          </div>

          <div>
            <p className="font-medium text-slate-900">
              Password
            </p>

            <p className="text-sm text-slate-500">
              Update your account password
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="
            group/button
            btn-secondary
            text-sm

            inline-flex
            items-center
            gap-2

            transition-all
            duration-300

            hover:scale-105
            hover:-translate-y-0.5
            active:scale-95
          "
        >
          <span>Change</span>

          <Lock
            className="
              w-4
              h-4

              transition-transform
              duration-300

              group-hover/button:rotate-12
              group-hover/button:scale-110
            "
          />
        </button>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Settings;