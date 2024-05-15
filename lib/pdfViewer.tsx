import { useEffect } from "react";

const RxPdfViewer = () => {
  useEffect(() => {
    (async function () {
      const pdfjsLib = await import("pdfjs-dist");
      console.log(pdfjsLib);
    })();
  }, []);

  return <div>Pdf Viewer</div>;
};

export default RxPdfViewer;
