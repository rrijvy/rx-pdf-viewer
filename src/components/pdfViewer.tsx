import { useEffect } from "react";

const PdfViewer = () => {
  useEffect(() => {
    console.log("pdf loader");
  }, []);

  return <div className="rx-pdf-viewer">Pdf Viewer</div>;
};

export default PdfViewer;
