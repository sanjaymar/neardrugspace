import React, { useState, useEffect, useRef } from 'react';
import resultstyles from './index.module.scss';
import { Upload, Button, Form, message, Tabs } from 'antd';
import { Table, Checkbox,  Pagination ,Radio} from 'antd';
import { UploadOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons';
import PDFPreview from './PDFPreview.jsx';
import { StarOutlined,CopyOutlined,DeleteOutlined,PlusOutlined } from '@ant-design/icons';
import { FaMapMarkerAlt } from 'react-icons/fa';

const { Dragger } = Upload;
const { TabPane } = Tabs;
function Result() {
  const [file, setFile] = useState(null);
  const [taskid, settaskid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bibliographic'); // 默认选中“著录数据”标签页
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [record, setRecord] = useState({ });
  const [synthesisList, setSynthesisList] = useState({ });
  const [imagesList, setImagesList] = useState({ });
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('reaction'); // 默认选中“反应机理图”
  // 判断登录情况
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // const storedTaskId = localStorage.getItem('taskid');
      const storedTaskId = "167";
      if (storedTaskId) {
        settaskid((storedTaskId));
        fetchData(storedTaskId, token);
        fetchData2(storedTaskId, token);
        fetchData3(storedTaskId, token);
      } else {
        message.error('用户未提交文件');
      }
    } else { 
      message.error('用户未登录');
    }
  }, []);
  
useEffect(() => {
  // 每次 activeTab 改变时检查 record 是否为空，并设置按钮状态
  if (activeTab === 'bibliographic' && record === null) {
    setIsDisabled(true);
  } else if (activeTab === 'reaction' && synthesisList === null) {
    setIsDisabled(true);
  } else if (activeTab === 'picture' && (imagesList === null||imagesList.length === 0)) {
    setIsDisabled(true);
  } else {
    setIsDisabled(false);
  }
}, [activeTab, record, synthesisList,imagesList]);
 // 下载函数
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
        url =  `/api/files/download/examples/${taskid}`;
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
// 请求查询著录数据
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
        setFile(data.data.fileUrl);
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
  // 请求查询合成反应数据
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
   // 请求查询图片数据
   const fetchData3 = async (taskid, token) => {
    setLoading(true);
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
        const imagesList =data.data.imagesList
        setImagesList(imagesList) // 更新状态
        if (imagesList === null && activeTab === 'picture') {
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
    PCT_publication_number:record.pctPubNo|| 'null',
    PCT_publication_date:record.pctPubDate|| 'null',
    Proprietors :record.roprietor|| 'null',
    Applicants: record.proprietors || record.applicants || 'null',
    Inventors: record.inventors || 'null',
    agents: record.agents|| 'null',
    IPCR_IPC_main_classification: record.ipcNumber || 'null',
    CPC_main_classification: record.cpcNumber || 'null',
    Invention_title: record.title || 'null',
    Abstract: record.abstract || 'null',
    Diseases:record.disease|| 'null',
    Genes:record.genes|| 'null',
    Mutations:record.Mutations|| 'null'
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
    Proprietors :'',
    Applicants: '',
    Inventors: '',
    agents: '',
    IPCR_IPC_main_classification: '',
    CPC_main_classification: '',
    Invention_title: '',
    Abstract: '',
    Diseases:'',
    Genes:'',
    Mutations:''
};
const handleSelectChange = (selectedRowKeys) => {
  setSelectedRowKeys(selectedRowKeys);
};
const rowSelection = {
  selectedRowKeys,
  onChange: handleSelectChange,
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
      intermediateName: chemicalCompound. intermediateName || '', // 化合物的 intermediateName
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
    stepDesc:   step.stepDesc || '', // 步骤描述
    proReferenceReactions: step.proReferenceReactions || '', // 相关反应
    represent2: [
      step.proHNMR? `proHNMR: ${step.proHNMR}` : 'proHNMR:',
      step.proCNMR? `proCNMR: ${step.proCNMR}` : 'proCNMR:',
      step.proFNMR? `proFNMR: ${step.proFNMR}` : 'proFNMR:',
      step.proPNMR? `proPNMR: ${step.proPNMR}` : 'proPNMR:',
      step.proMS? `proMS: ${step.proMS}` : 'proMS:',
      step.proIR? `proIR: ${step.proIR}` : 'proIR:',
      step.proUV? `proUV: ${step.proUV}` : 'proUV:',
      step.proMP? `proMP: ${step.proMP}` : 'proMP:',
      step.proRF? `proRF: ${step.proRF}` : 'proRF:',
      step.proAnalCalcd? `proAnalCalcd: ${step.proAnalCalcd}` : 'proAnalCalcd:',
      step.proLCMS? `proLCMS: ${step.proLCMS}` : 'proLCMS:',
      step.proHPLC? `proHPLC: ${step.proHPLC}` : 'proHPLC:',
    ] .filter(Boolean) // 去除空值
    .join('\n'), // 用换行符连接
    structure2:[
      step.proEXAMPLELABEL? `proEXAMPLELABEL: ${step.proEXAMPLELABEL}` : 'proEXAMPLELABEL:',
      step.proREATIONPRODUCT? `proREATIONPRODUCT: ${step.proREATIONPRODUCT}` : 'proREATIONPRODUCT:',
      step.proSTARINGMATERIAL? `proSTARINGMATERIAL: ${step.proSTARINGMATERIAL}` : 'proSTARINGMATERIAL:',
      step.proREAGENTCATALYST? `proREAGENTCATALYST: ${step.proREAGENTCATALYST}` : 'proREAGENTCATALYST:',
      step.proSOLVENT? `proSOLVENT: ${step.proSOLVENT}` : 'proSOLVENT:',
      step.proTIMES? `proTIMES: ${step.proTIMES}` : 'proTIMES:',
      step.proTEMPERATURE? `proTEMPERATURE: ${step.proTEMPERATURE}` : 'proTEMPERATURE:',
      step.proYIELDPERCENT? `proYIELDPERCENT: ${step.proYIELDPERCENT}` : 'proYIELDPERCENT:',
      step.proYIELDOTHER? `proYIELDOTHER: ${step.proYIELDOTHER}` : 'proYIELDOTHER:',
    ].filter(Boolean)
    .join('\n'), // 用换行符连接
    // 根据需求提取更多字段
  })) : [];

  return {
    chemicalCompoundTable,
    synthesisProcessTable
  };
}) : [];
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
// 著录数据
  const patentDetails = [
  { key: '1', field: 'Patent No', details: data.Patent_No.replace(/,/g, '')|| 'null'} ,
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
// 分子数据
  const molecularDetails = [
  { id: 1, structure: '结构1', code: '1', source: '2(P2/P8)', property: '-' },
  { id: 2, structure: '结构2', code: '2', source: '2(P2/P7)', property: '-' },
  { id: 3, structure: '结构3', code: '3', source: '2(P2/P8)', property: 'H-NMR:' },
  { id: 3, structure: '结构3', code: '3', source: '2(P2/P8)', property: 'H-NMR:' },
  { id: 3, structure: '结构3', code: '3', source: '2(P2/P8)', property: 'H-NMR:' },
  { id: 3, structure: '结构3', code: '3', source: '2(P2/P8)', property: 'H-NMR:' },
  // 添加更多示例数据...
];
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)' , 
      justifyContent: 'center', 
      alignItems: 'center'}}>
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

