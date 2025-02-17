import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { message } from 'antd';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css'; // 确保文本层不会多余显示

// 设置 worker 路径为本地静态文件
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function PDFPreview({ url }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const onLoadError = (error) => {
    console.error('Error loading PDF:', error);
    message.error("无法加载 PDF 文件：" + error.message);
  };
  
  return (
    <div >
      <Document
        file={{ url }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onLoadError} // 添加错误处理
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={1.5}
            // width={400}
          />
        ))}
      </Document>
    </div>
  );
  
}

export default PDFPreview;