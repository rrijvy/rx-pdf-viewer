import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from "pdfjs-dist";
import React, { useEffect, useRef } from "react";

type PdfViewerProps = {
  workerSrc: string;
};

const PdfViewer: React.FC<PdfViewerProps> = (props: PdfViewerProps) => {
  GlobalWorkerOptions.workerSrc = props.workerSrc;
  const pdfRef = useRef<PDFDocumentProxy>();

  useEffect(() => {
    const pdfUrl = "https://p1stonimage.s3.amazonaws.com/ManualImportTemplate/dev/Baula+Ke+Banailo+Re+By+Humayun+Ahmed.pdf";
    getDocument(pdfUrl);
    console.log("::: Pdf Viewer", pdfRef.current);
  }, []);

  return <div>Pdf Viewer</div>;
};

export default PdfViewer;
