import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';

const PdfViewer = ({ base64String }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Convert base64 string to a Blob
    const base64ToBlob = (base64, contentType = 'application/pdf', sliceSize = 512) => {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    };

    let blobUrl; // Declare blobUrl in outer scope for cleanup
    let renderTask; // To hold the current rendering task

    const renderPdf = async () => {
      const pdfBlob = base64ToBlob(base64String);
      blobUrl = URL.createObjectURL(pdfBlob); // Create an object URL from the Blob

      const loadingTask = pdfjsLib.getDocument(blobUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Cancel the previous render if a new one starts
      if (renderTask) {
        renderTask.cancel();
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      renderTask = page.render(renderContext);

      // Wait for the render to complete or catch cancellation
      renderTask.promise.catch((error) => {
        if (error instanceof pdfjsLib.RenderingCancelledException) {
          console.log("Rendering cancelled", error);
        } else {
          console.error("Rendering error", error);
        }
      });
    };

    renderPdf().catch(console.error);

    // Cleanup to release memory when component unmounts
    return () => {
      if (renderTask) {
        renderTask.cancel(); // Cancel any ongoing rendering task
      }
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [base64String]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PdfViewer;







import React, { useEffect, useRef } from 'react';





import * as pdfjsLib from 'pdfjs-dist/webpack';

const PdfViewer = ({ base64String }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Convert base64 string to a Blob
    const base64ToBlob = (base64, contentType = 'application/pdf', sliceSize = 512) => {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    };

    let blobUrl; // Declare blobUrl in outer scope for cleanup
    let renderTask; // To hold the current rendering task

    const renderPdf = async () => {
      const pdfBlob = base64ToBlob(base64String);
      blobUrl = URL.createObjectURL(pdfBlob); // Create an object URL from the Blob

      const loadingTask = pdfjsLib.getDocument(blobUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Cancel the previous render if a new one starts
      if (renderTask) {
        renderTask.cancel();
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      renderTask = page.render(renderContext);

      // Wait for the render to complete or catch cancellation
      renderTask.promise.catch((error) => {
        if (error instanceof pdfjsLib.RenderingCancelledException) {
          console.log("Rendering cancelled", error);
        } else {
          console.error("Rendering error", error);
        }
      });
    };

    renderPdf().catch(console.error);

    // Cleanup to release memory when component unmounts
    return () => {
      if (renderTask) {
        renderTask.cancel(); // Cancel any ongoing rendering task
      }
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [base64String]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PdfViewer;
