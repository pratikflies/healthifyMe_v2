"use client"

import { Separator } from "@/components/ui/separator";
import "./dashboard.css";

const sidebarNavItems = [
  {
    title: "Go To Map",
    route: "map",
  },
  {
    title: "Edit Profile",
    route: "profile"
  },
  {
    title: "HealthifyMe Stories™",
    route: "stories",
  },
  {
    title: "Get A Mentor",
    route: "payment"
  },
  {
    title: "Logout",
    route: "logout",
  },
];

export default function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const handleClick = (intent: string) => {
    console.log(`Button clicked with intent: ${intent}`);
    // do stuff
  };

  return (
    <>
      <div className="hidden space-y-8 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            A comprehensive overview of your health and fitness data.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5 flex flex-col">
                {sidebarNavItems.map((item, index) => (
                <button
                    key={index}
                    className="py-2 px-4 mb-4 rounded-md" 
                    style={{ borderColor: '#ffb545', borderWidth: '0.5px' }} 
                    onClick={()=>handleClick(item.route)}
                >
                    {item.title}
                </button>
                ))}
            </aside>
            <div className="flex-1 lg:max-w-screen-xl">{children}</div>
        </div>
      </div>
    </>
  );
}
