import { MouseEvent, FocusEvent, FC } from "react";
import { PdfPageViewerProps } from "../types";
import { ArrowLeft, ArrowRight, FaMinus, FaPlus } from "../assets/icons";

const PdfControl: FC<PdfPageViewerProps> = (props: PdfPageViewerProps) => {
  const { pdfViewerHook } = props;

  const renderPreviousPage = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pdfViewerHook.pdfControls.IsPageRendering) return;
    pdfViewerHook.pdfControls?.RenderPreviousPage();
  };

  const renderNextPage = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pdfViewerHook.pdfControls.IsPageRendering) return;
    pdfViewerHook.pdfControls?.RenderNextPage();
  };

  const zoomIn = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pdfViewerHook.pdfControls.IsPageRendering) return;
    pdfViewerHook.pdfControls?.ZoomIn();
  };

  const zoomOut = (event: MouseEvent<HTMLButtonElement>): void => {
    if (pdfViewerHook.pdfControls.IsPageRendering) return;
    pdfViewerHook.pdfControls?.ZoomOut();
  };

  const jumpToPage = (event: FocusEvent<HTMLInputElement>): void => {
    if (pdfViewerHook.pdfControls?.IsPageRendering) return;
    if (event.target.value) {
      const value = parseInt(event.target.value);
      pdfViewerHook.pdfControls?.JumpToPage(value);
      if (value >= 1 && value <= (pdfViewerHook.pdfControls?.TotalPages ?? 0)) {
        if (pdfViewerHook.refs.pageNoInput.current) {
          pdfViewerHook.refs.pageNoInput.current.value = value.toString();
        }
      } else {
        if (pdfViewerHook.refs.pageNoInput.current) {
          pdfViewerHook.refs.pageNoInput.current.value = (pdfViewerHook.pdfControls?.CurrentPageNumber ?? 1).toString();
        }
      }
    }
  };

  return (
    <div className="toolbar">
      <div className="flex">
        <button className="btn-icon mr" type="button" title="arrow left" onClick={renderPreviousPage}>
          <ArrowLeft />
        </button>
        <input className="mx" type="number" placeholder="0" onChange={jumpToPage} ref={pdfViewerHook.refs.pageNoInput} />
        <span className="mx">/</span>
        <span className="mx" ref={pdfViewerHook.refs.totalPages}></span>
        <button className="btn-icon ml" type="button" title="arrow right" onClick={renderNextPage}>
          <ArrowRight />
        </button>
      </div>
      <div className="flex" ref={pdfViewerHook.refs.zoomControl}>
        <button className="btn-icon mr" type="button" title="minus" onClick={zoomOut}>
          <FaMinus />
        </button>
        <span className="mx" ref={pdfViewerHook.refs.zoomLevel} style={{ minWidth: "20px", textAlign: "center" }}>
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
