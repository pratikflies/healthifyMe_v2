"use client"

import React from "react";
import Link from "next/link";
import { SidebarBodyType } from "@/lib/types";

export default function SidebarHeaderComponent({ setSidebarBody }: SidebarBodyType ) {
    const handleLoginClick = (type: string) => {
        setSidebarBody(type);
    };

    return (
        <div>
            <p className="intro">
                {`You are currently using a demo version of the app. To gain access to the full version, `}
                <button 
                    onClick={() => handleLoginClick("login")}
                    className="Github Link"
                >
                    Login
                </button>
                {` or `}
                <button 
                    onClick={() => handleLoginClick("signup")}
                    className="Github Link"
                >
                    Signup
                </button>
                {`. In case you are facing problems, `}
                <Link href="/contact-us" className="Github Link">Contact Us</Link>.
            </p>
        </div>
    );
};