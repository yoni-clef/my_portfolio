import { Input, Textarea } from "../components/Field";
import type { ProfileData } from "../useProfileData";

interface Props {
    data: ProfileData;
    update: <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => void;
}

export function IdentitySection({ data, update }: Props) {
    return (
        <section className="adm-section">
            <h2 className="adm-section-title">Identity</h2>
            <div className="adm-grid-2">
                <Input
                    label="First Name"
                    value={data.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                />
                <Input
                    label="Last Name"
                    value={data.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                />
                <Input
                    label="Initials"
                    hint="Shown in the brand mark"
                    value={data.initials}
                    onChange={(e) => update("initials", e.target.value)}
                />
                <Input
                    label="Role"
                    hint="e.g. Full Stack Developer"
                    value={data.role}
                    onChange={(e) => update("role", e.target.value)}
                />
            </div>
            <Textarea
                label="Headline"
                rows={2}
                value={data.headline}
                onChange={(e) => update("headline", e.target.value)}
            />
            <Textarea
                label="Intro"
                rows={3}
                value={data.intro}
                onChange={(e) => update("intro", e.target.value)}
            />
            <Input
                label="Collaboration Note"
                hint="Shown in the proof badge"
                value={data.collaborationNote}
                onChange={(e) => update("collaborationNote", e.target.value)}
            />
            <div className="adm-grid-3">
                <Input
                    label="Projects Count"
                    value={data.projectCount}
                    onChange={(e) => update("projectCount", e.target.value)}
                />
                <Input
                    label="Teams Count"
                    value={data.teamCount}
                    onChange={(e) => update("teamCount", e.target.value)}
                />
                <Input
                    label="Years Count"
                    value={data.yearsCount}
                    onChange={(e) => update("yearsCount", e.target.value)}
                />
            </div>
            <Input
                label="Avatar Image Path"
                hint="Relative to /public, e.g. /images/portrait.png"
                value={data.avatarImage}
                onChange={(e) => update("avatarImage", e.target.value)}
            />
        </section>
    );
}
