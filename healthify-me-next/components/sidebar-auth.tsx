"use client"

import React, { useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authDataType } from "@/lib/types";
import { SidebarBodyType } from "@/lib/types";

export default function SidebarAuthComponent({ isLoading, setIsLoading, sidebarBody, setSidebarBody }: SidebarBodyType) {
    // none of the below states save
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();

    const validation = ({ email, password }: authDataType) => {
        // basic client side validation
        if (email.trim() === "" || password.trim() === "") {
            throw new Error("Please enter both email and password!");
        }
        return true;
    };

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        const authData = {
            email,
            password,
        };

        // validate form data
        const isValidate = validation(authData);

        if (isValidate) {
            try {
                const response = await fetch(
                    `http://localhost:3001/${sidebarBody}`,
                {
                    method: "POST",
                    body: JSON.stringify(authData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const responseData = await response.json();
                    if (sidebarBody === "login") {
                        Cookie.set("token", responseData.token);
                        // router.refresh(); // try without this, also try router.reload()
                        // router.push("/dashboard");
                        window.location.href = "/dashboard";
                    } else {
                        // notify user to check e-mail, activate account
                        setSidebarBody("login");
                    }
                    setEmail("");
                    setPassword("");
                    setShowPassword(false);
                } else throw new Error("Bad network response!");
            } catch (error) {
                console.error("Something went wrong while authenticating!", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.error("Please enter valid details!");
            setIsLoading(false);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoBack = () => {
        setSidebarBody("workouts");
    };

    return (
        <>
            <div className="login-headline">
                {
                    sidebarBody === "login" ?
                    "Login to continue" : 
                    "Create an account"
                }
            </div>
            <div className="login-form-container">
                <form onSubmit={onSubmit} className="login-form">
                    <div className="form-group">
                        <Input 
                            type="text" 
                            id="email" 
                            className="form-input" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <Input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            className="form-input" 
                            value={password} 
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <div className="options-container">
                            <div className="show-password">
                                <Input 
                                    type="checkbox" 
                                    id="show-password" 
                                    checked={showPassword}
                                    onChange={togglePasswordVisibility}
                                    disabled={isLoading}
                                />
                                <Label htmlFor="show-password" className="show-password-label">Show Password</Label>
                            </div>
                            <div className="go-back" onClick={handleGoBack}>
                                {"<-Go Back"}
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <Button disabled={isLoading} type="submit" className="form-button">
                            {isLoading && "Please Wait..."}
                            {!isLoading && (sidebarBody === "login" ? "Login" : "Signup")}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
