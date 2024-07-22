import pdfjsLib from "../pdf";
import { PDFDocumentProxy } from "pdfjs-dist";
import { useEffect, useRef } from "react";

type PdfViewerHookParams = {
  workerSrc: string;
  documentSrc: string | URL | ArrayBuffer;
};

export const useRxPdfViewer = (params: PdfViewerHookParams) => {
  const pdfRef = useRef<PDFDocumentProxy>();
  useEffect(() => {
    (async (params: PdfViewerHookParams) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = params.workerSrc;
      pdfRef.current = await pdfjsLib.getDocument(params.documentSrc).promise;
    })(params);
  }, [params.documentSrc]);
};
