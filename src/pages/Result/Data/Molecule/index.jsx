import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message, Tabs } from 'antd';
import { Table, Checkbox, Pagination, Radio, Modal } from 'antd';
import { DownloadOutlined, } from '@ant-design/icons';

import { StarOutlined, CopyOutlined, DeleteOutlined, PlusOutlined, SortAscendingOutlined } from '@ant-design/icons';
import {
    CalculatorOutlined,
    AreaChartOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';
import { FaMapMarkerAlt } from 'react-icons/fa';
// 在需要使用表格的组件中
import resultstyles from '../../result.module.scss';

import { useParams } from 'react-router-dom';
function Molecule({ activeTab }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isDisabled, setIsDisabled] = useState(false);
    const { id } = useParams(); // 获取路由参数 id
    const [molecular, setMolecular] = useState({});

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const handleDownload = async () => {
        if (isDisabled) return; // 如果按钮被禁用，直接返回

        const token = localStorage.getItem('token');
        try {
            let url = ''; // 根据 activeTab 选择对应的接口

            switch (activeTab) {
                case 'bibliographic':
                    url = `/api/files/download/record/${taskid}`;
                    break;
                case 'molecular':
                    url = '/api/download/molecular';
                    break;
                case 'table':
                    url = '/api/download/table';
                    break;
                case 'reaction':
                    url = `/api/files/download/examples/${taskid}`;
                    break;
                case 'picture':
                    url = `/api/files/download/images/${taskid}`;
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
            fetchData4(id, token);
        } else if (!token) {
            message.error('用户未登录');
        } else if (!id) {
            message.error('任务 ID 未提供');
        }
    }, [id]); // 监听 id 的变化
    const fetchData4 = async (taskid, token) => {
        try {
            const response = await fetch(`/api/apiResult/molecuar/${taskid}`, {
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
                const molecular = data.data.molecular; // 解析 molecular 字段
                setMolecular(molecular); // 更新状态
                setLoading(false);
            }
        } catch (error) {
            console.error('获取数据失败:', error);
        } finally {
        }
    };
    //分子数据
    // const data4 = Array.isArray(molecular) ? molecular.map((molecularItem, index) => {
    //   return {
    //     index: index + 1, // 索引
    //     structure: molecularItem.structure || '', // 化合物的structure
    //     code: molecularItem.code || '', // 化合物的code
    //     source: molecularItem.source || '', // 化合物的source
    //     property: molecularItem.property || '', // 化合物的property
    //     // 根据需求提取更多字段
    //   };
    // }) : [];


    const data4 = [
        { id: 1, structure: 'CCO', code: 'M001', source: 'Natural', property: 'Solvent' },
        { id: 2, structure: 'CCN', code: 'M002', source: 'Synthetic', property: 'Base' },
        { id: 3, structure: 'C=O', code: 'M003', source: 'Natural', property: 'Carbonyl' },
        { id: 4, structure: 'C#N', code: 'M004', source: 'Synthetic', property: 'Nitrile' },
        { id: 5, structure: 'C1=CC=CC=C1', code: 'M005', source: 'Natural', property: 'Aromatic' },
        { id: 6, structure: 'C(C(=O)O)N', code: 'M006', source: 'Synthetic', property: 'Amino Acid' },
        { id: 7, structure: 'C1CCCCC1', code: 'M007', source: 'Natural', property: 'Cyclohexane' },
        { id: 8, structure: 'C1=CC=C2C=CC=CC2=C1', code: 'M008', source: 'Synthetic', property: 'Polycyclic' },
        { id: 9, structure: 'C1=CN=CN1', code: 'M009', source: 'Natural', property: 'Heterocycle' },
        { id: 10, structure: 'C1=CC=C(C=C1)O', code: 'M010', source: 'Synthetic', property: 'Phenol' },
        { id: 11, structure: 'C1=CC=C(C=C1)Cl', code: 'M011', source: 'Natural', property: 'Chlorobenzene' },
        { id: 12, structure: 'C1=CC=C(C=C1)Br', code: 'M012', source: 'Synthetic', property: 'Bromobenzene' },
        { id: 13, structure: 'C1=CC=C(C=C1)I', code: 'M013', source: 'Natural', property: 'Iodobenzene' },
        { id: 14, structure: 'C1=CC=C(C=C1)F', code: 'M014', source: 'Synthetic', property: 'Fluorobenzene' },
        { id: 15, structure: 'C1=CC=C(C=C1)NO2', code: 'M015', source: 'Natural', property: 'Nitrobenzene' },
        { id: 16, structure: 'C1=CC=C(C=C1)NH2', code: 'M016', source: 'Synthetic', property: 'Aniline' },
        { id: 17, structure: 'C1=CC=C(C=C1)COOH', code: 'M017', source: 'Natural', property: 'Benzoic Acid' },
        { id: 18, structure: 'C1=CC=C(C=C1)CO', code: 'M018', source: 'Synthetic', property: 'Benzaldehyde' },
        { id: 19, structure: 'C1=CC=C(C=C1)CH3', code: 'M019', source: 'Natural', property: 'Toluene' },
        { id: 20, structure: 'C1=CC=C(C=C1)OCH3', code: 'M020', source: 'Synthetic', property: 'Anisole' },
    ];
    const handleSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: handleSelectChange,
    };
    const columns2 = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: () => (
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, auto)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Button icon={<StarOutlined />} size="small" type="link" style={{ padding: 0 }} />
                    <Button icon={<CopyOutlined />} size="small" type="link" style={{ padding: 0 }} />
                    <Button icon={<FaMapMarkerAlt />} size="small" type="link" style={{ padding: 0 }} />
                    <Button icon={<DeleteOutlined />} size="small" type="link" style={{ padding: 0 }} />
                </div>

            ),
        },
        {
            title: '化学结构',
            dataIndex: 'structure',
            key: 'structure',
            render: (text) => (
                <div className={resultstyles.chemicalStructure}>
                    {/* 在此插入图片或SVG来表示化学结构 */}
                    <img src="chemical_structure_placeholder.png" alt="结构图" style={{ width: '50px', height: 'auto' }} />
                </div>
            ),
        },
        {
            title: '编号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '来源',
            dataIndex: 'source',
            key: 'source',
        },
        {
            title: '其他属性',
            dataIndex: 'property',
            key: 'property',
        },
    ];
    // 分页变化时的回调
    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };


    // 返回对应的母核结构表格
    const expandedRowRender = (record) => {
        return (
            <Table
                columns={columns2}
                dataSource={data4}
                pagination={false}
                rowKey="id"
                bordered
                style={{ marginTop: '10px', height: '200px', overflow: 'auto' }}
            />
        );
    };
    return (
        <div>
            <div className={resultstyles.molecularcontainer}>
                {/* 顶部控制区 */}
                <div className={resultstyles.molecularControls}>
                    <Checkbox className={resultstyles.checkbox}>全选</Checkbox>
                    <div className={resultstyles.headerbutton}>
                        <Button type="primary" danger icon={<DeleteOutlined />} style={{ marginRight: '10px' }}>
                            删除无编号分子
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: '10px' }}>
                            批量删除
                        </Button>
                        <Button type="primary" >
                            *添加分子
                        </Button>
                    </div>
                </div>
                <div className={resultstyles.molecularTable}>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns2}
                        dataSource={data4.slice((currentPage - 1) * pageSize, currentPage * pageSize)} // 分页数据
                        pagination={false} // 禁用 Table 自带的分页
                        rowKey="id"
                        bordered
                        expandable={{ expandedRowRender, rowExpandable: () => true }}
                        onExpandedRowsChange={keys => setExpandedRowKeys(keys)}
                    />
                </div>
                {/* 单独放置的分页 */}
                <div className={resultstyles.paginationContainer}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={data4.length}
                        onChange={handlePageChange}
                        showSizeChanger
                        onShowSizeChange={handlePageChange}
                    />
                </div>
            </div>
            <div className={resultstyles.downloadbutton}>
                <Button icon={<DownloadOutlined />} onClick={handleDownload} disabled={isDisabled}>下载</Button>
            </div>
        </div>
    );
}
export default Molecule;