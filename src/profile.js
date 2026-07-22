export const profile = {
  // ── Identity ──────────────────────────────────────────────────────────────
  firstName: "Your",
  lastName: "Name",
  initials: "YN",
  role: "Full Stack Developer",
  headline: "I build clean, maintainable products with thoughtful user experiences.",
  intro:
    "My focus is shipping reliable web apps, writing readable code, and turning ideas into polished interfaces people can use with confidence.",
  collaborationNote: "Open to freelance work, product builds, and engineering teams.",
  avatarImage: "/images/myphotoed.png", // portrait for DotPortrait hero

  // ── Nav & Social ──────────────────────────────────────────────────────────
  navItems: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { label: "GitHub", short: "GH", href: "https://github.com/" },
    { label: "LinkedIn", short: "in", href: "https://linkedin.com/" },
    { label: "Dribbble", short: "db", href: "https://dribbble.com/" },
    { label: "Behance", short: "Be", href: "https://behance.net/" },
    { label: "Figma", short: "Fi", href: "https://figma.com/" },
  ],

  // ── Hero stats ────────────────────────────────────────────────────────────
  projectCount: "12+",
  teamCount: "8+",
  yearsCount: "5+",

  // ── About ─────────────────────────────────────────────────────────────────
  about: {
    bio: [
      "I'm a full stack developer who cares about both the code and the people using it. I've worked across startups and product teams, building everything from customer-facing apps to internal tools.",
      "I gravitate toward clean architecture, sensible abstractions, and interfaces that get out of the way. When I'm not building, I'm usually thinking about systems, design, or how the two fit together.",
    ],
    skills: [
      { category: "Frontend", items: ["React", "TypeScript", "Next.js", "CSS / Tailwind"] },
      { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "REST / GraphQL"] },
      { category: "Tooling", items: ["Git", "Docker", "Vite", "CI/CD"] },
      { category: "Design", items: ["Figma", "UI Systems", "Accessibility", "Prototyping"] },
    ],
    experience: [
      {
        role: "Senior Full Stack Developer",
        company: "Company Name",
        period: "2022 – Present",
        summary: "Leading product development across web and mobile, owning architecture decisions and mentoring junior engineers.",
      },
      {
        role: "Full Stack Developer",
        company: "Agency Name",
        period: "2019 – 2022",
        summary: "Built client products end-to-end — from scoping and design to deployment and handoff.",
      },
    ],
  },

  // ── Projects section header ───────────────────────────────────────────────
  projectsIntro: {
    title: "User-centered Development Approach Enhances Productivity and Drives Revenue Growth",
    lead: "Smart Development:",
    body: "I build product experiences that help businesses stand out with practical engineering, clear user flows, and dependable delivery. Each project is shaped around the people using it, the teams maintaining it, and the outcomes it needs to support.",
  },

  // ── Projects list ─────────────────────────────────────────────────────────
  projects: [
    {
      id: "foodche",
      title: "FoodChe PWA Web & Mobile Application",
      category: "Food Delivery Web & Mobile Application",
      summary:
        "A full food delivery platform with an admin panel, customer-facing progressive web app, and driver workflow. Designed for smooth ordering, operational clarity, and a backend structure that can grow with the business.",
      tags: [
        "Food Delivery App",
        "Progressive Web Application",
        "Mobile App",
        "NodeJS Backend",
        "Admin Panel",
        "Delivery App",
        "Customer Satisfaction",
        "Operational Efficiency",
        "Scalability",
        "Secure Infrastructure",
      ],
      liveUrl: "",
      repoUrl: "",
    },
    {
      id: "project-2",
      title: "Project Two Title",
      category: "Category — Type",
      summary: "Short description of what this project does, who it's for, and what makes it interesting.",
      tags: ["Tag One", "Tag Two", "Tag Three"],
      liveUrl: "",
      repoUrl: "",
    },
    {
      id: "project-3",
      title: "Project Three Title",
      category: "Category — Type",
      summary: "Short description of what this project does, who it's for, and what makes it interesting.",
      tags: ["Tag One", "Tag Two", "Tag Three"],
      liveUrl: "",
      repoUrl: "",
    },
  ],

  // ── Contact ───────────────────────────────────────────────────────────────
  contact: {
    heading: "Let's build something together.",
    subheading: "Whether it's a new product, a tricky engineering problem, or a team that needs an extra hand — reach out.",
    email: "hello@yourname.com",
    availability: "Available for new projects",
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    copy: "Designed & built by Your Name",
  },
};
