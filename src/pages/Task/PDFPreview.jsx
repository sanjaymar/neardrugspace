import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css'; // 确保文本层不会多余显示

// 设置 worker 路径为本地静态文件
pdfjs.GlobalWorkerOptions.workerSrc = '/public/pdf.worker.min.js?v=' + process.env.REACT_APP_VERSION;

function PDFPreview({ file }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Document
        file={file} // 直接传递文件对象
        onLoadSuccess={onDocumentLoadSuccess}
        loading={null} // 禁止显示加载信息
        noData={null} // 禁止显示无数据信息
        error={null} // 禁止显示错误信息
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={3.5} // 提高渲染的清晰度，默认是1，可以调整为1.5或更高
            width={400} // 可调整宽度以适配容器
          />
        ))}
      </Document>
    </div>
  );
}

export default PDFPreview;
