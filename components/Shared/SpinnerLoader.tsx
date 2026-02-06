import React from "react";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerLoaderProps {
  className?: string;
  size?: SpinnerSize;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const SpinnerLoader = ({ className = "", size = "md" }: SpinnerLoaderProps) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  );
};

export default SpinnerLoader;

