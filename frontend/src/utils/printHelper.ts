/**
 * Renders an HTML container inside an isolated hidden iframe and triggers window.print().
 * This provides high-resolution, vector-accurate printing and "Save as PDF" output
 * without showing background page clutter, navigation headers, sidebars or URLs.
 */
export const printElement = (elementId: string, documentTitle = 'Document'): boolean => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for printing.`);
    return false;
  }

  // Create an invisible iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.title = 'Print Frame';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return false;
  }

  // Write base HTML with print-optimized styles
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${documentTitle}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
          *, *::before, *::after {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.4;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            text-align: left;
            vertical-align: top;
          }
          .border-t { border-top: 1px solid #e2e8f0; }
          .border-b { border-bottom: 1px solid #e2e8f0; }
          .border { border: 1px solid #e2e8f0; }
          .bg-slate-50 { background-color: #f8fafc; }
          .text-slate-500 { color: #64748b; }
          .text-slate-700 { color: #334155; }
          .text-slate-900 { color: #0f172a; }
          .font-semibold { font-weight: 600; }
          .font-bold { font-weight: 700; }
          .text-xs { font-size: 11px; }
          .text-sm { font-size: 13px; }
          .text-lg { font-size: 16px; }
          .text-xl { font-size: 18px; }
          .text-right { text-align: right; }
          .page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Wait for images to load before printing
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // Clean up after print dialog closes
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  }, 250);

  return true;
};
