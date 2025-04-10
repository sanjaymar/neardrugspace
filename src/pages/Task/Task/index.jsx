import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Button, Form, message, Table, Input } from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import PDFPreview from '../PDFPreview.jsx';
import { AiOutlineEdit, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { render } from 'less';
import taskstyles from '../task.module.scss'
const { Dragger } = Upload;
function Task() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [markdown, setMarkdown] = useState('');
    const [taskid, setTaskid] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('createtask');
    const storedToken = localStorage.getItem('token');
    
  const handleFileChange = (info) => {
    setFile(info.file.originFileObj);
  };

  const handleSubmit = (token) => {
    if (!file) {
      message.error("请先上传文件。");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    fetch('/api/files/api', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'token': token
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.code === '200' && data.data) {
          const newTaskId = data.data.taskId;
          const newMarkdown = data.data.markdownResult;
          // 设置状态并存储到 localStorage
          setTaskid(newTaskId);
          setMarkdown(newMarkdown);
          localStorage.setItem('taskid', newTaskId); // 存储taskid
          localStorage.setItem('markdown', newMarkdown); // 存储markdown
          message.success("文件处理成功");
          // Refetch task data
          handleSearch(token);  // Fetch the updated task data
          setSelectedTab('results'); // Update selected tab after fetching
          navigate('/task/results'); // Navigate to results
        } else {
          message.error(data.msg || "发生错误");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        message.error("文件处理时发生错误：" + error.message);
      })
      .finally(() => setLoading(false));
  };
    return (
        <div className={taskstyles.container}>

            <div className={taskstyles.uploadSection}>
                <Form onFinish={() => handleSubmit(token)} >
                    <Dragger
                        onChange={handleFileChange}
                        fileList={file ? [{ uid: '-1', name: file.name, status: 'done' }] : []}
                        className={taskstyles.draggerCustom}
                        showUploadList={false}
                    >
                        {file ? (
                            <PDFPreview file={file} />
                        ) : (
                            <>
                                <p className="ant-upload-drag-icon">
                                    <UploadOutlined />
                                </p>
                                <p className="ant-upload-text">点击上传 PDF 文件</p>
                            </>
                        )}
                    </Dragger>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ marginTop: '10px', width: '100%' }}
                    >
                        提交
                    </Button>
                </Form>
            </div>
        </div>
    );

}
export default Task