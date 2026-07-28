import {
  CheckCircle2,
  Loader2,
  LogIn,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const CheckInButton = ({ todayRecord, onAction }) => {
  const [loading, setLoading] = useState(false);

  const hasCheckedIn = Boolean(todayRecord?.checkIn);
  const hasCheckedOut = Boolean(todayRecord?.checkOut);

  const handleAttendance = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await api.post("/attendance");

      toast.success(
        hasCheckedIn
          ? "Checked out successfully!"
          : "Checked in successfully!"
      );

      onAction?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (hasCheckedOut) {
    return (
      <div className="mt-6 flex justify-center animate-fade-in">
        <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl px-6 py-5 shadow-lg animate-fade-in-up">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-green-700">
              Work Day Completed
            </h3>
            <p className="text-sm text-gray-600">
              You have completed today's work.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex justify-center animate-fade-in">
      <button
        onClick={handleAttendance}
        disabled={loading}
        className={`group flex items-center gap-4 rounded-2xl px-6 py-4 text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
          hasCheckedIn
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            hasCheckedIn ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : hasCheckedIn ? (
            <LogOut className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
          ) : (
            <LogIn className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-1" />
          )}
        </div>

        <div className="text-left">
          <h3 className="font-semibold">
            {loading
              ? "Processing..."
              : hasCheckedIn
              ? "Clock Out"
              : "Clock In"}
          </h3>

          {!loading && (
            <p className="text-xs text-white/80">
              {hasCheckedIn
                ? "Click to end your work day"
                : "Click to start your work day"}
            </p>
          )}
        </div>
      </button>
    </div>
  );
};

export default CheckInButton;