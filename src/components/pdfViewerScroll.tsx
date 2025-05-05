import { FC, useEffect, useRef } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";
import pdfjsLib from "../pdf";

interface PdfThumbnailListProps {
  pdfDocument: PDFDocumentProxy | undefined;
  currentPage: number;
  onPageSelect: (pageNumber: number) => void;
}

const PdfViewerScroll: FC<PdfThumbnailListProps> = ({ pdfDocument, currentPage, onPageSelect }) => {
  const pdfPagesWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    renderPageList();

    return () => {
      if (pdfPagesWrapper.current) {
        pdfPagesWrapper.current.innerHTML = "";
      }
    };
  }, [pdfDocument]);

  useEffect(() => {
    // Highlight current page thumbnail
    if (pdfPagesWrapper.current) {
      const thumbnails = pdfPagesWrapper.current.querySelectorAll(".pdf-list-item");
      thumbnails.forEach((thumbnail, index) => {
        if (index + 1 === currentPage) {
          thumbnail.classList.add("active");
        } else {
          thumbnail.classList.remove("active");
        }
      });
    }
  }, [currentPage]);

  const renderPageList = () => {
    if (pdfDocument && pdfPagesWrapper.current) {
      // Clear existing content
      pdfPagesWrapper.current.innerHTML = "";

      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const newCanvas = document.createElement("canvas");
        const newDiv = document.createElement("div");
        newDiv.innerHTML = i.toString();
        newDiv.classList.add("pb");
        newCanvas.classList.add("pdf-list-item");
        if (i === currentPage) {
          newCanvas.classList.add("active");
        }

        newCanvas.addEventListener("click", () => {
          onPageSelect(i);
        });

        let scale = 0.18,
          canvas = newCanvas,
          ctx = newCanvas.getContext("2d");

        pdfDocument.getPage(i).then((page) => {
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

  return <div className="pdf-list-wrapper" ref={pdfPagesWrapper}></div>;
};

export default PdfViewerScroll;
