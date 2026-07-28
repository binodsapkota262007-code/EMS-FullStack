import { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import PayslipList from "../components/payslip/PayslipList";
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const fetchPayslips = useCallback(async () => {
    try {
      const res = await api.get("/payslips");
      setPayslips(res.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment) return;

    if (payment === "success") {
      toast.success("Payment received");
    } else if (payment === "failed") {
      toast.error("Payment was not completed");
    }

    // Clean the query param so a refresh doesn't re-trigger the toast
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      api
        .get("/employees")
        .then((res) =>
          setEmployees(res.data.filter((e) => !e.isDeleted))
        )
        .catch(() => {});
    }
  }, [isAdmin]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="page-title">Payslips</h1>

          <p className="page-subtitle">
            {isAdmin
              ? "Generate and manage employee payslips"
              : "Your payslip history"}
          </p>
        </div>

        {isAdmin && (
          <GeneratePayslipForm
            employees={employees}
            onSuccess={fetchPayslips}
          />
        )}
      </div>

      {/* TABLE / LIST */}
      <div className="rounded-2xl">
        <PayslipList
          payslips={payslips}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default Payslips;