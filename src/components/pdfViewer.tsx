// import * as pdfjsLib from "pdfjs-dist";
import { useEffect } from "react";

const PdfViewer = () => {
  useEffect(() => {
    (function () {
      // console.log(pdfjsLib);
    })();
  }, []);
  return <div className="rx-pdf-viewer">Pdf Viewer</div>;
};

export default PdfViewer;
