import React, { useRef, useEffect,useState } from 'react';
import { RemoteStructServiceProvider } from 'ketcher-core'
import { Ketcher } from 'ketcher-react';
import { Editor } from 'ketcher-react';
import styles from './index.module.scss';

const Edit = () => {
  const iframeRef = useRef(null);
  const [editorReady, setEditorReady] = useState(false);

  // 初始化分子编辑器
  useEffect(() => {
    const initEditor = () => {
      if (iframeRef.current) {
        const ketcher = iframeRef.current.contentWindow.ketcher;
        ketcher.setOptions({
          atomColoring: true,    // 原子着色显示
          stereoFlags: true,     // 立体化学标记
          tooltipDelay: 300      // 工具提示延迟
        });
        ketcher.setMolecule('C1=CC=C(C=C1)N'); // 初始化带氨基的苯环
        setEditorReady(true);
      }
    };

    const iframe = iframeRef.current;
    iframe.addEventListener('load', initEditor);
    return () => iframe.removeEventListener('load', initEditor);
  }, []);

  // 保存分子结构
  const handleSave = async () => {
    if (editorReady) {
      const ketcher = iframeRef.current.contentWindow.ketcher;
      try {
        const molfile = await ketcher.getMolfile();
        const svg = await ketcher.getSvg();  // 同时获取SVG预览
        console.log('保存数据:', { molfile, svg });
        window.parent.postMessage({ type: 'SAVE_STRUCTURE', payload: molfile }, '*');
      } catch (e) {
        console.error('保存失败:', e);
      }
    }
  };

  // 结构切换逻辑
  const navigateStructure = (direction) => {
    const ketcher = iframeRef.current.contentWindow.ketcher;
    const current = ketcher.getMolecule();
    const newStruct = direction === 'prev' 
      ? current.prevStructure 
      : current.nextStructure;
    ketcher.setMolecule(newStruct);
  };

  return (
    <div className={styles.container}>
      {/* 左侧结构控制面板 */}
      <div className={styles.controlPanel}>
        <div className={styles.structureNavigator}>
          <h3>结构导航</h3>
          <div className={styles.previewWrapper}>
            <img src="/preview-placeholder.png" alt="结构预览" />
            <div className={styles.navButtons}>
              <button onClick={() => navigateStructure('prev')}>←</button>
              <span className={styles.counter}>1/2</span>
              <button onClick={() => navigateStructure('next')}>→</button>
            </div>
          </div>
          
          {/* 定位管理工具组 */}
          <div className={styles.positioningTools}>
            <button onClick={() => iframeRef.current.contentWindow.ketcher.alignStructure()}>
              重新定位
            </button>
            <button onClick={() => iframeRef.current.contentWindow.ketcher.deleteSelected()}>
              删除定位
            </button>
            <button onClick={() => iframeRef.current.contentWindow.ketcher.addAttachmentPoint()}>
              新增定位
            </button>
          </div>
        </div>
      </div>

      {/* 核心编辑区域 */}
      <div className={styles.editorArea}>
        <iframe
          ref={iframeRef}
          src="/standalone/index.html"
          className={styles.editorFrame}
          allowFullScreen
          allow="clipboard-read; clipboard-write"
        />
      </div>

      {/* 操作状态栏 */}
      <div className={styles.actionBar}>
        <div className={styles.progress}>
          <span>完成度: 65%</span>
          <div className={styles.progressBar} />
        </div>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={() => window.history.back()}>
            取消
          </button>
          <button className={styles.confirm} onClick={handleSave}>
            确认修改
          </button>
        </div>
      </div>
    </div>
  );
};


export default Edit;
