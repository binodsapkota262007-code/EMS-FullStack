import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import CheckInButton from "../components/attendance/CheckInButton";
import AttendanceStats from "../components/attendance/AttendanceStats";
import AttendanceHistory from "../components/attendance/AttendanceHistory";
import api from "../api/axios";
import toast from "react-hot-toast";

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  // ---------------- FETCH ----------------
  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/attendance");
      const json = res.data;

      setHistory(json.data || []);
      if (json.employee?.isDeleted) setIsDeleted(true);
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, [fetchData]);

  // ---------------- ALL HOOKS FIRST ----------------

  const processedHistory = useMemo(() => {
    return history.map((r) => {
      if (r.status !== "PRESENT") return r;

      const time = r.checkIn || r.clockIn || r.createdAt;
      const hour = time ? new Date(time).getHours() : 0;

      return {
        ...r,
        isLate: hour >= 10,
      };
    });
  }, [history]);

  // ---------------- DERIVED DATA ----------------
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRecord = history.find(
    (r) =>
      new Date(r.date).toDateString() === today.toDateString()
  );

  // ❗ ONLY AFTER ALL HOOKS
  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in space-y-6">

      {/* Header */}
      <div className="page-header transition-all duration-500 hover:translate-x-1">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">
          Track your work hours and daily check-ins
        </p>
      </div>

      {/* Deleted warning */}
      {isDeleted ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center animate-pulse">
          <p className="text-rose-600">
            You can no longer clock in or out because your employee records have been marked as deleted.
          </p>
        </div>
      ) : (
        <div className="transition-all duration-300 hover:scale-[1.01]">
          <CheckInButton
            todayRecord={todayRecord}
            onAction={fetchData}
          />
        </div>
      )}

      {/* Stats */}
      <div className="transition-all duration-500 hover:scale-[1.01]">
        <AttendanceStats history={processedHistory} />
      </div>

      {/* History */}
      <div className="transition-all duration-500 hover:scale-[1.01]">
        <AttendanceHistory history={processedHistory} />
      </div>
    </div>
  );
};

export default Attendance;