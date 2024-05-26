/// <reference types="pdfjs-dist/types/src/pdf.d.ts" />

declare module "pdfjs-dist/build/pdf.js" {
  import PDFJS from "pdfjs-dist/types/src/pdf.d.ts";
  const pdfjs: typeof PDFJS;
  export default pdfjs;
}
