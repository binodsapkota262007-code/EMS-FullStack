import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CalendarIcon,
  Wallet,
  FileTextIcon,
  ArrowRightIcon,
  CalendarPlusIcon,
  BadgeCheckIcon,
} from "lucide-react";

const COLORS = ["#10b981", "#f59e0b", "#f43f5e"];
const RADIAN = Math.PI / 180;

// Renders a percentage label inside each slice, skipping slivers too thin to read
const renderSliceLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.62;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-slate-900/10 border border-slate-100 px-4 py-3">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: item.payload.fill }}
        />
        <span className="text-sm font-medium text-slate-600">{item.name}</span>
      </div>
      <p className="text-lg font-bold text-slate-900 mt-0.5">
        {item.value.toLocaleString()}
      </p>
    </div>
  );
};

const ChartLegend = ({ items, total }) => (
  <div className="grid grid-cols-3 gap-3 mt-6">
    {items.map((item) => (
      <div
        key={item.name}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <div className="min-w-0">
          <p className="text-xs text-slate-500 truncate">{item.name}</p>
          <p className="text-sm font-semibold text-slate-800">
            {item.value.toLocaleString()}
            {total > 0 && (
              <span className="text-slate-400 font-normal">
                {" "}
                · {Math.round((item.value / total) * 100)}%
              </span>
            )}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const EmployeeDashboard = ({ data }) => {
  const emp = data.employee;

  const cards = [
    {
      icon: CalendarIcon,
      value: data.currentMonthAttendance,
      title: "Days Present",
      subtitle: "This month",
    },
    {
      icon: FileTextIcon,
      value: data.pendingLeaves,
      title: "Pending Leaves",
      subtitle: "Awaiting approval",
    },
    {
      icon: Wallet,
      value: data.latestPayslip
        ? `NPR ${data.latestPayslip.netSalary.toLocaleString()}`
        : "N/A",
      title: "Latest Payslip",
      subtitle: "Most recent payout",
    },
  ];

  const attendanceChartData = [
    {
      name: "Present",
      value: data.currentMonthAttendance || 0,
      color: COLORS[0],
    },
    {
      name: "Leave",
      value: data.pendingLeaves || 0,
      color: COLORS[1],
    },
    {
      name: "Absent",
      value: Math.max(
        0,
        (data.totalWorkingDays || 30) -
          (data.currentMonthAttendance || 0)
      ),
      color: COLORS[2],
    },
  ];

  const attendanceTotal = attendanceChartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div
        className="page-header animate-fade-in-up"
        style={{
          animationFillMode: "both",
        }}
      >
        <h1 className="page-title">
          Welcome, {emp?.firstName}!
        </h1>

        <p className="page-subtitle">
          {emp?.position} -{" "}
          {emp?.department || "No Department"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="
              card
              p-5
              sm:p-6
              relative
              overflow-hidden
              group
              flex
              items-center
              justify-between
              border
              border-slate-100
              shadow-sm
              animate-fade-in-up
              transition-all
              duration-300
              hover:-translate-y-1
              hover:scale-[1.02]
              hover:shadow-xl
              hover:shadow-indigo-500/10
              active:scale-[0.98]
            "
            style={{
              animationDelay: `${index * 150}ms`,
              animationFillMode: "both",
            }}
          >
            {/* Left Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-400 group-hover:bg-indigo-500 group-hover:w-1.5 transition-all duration-300" />

            <div>
              <p className="text-sm font-medium text-slate-1900">
                {card.title}
              </p>

              <p className="text-2xl font-bold text-slate-1900 mt-1">
                {card.value}
              </p>

              <p className="text-sm text-slate-1900 mt-1">
                {card.subtitle}
              </p>
            </div>

            <card.icon
              className="
                size-10
                p-2.5
                rounded-lg
                bg-slate-100
                text-slate-600
                transition-all
                duration-300
                group-hover:bg-indigo-50
                group-hover:text-indigo-600
                group-hover:scale-110
                group-hover:rotate-6
              "
            />
          </div>
        ))}
      </div>
            {/* Attendance Chart */}
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-slate-100
          shadow-sm
          p-6
          mb-8
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          hover:shadow-indigo-500/10
          animate-fade-in-up
        "
        style={{
          animationDelay: "600ms",
          animationFillMode: "both",
        }}
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          Attendance Overview
        </h2>

        <div className="relative h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={112}
                paddingAngle={3}
                cornerRadius={6}
                stroke="#fff"
                strokeWidth={3}
                label={renderSliceLabel}
                labelLine={false}
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {attendanceChartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    className="cursor-pointer outline-none transition-opacity duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>

              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-bold text-slate-900">
              {attendanceTotal.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-slate-1900 mt-0.5">
              Days
            </p>
          </div>
        </div>

        <ChartLegend items={attendanceChartData} total={attendanceTotal} />
      </div>

      {/* Action Buttons */}
      <div
        className="flex flex-col sm:flex-row gap-3 animate-fade-in-up"
        style={{
          animationDelay: "900ms",
          animationFillMode: "both",
        }}
      >
       <Link
  to="/attendance"
  className="
    group
    btn-primary
    flex-1
    inline-flex
    items-center
    justify-center
    gap-2
    transition-all
    duration-300
    hover:-translate-y-1
    hover:scale-[1.02]
    active:scale-95
    shadow-lg
    shadow-indigo-500/20
    hover:shadow-xl
    hover:shadow-indigo-500/30
  "
>
  <BadgeCheckIcon
    className="
      w-5
      h-5
      transition-all
      duration-300
      group-hover:scale-110
      group-hover:rotate-12
    "
  />

  <span>Mark Attendance</span>
</Link>

    <Link
  to="/leave"
  className="
    group
    flex-1
    inline-flex
    items-center
    justify-center
    gap-2
    px-5
    py-3
    rounded-lg
    font-medium

    bg-emerald-600
    text-white

    transition-all
    duration-300

    hover:bg-emerald-700
    hover:-translate-y-1
    hover:scale-[1.02]

    active:scale-95

    shadow-lg
    shadow-emerald-500/20
    hover:shadow-xl
    hover:shadow-emerald-500/30
  "
>
  <CalendarPlusIcon
    className="
      w-5
      h-5
      transition-all
      duration-300
      group-hover:rotate-12
      group-hover:scale-110
    "
  />

  <span>Apply for Leave</span>
</Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;