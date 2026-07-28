import { useCallback, useEffect, useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import { Plus, Search, X } from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";
import api from "../api/axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      const url = selectedDept
        ? `/employees?department=${selectedDept}`
        : "/employees";

      const res = await api.get(url);
      setEmployees(res.data);
    } catch {
      console.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [selectedDept]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filtered = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.position}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in p-6 max-w-7xl mx-auto">

      {/* Header */}

      <div className="flex justify-between items-center mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Directory
          </h1>

          <p className="text-sm text-gray-500">
            Manage your team members here.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          <Plus
            size={16}
            className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110"
          />

          Add Employee
        </button>
      </div>

      {/* Search */}

      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up">

        <div className="relative flex-1 group">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" />

          <input
            type="text"
            autoComplete="off"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:scale-[1.01]"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 transition-all duration-300 hover:rotate-90 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          )}

        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-44 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer outline-none transition-all duration-300 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:scale-[1.01]"
        >
          <option value="">All Departments</option>

          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

      </div>

      {/* Cards */}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">

          {filtered.length === 0 ? (
            <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              No employees found
            </p>
          ) : (
            filtered.map((emp, index) => (
              <div
                key={emp.id}
                className="animate-fade-in-up transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <EmployeeCard
                  employee={emp}
                  onDelete={fetchEmployees}
                  onEdit={(e) => setEditEmployee(e)}
                />
              </div>
            ))
          )}

        </div>
      )}

      {/* Create Employee Modal */}

      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add New Employee
                </h2>

                <p className="text-sm text-slate-500 mt-0.5">
                  Create a user account and employee profile
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg text-slate-400 transition-all duration-300 hover:bg-slate-100 hover:text-red-500 hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="p-6">

              <EmployeeForm
                onSuccess={() => {
                  setShowCreateModal(false);
                  fetchEmployees();
                }}
                onCancel={() => setShowCreateModal(false)}
              />

            </div>

          </div>

        </div>
      )}
       {/* ----- Edit Employee Modal ----- */}

      {editEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setEditEmployee(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Employee
                </h2>

                <p className="text-sm text-slate-500 mt-0.5">
                  Update employee information
                </p>
              </div>

              <button
                onClick={() => setEditEmployee(null)}
                className="p-2 rounded-lg text-slate-400 transition-all duration-300 hover:bg-slate-100 hover:text-red-500 hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <EmployeeForm
                initialData={editEmployee}
                onSuccess={() => {
                  setEditEmployee(null);
                  fetchEmployees();
                }}
                onCancel={() => setEditEmployee(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;