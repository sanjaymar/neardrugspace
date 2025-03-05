import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { StarFilled } from '@ant-design/icons'; // 引入五角星图标
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import styles from './index.module.scss'; // 引入 CSS 模块

// 设置 worker 路径为本地静态文件
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function PDFPreview2({ file, isCollected }) {
  return (
    <div className={styles.previewContainer}>
      {isCollected && ( // 如果已收藏，显示黄色五角星
        <div className={styles.starIcon}>
          <StarFilled style={{ color: 'gold', fontSize: '20px' }} />
        </div>
      )}
      <Document
        file={file}
        loading="正在加载 PDF..."
        noData="未找到 PDF 文件"
        error="加载 PDF 失败"
      >
        <Page pageNumber={1} width={200} /> {/* 只显示第一页 */}
      </Document>
    </div>
  );
}

export default PDFPreview2;