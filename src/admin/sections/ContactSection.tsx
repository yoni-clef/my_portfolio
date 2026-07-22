import { Input, Textarea } from "../components/Field";
import type { ProfileData } from "../useProfileData";

interface Props {
    data: ProfileData;
    update: <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => void;
}

export function ContactSection({ data, update }: Props) {
    function updateContact(field: keyof ProfileData["contact"], value: string) {
        update("contact", { ...data.contact, [field]: value });
    }

    function updateFooter(field: keyof ProfileData["footer"], value: string) {
        update("footer", { ...data.footer, [field]: value });
    }

    return (
        <section className="adm-section">
            <h2 className="adm-section-title">Contact &amp; Footer</h2>
            <Input
                label="Heading"
                value={data.contact.heading}
                onChange={(e) => updateContact("heading", e.target.value)}
            />
            <Textarea
                label="Subheading"
                rows={2}
                value={data.contact.subheading}
                onChange={(e) => updateContact("subheading", e.target.value)}
            />
            <div className="adm-grid-2">
                <Input
                    label="Email"
                    type="email"
                    value={data.contact.email}
                    onChange={(e) => updateContact("email", e.target.value)}
                />
                <Input
                    label="Availability"
                    hint="Shown in the badge"
                    value={data.contact.availability}
                    onChange={(e) => updateContact("availability", e.target.value)}
                />
            </div>
            <Input
                label="Footer Copy"
                value={data.footer.copy}
                onChange={(e) => updateFooter("copy", e.target.value)}
            />
        </section>
    );
}
