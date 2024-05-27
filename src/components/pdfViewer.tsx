import * as pdfjsLib from "pdfjs-dist";
import { FC } from "react";

type PdfViewerProps = {
  workerSrc: string;
};

const PdfViewer: FC<PdfViewerProps> = (props: PdfViewerProps) => {
  console.log(pdfjsLib);
  return (
    <div className="pdf-viewer">
      <p>Pdf Viewer</p>
    </div>
  );
};

export default PdfViewer;
