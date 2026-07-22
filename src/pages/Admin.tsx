import { useRef } from "react";
import { useProfileData } from "../admin/useProfileData";
import { IdentitySection } from "../admin/sections/IdentitySection";
import { SocialSection } from "../admin/sections/SocialSection";
import { AboutSection } from "../admin/sections/AboutSection";
import { ProjectsSection } from "../admin/sections/ProjectsSection";
import { ContactSection } from "../admin/sections/ContactSection";

const SECTIONS = [
    { id: "identity", label: "Identity" },
    { id: "social", label: "Social" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
];

export default function Admin() {
    const { data, update, exportJson, importJson, loaded } = useProfileData();
    const importRef = useRef<HTMLInputElement>(null);

    function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) importJson(file);
        e.target.value = "";
    }

    if (!loaded) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", background: "#0a0a0a", color: "#a9a9a9", fontFamily: "inherit" }}>
                Loading…
            </div>
        );
    }

    return (
        <div className="adm-shell">
            {/* Sidebar */}
            <aside className="adm-sidebar">
                <div className="adm-sidebar-brand">
                    <span>Admin</span>
                    <a href="/#home" className="adm-preview-link">← Portfolio</a>
                </div>

                <nav className="adm-nav">
                    {SECTIONS.map((s) => (
                        <a key={s.id} href={`#adm-${s.id}`} className="adm-nav-link">
                            {s.label}
                        </a>
                    ))}
                </nav>

                <div className="adm-sidebar-actions">
                    <button className="adm-btn-export" onClick={exportJson}>
                        Export profile.json
                    </button>
                    <button
                        className="adm-btn-import"
                        onClick={() => importRef.current?.click()}
                    >
                        Import profile.json
                    </button>
                    <input
                        ref={importRef}
                        type="file"
                        accept=".json"
                        style={{ display: "none" }}
                        onChange={handleImport}
                    />
                    <p className="adm-export-hint">
                        After exporting, place <code>profile.json</code> in{" "}
                        <code>public/</code> and rebuild.
                    </p>
                </div>
            </aside>

            {/* Main content */}
            <main className="adm-main">
                <div className="adm-header">
                    <h1>Portfolio Editor</h1>
                    <p>Edit your portfolio content below, then export and deploy.</p>
                </div>

                <div id="adm-identity"><IdentitySection data={data} update={update} /></div>
                <div id="adm-social"><SocialSection data={data} update={update} /></div>
                <div id="adm-about"><AboutSection data={data} update={update} /></div>
                <div id="adm-projects"><ProjectsSection data={data} update={update} /></div>
                <div id="adm-contact"><ContactSection data={data} update={update} /></div>
            </main>
        </div>
    );
}
