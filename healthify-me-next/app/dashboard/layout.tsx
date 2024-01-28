"use client"

import DashboardSidebar from "@/components/dashboard-sidebar"
import { sidebarNavItems } from "@/lib/sidebarNavItems";
import { useRouter } from "next/router";
import "./dashboard.css";

export default function DashboardSidebarContent({ children }: { children: React.ReactNode }) {
  // const router = useRouter();
  const handleClick = (intent: string) => {
    // router.push(`${intent}`);
    window.location.href = `${intent}`;
  }

  return (
    <DashboardSidebar
      heading={"Dashboard"}
      subHeading={"A comprehensive overview of your health and fitness data."} 
      sidebarNavItems={sidebarNavItems} 
      onClick={handleClick}>
        {children}
    </DashboardSidebar>
  );
}
