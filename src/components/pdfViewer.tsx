import "pdfjs-dist/web/pdf_viewer.css";
import "../styles.css";
import pdfjsLib from "../pdf";
import ControlHelper, { RenderCallback } from "../helpers/controlHelpers";
import { PDFDocumentProxy } from "pdfjs-dist";
import { FC, useEffect, useRef, MouseEvent, FocusEvent } from "react";
import { PdfViewerProps } from "../types";
import { ArrowLeft, ArrowRight, FaMinus, FaPlus } from "../assets/icons";

const PdfViewer: FC<PdfViewerProps> = (props: PdfViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayeyRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfPagesWrapper = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PDFDocumentProxy>();
  const pageRendering = useRef(false);
  const zoomControlRef = useRef<HTMLDivElement>(null);
  const totalPagesRef = useRef<HTMLParagraphElement>(null);
  const zoomLevelRef = useRef<HTMLSpanElement>(null);
  const pageNoInputRef = useRef<HTMLInputElement>(null);
  const ovserverRef = useRef<MutationObserver>();

  const controlHelperRef = useRef<ControlHelper>();

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
      pdfRef.current = await pdfjsLib.getDocument(props.documentSrc).promise;
      controlHelperRef.current = new ControlHelper(renderPage);
      if (totalPagesRef.current) {
        controlHelperRef.current.TotalPages = pdfRef.current.numPages;
        totalPagesRef.current.innerHTML = pdfRef.current.numPages.toString();
      }
      ovserverRef.current = new MutationObserver(callback);
      if (canvasRef.current) {
        ovserverRef.current.observe(canvasRef.current, config);
      }
      renderPage(controlHelperRef.current.CurrentPageNumber, controlHelperRef.current.CurrentScaleValue);
      renderPageList();
    })(props);

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
        newDiv.classList.add("pb");
        newCanvas.classList.add("pdf-list-item");
        newCanvas.addEventListener("click", () => {
          renderPage(i, controlHelperRef.current?.CurrentScaleValue);
          if (controlHelperRef.current) {
            controlHelperRef.current.CurrentPageNumber = i;
          }
        });
        let scale = 0.18,
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

  const renderPage: RenderCallback = (pageNum: number, zoomLevel?: number) => {
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
    controlHelperRef.current?.RenderPreviousPage();
  };

  const renderNextPage = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pageRendering.current) return;
    controlHelperRef.current?.RenderNextPage();
  };

  const zoomIn = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pageRendering.current) return;
    controlHelperRef.current?.ZoomIn();
  };

  const zoomOut = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pageRendering.current) return;
    controlHelperRef.current?.ZoomOut();
  };

  const jumpToPage = (event: FocusEvent<HTMLInputElement>): void => {
    if (pageRendering.current) return;
    if (event.target.value) {
      const value = parseInt(event.target.value);
      controlHelperRef.current?.JumpToPage(value);
      if (value >= 1 && value <= (controlHelperRef.current?.TotalPages ?? 0)) {
        if (pageNoInputRef.current) {
          pageNoInputRef.current.value = value.toString();
        }
      } else {
        if (pageNoInputRef.current) {
          pageNoInputRef.current.value = (controlHelperRef.current?.CurrentPageNumber ?? 1).toString();
        }
      }
    }
  };

  console.log("::: Pdf viewer loaded :::");

  return (
    <div style={{ height: "100vh" }}>
      <div className="toolbar">
        <div className="flex px">
          <button className="btn-icon mr" type="button" title="arrow left" onClick={renderPreviousPage}>
            <ArrowLeft />
          </button>
          <input className="mx bg-Black" type="number" placeholder="0" onBlur={jumpToPage} ref={pageNoInputRef} />
          <span className="mx">/</span>
          <span className="mx" ref={totalPagesRef}></span>
          <button className="btn-icon ml" type="button" title="arrow right" onClick={renderNextPage}>
            <ArrowRight />
          </button>
        </div>
        <div className="flex px" ref={zoomControlRef}>
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
      <div className="pdf-viewer-wrapper">
        <div className="pdf-list-wrapper" ref={pdfPagesWrapper}></div>
        <div className="pdf-viewer" ref={pdfContainerRef}>
          <canvas ref={canvasRef} />
          <div ref={textLayeyRef} />
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
