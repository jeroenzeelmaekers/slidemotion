import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initHighlighter } from "slidemotion";
import { App } from "./app.js";
import { orangeJuiceLight } from "./themes/orange-juice-light.js";
import { orangeJuiceDark } from "./themes/orange-juice-dark.js";

async function main() {
  await initHighlighter({
    themes: [orangeJuiceLight, orangeJuiceDark],
    langs: ["typescript", "tsx", "bash"],
  });

  const root = document.getElementById("root");
  if (!root) throw new Error("Missing #root element");

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

main();
