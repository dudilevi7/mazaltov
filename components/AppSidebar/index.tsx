"use client";
import { useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import { LanguageDirection } from "@/types/General";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faListCheck,
  faCalendarDays,
  faUsers,
  faCoins,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const SIDEBAR_ITEMS: {
  id: string;
  labelHe: string;
  labelEn: string;
  icon: IconDefinition;
}[] = [
  { id: "tasks", labelHe: "משימות", labelEn: "Tasks", icon: faListCheck },
  { id: "calendar", labelHe: "לוח שנה", labelEn: "Calendar", icon: faCalendarDays },
  { id: "guests", labelHe: "אורחים", labelEn: "Guests", icon: faUsers },
  { id: "budget", labelHe: "תקציב", labelEn: "Budget", icon: faCoins },
  { id: "settings", labelHe: "הגדרות", labelEn: "Settings", icon: faGear },
];

export default function AppSidebar() {
  const { languageDirection } = useAppContext();
  const [isOpen, setIsOpen] = useState(true);

  const isRtl = languageDirection === LanguageDirection.HEB;
  const isRight = isRtl;
  const ChevronIcon = isOpen
    ? isRight
      ? faChevronRight
      : faChevronLeft
    : isRight
      ? faChevronLeft
      : faChevronRight;

  return (
    <div
      className={`relative flex shrink-0 h-full min-h-screen bg-gray-100 border-gray-200 transition-all duration-300 ${
        isRight ? "border-l" : "border-r"
      } ${isOpen ? "w-36" : "w-12"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        className={`flex flex-col h-full ${isOpen ? "py-4 px-3 animate-fade-in-0.5" : "py-4 px-0 items-center"}`}
      >
        <nav className="flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors ${
                isOpen
                  ? `w-full px-3 py-2 text-sm font-medium ${isRtl ? "flex-row-reverse justify-end" : "justify-start"}`
                  : "w-10 h-10 justify-center"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="shrink-0" />
              {isOpen && (
                <span className="text-base animate-fade-in-0.5">{isRtl ? item.labelHe : item.labelEn}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors shadow-sm z-10 
          top-[70%] ${isRight ? `left-0 transform translate-[-50%]` : `right-0 transform translate-x-[50%] translate-y-[-50%]`}`}

      >
        <FontAwesomeIcon icon={ChevronIcon} className="text-sm " />
      </button>
    </div>
  );
}
