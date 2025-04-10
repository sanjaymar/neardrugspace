import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Button, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PDFPreview2 from '../PDFPreview2.jsx';
const { Dragger } = Upload;
import taskstyles from '../task.module.scss'
function Collects() {
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
            handleSearch2(storedToken); // Fetch collected data
        } else {
            message.error('用户未登录');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('collectData', JSON.stringify(collectData));
    }, [collectData]);

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
    // 处理查看详情的逻辑
    const handleViewDetails = (id) => {
        navigate(`/result/${id}`); // 跳转到 result 页面，并传递 id
    };
    const filteredData2 = collectData.filter(item =>
        Object.keys(item).some(key =>
            String(item[key]).toLowerCase().includes(searchKeyword.toLowerCase())
        )
    );


    return (
        <div className={taskstyles.container}>
            <div className={taskstyles.collectSection}>
                <Input
                    placeholder="输入文件名搜索记录"
                    prefix={<SearchOutlined />}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className={taskstyles.selectinput}
                    allowClear
                />
                <div className={taskstyles.thumbnailGrid}>
                    {filteredData2.map((record) => (
                        <div key={record.id} className={taskstyles.thumbnailItem}>
                            <PDFPreview2
                                file={`http://172.20.137.175:90/files/${record.fileUrl}`}
                                isCollected={record.collect === 1} // 根据 collect 字段判断是否已收藏
                            />
                            <Button
                                type="primary"
                                className={taskstyles.viewDetailsButton}
                                onClick={() => handleViewDetails(record.id)} // 点击时传递 id
                            >
                                查看详情
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}
export default Collects