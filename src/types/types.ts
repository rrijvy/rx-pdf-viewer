import { MouseEvent, ChangeEvent } from "react";
import useRxPdfViewer from "../hooks/useRxPdfViewer";

export type PdfViewerHookParams = {
  workerSrc: string;
  documentSrc: string | URL | ArrayBuffer;
};

export type RxPdfViewerHookType = ReturnType<typeof useRxPdfViewer>;

export type PdfViewerProps = {
  workerSrc: string;
  documentSrc: string | URL | ArrayBuffer;
  documentName?: string;
  showToolbar?: boolean;
};

export type PdfControlProps = {
  workerSrc: string;
  documentSrc: string | URL | ArrayBuffer;
  renderPreviousPage: (e: MouseEvent<HTMLButtonElement>) => void;
  renderNextPage: (e: MouseEvent<HTMLButtonElement>) => void;
  jumpToPage: (e: ChangeEvent<HTMLInputElement>) => void;
  zoomOut: (e: MouseEvent<HTMLButtonElement>) => void;
  zoomIn: (e: MouseEvent<HTMLButtonElement>) => void;
};

export type PdfPageViewerProps = {
  pdfViewerHook: RxPdfViewerHookType;
};
