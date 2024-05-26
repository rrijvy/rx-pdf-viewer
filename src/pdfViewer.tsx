import pdfjsLib from "./pdf";
import { FC, useEffect, useRef } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";

type PdfViewerProps = {
  workerSrc: string;
};

const PdfViewer: FC<PdfViewerProps> = (props: PdfViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayeyRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PDFDocumentProxy>();
  const containerRef = useRef<HTMLElement>();
  const pageRendering = useRef(false);

  useEffect(() => {
    (async (param?: PdfViewerProps) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = props.workerSrc;
      const pdfUrl = "https://p1stonimage.s3.amazonaws.com/ManualImportTemplate/dev/Baula+Ke+Banailo+Re+By+Humayun+Ahmed.pdf";
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      console.log("::: Pdf Viewer", pdfRef.current);
    })(props);
  }, []);

  console.log("::: Pdf viewer.");
  console.log("::: pdfjsLib - ", pdfjsLib);

  return <div>Pdf Viewer</div>;
};

export default PdfViewer;
