"use client";

import { useAppContext } from "@/context/AppContext";

interface ProgressBarProps {
  total: number;
  completed: number;
  remaining: number;
  className?: string;
}

const ProgressBar = ({
  total,
  completed,
  remaining,
  className = "",
}: ProgressBarProps) => {
  const { languageDirection } = useAppContext();
  const totalValue = total || 1;
  const completedPercent = (completed / totalValue) * 100;
  const remainingPercent = (remaining / totalValue) * 100;

  return (
    <div className={`w-full ${className}`} dir={languageDirection}>
      <div className="flex h-6 w-full overflow-hidden rounded-full bg-gray-100">
        
        <div
          className="bg-linear-to-r from-green-500 to-green-600 transition-all duration-300 animate-progress-bar relative"
          aria-label={`${completedPercent.toFixed(0)}% שולם`}
          style={{ width: `${completedPercent}%` }}
        >
          <span className="text-sm font-semibold left-[50%] -translate-x-1/2 absolute top-1/2 -translate-y-1/2 text-white">{completedPercent.toFixed(0)}%</span>
        </div>
        <div
          className=" transition-all duration-300 bg-linear-to-l from-gray-100 to-gray-200"
          style={{ width: `${remainingPercent}%` }}
          aria-label={`${remainingPercent.toFixed(0)}% נותר`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
