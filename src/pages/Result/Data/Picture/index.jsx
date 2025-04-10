import React, { useState, useEffect } from 'react';
import { Button, message, Tabs } from 'antd';
import { Radio} from 'antd';
import { DownloadOutlined, } from '@ant-design/icons';
// 在需要使用表格的组件中
import resultstyles from '../../result.module.scss';
import { useParams } from 'react-router-dom';
const { TabPane } = Tabs;
function Picture({activeTab}) {
    const [imagesList, setImagesList] = useState({});
    const [isDisabled, setIsDisabled] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('2'); // 默认选中“反应机理图”
    const { id } = useParams(); // 获取路由参数 id
    const handleDownload = async () => {
        if (isDisabled) return; // 如果按钮被禁用，直接返回

        const token = localStorage.getItem('token');
        try {
            let url = ''; // 根据 activeTab 选择对应的接口

            switch (activeTab) {
                case 'bibliographic':
                    url = `/api/files/download/record/${id}`;
                    break;
                case 'molecular':
                    url = '/api/download/molecular';
                    break;
                case 'table':
                    url = '/api/download/table';
                    break;
                case 'reaction':
                    url = `/api/files/download/examples/${id}`;
                    break;
                case 'picture':
                    url = `/api/files/download/images/${id}`;
                    break;
                default:
                    console.error('未找到匹配的 key');
                    return;
            }

            // 发起请求下载数据
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            });

            if (!response.ok) {
                throw new Error(`下载失败，状态码: ${response.status}`);
            }

            const blob = await response.blob(); // 获取文件流
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${activeTab}_data_${new Date().toISOString()}.json`; // 设置文件名，可自定义
            link.click();
            window.URL.revokeObjectURL(link.href); // 释放 URL
            console.log(`${activeTab} 数据下载成功`);
        } catch (error) {
            console.error('下载数据失败:', error);
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        // const id = "200"
        if (token && id) {
            localStorage.setItem('storedTaskId', id); // 将 id 存储到 localStorage
            // 调用 fetchData 函数
            fetchData3(id, token);
        } else if (!token) {
            message.error('用户未登录');
        } else if (!id) {
            message.error('任务 ID 未提供');
        }
    }, [id]); // 监听 id 的变化
    // 请求查询图片数据
    const fetchData3 = async (taskid, token) => {

        try {
            const response = await fetch(`/api/apiResult/images/${taskid}`, {
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
                const imagesList = data.data.imagesList
                setImagesList(imagesList) // 更新状态
                // console.log(imagesList)
                if ((imagesList === null||imagesList.length===0) && activeTab === 'picture') {
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

        }
    };
    //图片数据
    const data3 = Array.isArray(imagesList) ? imagesList.map((image, index) => {
        return {
            index: index + 1, // 索引
            caption: image.caption || '', //图片描述
            img: image.img || '', //图片地址
            footnote: image.footnote || '', //图片脚注
            label: image.label || '', //图片标签
            // 根据需求提取更多字段
        };
    }) : [];
    // 初始化图片分类对象
    const categorizedImages = {

        2: { title: '反应机理图', images: [] },
        3: { title: '实验结果图', images: [] },
        4: { title: '化学表征图', images: [] },
    };

    // 将图片分类到对应的类型中
    if (Array.isArray(data3) && data3.length > 0) {
        data3.forEach((image) => {
            if (categorizedImages[image.label]) {
                categorizedImages[image.label].images.push(image);
            }
        });
    }
    return (
        <div>
            <div className={resultstyles.pictureContainer}>
                {/* 选择条 */}
                <Radio.Group
                    options={[
                        { label: '反应机理图', value: '2' },
                        { label: '实验结果图', value: '3' },
                        { label: '化学表征图', value: '4' },
                    ]}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />

                {/* 根据选择的类别渲染图片 */}
                <div className={resultstyles.imageList}>
                    {categorizedImages[selectedCategory].images.length > 0 ? (
                        categorizedImages[selectedCategory].images.map((image, index) => (
                            <div key={index} className={resultstyles.imageItem}>
                                <div className={resultstyles.caption}>{image.caption || '无标题'}</div>
                                <img
                                    src={`data:image/png;base64,${image.img || ''}`}
                                    alt={image.caption}
                                    className={resultstyles.image}
                                />
                                <div className={resultstyles.footnote}>{image.footnote || '无脚注'}</div>
                            </div>
                        ))
                    ) : (
                        <div className={resultstyles.noData}>
                            无数据
                        </div>
                    )}
                </div>
            </div>
            <div className={resultstyles.downloadbutton}>
                <Button icon={<DownloadOutlined />} onClick={handleDownload} disabled={isDisabled}>下载</Button>
            </div>
        </div>
    );
}
export default Picture;