import { useState } from "react";

import { DotPortrait } from "../components/DotPortrait";

/** Swap this path once you add `public/images/portrait.jpg`. */
const SAMPLE_IMAGE = "/images/yoniBlackWhite.png";

const defaultControls = {
  width: 520,
  height: 520,
  dotSpacing: 6,
  maxDotRadius: 4,
  minDotRadius: 0.2,
  contrast: 1.25,
};

export default function DotPortraitDemo() {
  const [dotSpacing, setDotSpacing] = useState(defaultControls.dotSpacing);
  const [maxDotRadius, setMaxDotRadius] = useState(defaultControls.maxDotRadius);
  const [contrast, setContrast] = useState(defaultControls.contrast);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#f5f5f5",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "minmax(280px, 420px) 1fr",
          alignItems: "start",
        }}
      >
        <section
          style={{
            display: "grid",
            gap: "1rem",
          }}
        >
          <p style={{ margin: 0, opacity: 0.7, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem" }}>
            Phase 1 Demo
          </p>
          <h1 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.1 }}>
            Dot Portrait Halftone
          </h1>
          <p style={{ margin: 0, opacity: 0.78, lineHeight: 1.6 }}>
            Static halftone renderer. Replace the sample image at{" "}
            <code>public/images/portrait.jpg</code> with your own portrait.
          </p>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Dot spacing: {dotSpacing}px</span>
            <input
              type="range"
              min={3}
              max={14}
              step={1}
              value={dotSpacing}
              onChange={(event) => setDotSpacing(Number(event.target.value))}
            />
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Max dot radius: {maxDotRadius}px</span>
            <input
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={maxDotRadius}
              onChange={(event) => setMaxDotRadius(Number(event.target.value))}
            />
          </label>

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Contrast: {contrast.toFixed(2)}</span>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.05}
              value={contrast}
              onChange={(event) => setContrast(Number(event.target.value))}
            />
          </label>

          <a href="/" style={{ color: "#9bd0ff" }}>
            Back to portfolio
          </a>
        </section>

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1rem",
            background: "radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 55%)",
          }}
        >
          <DotPortrait
            image={SAMPLE_IMAGE}
            width={defaultControls.width}
            height={defaultControls.height}
            dotSpacing={dotSpacing}
            maxDotRadius={maxDotRadius}
            minDotRadius={defaultControls.minDotRadius}
            contrast={contrast}
          />
        </section>
      </div>
    </main>
  );
}
