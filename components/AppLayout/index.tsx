"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { LanguageDirection } from "@/types/General";
import AppSidebar from "@/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { languageDirection } = useAppContext();
  const isRtl = languageDirection === LanguageDirection.HEB;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/tasks");
    }
  }, [pathname, router]);

  return (
    <div
      className={`flex min-h-screen h-screen text-black ${isRtl ? "flex-row-reverse" : "flex-row"}`}
    >
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
};

export default AppLayout;