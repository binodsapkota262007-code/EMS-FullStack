import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { format } from "date-fns";
import api from "../api/axios";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { PrinterIcon, ArrowLeftIcon, DownloadIcon, Loader2 } from "lucide-react";

const PrintPayslip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        const res = await api.get(`/payslips/${id}`);
        setPayslip(res.data?.data || res.data);
      } catch (err) {
        console.log("Error loading payslip:", err);
        setPayslip(null);

        const backendMessage = err?.response?.data?.error;
        if (err?.response?.status === 401) {
          setErrorMsg(backendMessage || "Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 1200);
        } else {
          setErrorMsg(
            backendMessage || "Payslip not found or session expired"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayslip();
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!printRef.current || downloading) return;
    setDownloading(true);

    try {
      // Render the payslip DOM node to a high-res canvas image.
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // Fit the captured image onto an A4 page, preserving aspect ratio.
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // If content is taller than one page, continue on additional pages.
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const employeeName = [
        payslip.employee?.firstName,
        payslip.employee?.lastName,
      ]
        .filter(Boolean)
        .join("-") || "employee";
      const period = format(
        new Date(payslip.year, payslip.month - 1),
        "MMM-yyyy"
      );

      pdf.save(`Payslip-${employeeName}-${period}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      toast.error("Couldn't generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loading />;

  if (!payslip) {
    return (
      <div className="text-center py-12 text-slate-400 animate-fade-in">
        <p>{errorMsg}</p>

        <button
          onClick={() => navigate("/payslips")}
          className="mt-4 text-indigo-600 hover:underline transition-all duration-200 hover:scale-105"
        >
          Go back to Payslips
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white animate-fade-in space-y-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/payslips")}
        className="
          group
          inline-flex items-center gap-2
          text-slate-500 hover:text-indigo-600
          text-sm
          transition-all duration-300
          hover:-translate-x-1
          animate-[fadeInLeft_0.5s_ease-out]
        "
      >
        <ArrowLeftIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Back to Payslips
      </button>

      {/* PRINTABLE / DOWNLOADABLE CONTENT */}
      <div ref={printRef} className="bg-white">

      {/* HEADER */}
      <div className="text-center border-b border-slate-200 pb-6 mb-6 animate-[fadeInDown_0.6s_ease-out]">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          PAYSLIP
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          {format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}
        </p>
      </div>

      {/* EMPLOYEE DETAILS */}
      <div className="grid grid-cols-2 gap-6 mb-6 animate-[fadeInUp_0.7s_ease-out]">
        <div className="transition-all duration-300 hover:translate-x-1">
          <p className="text-xs text-slate-400 uppercase mb-1">Employee Name</p>
          <p className="font-semibold text-slate-900">
            {payslip.employee?.firstName} {payslip.employee?.lastName}
          </p>
        </div>

        <div className="transition-all duration-300 hover:translate-x-1">
          <p className="text-xs text-slate-400 uppercase mb-1">Position</p>
          <p className="font-semibold text-slate-900">
            {payslip.employee?.position}
          </p>
        </div>

        <div className="transition-all duration-300 hover:translate-x-1">
          <p className="text-xs text-slate-400 uppercase mb-1">Email</p>
          <p className="font-semibold text-slate-900">
            {payslip.employee?.email}
          </p>
        </div>

        <div className="transition-all duration-300 hover:translate-x-1">
          <p className="text-xs text-slate-400 uppercase mb-1">Period</p>
          <p className="font-semibold text-slate-900">
            {format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}
          </p>
        </div>
      </div>

      {/* SALARY TABLE */}
      <div className="rounded-xl border border-slate-200 overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 animate-[fadeInUp_0.8s_ease-out]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-3 px-4 text-xs text-slate-500">
                Description
              </th>
              <th className="text-right py-3 px-4 text-xs text-slate-500">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {[
              ["Basic Salary", payslip.basicSalary],
              ["Allowances", `+${payslip.allowances}`],
              ["Deductions", `-${payslip.deductions}`],
            ].map(([label, value], i) => (
              <tr
                key={i}
                className="border-t transition-all duration-200 hover:bg-slate-50"
              >
                <td className="py-3 px-4">{label}</td>
                <td className="text-right py-3 px-4 font-medium">
                  NPR {Number(value).toLocaleString()}
                </td>
              </tr>
            ))}

            <tr className="border-t-2 bg-slate-50">
              <td className="py-4 px-4 font-bold">Net Salary</td>
              <td className="text-right py-4 px-4 font-bold text-lg">
                NPR {payslip.netSalary?.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      </div>

      {/* PRINT / DOWNLOAD BUTTONS */}
      <div className="text-center flex flex-wrap items-center justify-center gap-3 animate-[fadeInUp_0.9s_ease-out]">
        <button
          onClick={() => window.print()}
          className="
            btn-primary
            inline-flex items-center gap-2
            transition-all duration-300
            hover:scale-105
            active:scale-95
            print:hidden
          "
        >
          <PrinterIcon className="w-5 h-5" />
          Print Payslip
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="
            btn-secondary
            inline-flex items-center gap-2
            transition-all duration-300
            hover:scale-105
            active:scale-95
            print:hidden
            disabled:opacity-60
            disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          {downloading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <DownloadIcon className="w-5 h-5" />
          )}
          {downloading ? "Preparing PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default PrintPayslip;