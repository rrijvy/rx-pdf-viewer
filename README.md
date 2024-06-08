# rx-pdf-viewer

`rx-pdf-viewer` is a lightweight PDF viewer for React that allows text selection if available. It leverages the `pdfjs-dist` library under the hood to render PDFs.

## Features

- Render PDFs in your React applications.
- Supports text selection.
- Simple and easy to use.

## Installation

You can install `rx-pdf-viewer` via npm:

```bash
npm install rx-pdf-viewer
```

## Usage

To use `rx-pdf-viewer` in your React project, you need to import the `PdfViewer` component and provide a worker source and the URL of the PDF file you want to display.

```bash
import React from 'react';
import { PdfViewer } from 'rx-pdf-viewer';

function App() {
  return (
    <div className="App">
      <PdfViewer workerSrc={`${window.location.origin}/pdf.worker.min.js`} fileUrl="path/to/your/file.pdf" />
    </div>
  );
}

export default App;
```

## Props

The `PdfViewer` component requires the following props:

`workerSrc`: A string representing the URL to the PDF.js worker script. This must be provided.
`fileUrl`: A string representing the URL of the PDF file to be displayed.

## Example

Ensure you have the `pdf.worker.min.js` file available in your public directory or a location accessible via the URL you provide to `workerSrc`.

Here is an example of how you might set this up:

- Download the `pdf.worker.min.js` file from the `pdfjs-dist` repository or include it from a CDN.
- Place the `pdf.worker.min.js` file in your public directory.
- Provide the correct path to the workerSrc prop.

#### Download pdf.worker.min.js

You can download the `pdf.worker.min.js` file from the pdfjs-dist repository:

#### Using pdf.worker.min.js from a CDN

Alternatively, you can use a CDN to load the worker script:

```bash
<PdfViewer workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" fileUrl="path/to/your/file.pdf" />
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

## License

No license bro!

## Acknowledgements

This project uses the `pdfjs-dist` library for rendering PDF documents. Right now it uses 3.11.174.
