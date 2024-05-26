import * as pdfjs from "pdfjs-dist/build/pdf.js";
import type PDFJS from "pdfjs-dist/types/src/pdf.d.ts";
const pdfjsLib: typeof PDFJS = pdfjs as unknown as typeof PDFJS;
console.log(pdfjsLib);
export default pdfjsLib;
