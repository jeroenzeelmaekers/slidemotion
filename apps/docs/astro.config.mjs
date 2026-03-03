import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "slidemotion",
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
