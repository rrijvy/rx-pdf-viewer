import { useEffect } from "react";
import { getDocument } from "pdfjs-dist";

const RxPdfViewer = () => {
  useEffect(() => {
    (async function () {
      // pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.mjs";
      console.log(typeof getDocument);
    })();
  }, []);

  return <div>Pdf Viewer</div>;
};

export default RxPdfViewer;
