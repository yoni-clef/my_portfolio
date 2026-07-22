import { useState, lazy, Suspense } from "react";
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

// ── Header ────────────────────────────────────────────────────────────────────
function Header() {
  const profile = useProfile();
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Home">
        <span className="brand-mark">{profile.initials}</span>
        <span>
          <strong>{profile.firstName}</strong>
          <strong>{profile.lastName}</strong>
        </span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        {profile.navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="talk-button" href="#contact">
        Light Up the Talk
      </a>
    </header>
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

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const profile = useProfile();
  return (
    <main id="home" className="hero">
      <div className="role-rail" aria-hidden="true">
        <span />
        <p>Full Stack</p>
        <strong>Developer</strong>
        <span />
      </div>

      <div className="portrait-wrap" aria-label="Portfolio portrait">
        <div className="portrait-glow" />
        <div className="portrait-frame">
          <DotPortrait
            image={profile.avatarImage}
            width={560}
            height={580}
            dotSpacing={6}
            maxDotRadius={4}
            minDotRadius={0.2}
            contrast={1.3}
          />
        </div>
        <div className="proof-badge">
          <p>"{profile.collaborationNote}"</p>
          <div className="avatar-stack" aria-hidden="true">
            {["A", "R", "K", "M", "S", "D", "P", "L"].map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="hero-copy" aria-labelledby="hero-title">
        <p className="eyebrow">{profile.role}</p>
        <h1 id="hero-title">
          <span>{profile.firstName}</span>
          {profile.lastName}
        </h1>
        <p className="headline">{profile.headline}</p>
        <p className="intro">{profile.intro}</p>

      </section>
    </main>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────


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
          {["Dashboard", "Orders", "Apps", "Customers", "Stores", "Reports"].map((row) => (
            <span key={row}>{row}</span>
          ))}
        </aside>
        <main>
          <div className="screen-topline" />
          <div className="metric-grid">
            {["44", "16", "1", "0", "7"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className="table-lines">
            <span /><span /><span /><span />
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
          <p>#1 Food Delivery Service</p>
          <h3>We deliver your favorite food fresh and fast.</h3>
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
  const items = Array.from({ length: variant === "list" ? 5 : 6 }, (_, i) => i);
  return (
    <div className={`device phone-device phone-${size}`} aria-hidden="true">
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
        <div className="projects-heading-copy">
          <h2 id="projects-heading-title">{profile.projectsIntro.title}</h2>
          <p>
            <strong>{profile.projectsIntro.lead}</strong>{" "}
            {profile.projectsIntro.body}
          </p>
        </div>
        <div className="projects-orb" aria-hidden="true">
          <span>Projects</span>
        </div>
      </div>

      <article className="project-card" aria-label={`Project: ${project.title}`}>
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

        <div className="project-tags" aria-label="Project technologies">
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
          <span className="availability-badge">{profile.contact.availability}</span>
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
