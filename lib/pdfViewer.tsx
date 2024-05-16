import { useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

console.log(pdfjsLib);

const RxPdfViewer = () => {
  useEffect(() => {
    (async function () {
      // const pdfjsLib = await import("pdfjs-dist");
      console.log(pdfjsLib);
    })();
  }, []);

  return <div>Pdf Viewer</div>;
};

export default RxPdfViewer;
