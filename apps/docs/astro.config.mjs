import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "slidemotion",
      customCss: ["./src/styles/custom.css"],
      head: [
        {
          tag: "link",
          attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: "anonymous",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap",
          },
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/jeroenzeelmaekers/slidemotion",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "index" },
            { label: "Installation", slug: "installation" },
            { label: "Quick Start", slug: "quick-start" },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Components", slug: "guides/components" },
            { label: "Animation", slug: "guides/animation" },
            { label: "Code Slides", slug: "guides/code" },
            { label: "Theming", slug: "guides/theming" },
            { label: "Presenter", slug: "guides/presenter" },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "Overview", slug: "api/overview" },
          ],
        },
      ],
    }),
  ],
});
