import pdfjsLib from "../pdf";
import { PDFDocumentProxy } from "pdfjs-dist";
import { useRef, MouseEvent, ChangeEvent, useEffect } from "react";
import FaMinus from "./icons/faMinus";
import FaPlus from "./icons/faPlus";
import ArrowLeft from "./icons/arrowLeft";
import ArrowRight from "./icons/arrowRight";

interface PdfControlProps {
  workerSrc: string;
  documentSrc: string | URL | ArrayBuffer;
  renderPreviousPage: (e: MouseEvent<HTMLButtonElement>) => void;
  renderNextPage: (e: MouseEvent<HTMLButtonElement>) => void;
  jumpToPage: (e: ChangeEvent<HTMLInputElement>) => void;
  zoomOut: (e: MouseEvent<HTMLButtonElement>) => void;
  zoomIn: (e: MouseEvent<HTMLButtonElement>) => void;
}

const PdfControl = (props: PdfControlProps) => {
  const pdfRef = useRef<PDFDocumentProxy>();
  const pdfControlRef = useRef<HTMLDivElement>(null);
  const zoomControlRef = useRef<HTMLDivElement>(null);
  const pageNoInputRef = useRef<HTMLInputElement>(null);
  const totalPagesRef = useRef<HTMLDivElement>(null);
  const zoomLevelRef = useRef<HTMLSpanElement>(null);

  const renderPreviousPage = (e: MouseEvent<HTMLButtonElement>) => {
    props.renderPreviousPage(e);
  };

  const renderNextPage = (e: MouseEvent<HTMLButtonElement>) => {
    props.renderNextPage(e);
  };

  const jumpToPage = (e: ChangeEvent<HTMLInputElement>) => {
    props.jumpToPage(e);
  };

  const zoomOut = (e: MouseEvent<HTMLButtonElement>) => {
    props.zoomOut(e);
  };

  const zoomIn = (e: MouseEvent<HTMLButtonElement>) => {
    props.zoomIn(e);
  };

  return (
    <div className="toolbar">
      <div className="flex" ref={pdfControlRef}>
        <button className="btn-icon mr" type="button" title="arrow left" onClick={renderPreviousPage}>
          <ArrowLeft />
        </button>
        <input className="mx" type="number" placeholder="0" onChange={jumpToPage} />
        <span className="mx">/</span>
        <span className="mx"></span>
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
  );
};

export default PdfControl;
