import { Input, Textarea, Field } from "../components/Field";
import type { ProfileData, Project } from "../useProfileData";

interface Props {
    data: ProfileData;
    update: <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => void;
}

export function ProjectsSection({ data, update }: Props) {
    function updateIntro(field: keyof ProfileData["projectsIntro"], value: string) {
        update("projectsIntro", { ...data.projectsIntro, [field]: value });
    }

    function updateProject(index: number, field: keyof Project, value: string | string[]) {
        const next = data.projects.map((p, i) =>
            i === index ? { ...p, [field]: value } : p
        );
        update("projects", next);
    }

    function addProject() {
        update("projects", [
            ...data.projects,
            { id: `project-${Date.now()}`, title: "", category: "", summary: "", tags: [], liveUrl: "", repoUrl: "" },
        ]);
    }

    function removeProject(index: number) {
        update("projects", data.projects.filter((_, i) => i !== index));
    }

    return (
        <section className="adm-section">
            <h2 className="adm-section-title">Projects</h2>

            <h3 className="adm-subsection-title">Section Intro</h3>
            <Textarea
                label="Title"
                rows={2}
                value={data.projectsIntro.title}
                onChange={(e) => updateIntro("title", e.target.value)}
            />
            <div className="adm-grid-2">
                <Input
                    label="Lead"
                    hint="Bold prefix"
                    value={data.projectsIntro.lead}
                    onChange={(e) => updateIntro("lead", e.target.value)}
                />
                <Textarea
                    label="Body"
                    rows={3}
                    value={data.projectsIntro.body}
                    onChange={(e) => updateIntro("body", e.target.value)}
                />
            </div>

            <h3 className="adm-subsection-title" style={{ marginTop: "2rem" }}>Project List</h3>
            {data.projects.map((project, i) => (
                <div key={project.id} className="adm-row-group adm-project-group">
                    <div className="adm-project-index">Project {i + 1}</div>
                    <Input
                        label="Title"
                        value={project.title}
                        onChange={(e) => updateProject(i, "title", e.target.value)}
                    />
                    <Input
                        label="Category"
                        value={project.category}
                        onChange={(e) => updateProject(i, "category", e.target.value)}
                    />
                    <Textarea
                        label="Summary"
                        rows={3}
                        value={project.summary}
                        onChange={(e) => updateProject(i, "summary", e.target.value)}
                    />
                    <Field label="Tags" hint="Comma-separated">
                        <input
                            className="adm-input"
                            value={project.tags.join(", ")}
                            onChange={(e) =>
                                updateProject(
                                    i,
                                    "tags",
                                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                )
                            }
                        />
                    </Field>
                    <div className="adm-grid-2">
                        <Input
                            label="Live URL"
                            type="url"
                            placeholder="https://"
                            value={project.liveUrl}
                            onChange={(e) => updateProject(i, "liveUrl", e.target.value)}
                        />
                        <Input
                            label="Repo URL"
                            type="url"
                            placeholder="https://github.com/"
                            value={project.repoUrl}
                            onChange={(e) => updateProject(i, "repoUrl", e.target.value)}
                        />
                    </div>
                    <button className="adm-btn-remove" onClick={() => removeProject(i)}>
                        Remove Project
                    </button>
                </div>
            ))}
            <button className="adm-btn-add" onClick={addProject}>
                + Add Project
            </button>
        </section>
    );
}
