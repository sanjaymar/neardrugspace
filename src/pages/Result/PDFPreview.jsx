import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { message } from 'antd';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css'; // 确保文本层不会多余显示
import mainStyles from './result.module.scss';

// 设置 worker 路径为本地静态文件
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function PDFPreview({ url, boxes }) {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    // console.log(`PDF 总页数: ${numPages}`); // 输出 PDF 总页数
  };

  const onLoadError = (error) => {
    console.error('Error loading PDF:', error);
    message.error("无法加载 PDF 文件：" + error.message);
  };

  return (
    <div>
      <Document
        file={{ url }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onLoadError}
      >
        {Array.from(new Array(numPages), (el, index) => {
          const pageNumber = index + 1;
          const isBoxVisible = boxes && boxes.some((box) => box.pageNumber === pageNumber);

          // 调试输出
        //  / console.log('Boxes:', boxes);
          // console.log('Current Page:', pageNumber);
          // console.log('Is Box Visible:', isBoxVisible);

          return (
            <div key={`page_${pageNumber}`} style={{ position: 'relative' }}>
              <Page pageNumber={pageNumber} scale={2.7} width={228} />
              {isBoxVisible &&
                boxes
                  .filter((box) => box.pageNumber === pageNumber) // 过滤出当前页的 boxes
                  .map((box, index) => (
                    <div
                      key={index} // 确保每个 box 有唯一的 key
                      className={mainStyles.redbox}
                      style={{
                        position: 'absolute',
                        left: `${box.x}px`,
                        top: `${box.y}px`,
                        width: `${box.width}px`,
                        height: `${box.height}px`,
                      }}
                    />
                  ))}
            </div>
          );
        })}
      </Document>
    </div>
  );
}

export default PDFPreview;