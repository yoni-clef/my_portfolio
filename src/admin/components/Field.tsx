interface FieldProps {
    label: string;
    hint?: string;
    children: React.ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
    return (
        <div className="adm-field">
            <label className="adm-label">
                {label}
                {hint && <span className="adm-hint">{hint}</span>}
            </label>
            {children}
        </div>
    );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    hint?: string;
}

export function Input({ label, hint, ...props }: InputProps) {
    return (
        <Field label={label} hint={hint}>
            <input className="adm-input" {...props} />
        </Field>
    );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    hint?: string;
}

export function Textarea({ label, hint, ...props }: TextareaProps) {
    return (
        <Field label={label} hint={hint}>
            <textarea className="adm-input adm-textarea" {...props} />
        </Field>
    );
}
