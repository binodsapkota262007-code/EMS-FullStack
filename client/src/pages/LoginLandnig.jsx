import LoginLeftside from "../components/LoginLeftside"
import ThemeToggle from "../components/ThemeToggle"
import { ArrowRightIcon, ShieldIcon, UserIcon } from "lucide-react"
import { Link } from "react-router-dom"

const LoginLandnig = () => {
  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      description: "Manage employee, departments, payroll, and system configurations.",
      icon: ShieldIcon
    },
     {
      to: "/login/employee",
      title: "Employee Portal",
      description: "View your profile, track  attendance, request time-off, and access payslips.",
      icon: UserIcon
    }
  ]


  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <LoginLeftside />
<div className="w-full md:w-1/2 flex flex-col items-center justify-center
 p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen dark:bg-slate-950">

<div className="absolute top-6 right-6 z-20">
  <ThemeToggle />
</div>

<div className="w-full max-w-md animate-fade-in relative z-10">
{/* Header */}
<div className="mb-10 text-center md:text-left animate-fade-in">

  <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-3 dark:text-slate-50">
    Welcome Back
  </h2>

  <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md dark:text-slate-400">
    Select your portal to securely access the system and continue your workflow.
  </p>

  {/* Decorative line */}
  <div className="mt-5 flex justify-center md:justify-start">
    <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full" />
  </div>
</div>

{/* Portals list */}
<div className="space-y-5">
  {portalOptions.map((portal) => (
    <Link
      key={portal.to}
      to={portal.to}
      className="
        group
        block
        rounded-2xl
        border border-slate-200
        bg-white
        p-6
        transition-all duration-300
        hover:-translate-y-1
        hover:scale-[1.02]
        hover:border-indigo-400
        hover:shadow-xl
        hover:shadow-indigo-500/10
        dark:bg-slate-900
        dark:border-slate-800
        dark:hover:border-indigo-500
        dark:hover:shadow-indigo-500/20
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="
              p-3
              rounded-xl
              bg-indigo-50
              text-indigo-600
              transition-all duration-300
              group-hover:bg-indigo-600
              group-hover:text-white
              group-hover:rotate-6
              group-hover:scale-110
              dark:bg-indigo-500/10
              dark:text-indigo-400
            "
          >
            <portal.icon className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-slate-100 dark:group-hover:text-indigo-400">
              {portal.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500 leading-relaxed dark:text-slate-400">
              {portal.description}
            </p>
          </div>
        </div>

        <ArrowRightIcon
          className="
            w-5 h-5
            text-slate-400
            transition-all duration-300
            group-hover:text-indigo-600
            group-hover:translate-x-1
          "
        />
      </div>
    </Link>
  ))}
</div>

{/* Footer  */}

<div className="mt-12 text-center md:text-left text-sm text-slate-400 dark:text-slate-600">
  <p>
    © {new Date().getFullYear()}  Binod Sapkota. All rights reserved.
  </p>
</div>

</div>

</div>
    </div>
  )
}

export default LoginLandnig