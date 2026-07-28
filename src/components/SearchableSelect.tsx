import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

export interface SelectOption {
  id: string;
  name: string;
  subText?: string;
  manufacturer?: string;
  badge?: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search component...",
  label,
  className = ""
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value) || options[0];

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
        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-purple-500/50 rounded-2xl p-3 text-left transition flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedOption?.manufacturer && (
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                selectedOption.manufacturer === "Intel"
                  ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                  : selectedOption.manufacturer === "AMD"
                  ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                  : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              }`}
            >
              {selectedOption.manufacturer}
            </span>
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-black text-[#1E2022] dark:text-white truncate">
              {selectedOption ? selectedOption.name : placeholder}
            </h4>
            {selectedOption?.subText && (
              <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{selectedOption.subText}</p>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-purple-400" : ""}`} />
      </button>

      {/* Dropdown Menu Container */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 dark:bg-[#1A1C1E]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-72">
          {/* Search Bar Input */}
          <div className="p-2.5 border-b border-black/10 dark:border-white/10 flex items-center gap-2 bg-black/5 dark:bg-white/5">
            <Search className="w-4 h-4 text-purple-400 shrink-0" />
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
                        ? "bg-purple-600/15 text-purple-600 dark:text-purple-300 font-black border border-purple-500/30"
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
                          <p className="text-[10px] text-gray-400 truncate font-medium">{option.subText}</p>
                        )}
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
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
