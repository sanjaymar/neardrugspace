import React, { useState, useEffect} from 'react';
import { Button, message, Tabs } from 'antd';
import { Table } from 'antd';
import { DownloadOutlined, } from '@ant-design/icons';
import resultstyles from '../../result.module.scss';
import { useParams } from 'react-router-dom';
function Reaction({activeTab}) {
    const [synthesisList, setSynthesisList] = useState({});
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
            fetchData2(id, token);
        } else if (!token) {
            message.error('用户未登录');
        } else if (!id) {
            message.error('任务 ID 未提供');
        }
    }, [id]); // 监听 id 的变化
    const fetchData2 = async (taskid, token) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/apiResult/examples/${taskid}`, {
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
                const synthesisList = data.data.synthesisList; // 解析 synthesisList 字段
                setSynthesisList(synthesisList); // 更新状态
                // 如果 synthesisList 为 null，则禁用按钮
                if (synthesisList === null && activeTab === 'reaction') {
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
    // 合成反应数据
    const data2 = Array.isArray(synthesisList) ? synthesisList.map((synthesisItem, index) => {
        const { chemicalCompound, synthesisProcessList } = synthesisItem;

        // 化合物表格数据
        const chemicalCompoundTable = [
            {
                index: index + 1, // 索引
                exampleId: chemicalCompound.exampleId || '', // 化合物的exampleId
                compoundId: chemicalCompound.compoundId || '', // 化合物的compoundId
                intermediateName: chemicalCompound.intermediateName || '', // 化合物的 intermediateName
                compoundName: chemicalCompound.compoundName || '', // 化合物的compoundName
                smiles: chemicalCompound.smiles || '', // 化合物的smiles
                referenceReactions: chemicalCompound.referenceReactions || '', // 化合物的referenceReactions
                // 表征信息转换为换行符间隔的字符串
                represent: [
                    chemicalCompound.pnmr ? `pnmr: ${chemicalCompound.pnmr}` : 'pnmr:',
                    chemicalCompound.ms ? `ms: ${chemicalCompound.ms}` : 'ms:',
                    chemicalCompound.ir ? `ir: ${chemicalCompound.ir}` : 'ir:',
                    chemicalCompound.uv ? `uv: ${chemicalCompound.uv}` : 'uv:',
                    chemicalCompound.mp ? `mp: ${chemicalCompound.mp}` : 'mp:',
                    chemicalCompound.rf ? `rf: ${chemicalCompound.rf}` : 'rf:',
                    chemicalCompound.analCalcd ? `analCalcd: ${chemicalCompound.analCalcd}` : 'analCalcd:',
                    chemicalCompound.lcms ? `lcms: ${chemicalCompound.lcms}` : 'lcms:',
                    chemicalCompound.hplc ? `hplc: ${chemicalCompound.hplc}` : 'hplc:',
                    chemicalCompound.hnmr ? `hnmr: ${chemicalCompound.hnmr}` : 'hnmr:',
                    chemicalCompound.cnmr ? `cnmr: ${chemicalCompound.cnmr}` : 'cnmr:',
                    chemicalCompound.fnmr ? `fnmr: ${chemicalCompound.fnmr}` : 'fnmr:',
                ]
                    .filter(Boolean) // 去除空值
                    .join('\n'), // 用换行符连接
                // 根据需求提取更多字段
                stucture: [
                    chemicalCompound.examplelabel ? `pnmr: ${chemicalCompound.examplelabel}` : 'examplelabel:',
                    chemicalCompound.reationproduct ? `reationproduct: ${chemicalCompound.reationproduct}` : 'reationproduct:',
                    chemicalCompound.staringmaterial ? `staringmaterial: ${chemicalCompound.staringmaterial}` : 'staringmaterial:',
                    chemicalCompound.reagentcatalyst ? `reagentcatalyst: ${chemicalCompound.reagentcatalyst}` : 'reagentcatalyst:',
                    chemicalCompound.solvent ? `solvent: ${chemicalCompound.solvent}` : 'solvent:',
                    chemicalCompound.times ? `times: ${chemicalCompound.times}` : 'times:',
                    chemicalCompound.temperature ? `temperature: ${chemicalCompound.temperature}` : 'temperature:',
                    chemicalCompound.yieldpercent ? `yieldpercent: ${chemicalCompound.yieldpercent}` : 'yieldpercent:',
                    chemicalCompound.yieldother ? `yieldother: ${chemicalCompound.yieldother}` : 'yieldother:',
                    chemicalCompound.othercompound ? `othercompound: ${chemicalCompound.othercompound}` : 'othercompound:'
                ]
                    .filter(Boolean) // 去除空值
                    .join('\n'), // 用换行符连接
                // 根据需求提取更多字段
            }
        ];

        // 合成过程表格数据
        const synthesisProcessTable = Array.isArray(synthesisProcessList) ? synthesisProcessList.map((step, stepIndex) => ({
            index: stepIndex + 1, // 步骤索引
            stepId: step.stepId || '', // 步骤ID
            stepCompound: step.stepCompound || '', // 步骤步骤化合物·
            stepDesc: step.stepDesc || '', // 步骤描述
            proReferenceReactions: step.proReferenceReactions || '', // 相关反应
            represent2: [
                step.proHNMR ? `proHNMR: ${step.proHNMR}` : 'proHNMR:',
                step.proCNMR ? `proCNMR: ${step.proCNMR}` : 'proCNMR:',
                step.proFNMR ? `proFNMR: ${step.proFNMR}` : 'proFNMR:',
                step.proPNMR ? `proPNMR: ${step.proPNMR}` : 'proPNMR:',
                step.proMS ? `proMS: ${step.proMS}` : 'proMS:',
                step.proIR ? `proIR: ${step.proIR}` : 'proIR:',
                step.proUV ? `proUV: ${step.proUV}` : 'proUV:',
                step.proMP ? `proMP: ${step.proMP}` : 'proMP:',
                step.proRF ? `proRF: ${step.proRF}` : 'proRF:',
                step.proAnalCalcd ? `proAnalCalcd: ${step.proAnalCalcd}` : 'proAnalCalcd:',
                step.proLCMS ? `proLCMS: ${step.proLCMS}` : 'proLCMS:',
                step.proHPLC ? `proHPLC: ${step.proHPLC}` : 'proHPLC:',
            ].filter(Boolean) // 去除空值
                .join('\n'), // 用换行符连接
            structure2: [
                step.proEXAMPLELABEL ? `proEXAMPLELABEL: ${step.proEXAMPLELABEL}` : 'proEXAMPLELABEL:',
                step.proREATIONPRODUCT ? `proREATIONPRODUCT: ${step.proREATIONPRODUCT}` : 'proREATIONPRODUCT:',
                step.proSTARINGMATERIAL ? `proSTARINGMATERIAL: ${step.proSTARINGMATERIAL}` : 'proSTARINGMATERIAL:',
                step.proREAGENTCATALYST ? `proREAGENTCATALYST: ${step.proREAGENTCATALYST}` : 'proREAGENTCATALYST:',
                step.proSOLVENT ? `proSOLVENT: ${step.proSOLVENT}` : 'proSOLVENT:',
                step.proTIMES ? `proTIMES: ${step.proTIMES}` : 'proTIMES:',
                step.proTEMPERATURE ? `proTEMPERATURE: ${step.proTEMPERATURE}` : 'proTEMPERATURE:',
                step.proYIELDPERCENT ? `proYIELDPERCENT: ${step.proYIELDPERCENT}` : 'proYIELDPERCENT:',
                step.proYIELDOTHER ? `proYIELDOTHER: ${step.proYIELDOTHER}` : 'proYIELDOTHER:',
            ].filter(Boolean)
                .join('\n'), // 用换行符连接
            // 根据需求提取更多字段
        })) : [];

        return {
            chemicalCompoundTable,
            synthesisProcessTable
        };
    }) : [];
    // 合成反应表格表头
    const columnsChemicalCompound = [
        {
            title: '化合物',
            dataIndex: 'field',
            key: 'field',
            width: '20%',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: ' ',
            dataIndex: 'details',
            key: 'details',
            width: '80%',
            render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
        },
    ];

    const columnsSynthesisProcess = [
        {
            title: '合成过程',
            dataIndex: 'field',
            key: 'field',
            width: '20%',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: ' ',
            dataIndex: 'details',
            key: 'details',
            width: '80%',
            render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
        },
    ];
    return (
        <div>
            <div className={resultstyles.reactionContainer}>
                {synthesisList === null ? (
                    // synthesisList 为空时显示无数据提示
                    <div className={resultstyles.noData}>
                        无数据
                    </div>
                ) : (
                    // 有数据时渲染表格
                    data2.map((item, index) => {
                        // 化合物信息表格数据
                        const reactionDetails = [
                            { key: '1', field: '化合物编号', details: item.chemicalCompoundTable.exampleId || 'null' },
                            { key: '2', field: '化合物ID', details: item.chemicalCompoundTable.compoundId || 'null' },
                            { key: '3', field: '化合物名称（1）', details: item.chemicalCompoundTable.intermediateName || 'null' },
                            { key: '4', field: '化合物名称（2）', details: item.chemicalCompoundTable.compoundName || 'null' },
                            { key: '5', field: '化合物结构', details: item.chemicalCompoundTable.smiles || 'null' },
                            { key: '6', field: '相关反应', details: item.chemicalCompoundTable.referenceReactions || 'null' },
                            { key: '7', field: '表征信息', details: item.chemicalCompoundTable.represent || 'null' },
                            { key: '8', field: '反应步骤结构化描述', details: item.chemicalCompoundTable.stucture || 'null' },
                        ];

                        // 合成过程表格数据
                        const reactionDetails2 = item.synthesisProcessTable.map((step, stepIndex) => [
                            { key: `${stepIndex + 1}-1`, field: '反应步骤编号', details: step.stepId || 'null' },
                            { key: `${stepIndex + 1}-2`, field: '反应步骤化合物', details: step.stepCompound || 'null' },
                            { key: `${stepIndex + 1}-3`, field: '反应步骤', details: step.stepDesc || 'null' },
                            { key: `${stepIndex + 1}-4`, field: '相关反应', details: step.proReferenceReactions || 'null' },
                            { key: `${stepIndex + 1}-5`, field: '表征信息', details: step.represent2 || 'null' },
                            { key: `${stepIndex + 1}-6`, field: '反应步骤结构化描述', details: step.structure2 || 'null' },
                        ]).flat();

                        return (
                            <div key={`compound-process-${index}`} className={resultstyles.tableWrapper}>
                                {/* 化合物表格 */}
                                <Table
                                    columns={columnsChemicalCompound}
                                    dataSource={reactionDetails}
                                    pagination={false}
                                    bordered
                                    loading={loading}
                                />

                                {/* 合成过程表格 */}
                                <Table
                                    columns={columnsSynthesisProcess}
                                    dataSource={reactionDetails2}
                                    pagination={false}
                                    bordered
                                    loading={loading}
                                />
                            </div>
                        );
                    })
                )}
            </div>
            <div className={resultstyles.downloadbutton}>
                <Button icon={<DownloadOutlined />} onClick={handleDownload} disabled={isDisabled}>下载</Button>
            </div>
        </div>
    );
}
export default Reaction;