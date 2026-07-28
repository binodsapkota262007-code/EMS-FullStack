import { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import {
  PalmtreeIcon,
  PlusIcon,
  ThermometerIcon,
  UmbrellaIcon,
} from "lucide-react";
import LeaveHistory from "../components/leave/LeaveHistory";
import ApplyLeaveModal from "../components/leave/ApplyLeaveModal";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Leave = () => {
  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const fetchLeaves = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/leaves");
      setLeaves(res.data.data || []);

      if (res.data.employee?.isDeleted) {
        setIsDeleted(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadLeaves = async () => {
      await fetchLeaves();
    };
    loadLeaves();
  }, [fetchLeaves]);

  if (loading) return <Loading />;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "APPROVED"
  );

  const leaveStats = [
    {
      label: "Sick Leave",
      value: approvedLeaves.filter((l) => l.type === "SICK").length,
      icon: ThermometerIcon,
    },
    {
      label: "Casual Leave",
      value: approvedLeaves.filter((l) => l.type === "CASUAL").length,
      icon: UmbrellaIcon,
    },
    {
      label: "Annual Leave",
      value: approvedLeaves.filter((l) => l.type === "ANNUAL").length,
      icon: PalmtreeIcon,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">
            {isAdmin
              ? "Manage leave applications"
              : "Your leave history and requests"}
          </p>
        </div>

        {!isAdmin && !isDeleted && (
          <button
            onClick={() => setShowModal(true)}
            className="
              group
              btn-primary
              flex items-center justify-center gap-2
              w-full sm:w-auto

              transition-all duration-300 ease-in-out
              hover:scale-[1.03]
              hover:-translate-y-0.5
              active:scale-95

              shadow-lg shadow-indigo-500/25
              hover:shadow-xl hover:shadow-indigo-500/40
            "
          >
            <PlusIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
            <span>Apply for Leave</span>
          </button>
        )}
      </div>

      {/* Stats */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {leaveStats.map((stat) => (
            <div
              key={stat.label}
              className="
                card
                p-5 sm:p-6
                relative
                overflow-hidden
                group
                flex items-center gap-4

                transition-all duration-300 ease-in-out
                hover:-translate-y-1
                hover:scale-[1.02]
                hover:shadow-xl
                hover:shadow-indigo-500/10

                active:scale-[0.98]
              "
            >
              {/* Accent Bar */}
              <div
                className="
                  absolute left-0 top-0 bottom-0
                  w-1 rounded-r-full
                  bg-slate-500/70

                  transition-all duration-300
                  group-hover:bg-indigo-500
                  group-hover:w-1.5
                "
              />

              {/* Icon */}
              <div
                className="
                  p-3 rounded-lg
                  bg-slate-100

                  transition-all duration-300

                  group-hover:bg-indigo-50
                  group-hover:scale-110
                  group-hover:rotate-6
                "
              >
                <stat.icon
                  className="
                    w-5 h-5
                    text-slate-600

                    transition-all duration-300

                    group-hover:text-indigo-600
                  "
                />
              </div>

              {/* Content */}
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>

                <p
                  className="
                    text-2xl font-bold
                    text-slate-900 tracking-tight

                    transition-transform duration-300
                    group-hover:scale-105
                  "
                >
                  {stat.value}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    taken
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <LeaveHistory
        leaves={leaves}
        isAdmin={isAdmin}
        onUpdate={fetchLeaves}
      />

      <ApplyLeaveModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchLeaves}
      />
    </div>
  );
};

export default Leave;