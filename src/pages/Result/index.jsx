import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {  message } from 'antd';
import PDF from './PDFreview'
import DataTabs from './Data'
// 在需要使用表格的组件中
import resultstyles from './result.module.scss';
import { useParams } from 'react-router-dom';
function Result() {
  const navigate = useNavigate();
  const [fileurl, setFile] = useState(null);
  const { id } = useParams(); // 获取路由参数 id
  useEffect(() => {
    const token = localStorage.getItem('token');
    // const id = "200"
    if (token && id) {
      localStorage.setItem('storedTaskId', id); // 将 id 存储到 localStorage
      // 调用 fetchData 函数
      fetchData(id, token);

    } else if (!token) {
      message.error('用户未登录');
    } else if (!id) {
      message.error('任务 ID 未提供');
    }
  }, [id]); // 监听 id 的变化


  const fetchData = async (taskid, token) => {

    try {
      const response = await fetch(`/api/apiResult/record/${taskid}`, {
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
        data.data.fileUrl = data.data.fileUrl.replace(/ /g, '');
        setFile(data.data.fileUrl);
      
       
      } else {
        message.error(data.msg || "发生错误");
      }
    } catch (error) {
      console.error('Error:', error);
      message.error("获取数据时发生错误：" + error.message);
    } finally {
    }
  };
  // 著录数据


  return (
    <div className={resultstyles.allcontainer} >
      {typeof fileurl == 'string' ? (
        <PDF fileurl={fileurl} />
      ) : (
        <div className="data-loading">等待数据加载...</div>
      )}

      {/* 右侧的选项卡内容 */}
      <div className={resultstyles.right}>
        <DataTabs />
      </div>
    </div>
  );
}

export default Result;
