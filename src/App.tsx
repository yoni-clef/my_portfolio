import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaGithub,
  FaLinkedinIn,
  FaExternalLinkAlt,
  FaDribbble,
  FaFigma,
  FaTelegram,
  FaEnvelope,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { DotPortrait } from "./components/DotPortrait";
import { useProfile } from "./ProfileContext";

const DotPortraitDemo = lazy(() => import("./pages/DotPortraitDemo"));
const Admin = lazy(() => import("./pages/Admin"));

// ── Social icon map ───────────────────────────────────────────────────────────
const socialIcons: Record<string, IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  Dribbble: FaDribbble,
  Figma: FaFigma,
  Telegram: FaTelegram,
  Gmail: FaEnvelope,
};
function getSocialIcon(label: string): IconType | undefined {
  return socialIcons[label];
}

// ══════════════════════════════════════════════════════════════════════════════
// MOTION HOOKS  (recipes from design/reference/motion/README.md)
// ══════════════════════════════════════════════════════════════════════════════

// ── Recipe 9: header hides on scroll-down, reveals on scroll-up ──────────────
// Trigger: scroll; property: transform; curve: cubic-bezier(0.22,1,0.36,1) 180ms
function useHeaderHide() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (delta > 4 && y > 80) setHidden(true);   // scrolling down → hide
      else if (delta < -4) setHidden(false);        // scrolling up  → reveal
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

// ── Recipe 9 (nav active): active section highlight 150ms cubic-bezier ────────
function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) setActive(visible[0].target.id);
      },
      { threshold: 0.25 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);

  return active;
}

// ── Recipes 21 & 22: typewriter + text-scramble on heading span ───────────────
// Recipe 21: plain typewriter (one char at a time)
// Recipe 22: scramble — show final text with unsettled letters as random chars,
//            settling left-to-right, one more letter every few frames (~50ms)

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#&%@$";

function useScrambleText(target: string, active: boolean): string {
  const [display, setDisplay] = useState(target);
  const frame = useRef(0);
  const settled = useRef(0);
  const raf = useRef(0);

  const scramble = useCallback(() => {
    frame.current++;
    // settle one letter every 3 frames (~50ms at 60fps)
    if (frame.current % 3 === 0 && settled.current < target.length) {
      settled.current++;
    }
    const out = target
      .split("")
      .map((ch, i) => {
        if (ch === " ") return " ";
        if (i < settled.current) return ch;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join("");
    setDisplay(out);
    if (settled.current < target.length) {
      raf.current = requestAnimationFrame(scramble);
    } else {
      setDisplay(target);
    }
  }, [target]);

  useEffect(() => {
    if (!active) { setDisplay(target); return; }
    frame.current = 0;
    settled.current = 0;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(scramble);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, scramble]);

  return display;
}

// ── Recipe 21: typewriter for the terminal block ──────────────────────────────
const COMMANDS = [
  "npm run dev",
  "git push origin main",
  "vite build --mode prod",
  "docker compose up -d",
  "pnpm install --frozen",
];

function useTypewriter() {
  const [cmdIndex, setCmdIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "erasing">("typing");
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const cmd = COMMANDS[cmdIndex];
    let timer: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (displayed.length < cmd.length) {
        timer = setTimeout(() => setDisplayed(cmd.slice(0, displayed.length + 1)), 60);
      } else {
        timer = setTimeout(() => setPhase("hold"), 1800);
      }
    } else if (phase === "hold") {
      timer = setTimeout(() => setPhase("erasing"), 800);
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setCmdIndex((i) => (i + 1) % COMMANDS.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timer);
  }, [displayed, phase, cmdIndex]);

  return displayed;
}

// ── Recipe 10: mobile menu ────────────────────────────────────────────────────
// fd-pixel-sidebar-in: transform translate(-100%) → translate(0px), 180ms ease-out
// fd-fade-in: opacity 0 → 1, 300ms ease
function MobileMenu({
  open,
  onClose,
  navItems,
}: {
  open: boolean;
  onClose: () => void;
  navItems: { label: string; href: string }[];
}) {
  return (
    <>
      {/* Backdrop — fd-fade-in 300ms ease */}
      <div
        className={`mobile-backdrop${open ? " open" : ""}`}
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Sidebar — fd-pixel-sidebar-in 180ms ease-out */}
      <aside
        id="nd-sidebar-mobile"
        className={`mobile-menu${open ? " open" : ""}`}
        aria-label="Mobile navigation"
        data-state={open ? "open" : "closed"}
      >
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={onClose}>
              {item.label}
            </a>
          ))}
        </nav>
        <button className="mobile-close" onClick={onClose} aria-label="Close menu">
          ✕
        </button>
      </aside>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

