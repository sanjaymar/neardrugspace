import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Divider } from 'antd';
import styles from './index.module.scss';

const Edit = () => {
  const [ketcherSmiles, setKetcherSmiles] = useState('');
  const ketcherFrameRef = useRef(null);
  const location = useLocation();
  
  // 从路由state获取初始SMILES
  const initialSmiles = location.state?.initialSmiles || '';

  useEffect(() => {
    const ketcherFrame = ketcherFrameRef.current;
    if (!ketcherFrame) return;
  
    const handleLoad = () => {
      setTimeout(() => {
        const ketcher = ketcherFrameRef.current.contentWindow.ketcher;
        if (ketcher) {
          ketcher.setMolecule(initialSmiles);
        } else {
          console.error('Ketcher 实例未找到');
        }
      }, 2000); // 适当延长延迟时间
    };
  
    // 添加 load 事件监听
    ketcherFrame.addEventListener('load', handleLoad);
    
    // 清理事件监听
    return () => {
      ketcherFrame.removeEventListener('load', handleLoad);
    };
  }, [initialSmiles]); // 依赖 initialSmiles 变化
  const getSmiles = async () => {
    try {
      const ketcher = ketcherFrameRef.current.contentWindow.ketcher;
      const result = await ketcher.getSmiles();
      setKetcherSmiles(result);
    } catch (error) {
      console.error('获取SMILES失败:', error);
    }
  };

  return (
    <div className={styles.molecule}>
      <div className={styles.flex}>
        <div className={styles.leftContent}>
          <iframe
            ref={ketcherFrameRef}
            className={styles.frame}
            title="ketcher-editor"
            src="./standalone/index.html"
            width="800"
            height="600"
          />
        </div>
        <div className={styles.rightContent}>
          <Divider />
          <Button type="primary" onClick={getSmiles}>
            获取SMILES
          </Button>
          <p className={styles.smilesResult}>{ketcherSmiles}</p>
        </div>
      </div>
    </div>
  );
};

export default Edit;