"use client"

import React from "react";

export default function SidebarFooterComponent() {
    return (
        <p className="copyright">
            {`Your personal fitness tracking app built by `}
            <a className="Github Link"
                target="_blank"
                href="https://github.com/SauravM307"
                >Saurav
            </a>
            {` and `}
            <a className="Github Link"
                target="_blank"
                href="https://github.com/pratikflies"
                >Pratik
            </a>.
        </p>
    );
};