"use client"

import DashboardSidebar from "@/components/dashboard-sidebar";
import { sidebarNavItems } from "@/lib/sidebarNavItems";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axiosInstance";
import "../dashboard/dashboard.css";

export default function ProfileSidebarContent({ children }: { children: React.ReactNode }) {
    // const router = useRouter();
    const handleClick = async (intent: string) => {
        // router.push(`${intent}`);
        if (intent === "logout") {
          try {
            const token = Cookies.get("token");
            const response = await axiosInstance.post("http://localhost:3001/logout", { token });
            if (response.status === 200) {
              Cookies.remove("token");
              window.location.href = "/";
              return;
            } else throw new Error("Bad network response!");
          } catch (error) {
            console.error("Error while logging out!", error);
          }
        }
        window.location.href = `${intent}`;
    }
  
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
