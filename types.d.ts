/// <reference types="pdfjs-dist/types/src/pdf.d.ts" />

declare module "pdfjs-dist/build/pdf.js" {
  import type PDFJS from "pdfjs-dist/types/src/pdf.d.ts";
  const pdfjs: typeof PDFJS;
  export default pdfjs;
}

declare module "pdfjs-dist/web/pdf_viewer.js" {
  import type PDFJSWEB from "pdfjs-dist/web/pdf_viewer.d.ts";
  const pdfjsWeb: typeof PDFJSWEB;
  export default pdfjsWeb;
}
