import { Input, Textarea } from "../components/Field";
import { Field } from "../components/Field";
import type { ProfileData, SkillGroup, Experience } from "../useProfileData";

interface Props {
    data: ProfileData;
    update: <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => void;
}

export function AboutSection({ data, update }: Props) {
    const { about } = data;

    // ── Bio ──────────────────────────────────────────────────────────────────
    function updateBio(index: number, value: string) {
        const next = about.bio.map((p, i) => (i === index ? value : p));
        update("about", { ...about, bio: next });
    }

    function addBio() {
        update("about", { ...about, bio: [...about.bio, ""] });
    }

    function removeBio(index: number) {
        update("about", { ...about, bio: about.bio.filter((_, i) => i !== index) });
    }

    // ── Skills ───────────────────────────────────────────────────────────────
    function updateSkillGroup(index: number, field: keyof SkillGroup, value: string | string[]) {
        const next = about.skills.map((g, i) =>
            i === index ? { ...g, [field]: value } : g
        );
        update("about", { ...about, skills: next });
    }

    function addSkillGroup() {
        update("about", { ...about, skills: [...about.skills, { category: "", items: [] }] });
    }

    function removeSkillGroup(index: number) {
        update("about", { ...about, skills: about.skills.filter((_, i) => i !== index) });
    }

    // ── Experience ───────────────────────────────────────────────────────────
    function updateExp(index: number, field: keyof Experience, value: string) {
        const next = about.experience.map((e, i) =>
            i === index ? { ...e, [field]: value } : e
        );
        update("about", { ...about, experience: next });
    }

    function addExp() {
        update("about", {
            ...about,
            experience: [...about.experience, { role: "", company: "", period: "", summary: "" }],
        });
    }

    function removeExp(index: number) {
        update("about", { ...about, experience: about.experience.filter((_, i) => i !== index) });
    }

    return (
        <section className="adm-section">
            <h2 className="adm-section-title">About</h2>

            {/* Bio paragraphs */}
            <h3 className="adm-subsection-title">Bio</h3>
            {about.bio.map((paragraph, i) => (
                <div key={i} className="adm-row-group">
                    <Textarea
                        label={`Paragraph ${i + 1}`}
                        rows={3}
                        value={paragraph}
                        onChange={(e) => updateBio(i, e.target.value)}
                    />
                    <button className="adm-btn-remove" onClick={() => removeBio(i)}>
                        Remove
                    </button>
                </div>
            ))}
            <button className="adm-btn-add" onClick={addBio}>
                + Add Paragraph
            </button>

            {/* Skills */}
            <h3 className="adm-subsection-title" style={{ marginTop: "2rem" }}>Skills</h3>
            {about.skills.map((group, i) => (
                <div key={i} className="adm-row-group">
                    <Input
                        label="Category"
                        value={group.category}
                        onChange={(e) => updateSkillGroup(i, "category", e.target.value)}
                    />
                    <Field label="Skills" hint="Comma-separated">
                        <input
                            className="adm-input"
                            value={group.items.join(", ")}
                            onChange={(e) =>
                                updateSkillGroup(
                                    i,
                                    "items",
                                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                )
                            }
                        />
                    </Field>
                    <button className="adm-btn-remove" onClick={() => removeSkillGroup(i)}>
                        Remove
                    </button>
                </div>
            ))}
            <button className="adm-btn-add" onClick={addSkillGroup}>
                + Add Skill Group
            </button>

            {/* Experience */}
            <h3 className="adm-subsection-title" style={{ marginTop: "2rem" }}>Experience</h3>
            {about.experience.map((exp, i) => (
                <div key={i} className="adm-row-group">
                    <div className="adm-grid-2">
                        <Input
                            label="Role"
                            value={exp.role}
                            onChange={(e) => updateExp(i, "role", e.target.value)}
                        />
                        <Input
                            label="Company"
                            value={exp.company}
                            onChange={(e) => updateExp(i, "company", e.target.value)}
                        />
                        <Input
                            label="Period"
                            hint="e.g. 2022 – Present"
                            value={exp.period}
                            onChange={(e) => updateExp(i, "period", e.target.value)}
                        />
                    </div>
                    <Textarea
                        label="Summary"
                        rows={2}
                        value={exp.summary}
                        onChange={(e) => updateExp(i, "summary", e.target.value)}
                    />
                    <button className="adm-btn-remove" onClick={() => removeExp(i)}>
                        Remove
                    </button>
                </div>
            ))}
            <button className="adm-btn-add" onClick={addExp}>
                + Add Experience
            </button>
        </section>
    );
}
