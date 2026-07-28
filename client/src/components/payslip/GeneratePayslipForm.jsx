import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const GeneratePayslipForm = ({ employees = [], onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return () => setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.post("/payslips", data);

      toast.success("Payslip generated successfully");

      setIsOpen(false);
      e.currentTarget.reset();

      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Generate Payslip
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="card max-w-lg w-full p-6 animate-[fadeInUp_0.35s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Generate Monthly Payslip
          </h3>

          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 transition-transform duration-300 hover:rotate-90 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Employee
            </label>

            <select
              name="employeeId"
              required
              className="input transition-all duration-200 focus:scale-[1.02]"
            >
              <option value="">Select employee</option>

              {employees.length === 0 ? (
                <option value="" disabled>
                  No employees available
                </option>
              ) : (
                employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.position})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Month
              </label>

              <select
                name="month"
                required
                className="input transition-all duration-200 focus:scale-[1.02]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Year
              </label>

              <input
                type="number"
                name="year"
                defaultValue={new Date().getFullYear()}
                className="input transition-all duration-200 focus:scale-[1.02]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Basic Salary
            </label>

            <input
              type="number"
              name="basicSalary"
              placeholder="5000"
              className="input transition-all duration-200 focus:scale-[1.02]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Allowances
              </label>

              <input
                type="number"
                name="allowances"
                defaultValue="0"
                className="input transition-all duration-200 focus:scale-[1.02]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deductions
              </label>

              <input
                type="number"
                name="deductions"
                defaultValue="0"
                className="input transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || employees.length === 0}
              className="btn-primary flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayslipForm;