import { FC } from "react";
import { PdfPageViewerProps } from "../types";

const PdfPageViewer: FC<PdfPageViewerProps> = (props: PdfPageViewerProps) => {
  const { pdfViewerHook } = props;
  return (
    <>
      <canvas ref={pdfViewerHook.refs.canvas} />
      <div ref={pdfViewerHook.refs.textLayer} />
    </>
  );
};

export default PdfPageViewer;
