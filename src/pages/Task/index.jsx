import React, { useState, useEffect } from 'react';
import mainstyles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { Upload, Button, Form, message, Table,Input } from 'antd';
import { UploadOutlined,SearchOutlined } from '@ant-design/icons';
import TopNav from './TopNav';
import PDFPreview from './PDFPreview.jsx';
import { AiOutlineEdit, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
const { Dragger } = Upload;

function Task() { 
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [taskid, setTaskid] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [token, setUserToken] = useState('');
  const [taskData, settaskData] = useState([]);
  const [collectData, setcollectData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedTab, setSelectedTab] = useState('createtask');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setUserToken(storedToken);
      handleSearch(storedToken); // Fetch initial task data
      handleSearch2(storedToken); // Fetch collected data
    } else {
      message.error('用户未登录');
    }
  }, []);
  

  useEffect(() => {
    localStorage.setItem('taskData', JSON.stringify(taskData));
  }, [taskData]);

  useEffect(() => {
    localStorage.setItem('collectData', JSON.stringify(collectData));
  }, [collectData]);

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
  
  const handleSearch = (token) => {
    setLoading2(true);
    fetch('/api/analysis', {
      method: 'GET',
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
        settaskData(data.data);
      } else {
        message.error(data.msg || "发生错误");
      }
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => setLoading2(false));
  };

  const handleSearch2 = (token) => {
    setLoading2(true);
    fetch('/api/analysis/collect', {
      method: 'GET',
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
        setcollectData(data.data);
      } else {
        message.error(data.msg || "发生错误");
      }
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => setLoading2(false));
  };

  const updatetaskData = (updatedItem) => {
    setLoading2(true);
    const requestData = {
      id: updatedItem.id,
      userId: updatedItem.userId,
      fileName: updatedItem.fileName,
      notes: updatedItem.notes,
      status: updatedItem.status,
      createTime: updatedItem.createTime,
      finishTime: updatedItem.finishTime,
      collect: updatedItem.collect
    };

    fetch('/api/analysis', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'token': token
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.code === '200') {
        settaskData(prevData => 
          prevData.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item)
        );
        message.success("更新成功");
            // 更新完成后同步刷新收藏数据
      handleSearch2(token);
      } else {
        message.error(data.msg || "更新失败");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      message.error("更新失败：" + error.message);
    })
    .finally(() => setLoading2(false));
  };

  const handleEditNote = (record) => {
    const newNote = prompt("请输入新的备注内容：", record.notes || "");
    if (newNote !== null) {
      const updatedItem = { ...record, notes: newNote };
      updatetaskData(updatedItem);
    }
  };

  const toggleCollect = (record) => {
    const updatedItem = { ...record, collect: record.collect === 1 ? 0 : 1 };
    updatetaskData(updatedItem);
  };

  const columns = [
    {
      title: '',
      dataIndex: 'collect',
      key: 'collect',
      render: (_, record) => (
        <span onClick={() => toggleCollect(record)} style={{ cursor: 'pointer' }}>
          {record.collect === 1 ? <AiFillStar style={{ color: 'yellow' }} /> : <AiOutlineStar />}
        </span>
      )
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'filename',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      render: (_, record) => (
        <Button icon={<AiOutlineEdit />} onClick={() => handleEditNote(record)} />
      )
    },
    {
      title: '分析状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        status === '分析完成' ? (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white', width: '70%' }}
          >
            分析完成
          </Button>
        ) : (
          <Button
            type="danger"
            icon={<CloseCircleOutlined />}
            style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white', width: '70%' }}
          >
            分析失败
          </Button>
        )
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createtime',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      resizable: true
    },
    {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishtime',
      sorter: (a, b) => new Date(a.finishTime) - new Date(b.finishTime),
      resizable: true
    },
  ];
// 添加过滤逻辑
const filteredData1 = taskData.filter(item =>
  Object.keys(item).some(key =>
    String(item[key]).toLowerCase().includes(searchKeyword.toLowerCase())
  )
);
const filteredData2 = collectData.filter(item =>
  Object.keys(item).some(key =>
    String(item[key]).toLowerCase().includes(searchKeyword.toLowerCase())
  )
);
  const renderContent = () => {
    if (selectedTab === 'createtask') {
      return (
        <div className={mainstyles.uploadSection}>
          <Form onFinish={() => handleSubmit(token)} >
            <Dragger
              onChange={handleFileChange}
              fileList={file ? [{ uid: '-1', name: file.name, status: 'done' }] : []}
              className={mainstyles.draggerCustom}
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
      );
    } else if (selectedTab === 'results') {
      return (
        <div className={mainstyles.resultsSection}>
          <Input
            placeholder="输入文件名搜索记录"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className={mainstyles.selectinput}
            allowClear
          />
          <Table
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            columns={columns}
            dataSource={filteredData1}
            pagination={false}
            rowKey="id"
            bordered
            loading={loading2}
          />
        </div>
      );
    } else if (selectedTab === 'favorites') {
      return (
        <div className={mainstyles.collectSection}>
                    <Input
            placeholder="输入文件名搜索记录"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className={mainstyles.selectinput}
            allowClear
          />
          <Table
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            columns={columns}
            dataSource={filteredData2}
            pagination={false}
            rowKey="id"
            bordered
            loading={loading2}
          />
        </div>
      );
    }
  };

  return (
    <div className={mainstyles.container}>
      <TopNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {renderContent()}
    </div>
  );
}

export default Task;
