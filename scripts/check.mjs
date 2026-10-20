// Verificação rápida antes de publicar: arquivos, link de inscrição e conteúdo.
import { readFile, access } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const files = [
  "index.html", "desafio/index.html",
  "assets/css/base.css", "assets/css/landing.css", "assets/css/quiz.css",
  "assets/js/config.js", "assets/js/content.js", "assets/js/game.js", "assets/js/landing.js", "assets/js/quiz.js", "assets/js/saas.js", "assets/js/scroll.js", "assets/js/board.js",
  "assets/images/igor-clt.jpg", "assets/images/igor-depois-01.jpg", "assets/images/igor-depois-02.jpg", "assets/images/igor-depois-03.jpg", "assets/images/igor-depois-04.jpg"
];
let problems = 0;
for (const f of files) {
  try { await access(new URL(f, root)); } catch { console.error(`Falta o arquivo: ${f}`); problems++; }
}
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(await readFile(new URL("assets/js/config.js", root), "utf8"), ctx);
vm.runInContext(await readFile(new URL("assets/js/content.js", root), "utf8"), ctx);
const C = ctx.window.CTL_CONTENT;
if (!ctx.window.CTL_CTA_URL || ctx.window.CTL_CTA_URL === "#") console.warn("Aviso: o link de inscrição ainda é \"#\". Edite assets/js/config.js.");
if (!C || C.questions.length !== 8) { console.error("O diagnóstico precisa de 8 perguntas."); problems++; }
for (const [i, q] of (C?.questions || []).entries()) if (q.a.length < 2 || q.a.length > 4) { console.error(`Pergunta ${i + 1}: use de 2 a 4 respostas.`); problems++; }
if ((C?.days || []).length < 2) { console.error("Faltam etapas em days."); problems++; }
console.log(problems ? `${problems} problema(s) encontrado(s).` : "Tudo certo.");
process.exit(problems ? 1 : 0);
