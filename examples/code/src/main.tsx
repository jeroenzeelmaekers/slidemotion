import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initHighlighterJavaScript } from "slidemotion";
import bashLang from "shiki/dist/langs/bash.mjs";
import tsxLang from "shiki/dist/langs/tsx.mjs";
import typescriptLang from "shiki/dist/langs/typescript.mjs";
import { App } from "./app.js";
import { orangeJuiceLight } from "./themes/orange-juice-light.js";

async function main() {
  await initHighlighterJavaScript({
    themes: [orangeJuiceLight],
    langs: [typescriptLang, tsxLang, bashLang],
  });

  const root = document.getElementById("root");

  if (!root) throw new Error("Missing #root element");

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void main();
