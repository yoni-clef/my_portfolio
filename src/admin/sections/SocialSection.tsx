import { Input } from "../components/Field";
import type { ProfileData, SocialLink } from "../useProfileData";

interface Props {
    data: ProfileData;
    update: <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => void;
}

export function SocialSection({ data, update }: Props) {
    function updateLink(index: number, field: keyof SocialLink, value: string) {
        const next = data.socialLinks.map((link, i) =>
            i === index ? { ...link, [field]: value } : link
        );
        update("socialLinks", next);
    }

    function addLink() {
        update("socialLinks", [
            ...data.socialLinks,
            { label: "", short: "", href: "" },
        ]);
    }

    function removeLink(index: number) {
        update("socialLinks", data.socialLinks.filter((_, i) => i !== index));
    }

    return (
        <section className="adm-section">
            <h2 className="adm-section-title">Social Links</h2>
            <p className="adm-section-hint">
                Label must match exactly for icons: GitHub, LinkedIn, Dribbble, Behance, Figma
            </p>
            {data.socialLinks.map((link, i) => (
                <div key={i} className="adm-row-group">
                    <div className="adm-grid-3">
                        <Input
                            label="Label"
                            value={link.label}
                            onChange={(e) => updateLink(i, "label", e.target.value)}
                        />
                        <Input
                            label="Short"
                            hint="Fallback text"
                            value={link.short}
                            onChange={(e) => updateLink(i, "short", e.target.value)}
                        />
                        <Input
                            label="URL"
                            type="url"
                            value={link.href}
                            onChange={(e) => updateLink(i, "href", e.target.value)}
                        />
                    </div>
                    <button
                        className="adm-btn-remove"
                        onClick={() => removeLink(i)}
                        aria-label={`Remove ${link.label || "link"}`}
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button className="adm-btn-add" onClick={addLink}>
                + Add Social Link
            </button>
        </section>
    );
}
