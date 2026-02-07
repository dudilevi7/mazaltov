"use client";
import { useId } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
  place?: "top" | "right" | "bottom" | "left";
}

export default function Tooltip({
  children,
  content,
  className = "",
  place = "top",
}: TooltipProps) {
  const id = useId().replace(/:/g, "-");

  return (
    <>
      <div
        data-tooltip-id={id}
        data-tooltip-content={content}
        data-tooltip-place={place}
        className={`inline-flex items-center cursor-help ${className}`}
      >
        {children}
      </div>
      {content && <ReactTooltip id={id} className="z-50"/>}
    </>
  );
}