// ── Header ────────────────────────────────────────────────────────────────────
function Header() {
  const profile = useProfile();
  const hidden = useHeaderHide();
  const active = useActiveSection(["home", "about", "projects", "contact"]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Recipe 9: transform translateY(-100%) on scroll-down, 180ms cubic-bezier(0.22,1,0.36,1) */}
      <header
        className="site-header"
        style={{
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <a className="brand" href="#home" aria-label="Home">
          <span className="brand-mark">{profile.initials}</span>
          <span>
            <strong>{profile.firstName}</strong>{" "}
            <strong>{profile.lastName}</strong>
          </span>
        </a>

        {/* Desktop nav — Recipe 1/13: active-link 150ms cubic-bezier(0.4,0,0.2,1) */}
        <nav className="nav-links" aria-label="Primary navigation">
          {profile.navItems.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = active === sectionId;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                style={{
                  background: isActive ? "rgba(255,255,255,0.055)" : undefined,
                  color: isActive ? "rgb(255,255,255)" : undefined,
                  transition:
                    "background 150ms cubic-bezier(0.4,0,0.2,1), color 150ms cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a className="talk-button" href="#contact">
            Get in touch
          </a>
          {/* Mobile hamburger */}
          <button
            className="hamburger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Recipe 10: mobile menu */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={profile.navItems}
      />
    </>
  );
}

// ── Social rail ───────────────────────────────────────────────────────────────
function SocialRail() {
  const profile = useProfile();
  return (
    <aside className="social-rail" aria-label="Social links">
      {profile.socialLinks.map((link) => {
        const Icon = getSocialIcon(link.label);
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            title={link.label}
            className={Icon ? "social-icon-link" : undefined}
          >
            {Icon ? <Icon aria-hidden="true" focusable="false" /> : link.short}
          </a>
        );
      })}
    </aside>
  );
}

// ── Terminal block (Recipes 21 typewriter + blink cursor) ─────────────────────
function TerminalBlock() {
  const cmd = useTypewriter();
  return (
    <div className="terminal-block" aria-hidden="true">
      <span className="terminal-prompt">$</span>
      <span className="terminal-cmd">{cmd}</span>
      <span className="terminal-cursor farm-terminal-cursor-blink" />
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
// Recipe 23: first name scrambles on mount (text-scramble, settles left→right)
function Hero() {
  const profile = useProfile();
  // Start scramble on mount; `active` triggers it
  const [scrambleActive, setScrambleActive] = useState(false);
  const scrambledFirst = useScrambleText(profile.firstName, scrambleActive);

  useEffect(() => {
    // Run scramble once on page load, after a short delay (matches farmjs ~948ms enter choreography)
    const t = setTimeout(() => setScrambleActive(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <main id="home" className="hero">
      <div className="hero-inner">
        {/* role label */}
        <div className="role-rail" aria-hidden="true">
          <span />
          <p>{profile.role}</p>
          <span />
        </div>

        {/* portrait */}
        <div className="portrait-wrap" aria-label="Portfolio portrait">
          <div className="portrait-glow" />
          <div className="portrait-frame">
            <DotPortrait
              image={profile.avatarImage}
              width={320}
              height={320}
              dotSpacing={5}
              maxDotRadius={3}
              minDotRadius={0.2}
              contrast={1.3}
            />
          </div>
          <div className="proof-badge">
            <p>"{profile.collaborationNote}"</p>
            <div className="avatar-stack" aria-hidden="true">
              {["A", "R", "K", "M", "S", "D"].map((item, i) => (
                <span key={`${item}-${i}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* hero copy */}
        <section className="hero-copy" aria-labelledby="hero-title">
          <p className="eyebrow">{profile.role}</p>

          {/* Recipe 23: scramble on h1 first name */}
          <h1 id="hero-title">
            <span
              className="hero-scramble"
              aria-label={profile.firstName}
            >
              {scrambledFirst}
            </span>
            {" "}{profile.lastName}
          </h1>

          <p className="headline">{profile.headline}</p>
          <p className="intro">{profile.intro}</p>

          {/* stat row */}
          <div className="stat-row font-tabular" aria-label="Quick stats">
            <div className="stat-card">
              <strong>{profile.projectCount}</strong>
              <span>Projects</span>
            </div>
            <div className="stat-card">
              <strong>{profile.teamCount}</strong>
              <span>Collaborators</span>
            </div>
            <div className="stat-card">
              <strong>{profile.yearsCount}</strong>
              <span>Years</span>
            </div>
          </div>

          {/* Recipe 21: terminal typewriter */}
          <TerminalBlock />

          {/* actions */}
          <div className="hero-actions">
            <a className="talk-button" href="#projects">
              View work
            </a>
            <a className="filled-btn" href="#contact">
              Say hello
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const profile = useProfile();
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-inner">
        <div className="about-bio">
          <p className="section-kicker">About</p>
          <h2 id="about-title">Who I am &amp; what I do.</h2>
          {profile.about.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <div className="experience-list">
            {profile.about.experience.map((exp) => (
              <div key={exp.company} className="experience-item">
                <div className="experience-meta">
                  <strong>{exp.role}</strong>
                  <span>{exp.company}</span>
                </div>
                <span className="experience-period">{exp.period}</span>
                <p>{exp.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-skills">
          {profile.about.skills.map((group) => (
            <div key={group.category} className="skill-group">
              <h3>{group.category}</h3>
              <ul>
                {group.items.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Device mockups ────────────────────────────────────────────────────────────
function DesktopScreen() {
  return (
    <div className="device desktop-device" aria-hidden="true">
      <div className="desktop-camera" />
      <div className="desktop-screen">
        <aside>
          <strong>FoodChe</strong>
          {["Dashboard", "Orders", "Apps", "Customers", "Stores", "Reports"].map(
            (row) => (
              <span key={row}>{row}</span>
            )
          )}
        </aside>
        <main>
          <div className="screen-topline" />
          <div className="metric-grid">
            {["44", "16", "1", "0", "7"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="table-lines">
            <span />
            <span />
            <span />
            <span />
          </div>
        </main>
      </div>
    </div>
  );
}

function LaptopScreen() {
  return (
    <div className="device laptop-device" aria-hidden="true">
      <div className="laptop-screen">
        <nav>
          <strong>Zeribes</strong>
          <span>Home</span>
          <span>Menu</span>
          <span>Orders</span>
          <span>Contact</span>
        </nav>
        <section>
          <p>#1 Food Delivery</p>
          <h3>Fresh and fast.</h3>
          <button>Start order</button>
        </section>
      </div>
      <div className="laptop-base" />
    </div>
  );
}

interface PhoneScreenProps {
  size?: "large" | "small" | "narrow";
  variant?: "grid" | "list";
}

function PhoneScreen({ size = "large", variant = "grid" }: PhoneScreenProps) {
  const items = Array.from(
    { length: variant === "list" ? 5 : 6 },
    (_, i) => i
  );
  return (
    <div
      className={`device phone-device phone-${size}`}
      aria-hidden="true"
    >
      <div className="phone-speaker" />
      <div className={`phone-screen phone-screen-${variant}`}>
        <div className="phone-hero" />
        <div className="phone-content">
          {items.map((i) => (
            <span key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function ProjectShowcase() {
  const profile = useProfile();
  const [index, setIndex] = useState(0);
  const projects = profile.projects;
  const project = projects[index];

  function prev() {
    setIndex((i) => (i - 1 + projects.length) % projects.length);
  }
  function next() {
    setIndex((i) => (i + 1) % projects.length);
  }

  return (
    <section
      id="projects"
      className="projects-page"
      aria-labelledby="projects-heading-title"
    >
      <div className="projects-heading">
        <p className="section-kicker">Projects</p>
        <h2 id="projects-heading-title">{profile.projectsIntro.title}</h2>
        <p>
          <strong>{profile.projectsIntro.lead}</strong>{" "}
          {profile.projectsIntro.body}
        </p>
      </div>

      <article
        className="project-card"
        aria-label={`Project: ${project.title}`}
      >
        <button
          className="project-arrow project-arrow-left"
          aria-label="Previous project"
          onClick={prev}
        >
          <FaArrowLeft aria-hidden="true" focusable="false" />
        </button>
        <button
          className="project-arrow project-arrow-right"
          aria-label="Next project"
          onClick={next}
        >
          <FaArrowRight aria-hidden="true" focusable="false" />
        </button>

        <div className="device-stage">
          <DesktopScreen />
          <LaptopScreen />
          <PhoneScreen />
          <PhoneScreen size="small" />
          <PhoneScreen variant="list" />
          <PhoneScreen size="narrow" variant="list" />
        </div>

        <div className="project-info">
          <div className="project-info-header">
            <div>
              <h3>{project.title}</h3>
              <p>
                <strong>{project.category}</strong> {project.summary}
              </p>
            </div>
            <div className="project-links">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Live site"
                >
                  <FaExternalLinkAlt aria-hidden="true" /> Live
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Source code"
                >
                  <FaGithub aria-hidden="true" /> Code
                </a>
              )}
            </div>
          </div>
        </div>

        <div
          className="project-tags"
          aria-label="Project technologies"
        >
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div
          className="project-counter"
          aria-label={`Project ${index + 1} of ${projects.length}`}
        >
          {projects.map((_, i) => (
            <button
              key={i}
              className={`project-dot${i === index ? " active" : ""}`}
              aria-label={`Go to project ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </article>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const profile = useProfile();
  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-title"
    >
      <div className="contact-inner">
        <div className="contact-copy">
          <p className="section-kicker">Contact</p>
          <h2 id="contact-title">{profile.contact.heading}</h2>
          <p>{profile.contact.subheading}</p>
          <span className="availability-badge">
            {profile.contact.availability}
          </span>
        </div>

        <div className="contact-actions">
          <a
            className="primary-action contact-email"
            href={`mailto:${profile.contact.email}`}
            aria-label="Send email"
          >
            {profile.contact.email}
          </a>
          <div className="contact-socials">
            {profile.socialLinks.map((link) => {
              const Icon = getSocialIcon(link.label);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                >
                  {Icon ? (
                    <Icon aria-hidden="true" focusable="false" />
                  ) : (
                    link.short
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const profile = useProfile();
  return (
    <footer className="site-footer">
      <span>{profile.footer.copy}</span>
      <nav aria-label="Footer navigation">
        {profile.navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const hash = window.location.hash;

  if (hash === "#dot-portrait-demo") {
    return (
      <Suspense fallback={null}>
        <DotPortraitDemo />
      </Suspense>
    );
  }
  if (hash === "#admin") {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <SocialRail />
      <Hero />
      <About />
      <ProjectShowcase />
      <Contact />
      <Footer />
    </div>
  );
}
