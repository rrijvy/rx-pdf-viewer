import { getDocument } from "pdfjs-dist";
// import pdfjs from "../pdfjs.js";
import { useEffect } from "react";

const PdfViewer = () => {
  useEffect(() => {
    console.log(getDocument);

    // (async function () {
    //   const pdfjs = await import("pdfjs-dist");
    //   console.log(typeof pdfjs.getDocument);
    //   // console.log(getDocument);
    // })();
  }, []);
  return <div className="rx-pdf-viewer">Pdf Viewer</div>;
};

export default PdfViewer;
