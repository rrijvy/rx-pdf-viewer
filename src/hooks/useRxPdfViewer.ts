import pdfjsLib from "../pdf";
import ControlHelper, { RenderCallback } from "../helpers/controlHelpers";
import { useEffect, useRef } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";
import { PdfViewerHookParams } from "../types";

const useRxPdfViewer = (params: PdfViewerHookParams) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayeyRef = useRef<HTMLDivElement>(null);
  const pdfPagesWrapper = useRef<HTMLDivElement>(null);

  const pageNoInputRef = useRef<HTMLInputElement>(null);

  const totalPagesRef = useRef<HTMLParagraphElement>(null);
  const pageControlRef = useRef<HTMLDivElement>(null);
  const zoomControlRef = useRef<HTMLDivElement>(null);
  const zoomLevelRef = useRef<HTMLSpanElement>(null);

  const renderPage: RenderCallback = (pageNum: number, zoomLevel?: number) => {
    if (!controlHelperRef.current) return;

    controlHelperRef.current.IsPageRendering = true;

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
          .then(() => page.getTextContent())
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
                  if (controlHelperRef.current) {
                    controlHelperRef.current.IsPageRendering = false;
                  }
                });
            }
          });
      });
    }
  };

  const pdfRef = useRef<PDFDocumentProxy>();
  const controlHelperRef = useRef<ControlHelper>(new ControlHelper(renderPage));

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
    (async (params: PdfViewerHookParams) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = params.workerSrc;
      pdfRef.current = await pdfjsLib.getDocument(params.documentSrc).promise;

      if (totalPagesRef.current) {
        controlHelperRef.current.TotalPages = pdfRef.current.numPages;
        totalPagesRef.current.innerHTML = pdfRef.current.numPages.toString();
      }
      ovserverRef.current = new MutationObserver(callback);
      if (canvasRef.current) {
        ovserverRef.current.observe(canvasRef.current, config);
      }
      renderPage(controlHelperRef.current.CurrentPageNumber, controlHelperRef.current.CurrentScaleValue);
    })(params);
  }, [params.documentSrc]);

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

  return {
    pdfControls: controlHelperRef.current,
    refs: {
      canvas: canvasRef,
      textLayer: textLayeyRef,
      totalPages: totalPagesRef,
      pageNoInput: pageNoInputRef,
      pageControl: pageControlRef,
      zoomControl: zoomControlRef,
      zoomLevel: zoomLevelRef,
    },
  };
};

export default useRxPdfViewer;
