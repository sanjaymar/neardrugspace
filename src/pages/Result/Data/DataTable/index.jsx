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
import EditableTable from '../../EditableTable.jsx';
import { useParams } from 'react-router-dom';
function DataTable() {
    const [imgList, setImgList] = useState([]);
    const [isImagesVisible, setIsImagesVisible] = useState(true);
    const [smiles, setSmiles] = useState({});
    const { id } = useParams(); // 获取路由参数 id
    const [isDisabled, setIsDisabled] = useState(false);
    const [htmlList, setHtmlList] = useState([]);
    const [image,setImages] = useState([]);
    const [selectedTables,setSelectedTables]=useState([]);
    const [isMergeModalVisible,setIsMergeModalVisible]=useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        // const id = "200"
        if (token && id) {
            localStorage.setItem('storedTaskId', id); // 将 id 存储到 localStorage
            const smiles = "O=C=O";
            setSmiles(smiles);
            // 调用 fetchData 函数
            fetchData5(id, token);
        } else if (!token) {
            message.error('用户未登录');
        } else if (!id) {
            message.error('任务 ID 未提供');
        }
    }, [id]); // 监听 id 的变化
    // 监听 message 事件，接收 index2.html 发送的图片
    useEffect(() => {
        const handleMessage = (event) => {
            const { smiles, image } = event.data;
            if (smiles && image) {
                setImages((prev) => ({ ...prev, [smiles]: image }));
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);
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
    const fetchData5 = async (taskid, token) => {
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
                const htmlList = data.data.htmlList
                setImgList(imgList) // 更新状态
                setHtmlList(htmlList) // 更新状态
                if (imgList === null && activeTab === 'table' && htmlList === null) {
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
    const handleEdit = (smiles) => {
        navigate('/edit', {
            state: {
                initialSmiles: smiles,
                // 可以传递其他需要的数据
            }
        });
    };
    // 生成图片展示区域
    const renderImages = () => (
        <div className={`${resultstyles.tableImages} ${isImagesVisible ? resultstyles.visible : ''}`}>
            {imgList
                ?.sort((a, b) => a.id - b.id) // 按ID排序
                .map((img, index) => (
                    <div key={img.id} style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={`data:image/png;base64,${img.img}`}
                            alt={`实验图片-${img.id}`}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '5px',
                            fontSize: '14px',
                        }}>
                            {`Table ${index + 1}`}
                        </div>
                    </div>
                ))}
        </div>
    );
    //新增图表
    const handleAddTable = () => {
        const newTable = {
            id: `${htmlList.length + 1}`, // 生成唯一 ID
            html: `
          <table>
            <thead>
              <tr>
                <th>null</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>null</td>
              </tr>
            </tbody>
          </table>
        `, // 初始化表头和第一行
        };
        setHtmlList([...htmlList, newTable]);
    };
    //表格定位修改
    // 选择表格
    const handleSelectTable = (index) => {
        if (selectedTables.includes(index)) {
            setSelectedTables(selectedTables.filter(i => i !== index));
        } else {
            setSelectedTables([...selectedTables, index]);
        }
    };

    const normalizeTableHTML = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const table = doc.querySelector('table');

        // 确保 table 包含 thead 和 tbody
        if (!table.querySelector('thead')) {
            const thead = doc.createElement('thead');
            const headerRow = table.querySelector('tr');
            if (headerRow) {
                thead.appendChild(headerRow.cloneNode(true));
                table.insertBefore(thead, table.firstChild);
            }
        }

        if (!table.querySelector('tbody')) {
            const tbody = doc.createElement('tbody');
            Array.from(table.querySelectorAll('tr')).forEach((row) => {
                if (row.parentElement !== table.querySelector('thead')) {
                    tbody.appendChild(row.cloneNode(true));
                }
            });
            table.appendChild(tbody);
        }

        return table.outerHTML;
    };
    const handleMergeTables = () => {
        if (selectedTables.length < 2) {
            message.warning('请选择至少两个表格进行合并');
            return;
        }

        const [firstIndex, secondIndex] = selectedTables;
        const firstTableHtml = normalizeTableHTML(htmlList[firstIndex].html);
        const secondTableHtml = normalizeTableHTML(htmlList[secondIndex].html);

        // 解析 Table1 和 Table2 的 tbody 内容
        const parseTableBody = (htmlString) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const tbody = doc.querySelector('tbody');
            return tbody ? tbody.innerHTML : '';
        };

        const firstTableBody = parseTableBody(firstTableHtml);
        const secondTableBody = parseTableBody(secondTableHtml);
        // console.log(firstTableBody);
        // console.log(secondTableBody);
        // 合并两个表格的 tbody 内容
        const mergedHtml = firstTableHtml.replace('</tbody>', `${secondTableBody}</tbody>`);
        // console.log(mergedHtml);
        // 更新 Table1 的 html 内容
        const updatedHtmlList = htmlList.map((item, index) => {
            if (index === firstIndex) {
                return { ...item, html: mergedHtml }; // 更新 Table1 的 HTML
            }
            return item;
        });
        console.log(updatedHtmlList);
        setHtmlList(updatedHtmlList);
        setSelectedTables([]);
        setIsMergeModalVisible(false);
        message.success('表格合并成功');
    };

    return (
        <div>
            <div className={resultstyles.tableContainer}>
                {/* 图片栏 & 折叠控制 */}
                <div className={resultstyles.imageSection}>
                    {renderImages()}
                    {/* 始终显示的分割线控制栏 */}
                    <div className={resultstyles.collapseControl}>
                        <div className={resultstyles.dividerLine} />
                        <Button
                            onClick={() => setIsImagesVisible(!isImagesVisible)}
                            className={resultstyles.collapseButton}
                        >
                            {isImagesVisible ? '收起' : '展开'}
                        </Button>
                    </div>

                </div>

                <div className={resultstyles.resultContainer}>
                    {/* 表格顶部工具栏 */}
                    <div className={resultstyles.tableHeader}>
                        <div className={resultstyles.tableHeaderLeft}>
                            <div className={resultstyles.tableActions}>
                                <Button shape="circle" icon={<DeleteOutlined />} className={resultstyles.iconButton} />
                                <Button shape="circle" icon={<SortAscendingOutlined />} className={resultstyles.iconButton} />
                                <Button shape="circle" icon={<CalculatorOutlined />} className={resultstyles.iconButton} />
                                <Button shape="circle" icon={<AreaChartOutlined />} className={resultstyles.iconButton} onClick={() => setIsMergeModalVisible(true)} />
                                <Button shape="circle" icon={<DatabaseOutlined />} className={resultstyles.iconButton} />
                            </div>
                        </div>
                        <div className={resultstyles.tableHeaderRight}>
                            <Button className={resultstyles.primaryTextButton} onClick={handleAddTable}>
                                新增图表
                            </Button>
                            <Button className={resultstyles.primaryTextButton}>新增母核结构</Button>
                            <Button className={resultstyles.primaryTextButton} >
                                2D Structure
                            </Button>
                        </div>
                    </div>

                    {/* 母核结构展示区 */}
                    <div className={resultstyles.structureSection}>
                        <div className={resultstyles.molecularStructure}>
                            <div className={resultstyles.structurePreview}>
                                <iframe
                                    // title={`smiles-${record.id}`}
                                    src={`/index2.html?smiles=${encodeURIComponent(smiles)}`}
                                    width={120}
                                    height={100}
                                    style={{ border: "none", overflow: "hidden" }}
                                    scrolling="no"
                                />
                            </div>
                            <div className={resultstyles.structureInfo}>
                                <h3 className={resultstyles.structureTitle}>母核结构</h3>
                                <div className={resultstyles.structureActions}>
                                    <Button type="link" className={resultstyles.editButton} onClick={() => handleEdit(smiles)}>
                                        编辑
                                    </Button>
                                    <Button type="link" danger>
                                        删除
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={resultstyles.dataTable}>
                        {htmlList && htmlList.map((item, index) => {
                            return (
                                <div key={item.id} className={resultstyles.itemhtml}>
                                    <h3>Table {index + 1}</h3> {/* 显示索引，从 1 开始 */}
                                    <EditableTable
                                        htmlString={item.html}
                                        tableId={item.id}
                                        mergeTable={
                                            // 仅当该表格是被合并的目标时传递数据
                                            selectedTables[0] === index ? htmlList[selectedTables[1]]?.html : null
                                        }
                                    />
                                    {/* 合并表格的 Modal */}
                                    <Modal
                                        title="选择需要合并的表格"
                                        open={isMergeModalVisible}
                                        onOk={handleMergeTables}
                                        onCancel={() => setIsMergeModalVisible(false)}
                                    >
                                        {htmlList.map((item, index) => (
                                            <div key={index}>
                                                <Checkbox
                                                    checked={selectedTables.includes(index)}
                                                    onChange={() => handleSelectTable(index)}
                                                >
                                                    Table {index + 1}
                                                </Checkbox>
                                            </div>
                                        ))}
                                    </Modal>
                                </div>

                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={resultstyles.downloadbutton}>
                <Button icon={<DownloadOutlined />} onClick={handleDownload} disabled={isDisabled}>下载</Button>
            </div>
        </div>
    );
}
export default DataTable;