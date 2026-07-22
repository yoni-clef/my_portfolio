import { FaArrowLeft, FaArrowRight, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import type { IconType } from "react-icons";
import DotPortraitDemo from "./pages/DotPortraitDemo";
import { profile } from "./profile";

const socialIcons: Record<"GitHub" | "LinkedIn", IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
};

function getSocialIcon(label: string): IconType | undefined {
  if (label in socialIcons) {
    return socialIcons[label as keyof typeof socialIcons];
  }

  return undefined;
}

function Header() {
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

function SocialRail() {
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
          {Icon ? (
            <Icon aria-hidden="true" focusable="false" />
          ) : (
            link.short
          )}
        </a>
        );
      })}
    </aside>
  );
}

function Portrait() {
  const avatarItems = ["A", "R", "K", "M", "S", "D", "P", "L"];

  return (
    <div className="portrait-wrap" aria-label="Portfolio portrait area">
      <div className="portrait-glow" />
      <div className="portrait-frame">
        <div className="portrait-art">
          <div className="portrait-face">
            <span>{profile.initials}</span>
          </div>
          <div className="code-strip code-strip-one" />
          <div className="code-strip code-strip-two" />
          <div className="code-strip code-strip-three" />
        </div>
      </div>

      <div className="proof-badge">
        <p>"{profile.collaborationNote}"</p>
        <div className="avatar-stack" aria-hidden="true">
          {avatarItems.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <main id="home" className="hero">
      <div className="role-rail" aria-hidden="true">
        <span />
        <p>Full Stack</p>
        <strong>Developer</strong>
        <span />
      </div>

      <Portrait />

      <section className="hero-copy" aria-labelledby="hero-title">
        <p className="eyebrow">{profile.role}</p>
        <h1 id="hero-title">
          <span>{profile.firstName}</span>
          {profile.lastName}
        </h1>
        <p className="headline">{profile.headline}</p>
        <p className="intro">{profile.intro}</p>

        <div className="hero-actions">
          <a className="primary-action" href="#projects">
            Portfolio
          </a>
          <div className="stats" aria-label="Portfolio stats">
            <span>
              <strong>{profile.projectCount}</strong>
              Projects
            </span>
            <span>
              <strong>{profile.teamCount}</strong>
              Teams
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionPreview() {
  return (
    <section id="about" className="section-preview" aria-labelledby="about-title">
      <div>
        <p className="section-kicker">Selected Focus</p>
        <h2 id="about-title">Frontend systems, backend logic, and product polish.</h2>
      </div>
      <a href="#contact">Start a project</a>
    </section>
  );
}

function DesktopScreen() {
  const rows = ["Dashboard", "Orders", "Apps", "Customers", "Stores", "Reports"];

  return (
    <div className="device desktop-device" aria-hidden="true">
      <div className="desktop-camera" />
      <div className="desktop-screen">
        <aside>
          <strong>FoodChe</strong>
          {rows.map((row) => (
            <span key={row}>{row}</span>
          ))}
        </aside>
        <main>
          <div className="screen-topline" />
          <div className="metric-grid">
            {["44", "16", "1", "0", "7"].map((metric) => (
              <span key={metric}>{metric}</span>
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
  const items = Array.from({ length: variant === "list" ? 5 : 6 }, (_, index) => index);

  return (
    <div className={`device phone-device phone-${size}`} aria-hidden="true">
      <div className="phone-speaker" />
      <div className={`phone-screen phone-screen-${variant}`}>
        <div className="phone-hero" />
        <div className="phone-content">
          {items.map((item) => (
            <span key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectShowcase() {
  const project = profile.featuredProject;

  return (
    <section id="projects" className="projects-page" aria-labelledby="projects-title">
      <div className="projects-heading">
        <div className="projects-heading-copy">
          <h2>{profile.projectsIntro.title}</h2>
          <p>
            <strong>{profile.projectsIntro.lead}</strong> {profile.projectsIntro.body}
          </p>
        </div>
        <div className="projects-orb" aria-hidden="true">
          <span>Projects</span>
        </div>
      </div>

      <article className="project-card" aria-labelledby="projects-title">
        <button className="project-arrow project-arrow-left" aria-label="Previous project">
          <FaArrowLeft aria-hidden="true" focusable="false" />
        </button>
        <button className="project-arrow project-arrow-right" aria-label="Next project">
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
          <h3 id="projects-title">{project.title}</h3>
          <p>
            <strong>{project.category}</strong> {project.summary}
          </p>
        </div>

        <div className="project-tags" aria-label="Project technologies and outcomes">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </article>
    </section>
  );
}

export default function App() {
  if (window.location.hash === "#dot-portrait-demo") {
    return <DotPortraitDemo />;
  }

  return (
    <div className="app-shell">
      <Header />
      <SocialRail />
      <Hero />
      <SectionPreview />
      <ProjectShowcase />
    </div>
  );
}
