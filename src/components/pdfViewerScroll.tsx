import { FC, useEffect, useRef } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";
import { PdfViewerProps } from "../types";
import ControlHelper from "../helpers/controlHelpers";
import pdfjsLib from "../pdf";

const PdfViewerScroll: FC<PdfViewerProps> = (props) => {
  const pdfPagesWrapper = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PDFDocumentProxy>();
  const ovserverRef = useRef<MutationObserver>();
  const controlHelperRef = useRef<ControlHelper>();
  
  useEffect(() => {
    (async () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = props.workerSrc;
      pdfRef.current = await pdfjsLib.getDocument(props.documentSrc).promise;
      renderPageList();
    })();

    return () => {
      ovserverRef.current?.disconnect();
    };
  }, []);

  const renderPageList = () => {
    if (pdfRef.current && pdfPagesWrapper.current && controlHelperRef.current) {
      for (let i = 1; i <= controlHelperRef.current.TotalPages; i++) {
        const newCanvas = document.createElement("canvas");
        const newDiv = document.createElement("div");
        newDiv.innerHTML = i.toString();
        newCanvas.classList.add("pdf-list-item");
        let scale = .8,
          canvas = newCanvas,
          ctx = newCanvas?.getContext("2d");
        pdfRef.current.getPage(i).then((page) => {
          if (!ctx) return;
          let viewport = page.getViewport({ scale: scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          let renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };
          page.render(renderContext);
        });
        pdfPagesWrapper.current.appendChild(newCanvas);
        pdfPagesWrapper.current.appendChild(newDiv);
      }
    }
  };

  const renderPage = (htmlCanvas: HTMLCanvasElement) => {
    if (pdfRef.current && htmlCanvas) {
      let scale = 1,
        canvas = htmlCanvas,
        ctx = htmlCanvas?.getContext("2d");

      pdfRef.current.getPage(pageNum).then((page) => {
        if (!ctx || !textLayeyRef.current) return;

        textLayeyRef.current.setAttribute("class", "textLayer");
        textLayeyRef.current.style.setProperty("--scale-factor", scale.toString());

        let viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTask.promise
          .then(() => {
            return page.getTextContent();
          })
          .then((textContent) => {
            if (textLayeyRef.current) {
              pdfjsLib
                .renderTextLayer({
                  textContentSource: textContent,
                  container: textLayeyRef.current,
                  viewport: viewport,
                  textDivs: [],
                })
                .promise.then(() => {
                  pageRendering.current = false;
                });
            }
          });
      });
    }
  };

  return <div className="pdf-list-wrapper" ref={pdfPagesWrapper}></div>;
};

export default PdfViewerScroll;
