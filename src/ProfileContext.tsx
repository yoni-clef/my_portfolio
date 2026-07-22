import { createContext, useContext, useEffect, useState } from "react";
import { profile as staticProfile } from "./profile";
import type { ProfileData } from "./admin/useProfileData";

const ProfileContext = createContext<ProfileData>(staticProfile as ProfileData);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<ProfileData>(staticProfile as ProfileData);

    useEffect(() => {
        fetch("/profile.json")
            .then((res) => {
                if (!res.ok) throw new Error("No profile.json found");
                return res.json();
            })
            .then((json: ProfileData) => setData(json))
            .catch(() => {
                // silently fall back to profile.js defaults
            });
    }, []);

    return (
        <ProfileContext.Provider value={data}>{children}</ProfileContext.Provider>
    );
}

export function useProfile(): ProfileData {
    return useContext(ProfileContext);
}
