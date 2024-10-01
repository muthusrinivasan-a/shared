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

    const renderPdf = async () => {
      const pdfBlob = base64ToBlob(base64String);
      const blobUrl = URL.createObjectURL(pdfBlob); // Create an object URL from the Blob

      const loadingTask = pdfjsLib.getDocument(blobUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    };

    renderPdf().catch(console.error);

    // Clean up the URL object
    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [base64String]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PdfViewer;
