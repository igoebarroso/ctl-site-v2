import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".ico": "image/x-icon" };
const port = Number(process.env.PORT || 3000);

createServer(async (req, res) => {
  try {
    const rawPath = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
    let file = resolve(root, `.${rawPath}`);
    if (!file.startsWith(root + sep) && file !== root) throw new Error("Invalid path");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Página não encontrada.");
  }
}).listen(port, "127.0.0.1", () => console.log(`CTL disponível em http://127.0.0.1:${port}`));
