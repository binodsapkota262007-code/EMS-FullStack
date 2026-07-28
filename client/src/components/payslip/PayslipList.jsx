import { format } from "date-fns";
import { Download, Wallet, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

// Builds a hidden form from eSewa's field payload and submits it,
// which navigates the browser to eSewa's checkout page.
const redirectToEsewa = (formUrl, fields) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = formUrl;

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

const PayslipList = ({ payslips, isAdmin }) => {
  const handlePayWithEsewa = async (payslipId) => {
    try {
      const res = await api.post(`/payments/esewa/initiate/${payslipId}`);
      redirectToEsewa(res.data.formUrl, res.data.fields);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to start payment");
    }
  };

  return (
    <div className="card overflow-hidden animate-fade-in">

      <div className="overflow-x-auto">
        <table className="table-modern">

          {/* HEADER */}
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th>Payment</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {!payslips || payslips.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="
                    text-center py-14
                    text-slate-400
                    animate-pulse
                  "
                >
                  No Payslips found
                </td>
              </tr>
            ) : (
              payslips.map((payslip, index) => (
                <tr
                  key={payslip.id || payslip._id}
                  className="
                    hover:bg-slate-50
                    dark:hover:bg-slate-800/40
                    transition-all duration-300
                    animate-fade-in
                  "
                  style={{
                    animationDelay: `${index * 40}ms`,
                  }}
                >

                  {/* EMPLOYEE */}
                  {isAdmin && (
                    <td className="text-slate-900 font-medium dark:text-slate-100">
                      {payslip.employee?.firstName ||
                        payslip.employee?.fristName}{" "}
                      {payslip.employee?.lastName}
                    </td>
                  )}

                  {/* PERIOD */}
                  <td className="text-slate-500 dark:text-slate-400">
                    {format(
                      new Date(payslip.year, payslip.month - 1),
                      "MMMM yyyy"
                    )}
                  </td>

                  {/* BASIC */}
                  <td className="text-slate-500 dark:text-slate-400">
                    NPR {payslip.basicSalary?.toLocaleString()}
                  </td>

                  {/* NET */}
                  <td className="font-semibold text-slate-800 dark:text-slate-100">
                    NPR {payslip.netSalary?.toLocaleString()}
                  </td>

                  {/* PAYMENT STATUS */}
                  <td>
                    {payslip.paymentStatus === "PAID" ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-green-700 bg-green-50 ring-1 ring-green-600/10 dark:text-emerald-400 dark:bg-emerald-500/10 dark:ring-emerald-400/20">
                        Paid{payslip.paymentMethod ? ` · ${payslip.paymentMethod}` : ""}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-amber-700 bg-amber-50 ring-1 ring-amber-600/10 dark:text-amber-400 dark:bg-amber-500/10 dark:ring-amber-400/20">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="text-center">
                    {isAdmin || payslip.paymentStatus === "PAID" ? (
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            `/print/payslip/${payslip._id || payslip.id}`
                          )
                        }
                        className="
                          group
                          inline-flex items-center
                          px-3 py-1.5
                          text-xs font-medium
                          rounded-md

                          text-blue-600
                          bg-blue-50
                          ring-1 ring-blue-600/10

                          transition-all duration-300 ease-out

                          hover:bg-blue-100
                          hover:scale-105
                          hover:-translate-y-0.5
                          hover:shadow-md hover:shadow-blue-500/20

                          active:scale-95

                          dark:text-blue-400
                          dark:bg-blue-500/10
                          dark:ring-blue-400/20
                          dark:hover:bg-blue-500/20
                        "
                      >
                        <Download
                          className="
                            w-3 h-3 mr-1.5
                            transition-all duration-300
                            group-hover:translate-y-0.5
                            group-hover:scale-110
                            group-hover:rotate-12
                          "
                        />

                        <span className="transition-all duration-300">
                          Download
                        </span>
                      </button>
                    ) : (
                      <span
                        title="Available once payment is completed"
                        className="
                          inline-flex items-center
                          px-3 py-1.5
                          text-xs font-medium
                          rounded-md
                          text-slate-400
                          bg-slate-100
                          ring-1 ring-slate-200/70
                          cursor-not-allowed
                          dark:text-slate-500
                          dark:bg-slate-800
                          dark:ring-slate-700
                        "
                      >
                        <Clock className="w-3 h-3 mr-1.5" />
                        Pending
                      </span>
                    )}

                    {isAdmin && payslip.paymentStatus !== "PAID" && (
                      <button
                        type="button"
                        onClick={() =>
                          handlePayWithEsewa(payslip._id || payslip.id)
                        }
                        className="
                          group
                          inline-flex items-center
                          ml-2
                          px-3 py-1.5
                          text-xs font-medium
                          rounded-md

                          text-emerald-700
                          bg-emerald-50
                          ring-1 ring-emerald-600/10

                          transition-all duration-300 ease-out

                          hover:bg-emerald-100
                          hover:scale-105
                          hover:-translate-y-0.5
                          hover:shadow-md hover:shadow-emerald-500/20

                          active:scale-95

                          dark:text-emerald-400
                          dark:bg-emerald-500/10
                          dark:ring-emerald-400/20
                          dark:hover:bg-emerald-500/20
                        "
                      >
                        <Wallet className="w-3 h-3 mr-1.5" />
                        <span>Pay via eSewa</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default PayslipList;