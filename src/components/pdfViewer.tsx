import pdfjsLib from "../pdf";
import pdfjsWeb from "../pdfWeb";
import { PDFDocumentProxy } from "pdfjs-dist";
import { FC, useEffect, useRef } from "react";
import { EventBus } from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";

type PdfViewerProps = {
  workerSrc: string;
  fileUrl: string;
};

const PdfViewer: FC<PdfViewerProps> = (props: PdfViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayeyRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PDFDocumentProxy>();
  const containerRef = useRef<HTMLElement>();
  const pageRendering = useRef(false);
  const pdfjs = useRef(false);
  const eventBusRef = useRef<EventBus>();

  useEffect(() => {
    (async (param: PdfViewerProps) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = props.workerSrc;
      const pdfUrl = props.fileUrl;
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      pdfRef.current = pdf;
      eventBusRef.current = new pdfjsWeb.EventBus();
      renderPage(1, 1);
    })(props);
  }, []);

  const renderPage = (pageNum: number, zoomLevel?: number) => {
    pageRendering.current = true;

    if (pdfRef.current && canvasRef.current) {
      let scale = zoomLevel || 1,
        canvas = canvasRef.current,
        ctx = canvasRef.current?.getContext("2d");

      pdfRef.current.getPage(pageNum).then((page) => {
        if (!ctx || !textLayeyRef.current) return;

        textLayeyRef.current.setAttribute("class", "textLayer");
        textLayeyRef.current.style.setProperty("--scale-factor", scale.toString());
        textLayeyRef.current.style.left = canvasRef.current?.offsetLeft + "px";
        textLayeyRef.current.style.top = canvasRef.current?.offsetTop + "px";

        let viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (containerRef.current && containerRef.current.clientWidth < viewport.width) {
          if (pdfContainerRef.current) pdfContainerRef.current.style.left = "0";
        } else {
          if (pdfContainerRef.current) pdfContainerRef.current.style.left = "auto";
        }

        let renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTask.promise
          .then(() => {
            pageRendering.current = false;
            return page.getTextContent();
          })
          .then((textContent) => {
            if (textLayeyRef.current)
              pdfjsLib.renderTextLayer({
                textContentSource: textContent,
                container: textLayeyRef.current,
                viewport: viewport,
                textDivs: [],
              });
          });
      });
    }
  };

  console.log("::: Pdf viewer loaded :::");

  return (
    <div className="pdf-viewer" ref={pdfContainerRef} style={{ position: "relative" }}>
      <canvas ref={canvasRef} />
      <div ref={textLayeyRef} />
    </div>
  );
};

export default PdfViewer;
