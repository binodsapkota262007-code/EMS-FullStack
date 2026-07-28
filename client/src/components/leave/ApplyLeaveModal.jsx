import { CalendarDays, FileText, Loader2, Send, XIcon } from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const ApplyLeaveModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.post("/leaves", data);

      toast.success("Leave request submitted successfully!");

      onSuccess();
      onClose();
      e.target.reset();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Apply for Leave
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Submit your leave request for approval
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              group
              p-2
              rounded-full
              text-slate-400
              hover:text-red-500
              hover:bg-red-50

              transition-all duration-300
              hover:rotate-90
              hover:scale-110
              active:scale-90
            "
          >
            <XIcon className="w-5 h-5 transition-transform duration-300" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 pt-5 pb-6 space-y-5"
        >
          {/* Leave Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Leave Type
            </label>

            <select name="type" required>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="ANNUAL">Annual Leave</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              Duration
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-slate-400 mb-1">
                  From
                </span>

                <input
                  type="date"
                  name="startDate"
                  required
                  min={minDate}
                />
              </div>

              <div>
                <span className="block text-xs text-slate-400 mb-1">
                  To
                </span>

                <input
                  type="date"
                  name="endDate"
                  required
                  min={minDate}
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reason
            </label>

            <textarea
              name="reason"
              rows={3}
              required
              className="resize-none"
              placeholder="Briefly describe why you need this leave..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                group
                btn-secondary
                flex-1
                flex items-center justify-center gap-2

                transition-all duration-300
                hover:scale-[1.03]
                hover:-translate-y-0.5
                active:scale-95
              "
            >
              <span>Cancel</span>

              <XIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                group
                btn-primary
                flex-1
                flex items-center justify-center gap-2

                transition-all duration-300
                hover:scale-[1.03]
                hover:-translate-y-0.5
                active:scale-95

                shadow-lg shadow-indigo-500/25
                hover:shadow-xl hover:shadow-indigo-500/40

                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:hover:scale-100
                disabled:hover:translate-y-0
              "
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              )}

              <span className={loading ? "animate-pulse" : ""}>
                {loading ? "Submitting..." : "Submit"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;