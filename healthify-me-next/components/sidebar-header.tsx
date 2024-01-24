"use client"

import React from "react";
import Link from "next/link";

export default function SidebarHeaderComponent() {
    return (
        <div>
            <p className="intro">
                {`You are currently using a demo version of the app. To gain access to the full version, `}
                <Link href="/login" className="Github Link">Login</Link>{` or `}
                <Link href="/signup" className="Github Link">Signup</Link>.{` In case you are facing problems, `}
                <Link href="/contact-us" className="Github Link">Contact Us</Link>.
            </p>
        </div>
    );
};