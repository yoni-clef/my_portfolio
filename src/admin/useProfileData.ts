import { useState, useEffect } from "react";
import { profile as defaults } from "../profile";

export type SocialLink = { label: string; short: string; href: string };
export type NavItem = { label: string; href: string };
export type SkillGroup = { category: string; items: string[] };
export type Experience = { role: string; company: string; period: string; summary: string };
export type Project = {
    id: string;
    title: string;
    category: string;
    summary: string;
    tags: string[];
    liveUrl: string;
    repoUrl: string;
};

export interface ProfileData {
    firstName: string;
    lastName: string;
    initials: string;
    role: string;
    headline: string;
    intro: string;
    collaborationNote: string;
    avatarImage: string;
    navItems: NavItem[];
    socialLinks: SocialLink[];
    projectCount: string;
    teamCount: string;
    yearsCount: string;
    about: {
        bio: string[];
        skills: SkillGroup[];
        experience: Experience[];
    };
    projectsIntro: { title: string; lead: string; body: string };
    projects: Project[];
    contact: { heading: string; subheading: string; email: string; availability: string };
    footer: { copy: string };
}

export function useProfileData() {
    const [data, setData] = useState<ProfileData>(defaults as ProfileData);
    const [loaded, setLoaded] = useState(false);

    // Seed from public/profile.json if it exists
    useEffect(() => {
        fetch("/profile.json")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((json: ProfileData) => {
                setData(json);
                setLoaded(true);
            })
            .catch(() => setLoaded(true));
    }, []);

    function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
        setData((prev) => ({ ...prev, [key]: value }));
    }

    function exportJson() {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "profile.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    function importJson(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string) as ProfileData;
                setData(parsed);
            } catch {
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    }

    return { data, update, setData, exportJson, importJson, loaded };
}
