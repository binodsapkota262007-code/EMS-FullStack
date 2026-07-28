import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="
        inline-flex items-center gap-0.5 p-1 rounded-lg
        bg-slate-100 border border-slate-200
        dark:bg-slate-800 dark:border-slate-700
      "
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            title={label}
            onClick={() => setTheme(value)}
            className={`
              flex items-center justify-center gap-1.5
              px-2.5 py-1.5 rounded-md text-xs font-medium
              transition-all duration-200
              ${
                isActive
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }
            `}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
