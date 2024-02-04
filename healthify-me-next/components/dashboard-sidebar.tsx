// components/DashboardSidebar.tsx

import React from 'react';
import { Separator } from '@/components/ui/separator';
import { DashboardSidebarProps } from '@/lib/types';

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ children, heading, subHeading, sidebarNavItems, onClick }) => {
  return (
    <>
      <div className="hidden space-y-8 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
          <p className="text-muted-foreground">
            {subHeading}
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5 flex flex-col">
            {sidebarNavItems.map((item, index) => (
              <button
                key={index}
                className="py-2 px-4 mb-4 rounded-md"
                style={{ 
                    borderColor: (heading.charAt(0).toLowerCase() + heading.slice(1) === item.route) ? "initial" : "#ffb545",
                    borderWidth: (heading.charAt(0).toLowerCase() + heading.slice(1) === item.route) ? "2px" : "0.5px",
                }}
                onClick={() => onClick(item.route)}
                disabled={heading.charAt(0).toLowerCase() + heading.slice(1) === item.route}
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
};

export default DashboardSidebar;