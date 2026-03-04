import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initHighlighter } from "slidemotion";
import { orangeJuiceLight } from "./themes/orange-juice-light.js";
import { App } from "./app.js";

async function main() {
  await initHighlighter({
    themes: [orangeJuiceLight],
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
