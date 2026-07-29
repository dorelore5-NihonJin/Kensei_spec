import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  icon?: ReactNode;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  icon,
  label,
  placeholder = "Select option...",
  className = ""
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative flex items-center gap-2 ${isOpen ? "z-50" : "z-20"} ${className}`}>
      {label && (
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider shrink-0 hidden sm:inline">
          {label}
        </span>
      )}

      {/* Select Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex-1 min-w-0 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#E88D9F]/50 rounded-2xl px-3 py-2 text-left transition flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-[#E88D9F]/30"
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-[#E88D9F] shrink-0">{icon}</span>}
          <span className="text-xs font-black text-[#1E2022] dark:text-white truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#E88D9F]" : ""
          }`}
        />
      </button>

      {/* Custom Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white/95 dark:bg-[#1A1C1E]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-72 min-w-[240px]">
          <div className="overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#E88D9F]/15 text-[#E88D9F] font-black border border-[#E88D9F]/30"
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-[#1E2022] dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <div className="min-w-0">
                      <h5 className="text-xs font-black truncate">{option.label}</h5>
                      {option.subLabel && (
                        <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{option.subLabel}</p>
                      )}
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#E88D9F] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
