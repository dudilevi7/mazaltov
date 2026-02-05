"use client";
import { useAppContext } from "@/context/AppProvider";
import { LanguageDirection } from "@/types/General";
import AppSidebar from "@/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { languageDirection } = useAppContext();
  const isRtl = languageDirection === LanguageDirection.HEB;

  return (
    <div
      className={`flex min-h-screen h-screen text-black ${isRtl ? "flex-row-reverse" : "flex-row"}`}
    >
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}