const expandedRowRender = (record) => {
  // 返回对应的母核结构表格
  return (
    <Table
      columns={columns2}
      dataSource={molecularDetails}
      pagination={false}
      rowKey="id"
      bordered
      style={{ marginTop: '10px', height: '200px', overflow: 'auto' }}
    />
  );
};


// 定义表格列
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
  const renderTabContent = () => {
    switch (activeTab) {
      case 'bibliographic':
        return ( <div >
        {record===null?( // synthesisList 为空时显示无数据提示
        <div style={{ textAlign: 'center', padding: '20px',fontWeight:'bold',fontSize:'20px',color:'#333'}}>
                -----著录无数据-----
        </div>):(<div  className={resultstyles.container}><Table
        className={resultstyles.bibtable}
        columns={columns}
        dataSource={patentDetails}
        pagination={false}
        bordered
        loading={loading}
      /></div>
    )}
      </div>
      );
      case 'molecular':
        return <div className={resultstyles.container}>
        {/* 顶部控制区 */}
        <div className={resultstyles.molecularControls}>
          <Checkbox style={{ marginRight: '300px',width:'100%'}}>全选</Checkbox>
          <Button type="primary" danger icon={<DeleteOutlined />} style={{ marginLeft: '10px' }}>
            删除无编号分子
          </Button>
          <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: '10px' }}>
            批量删除
          </Button>
          <Button type="primary" style={{ marginLeft: '10px' }}>
            *添加分子
          </Button>
        </div>
        <div className={resultstyles.molecularTable}>
        <Table
        rowSelection={rowSelection}
        columns={columns2}
        dataSource={molecularDetails}
        pagination={false}
        rowKey="id"
        bordered
        expandable={{ expandedRowRender, rowExpandable: () => true }}
        onExpandedRowsChange={keys => setExpandedRowKeys(keys)}
      />
      </div>
      {/* 分页控制 */}
      <Pagination
          current={currentPage}
          onChange={(page) => setCurrentPage(page)}
          total={molecularDetails.length * 20} // 假设总数据条数为每页20条的倍数
          pageSize={5}
          style={{ textAlign: 'center', marginTop: '10px' }}
        />
      </div>
      
      ;
      case 'table':
        return <div>表格内容</div>;
      // 渲染表格
      case 'reaction':
        return (
          <div style={{ height: '630px',
            overflow: 'auto', 
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', }}>
            {synthesisList === null ? (
              // synthesisList 为空时显示无数据提示
              <div style={{ textAlign: 'center', padding: '20px',fontWeight:'bold',fontSize:'20px',color:'#333'}}>
                -----合成反应无数据-----
              </div>
            ) : (
              // 有数据时渲染表格
              data2.map((item, index) => {
                // 化合物信息表格数据
                const reactionDetails = [
                  { key: '1', field: '化合物编号', details: item.chemicalCompoundTable[0].exampleId || 'null' },
                  { key: '2', field: '化合物ID', details: item.chemicalCompoundTable[0].compoundId || 'null' },
                  { key: '3', field: '化合物名称（1）', details: item.chemicalCompoundTable[0].intermediateName || 'null' },
                  { key: '4', field: '化合物名称（2）', details: item.chemicalCompoundTable[0].compoundName || 'null' },
                  { key: '5', field: '化合物结构', details: item.chemicalCompoundTable[0].smiles || 'null' },
                  { key: '6', field: '相关反应', details: item.chemicalCompoundTable[0].referenceReactions || 'null' },
                  { key: '7', field: '表征信息', details: item.chemicalCompoundTable[0].represent || 'null' },
                  { key: '8', field: '反应步骤结构化描述', details: item.chemicalCompoundTable[0].stucture || 'null' },
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
                  <div key={`compound-process-${index}`} style={{ marginBottom: '20px' }}>
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
        );
      case 'picture':
          // 初始化图片分类对象
          // 分类图片数据
          const categorizedImages = {
            reaction: [], // 反应机理图
            experiment: [], // 实验结果图
            characterization: [], // 化学表征图
          };

          if (Array.isArray(data3) && data3.length > 0) {
            data3.forEach((image) => {
              if (categorizedImages[image.label]) {
                categorizedImages[image.label].push(image);
              }
            });
          }
        
          return (
            <div className={resultstyles.pictureContainer}>
            {/* 选择条 */}
            <Radio.Group
              options={[
                { label: '反应机理图', value: 'reaction' },
                { label: '实验结果图', value: 'experiment' },
                { label: '化学表征图', value: 'characterization' },
              ]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
  
            {/* 根据选择的类别渲染图片 */}
            {categorizedImages[selectedCategory].map((image, index) => (
              <div key={index} style={resultstyles.imageItem}>
                <div style={resultstyles.caption}>{image.caption || '无标题'}</div>
                <img src={`data:image/png;base64,${image.img || ''}`} alt={image.caption} style={resultstyles.image} />
                <div style={resultstyles.footnote}>{image.footnote || '无脚注'}</div>
              </div>
            ))}
          </div>
          );
        
        
      default:
        return null;
    }
  };
  
  return (
    <div className={resultstyles.allcontainer} >
    <div className={resultstyles.left}>
      <Dragger
        fileList={file ? [{ uid: '-1', name: file, status: 'done' }] : []}
        className={resultstyles.draggerCustom}
        showUploadList={false}
        disabled
      >
          <PDFPreview url={`http://172.20.137.175:90/files/${file}`} />
      </Dragger>
    </div >
      {/* 右侧的选项卡内容 */}
      <div className={resultstyles.right}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="著录数据" key="bibliographic" />
          <TabPane tab="分子" key="molecular" />
          <TabPane tab="表格" key="table" />
          <TabPane tab="合成反应" key="reaction" />
          <TabPane tab="图片" key="picture" />
        </Tabs>

        <div >
          {renderTabContent()}
        </div>

        <div className={resultstyles.downloadbutton}>
          <Button icon={<DownloadOutlined /> } onClick={handleDownload}  disabled={isDisabled}>下载</Button>
        </div>
      </div>
    </div>
  );
}

export default Result;
