import path from "node:path";
import fs from "node:fs";

const pdfWorkerPath = path.join("node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");

fs.copyFileSync(pdfWorkerPath, "./public/pdf.worker.min.mjs");
