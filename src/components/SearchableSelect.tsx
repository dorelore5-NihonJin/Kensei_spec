import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

export interface SelectOption {
  id: string;
  name: string;
  subText?: string;
  manufacturer?: string;
}

interface SearchableSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select component...",
  className = ""
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

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

  // Filter options based on query
  const filteredOptions = options.filter((opt) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      opt.name.toLowerCase().includes(q) ||
      (opt.subText && opt.subText.toLowerCase().includes(q)) ||
      (opt.manufacturer && opt.manufacturer.toLowerCase().includes(q))
    );
  });

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-1.5 ${isOpen ? "z-40" : "z-10"} ${className}`}>
      {label && <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{label}</label>}

      {/* Selected Option Box Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery("");
        }}
        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#E88D9F]/50 rounded-2xl p-3 text-left transition flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-[#E88D9F]/30"
      >
        {selectedOption ? (
          <div className="flex items-center gap-2.5 min-w-0">
            {selectedOption.manufacturer && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#E88D9F]/10 text-[#E88D9F] border border-[#E88D9F]/20 shrink-0">
                {selectedOption.manufacturer}
              </span>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-[#1E2022] dark:text-white truncate">
                {selectedOption.name}
              </span>
              {selectedOption.subText && (
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate">
                  {selectedOption.subText}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 py-1">
            {placeholder}
          </span>
        )}

        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-[#E88D9F]" : ""}`} />
      </button>

      {/* Dropdown Menu Container */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 dark:bg-[#1A1C1E]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-72">
          {/* Search Bar Input */}
          <div className="p-2.5 border-b border-black/10 dark:border-white/10 flex items-center gap-2 bg-black/5 dark:bg-white/5">
            <Search className="w-4 h-4 text-[#E88D9F] shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-xs font-bold text-[#1E2022] dark:text-white placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto divide-y divide-black/5 dark:divide-white/5 p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400 font-bold">
                No matching hardware found for "{searchQuery}"
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.id === value;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? "bg-[#E88D9F]/15 text-[#E88D9F] font-black border border-[#E88D9F]/30"
                        : "hover:bg-black/5 dark:hover:bg-white/5 text-[#1E2022] dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {option.manufacturer && (
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                            option.manufacturer === "Intel"
                              ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                              : option.manufacturer === "AMD"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {option.manufacturer}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold truncate">{option.name}</h5>
                        {option.subText && (
                          <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{option.subText}</p>
                        )}
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#E88D9F] shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
