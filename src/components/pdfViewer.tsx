import { getDocument } from "pdfjs-dist";
import { useEffect } from "react";

const PdfViewer = () => {
  useEffect(() => {
    console.log(getDocument);
  }, []);
  return <div className="rx-pdf-viewer">Pdf Viewer</div>;
};

export default PdfViewer;
