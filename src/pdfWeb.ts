import * as pdfjsWebViewer from "pdfjs-dist/web/pdf_viewer.js";
import type PDFJSWEBVIEWER from "pdfjs-dist/web/pdf_viewer.d.ts";
const pdfjsWeb: typeof PDFJSWEBVIEWER = pdfjsWebViewer as unknown as typeof PDFJSWEBVIEWER;
console.log(pdfjsWeb);
export default pdfjsWeb;
