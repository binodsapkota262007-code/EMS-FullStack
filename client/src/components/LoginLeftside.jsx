import { ShieldCheck, Users, CalendarCheck } from "lucide-react";

const LoginLeftside = () => {
  return (
    <div className="hidden md:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute top-1/3 right-10 w-44 h-44 bg-cyan-400/10 rounded-full blur-2xl animate-bounce" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center p-12 lg:p-20 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 w-fit mb-8">
          <ShieldCheck className="w-5 h-5 text-indigo-300" />
          <span className="text-sm font-medium text-indigo-100">
            Secure Employee Portal
          </span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
          Employee
          <br />
          Management
          <br />
          System
        </h1>

        <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-lg">
          Simplify attendance, leave management, payroll, and employee
          information with a modern, secure, and easy-to-use platform.
        </p>

        {/* Features */}
        <div className="mt-12 space-y-5">
          <div className="flex items-center gap-4 text-slate-200">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Users className="w-5 h-5 text-indigo-300" />
            </div>
            <span>Manage Employees Efficiently</span>
          </div>

          <div className="flex items-center gap-4 text-slate-200">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <CalendarCheck className="w-5 h-5 text-indigo-300" />
            </div>
            <span>Attendance & Leave Tracking</span>
          </div>

          <div className="flex items-center gap-4 text-slate-200">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-300" />
            </div>
            <span>Secure Payroll & Profile Management</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16">
          <div className="h-px bg-white/10 mb-5" />
          <p className="text-sm text-slate-400">
            Built for modern organizations • Fast • Secure • Reliable
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLeftside;