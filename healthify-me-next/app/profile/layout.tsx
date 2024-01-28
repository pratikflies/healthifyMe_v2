"use client"

import DashboardSidebar from "@/components/dashboard-sidebar";
import { sidebarNavItems } from "@/lib/sidebarNavItems";
import { useRouter } from "next/router";
import "../dashboard/dashboard.css";

export default function ProfileSidebarContent({ children }: { children: React.ReactNode }) {
    // const router = useRouter();
    const handleClick = (intent: string) => {
      // router.push(`${intent}`);
      window.location.href = `${intent}`;
    };
  
    return (
      <DashboardSidebar
        heading={"Profile"}
        subHeading={"Edit your details and scale your targets on the go."} 
        sidebarNavItems={sidebarNavItems} 
        onClick={handleClick}>
          {children}
      </DashboardSidebar>
    );
}
