"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconSpinner } from "@/components/ui/icons";
import { ProfileDataType } from "@/lib/types";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosInstance";
import "../dashboard/dashboard.css";

export async function getProps() {
    try {
        const response = await axiosInstance.get("http://localhost:3001/profile");
        if (!response || !response.data) throw new Error("Invalid response from server");

        return { props: response.data };
    } catch (error) {
        console.error("Error fetching profile data: ", error);
        return {
            props: {
                firstName: "NA",
                lastName: "NA",
                gender: "Choose not to disclose",
                age: 1,
                height: 1,
                weight: 1,
                target: 1,
            }
        };
    }
}

export default function Profile() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  // const router = useRouter();

  useEffect(() => {
    getProps()
      .then(response => {
        setFirstName(response.props?.firstName);
        setLastName(response.props?.lastName)
        setGender(response.props?.gender);
        setAge(response.props?.age);
        setHeight(response.props?.height);
        setWeight(response.props?.weight);
        setTarget(response.props?.target);
      })
      .catch(error => {
        console.error("Error fetching dashboard's data: ", error);
      });
  }, []);

  const validation = ({ firstName, age, height, weight, target }: ProfileDataType) => {
        // basic client side validation
        if (firstName.trim() === "") {
            throw new Error("Please enter First Name!");
        }
        if (!age ||!height ||!weight ||!target) throw new Error("Please enter valid details!");
        return true;
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const profileData = {
        firstName,
        lastName,
        gender,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        target: Number(target),
    };

    // validate form data
    const isValidate = validation(profileData);

    if (isValidate) {
        try {
            const response : any = await axiosInstance.post(
                "http://localhost:3001/profile", 
                profileData,
            );

            if (response.status === 200) {
                // notify user that data is saved
            } else throw new Error("Bad network response!");
        } catch (error) {
            console.error("Something went wrong while submitting profile data!", error);
        } finally {
            setIsLoading(false);
        }
    } else {
        console.error("Please enter valid details!");
        setIsLoading(false);
    }
  }

  const handleDeleteProfile = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
        const response : any = await axiosInstance.post("http://localhost:3001/deleteProfile");

        if (response.status === 200) {
            // do stuff
            // router.push("/");
            window.location.href = "/";
        } else throw new Error("Bad network response!");
    } catch (error) {
        console.error("Something went wrong while submitting profile data!", error);
    } finally {
        setIsLoading(false);
    }
  };
    
  const handleResetForm = (event: React.SyntheticEvent) => {
    event.preventDefault();

    setFirstName("");
    setLastName("");
    setGender("not-disclosed");
    setAge("");
    setHeight("");
    setWeight("");
    setTarget("");
  };

  return (
    <form onSubmit={onSubmit}>
    <div className="space-y-6 ml-12">
      <div className="flex space-x-6">
        <div className="space-y-2">
            <Label className="text-md">First Name</Label>
            <Input 
                type="text"
                id="firstName" 
                className="w-[200px] h-[30px] bg-black text-white"
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                disabled={isLoading}
            />
        </div>
        <div className="space-y-2">
            <Label className="text-md">Last Name</Label>
            <Input 
                type="text"
                id="lastName" 
                className="w-[200px] h-[30px] bg-black text-white"
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Snow"
                disabled={isLoading}
            />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-md">Gender</Label>
            <div className="relative">
                <select
                    id="gender"
                    className="w-[180px] h-[30px] bg-black text-white border border-white rounded-lg pl-3 pr-8"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    disabled={isLoading}
                    >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Choose not to disclose">Choose not to disclose</option>
                </select>
            </div>
      </div>
      <div className="space-y-2">
        <Label className="text-md">Age (YEARS)</Label>
        <Input 
            type="number"
            id="age" 
            className="w-[100px] h-[30px] bg-black text-white"
            value={age} 
            onChange={(e) => setAge(e.target.value)}
            placeholder="18"
            required
            disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-md">Height (METRES)</Label>
        <Input 
            type="number"
            id="height" 
            className="w-[100px] h-[30px] bg-black text-white"
            value={height} 
            onChange={(e) => setHeight(e.target.value)}
            placeholder="1.72"
            required
            disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-md">Weight (KGS)</Label>
        <Input 
            type="number"
            id="weight" 
            className="w-[100px] h-[30px] bg-black text-white"
            value={weight} 
            onChange={(e) => setWeight(e.target.value)}
            placeholder="77.7"
            required
            disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-md">Target (KMS)</Label>
        <Input 
            type="number"
            id="target" 
            className="w-[100px] h-[30px] bg-black text-white"
            value={target} 
            onChange={(e) => setTarget(e.target.value)}
            placeholder="25"
            required
            disabled={isLoading}
        />
      </div>

      <div className="flex">
        <Button disabled={isLoading} type="submit" className="mr-8">
            {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
        </Button>
        <Button variant={"destructive"} className="mr-8" onClick={handleDeleteProfile}>
          {isLoading && <IconSpinner className="mr-2 h-4 w-4 animate-spin" />}
          Delete Profile
        </Button>
        <Button variant={"outline"} className="" onClick={handleResetForm}>
          Reset Form
        </Button>
      </div>
    </div>
    </form>
  );
}
