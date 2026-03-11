export type LinkItem = {
  href: string;
  label: string;
};

export type FeatureCard = {
  description: string;
  icon: string;
  title: string;
};

export type StepCard = {
  command: string;
  description: string;
  title: string;
};

export type FooterColumn = {
  links: LinkItem[];
  title: string;
};

export type BentoCard = {
  description: string;
  title: string;
};

const docsUrl = "https://docs.slidemotion.dev";
const githubUrl = "https://github.com/jeroenzeelmaekers/slidemotion";
const npmUrl = "https://www.npmjs.com/package/slidemotion";

export const marketingPage = {
  docsUrl,
  githubUrl,
  npmUrl,
  hero: {
    title: "Presentations that feel like code",
    description:
      "Build polished slide decks with React. Animate ideas, morph code, and run live terminal demos without leaving your editor.",
    primaryCta: { href: `${docsUrl}/installation/`, label: "Start with docs" },
    secondaryCta: { href: githubUrl, label: "View GitHub" },
  },
  nav: [
    { href: "#features", label: "Features" },
    { href: "#workflow", label: "Workflow" },
    { href: docsUrl, label: "Docs" },
    { href: githubUrl, label: "GitHub" },
  ],
  trustBar: {
    label: "A GOOD FIT FOR",
    items: ["DevRel teams", "Conference speakers", "OSS maintainers", "Educators", "Product engineers"],
  },
  featureBento: {
    eyebrow: "FEATURES",
    title: "Everything you need for code-first talks",
    description: "Compose slides in JSX, tune every transition, and keep code demos in lockstep with your narrative.",
    cards: [
      {
        title: "Code morphing that stays readable",
        description: "Animate edits across steps so your audience follows the story, not the diff noise.",
      },
      {
        title: "Terminal demos with actual timing",
        description: "Replay command output, reveal steps at your pace, and make shell demos feel rehearsed.",
      },
      {
        title: "Spring-driven motion primitives",
        description: "Use low-level animation tools when slides need more nuance than canned transitions.",
      },
    ] satisfies [BentoCard, BentoCard, BentoCard],
  },
  featureGrid: {
    eyebrow: "AND MORE",
    title: "Built for developer workflows",
    cards: [
      {
        icon: "<>",
        title: "JSX layouts",
        description: "Use familiar composition patterns, utilities, and design systems to build each slide with intent.",
      },
      {
        icon: "PR",
        title: "Presenter mode",
        description: "Speaker notes, timers, previews, and audience view stay one shortcut away while presenting.",
      },
      {
        icon: "{}",
        title: "Themes and syntax",
        description: "Ship a cohesive visual system with theme presets, CSS tokens, and Shiki-powered highlighting.",
      },
      {
        icon: "PDF",
        title: "PDF export",
        description: "Generate portable handouts and backup decks when the venue setup is less than ideal.",
      },
      {
        icon: "HMR",
        title: "Hot reload",
        description: "Iterate on slides at speed and keep presentation flow intact while tweaking copy or motion.",
      },
      {
        icon: "API",
        title: "Composable API",
        description: "Build with small primitives so your deck architecture can stay as simple or bespoke as needed.",
      },
    ] satisfies FeatureCard[],
  },
  steps: {
    eyebrow: "HOW IT WORKS",
    title: "Three steps to your next talk",
    items: [
      {
        title: "Install",
        command: "npm install slidemotion react react-dom",
        description: "Pull in the package, keep your existing React setup, and start from code instead of slides.",
      },
      {
        title: "Write JSX",
        command: "<Slide><Code /></Slide>",
        description: "Model slides with real components, hooks, and state so choreography stays close to the content.",
      },
      {
        title: "Present",
        command: "bun run dev",
        description: "Rehearse with hot reload, open presenter mode, and walk into the talk with confidence.",
      },
    ] satisfies StepCard[],
  },
  cta: {
    title: "Ready to build your next talk?",
    description: "Design decks with the same tools you already trust for product work.",
    primaryCta: { href: `${docsUrl}/quick-start/`, label: "Read quick start" },
    secondaryCta: { href: githubUrl, label: "Star on GitHub" },
  },
  footer: {
    tagline: "Code-first presentations for people who ship from the terminal.",
    columns: [
      {
        title: "Product",
        links: [
          { href: "#features", label: "Features" },
          { href: "#workflow", label: "Workflow" },
          { href: npmUrl, label: "npm package" },
        ],
      },
      {
        title: "Docs",
        links: [
          { href: docsUrl, label: "Introduction" },
          { href: `${docsUrl}/installation/`, label: "Installation" },
          { href: `${docsUrl}/quick-start/`, label: "Quick start" },
        ],
      },
      {
        title: "Community",
        links: [
          { href: githubUrl, label: "GitHub" },
          { href: `${githubUrl}/tree/main/examples`, label: "Examples" },
          { href: `${githubUrl}/issues`, label: "Issues" },
        ],
      },
    ] satisfies FooterColumn[],
  },
};
