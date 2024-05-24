import React, { useEffect } from "react";
import pdfjsLib from "pdfjs-dist";
import 'pdfjs-dist/web/pdf_viewer.css';

const PdfViewer = () => {
  useEffect(() => {
    console.log("::: Pdf Viewer");
    console.log(pdfjsLib);
  }, []);

  return <div>Pdf Viewer</div>;
};

export default PdfViewer;
