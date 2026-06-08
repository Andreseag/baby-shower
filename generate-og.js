// generate-og.js
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import fs from "fs";

(async () => {
  console.log("🚀 Iniciando servidor temporal de Astro...");
  const astro = spawn("npx", ["astro", "preview", "--port", "8888"]);

  // Esperar un par de segundos a que el servidor levante
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("📸 Tomando captura de la OG-Image...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Ajustamos la pantalla al tamaño estándar de Open Graph
  await page.setViewport({ width: 1200, height: 630 });
  await page.goto("http://localhost:8888/og-image", {
    waitUntil: "networkidle0",
  });

  // Guardamos la imagen directamente en la carpeta public
  if (!fs.existsSync("./public")) fs.mkdirSync("./public");
  await page.screenshot({ path: "./public/og-image.png" });

  await browser.close();
  astro.kill();
  console.log("✅ ¡og-image.png generada con éxito en /public!");
  process.exit(0);
})();
