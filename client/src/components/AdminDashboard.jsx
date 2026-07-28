import { useMemo } from "react";
import {
  UsersIcon,
  Building2Icon,
  CalendarIcon,
  FileTextIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b"];
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
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
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

const AdminDashboard = ({ data }) => {
  const stats = useMemo(() => {
    if (!data) return [];

    return [
      {
        icon: UsersIcon,
        value: data.totalEmployees || 0,
        label: "Total Employees",
      },
      {
        icon: Building2Icon,
        value: data.totalDepartments || 0,
        label: "Departments",
      },
      {
        icon: CalendarIcon,
        value: data.todayAttendance || 0,
        label: "Today's Attendance",
      },
      {
        icon: FileTextIcon,
        value: data.totalLeaves || 0,
        label: "Total Leaves",
        subtitle: data.pendingLeaves
          ? `Pending: ${data.pendingLeaves}`
          : undefined,
      },
    ];
  }, [data]);

  const pieData = useMemo(() => {
    if (!data) return [];

    return [
      { name: "Employees", value: data.totalEmployees || 0, color: COLORS[0] },
      { name: "Departments", value: data.totalDepartments || 0, color: COLORS[1] },
      { name: "Today's Attendance", value: data.todayAttendance || 0, color: COLORS[2] },
      { name: "Total Leaves", value: data.totalLeaves || 0, color: COLORS[3] },
    ];
  }, [data]);

  const pieTotal = useMemo(
    () => pieData.reduce((sum, item) => sum + item.value, 0),
    [pieData]
  );

  if (!data) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 w-40 bg-slate-200 rounded" />
        <div className="h-4 w-60 bg-slate-200 rounded" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-slate-200 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">

      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome back, Admin — here's your overview.
        </p>
      </div>
      
{/* Stats */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
  {stats.map((s, index) => {
    const Icon = s.icon;

    return (
      <div
        key={s.label}
        className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 active:scale-[0.98]"
      >
        {/* Left Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-300 group-hover:bg-indigo-600 group-hover:w-1.5 transition-all duration-300" />

        <div>
          <p className="text-sm font-medium text-slate-500">
            {s.label}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-1">
            {s.value}
          </p>

          {s.subtitle && (
            <p className="text-xs text-slate-400 mt-2">
              {s.subtitle}
            </p>
          )}
        </div>

        <Icon
          className="w-10 h-10 p-2.5 rounded-lg bg-slate-100 text-slate-600
          group-hover:bg-indigo-50
          group-hover:text-indigo-600
          group-hover:scale-110
          group-hover:rotate-6
          transition-all duration-300"
        />
      </div>
    );
  })}
</div>

          {/* Chart */}
      <div
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fade-in-up"
        style={{
          animationDelay: "600ms",
          animationFillMode: "both",
        }}
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          System Overview
        </h2>

        <div className="relative h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
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
                {pieData.map((entry, index) => (
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
              {pieTotal.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Total
            </p>
          </div>
        </div>

        <ChartLegend items={pieData} total={pieTotal} />
      </div>

    </div>
  );
};

export default AdminDashboard;