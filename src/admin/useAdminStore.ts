import { useState, useCallback } from "react";
import { profile as defaultProfile } from "../profile";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface NavItem {
    label: string;
    href: string;
}

export interface SocialLink {
    label: string;
    short: string;
    href: string;
}

export interface SkillGroup {
    category: string;
    items: string[];
}

export interface Experience {
    role: string;
    company: string;
    period: string;
    summary: string;
}

export interface Project {
    id: string;
    title: string;
    category: string;
    summary: string;
    tags: string[];
    liveUrl: string;
    repoUrl: string;
}

export interface ProfileData {
    firstName: string;
    lastName: string;
    initials: string;
    role: string;
    headline: string;
    intro: string;
    collaborationNote: string;
    avatarImage: string;
    projectCount: string;
    teamCount: string;
    yearsCount: string;
    navItems: NavItem[];
    socialLinks: SocialLink[];
    about: {
        bio: string[];
        skills: SkillGroup[];
        experience: Experience[];
    };
    projectsIntro: {
        title: string;
        lead: string;
        body: string;
    };
    projects: Project[];
    contact: {
        heading: string;
        subheading: string;
        email: string;
        availability: string;
    };
    footer: {
        copy: string;
    };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function toProfileData(src: typeof defaultProfile): ProfileData {
    return {
        firstName: src.firstName,
        lastName: src.lastName,
        initials: src.initials,
        role: src.role,
        headline: src.headline,
        intro: src.intro,
        collaborationNote: src.collaborationNote,
        avatarImage: src.avatarImage,
        projectCount: src.projectCount,
        teamCount: src.teamCount,
        yearsCount: src.yearsCount,
        navItems: src.navItems,
        socialLinks: src.socialLinks,
        about: {
            bio: src.about.bio,
            skills: src.about.skills,
            experience: src.about.experience,
        },
        projectsIntro: src.projectsIntro,
        projects: src.projects,
        contact: src.contact,
        footer: src.footer,
    };
}

// ── Store hook ────────────────────────────────────────────────────────────────
export function useAdminStore() {
    const [data, setData] = useState<ProfileData>(() => toProfileData(defaultProfile));

    const update = useCallback(
        <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
            setData((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const exportJSON = useCallback(() => {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "profile.json";
        a.click();
        URL.revokeObjectURL(url);
    }, [data]);

    const importJSON = useCallback((file: File) => {
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
    }, []);

    const resetToDefaults = useCallback(() => {
        setData(toProfileData(defaultProfile));
    }, []);

    return { data, update, setData, exportJSON, importJSON, resetToDefaults };
}
