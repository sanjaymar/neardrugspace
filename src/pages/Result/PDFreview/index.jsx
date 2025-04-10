import { useState, useEffect } from 'react';
import resultstyles from '../result.module.scss'
import PDFPreview from '../PDFPreview.jsx'
import { Upload,message } from 'antd'
import { useParams } from 'react-router-dom';
const { Dragger } = Upload;
function PDF({fileurl}) {
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [boxes, setBoxes] = useState(false);
  const [imgList, setImgList] = useState([]);
  const [taskid, settaskid] = useState(null);
  const [loading,setLoading] = useState([]);
  const [isDisabled,setIsDisabled] = useState([]);
  const { id } = useParams(); // 获取路由参数 id
  useEffect(() => {
    setTimeout(() => {
      if (imgList && imgList.length > 0) {
        const boxes = imgList.map((img) => {
          const axisValues = img.axis.replace(/[[\]]/g, '').split(',').map(Number);
          return {
            pageNumber: axisValues[0], // 第几页
            x: axisValues[1],         // 左上角 x 坐标
            y: axisValues[2],         // 左上角 y 坐标
            width: axisValues[3] - axisValues[1], // 宽度（右下角 x - 左上角 x）
            height: axisValues[4] - axisValues[2], // 高度（右下角 y - 左上角 y）
          };
        });
        setBoxes(boxes);
      } else {
        setBoxes([]); // 如果imgList为空，清空boxes
      }
    }, 50000);
  }, [imgList]);
  useEffect(() => {
    // 模拟 PDF 渲染完成
    const timer = setTimeout(() => {
      setIsPdfReady(true);
    }, 5000); // 假设 PDF 渲染需要 3 秒

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('token');
    // const id = "200"
    if (token && id) {
      localStorage.setItem('storedTaskId', id); // 将 id 存储到 localStorage
      settaskid(id);
      fetchData5(id, token);
    } else if (!token) {
      message.error('用户未登录');
    } else if (!id) {
      message.error('任务 ID 未提供');
    }
  }, [id]); // 监听 id 的变化

  const fetchData5 = async (taskid, token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/apiResult/form/${taskid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.code === '200' && data.data) {
        const imgList = data.data.imgList
        setImgList(imgList) // 更新状态
        if (imgList === null && activeTab === 'table') {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
      } else {
        message.error(data.msg || "发生错误");
      }
    } catch (error) {
      console.error('Error:', error);
      message.error("获取数据时发生错误：" + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={resultstyles.left}>
      <Dragger
        fileList={fileurl ? [{ uid: '-1', name: fileurl, status: 'done' }] : []}
        className={resultstyles.draggerCustom}
        showUploadList={false}
        disabled
      >
        {isPdfReady ? <PDFPreview url={`http://172.20.137.175:90/files/${fileurl}`}
          boxes={boxes} /> : <div className={resultstyles.loading}>正在加载...</div>}
      </Dragger>
    </div >
  );
}
export default PDF;