import { useEffect, useRef } from "react";
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, renderTextLayer } from "pdfjs-dist";

const RxPdfViewer = () => {
  const pdfRef = useRef<PDFDocumentProxy>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayeyRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>();
  const pageRendering = useRef(false);

  useEffect(() => {
    (async function () {
      GlobalWorkerOptions.workerSrc = window.location.origin + "/pdf.worker.min.js";
      console.log(GlobalWorkerOptions.workerSrc);
      const pdf = await getDocument(
        "https://p1stonimage.s3.amazonaws.com/ManualImportTemplate/dev/Baula+Ke+Banailo+Re+By+Humayun+Ahmed.pdf"
      ).promise;
      pdfRef.current = pdf;
      renderPage(1, 1);
    })();
  }, []);

  const renderPage = (pageNum: number, zoomLevel?: number) => {
    pageRendering.current = true;

    if (pdfRef.current && canvasRef.current) {
      let scale = zoomLevel || 1;
      let canvas = canvasRef.current;
      let ctx = canvasRef.current?.getContext("2d");

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
              renderTextLayer({
                textContentSource: textContent,
                container: textLayeyRef.current,
                viewport: viewport,
                textDivs: [],
              });
          });
      });
    }
  };

  return (
    <div ref={pdfContainerRef}>
      <canvas ref={canvasRef} />
      <div ref={textLayeyRef} />
    </div>
  );
};

export default RxPdfViewer;
