import resultstyles from '../../result.module.scss';
import React, { useState, useEffect } from 'react';
import { message,Button } from 'antd';
import { DownloadOutlined, } from '@ant-design/icons';
import { Table } from 'antd';
import { useParams } from 'react-router-dom';
function Bili({activeTab}) {
    const [record, setRecord] = useState({});
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // 获取路由参数 id
    const [isDisabled, setIsDisabled] = useState(false);
    
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
            fetchData(id, token);
        } else if (!token) {
            message.error('用户未登录');
        } else if (!id) {
            message.error('任务 ID 未提供');
        }
    }, [id]); // 监听 id 的变化
    const fetchData = async (taskid, token) => {
        setLoading(true);
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
                const record = data.data.record; // 解析 record 字段
                setRecord(record); // 更新状态
                if (record === null && activeTab === 'bibliographic') {
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
    // 著录数据
    const data = record ? {
        Patent_No: record.patentNumber || 'null',
        Date_of_Patent: record.dateOfPatent || 'null',
        Kind_code: record.kindCode || 'null',
        Publication_date: record.pubDate || 'null',
        Application_number: record.applicationNumber || 'null',
        Application_date: record.filingDate || 'null',
        PCT_application_number: record.pctNumber || 'null',
        PCT_application_date: record.pctApplicationData || 'null',
        PCT_publication_number: record.pctPubNo || 'null',
        PCT_publication_date: record.pctPubDate || 'null',
        Proprietors: record.roprietor || 'null',
        Applicants: record.proprietors || record.applicants || 'null',
        Inventors: record.inventors || 'null',
        agents: record.agents || 'null',
        IPCR_IPC_main_classification: record.ipcNumber || 'null',
        CPC_main_classification: record.cpcNumber || 'null',
        Invention_title: record.title || 'null',
        Abstract: record.abstract || 'null',
        Diseases: record.disease || 'null',
        Genes: record.genes || 'null',
        Mutations: record.Mutations || 'null'
    } : {
        Patent_No: '',
        Date_of_Patent: '',
        Kind_code: '',
        Publication_date: '',
        Application_number: '',
        Application_date: '',
        PCT_application_number: '',
        PCT_application_date: '',
        PCT_publication_number: '',
        PCT_publication_date: '',
        Proprietors: '',
        Applicants: '',
        Inventors: '',
        agents: '',
        IPCR_IPC_main_classification: '',
        CPC_main_classification: '',
        Invention_title: '',
        Abstract: '',
        Diseases: '',
        Genes: '',
        Mutations: ''
    };
    // 著录数据日期格式化
    let formatDate = (dateString) => {
        // 解析日期字符串并创建 Date 对象
        let date = new Date(dateString);

        // 检查日期是否合法
        if (isNaN(date)) {
            return ''; // 如果日期无效，返回空字符串
        }

        // 提取年份、月份和日期
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，+1调整
        let day = String(date.getDate()).padStart(2, '0');

        // 格式化为 YYYY.MM.DD
        return `${year}.${month}.${day}`;
    };
    // 著录数据名字地址格式化
    let formatName = (applicants) => {
        let applicantsArray;

        // 尝试将 applicants 解析为 JSON
        try {
            applicantsArray = JSON.parse(applicants);
        } catch (e) {
            return { inventors: '' };  // 解析失败返回空对象
        }

        // 确保 applicantsArray 是数组
        if (!Array.isArray(applicantsArray)) {
            return { inventors: '' };
        }

        let names = [];
        let addresses = [];

        // 遍历每个 applicant
        applicantsArray.forEach(applicant => {
            // 处理姓名中的特殊字符，如分号、破折号等
            let name = applicant.name || '';
            name = name.replace(/[—]/g, '');  // 去掉特殊字符，如“—”和分号
            names.push(name);
            // // 处理名字：先按空格分开，避免名字被错误分割
            // let nameParts = name.split(';').filter(part => part.trim() !== '');  // 过滤掉空的部分
            // if (nameParts.length > 1) {
            //   // 如果是多个名字，反转为 "姓 名" 格式
            //   names.push(`${nameParts[nameParts.length - 1]} ${nameParts[0]}`);  // 假设最后一个词是姓
            // } else {
            //   // 如果只有一个名字，直接添加
            //   names.push(name);
            // }

            // 处理地址：如果地址为 null 或空值，设置为 "未知"
            let location = applicant.location ? applicant.location.replace(/[\\$]/g, '').trim() : 'null';
            addresses.push(location); // 添加地址
        });

        // 拼接最终结果，确保最后一项不带逗号，使用分号分隔
        let result = [];
        for (let i = 0; i < names.length; i++) {
            result.push(`name:${names[i]}, address:${addresses[i]}`);
        }

        // 返回最终拼接的字符串，最后用分号隔开
        return {
            inventors: result.join(';\n')    // 用分号分隔每项
        };
    };
    let formattedProprietors = formatName(data.Proprietors);
    let formattedApplicants = formatName(data.Applicants);
    let formattedInventors = formatName(data.Inventors);
    let formattedAgents = formatName(data.agents);
    //著录表头
    const columns = [
        {
            title: 'Field',
            dataIndex: 'field',
            key: 'field',
            width: '20%',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Details',
            dataIndex: 'details',
            key: 'details',
            width: '80%',
            render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
        },
    ];
    // 著录表格具体数据
    const patentDetails = [
        { key: '1', field: 'Patent No', details: data.Patent_No.replace(/,/g, '') || 'null' },
        { key: '2', field: 'Date of Patent', details: formatDate(data.Date_of_Patent) || 'null' },
        { key: '3', field: 'Kind Code', details: data.Kind_code || 'null' },
        { key: '4', field: 'Publication Date', details: formatDate(data.Publication_date) || 'null' },
        { key: '5', field: 'Application Number', details: data.Application_number || 'null' },
        { key: '6', field: 'Application Date', details: formatDate(data.Application_date) || 'null' },
        { key: '7', field: 'PCT Application Number', details: data.PCT_application_number || 'null' },
        { key: '8', field: 'PCT Application Date', details: formatDate(data.PCT_application_date) || 'null' },
        { key: '9', field: 'PCT Publication Number', details: data.PCT_publication_number || 'null' },
        { key: '10', field: 'PCT Publication Date', details: formatDate(data.PCT_publication_date) || 'null' },
        { key: '11', field: 'Proprietors', details: formattedProprietors.inventors || 'null' },
        { key: '12', field: 'Applicants', details: formattedApplicants.inventors || 'null' },
        { key: '13', field: 'Inventors', details: formattedInventors.inventors || 'null' },
        { key: '14', field: 'Agents', details: formattedAgents.inventors || 'null' },
        { key: '15', field: 'IPCR/IPC Main Classification', details: data.IPCR_IPC_main_classification || 'null' },
        { key: '16', field: 'CPC Main Classification', details: data.CPC_main_classification || 'null' },
        { key: '17', field: 'Invention Title', details: data.Invention_title || 'null' },
        { key: '18', field: 'Abstract', details: data.Abstract || 'null' },
        { key: '19', field: 'Diseases', details: data.Diseases || 'null' },
        { key: '20', field: 'Genes', details: data.Genes || 'null' },
        { key: '21', field: 'Mutations', details: data.Mutations || 'null' }

    ];


    return (
        <div >
            {record === null ? ( // synthesisList 为空时显示无数据提示
                <div className={resultstyles.noData}>
                    无数据
                </div>) : (<div className={resultstyles.bibicontainer}><Table
                    className={resultstyles.bibtable}
                    columns={columns}
                    dataSource={patentDetails}
                    pagination={false}
                    bordered
                    loading={loading}
                /></div>
            )}
            <div className={resultstyles.downloadbutton}>
                <Button icon={<DownloadOutlined />} onClick={handleDownload} disabled={isDisabled}>下载</Button>
            </div>
        </div>
    );
}
export default Bili;