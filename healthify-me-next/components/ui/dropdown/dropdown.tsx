import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axiosInstance";
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import './style.css';

const DropdownMenuDemo = () => {
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="IconButton" aria-label="Customise options">
          <HamburgerMenuIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
          <DropdownMenu.Item className="DropdownMenuItem" onClick={() => handleClick("dashboard")}>
            Dashboard
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" onClick={() => handleClick("profile")}>
            View Profile 
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" onClick={() => handleClick("stories")}>
            HealthifyMe Stories™
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" onClick={() => handleClick("payment")}>
            Get A Mentor
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="DropdownMenuSeparator" />
          <DropdownMenu.Item className="DropdownMenuItem" onClick={() => handleClick("logout")}>
            Log Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuDemo;