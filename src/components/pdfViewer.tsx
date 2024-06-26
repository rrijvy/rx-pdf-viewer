import pdfjsLib from "../pdf";
import { PDFDocumentProxy } from "pdfjs-dist";
import { FC, useEffect, useRef, MouseEvent, ChangeEvent } from "react";
import FaMinus from "./icons/faMinus";
import FaPlus from "./icons/faPlus";
import ArrowLeft from "./icons/arrowLeft";
import ArrowRight from "./icons/arrowRight";
import "pdfjs-dist/web/pdf_viewer.css";
import "../styles.css";

type PdfViewerProps = {
  workerSrc: string;
  fileUrl: string;
  showToolbar?: boolean;
};

const PdfViewer: FC<PdfViewerProps> = (props: PdfViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayeyRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PDFDocumentProxy>();
  const containerRef = useRef<HTMLElement>();
  const pageRendering = useRef(false);
  const pageControlRef = useRef<HTMLDivElement>(null);
  const zoomControlRef = useRef<HTMLDivElement>(null);
  const totalPagesRef = useRef<HTMLParagraphElement>(null);
  const zoomLevelRef = useRef<HTMLSpanElement>(null);
  const pageNoInputRef = useRef<HTMLInputElement>(null);
  const totalPageNo = useRef<number>(1);
  const currentPageNo = useRef<number>(1);
  const defaultScaleValue = useRef<number>(1);
  const currentScaleValue = useRef<number>(1);
  const ovserverRef = useRef<MutationObserver>();

  const config = { attributes: true, childList: true, subtree: true };

  const callback = (mutations: MutationRecord[], observer: MutationObserver) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        if (textLayeyRef.current && canvasRef.current) {
          textLayeyRef.current.style.left = canvasRef.current.offsetLeft + "px";
          textLayeyRef.current.style.top = canvasRef.current.offsetTop + "px";
        }
      }
    }
  };

  useEffect(() => {
    (async (param: PdfViewerProps) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = props.workerSrc;
      const pdfUrl = props.fileUrl;
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      pdfRef.current = pdf;
      if (totalPagesRef.current) {
        totalPageNo.current = pdf.numPages;
        totalPagesRef.current.innerHTML = pdf.numPages.toString();
      }
      ovserverRef.current = new MutationObserver(callback);
      if (canvasRef.current) {
        ovserverRef.current.observe(canvasRef.current, config);
      }
      renderPage(currentPageNo.current, currentScaleValue.current);
    })(props);

    return () => {
      ovserverRef.current?.disconnect();
    };
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

        if (zoomLevelRef.current && zoomLevel) {
          zoomLevelRef.current.innerHTML = zoomLevel.toString();
        }

        if (pageNoInputRef.current) {
          pageNoInputRef.current.value = pageNum.toString();
        }

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

  const renderPreviousPage = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pageRendering.current) return;
    if (currentPageNo.current > 1) {
      currentPageNo.current = currentPageNo.current - 1;
      renderPage(currentPageNo.current, currentScaleValue.current);
    }
  };

  const renderNextPage = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pageRendering.current) return;
    if (currentPageNo.current < totalPageNo.current) {
      currentPageNo.current = currentPageNo.current + 1;
      renderPage(currentPageNo.current, currentScaleValue.current);
    }
  };

  const zoomIn = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pageRendering.current) return;
    if (currentScaleValue.current <= 5) {
      currentScaleValue.current = currentScaleValue.current + 0.5;
      renderPage(currentPageNo.current, currentScaleValue.current);
    }
  };

  const zoomOut = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pageRendering.current) return;
    if (currentScaleValue.current > 0.5) {
      currentScaleValue.current = currentScaleValue.current - 0.5;
      renderPage(currentPageNo.current, currentScaleValue.current);
    }
  };

  const jumpToPage = (event: ChangeEvent<HTMLInputElement>): void => {
    if (pageRendering.current) return;
    if (event.target.value) {
      const value = parseInt(event.target.value);
      if (value >= 1 && value <= totalPageNo.current) {
        currentPageNo.current = value;
        renderPage(currentPageNo.current, currentScaleValue.current);
        if (pageNoInputRef.current) {
          pageNoInputRef.current.value = value.toString();
        }
      } else {
        if (pageNoInputRef.current) {
          pageNoInputRef.current.value = currentPageNo.current.toString();
        }
      }
    }
  };

  console.log("::: Pdf viewer loaded :::");

  return (
    <>
      {props.showToolbar && (
        <div className="toolbar">
          <div className="flex" ref={pageControlRef}>
            <button className="btn-icon mr" type="button" title="arrow left" onClick={renderPreviousPage}>
              <ArrowLeft />
            </button>
            <input className="mx" type="number" placeholder="0" onChange={jumpToPage} ref={pageNoInputRef} />
            <span className="mx">/</span>
            <span className="mx" ref={totalPagesRef}></span>
            <button className="btn-icon ml" type="button" title="arrow right" onClick={renderNextPage}>
              <ArrowRight />
            </button>
          </div>
          <div className="flex" ref={zoomControlRef}>
            <button className="btn-icon mr" type="button" title="minus" onClick={zoomOut}>
              <FaMinus />
            </button>
            <span className="mx" ref={zoomLevelRef} style={{ minWidth: "20px", textAlign: "center" }}>
              {"ZOOM LEVEL"}
            </span>
            <button className="btn-icon ml" type="button" title="plus" onClick={zoomIn}>
              <FaPlus />
            </button>
          </div>
        </div>
      )}
      <div
        className="pdf-viewer"
        ref={pdfContainerRef}
        style={{ position: "relative", width: "900px", height: "calc(100vh - 100px)", overflow: "auto" }}
      >
        <canvas ref={canvasRef} />
        <div ref={textLayeyRef} />
      </div>
    </>
  );
};

export default PdfViewer;
