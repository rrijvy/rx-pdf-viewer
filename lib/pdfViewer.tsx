import { useEffect } from "react";
// pdf.worker.jsimport * as pdfjsLib from "pdfjs-dist";

const RxPdfViewer = () => {
  useEffect(() => {
    // (async function () {
    //   pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs";
    //   console.log(pdfjsLib);
    // })();
  }, []);

  return <div>Pdf Viewer</div>;
};

export default RxPdfViewer;
