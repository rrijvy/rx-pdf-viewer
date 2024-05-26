import { jsx as _jsx } from "react/jsx-runtime";
import pdfjsLib from "./pdf";
import { useEffect, useRef } from "react";
const PdfViewer = (props) => {
    const canvasRef = useRef(null);
    const textLayeyRef = useRef(null);
    const pdfContainerRef = useRef(null);
    const pdfRef = useRef();
    const containerRef = useRef();
    const pageRendering = useRef(false);
    useEffect(() => {
        (async (param) => {
            pdfjsLib.GlobalWorkerOptions.workerSrc = props.workerSrc;
            const pdfUrl = "https://p1stonimage.s3.amazonaws.com/ManualImportTemplate/dev/Baula+Ke+Banailo+Re+By+Humayun+Ahmed.pdf";
            const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
            console.log("::: Pdf Viewer", pdfRef.current);
        })(props);
    }, []);
    console.log("::: Pdf viewer.");
    console.log("::: pdfjsLib - ", pdfjsLib);
    return _jsx("div", { children: "Pdf Viewer" });
};
export default PdfViewer;
//# sourceMappingURL=pdfViewer.js.map