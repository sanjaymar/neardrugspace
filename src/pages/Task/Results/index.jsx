import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Button, message, Table, Input } from 'antd';
import {  SearchOutlined } from '@ant-design/icons';
import { AiOutlineEdit, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import taskstyles from '../task.module.scss'
function Results() {
    const navigate = useNavigate();
      const [loading2, setLoading2] = useState(true);
      const [token, setUserToken] = useState('');
      const [taskData, settaskData] = useState([]);
      const [selectedRowKeys, setSelectedRowKeys] = useState([]);
      const [searchKeyword, setSearchKeyword] = useState('');
    
      useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setUserToken(storedToken);
          handleSearch(storedToken); // Fetch initial task data
        } else {
          message.error('用户未登录');
        }
      }, []);
    
      useEffect(() => {
        localStorage.setItem('taskData', JSON.stringify(taskData));
      }, [taskData]);
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
            // 处理查看详情的逻辑
  const handleEditNote = (record) => {
    const newNote = prompt("请输入新的备注内容：", record.notes || "");
    if (newNote !== null) {
      const updatedItem = { ...record, notes: newNote };
      updatetaskData(updatedItem);
    }
  };
  const handleViewDetails = (id) => {
    navigate(`/result/${id}`); // 跳转到 result 页面，并传递 id
  };
  const handleViewDetails2 = (id) => {
    navigate(`/markdown/${id}`); // 跳转到 result 页面，并传递 id
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
              onClick={() => handleViewDetails(record.id)}
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
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        // sorter: (a, b) => new Date(a.finishTime) - new Date(b.finishTime),
        resizable: true,
        render: (_, record) => (
          <Button
            type="primary"
            icon={<AiOutlineStar />}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white', width: '70%' }}
            onClick={() => handleViewDetails(record.id)}
          >
            查看详情
          </Button>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        // sorter: (a, b) => new Date(a.finishTime) - new Date(b.finishTime),
        resizable: true,
        render: (_, record) => (
          <Button
            type="primary"
            icon={<AiOutlineStar />}
            style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white', width: '70%' }}
            onClick={() => handleViewDetails2(record.id)}
          >
            PDF转Markdown
          </Button>
        ),
      },
    ];
  
    // 添加过滤逻辑
    const filteredData1 = taskData.filter(item =>
      Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
    return (
        <div className={taskstyles.container}>
            <div className={taskstyles.resultsSection}>
                <Input
                    placeholder="输入文件名搜索记录"
                    prefix={<SearchOutlined />}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className={taskstyles.selectinput}
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
        </div>
    );

}
export default Results