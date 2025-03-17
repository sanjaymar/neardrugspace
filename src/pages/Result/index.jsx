import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Upload, Button, Form, message, Tabs } from 'antd';
import { Table, Checkbox,  Pagination ,Radio,Modal} from 'antd';
import { UploadOutlined, SaveOutlined, DownloadOutlined,FilterOutlined,EditOutlined } from '@ant-design/icons';
import PDFPreview from './PDFPreview.jsx';
import { StarOutlined,CopyOutlined,DeleteOutlined,PlusOutlined,SortAscendingOutlined } from '@ant-design/icons';
import {
  SyncOutlined,
  CalculatorOutlined,
  AreaChartOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { FaMapMarkerAlt } from 'react-icons/fa';
// 在需要使用表格的组件中
import resultstyles from './index.module.scss';
import EditableTable from './EditableTable.jsx';
import ReactHtmlParser from 'react-html-parser'
import { useParams } from 'react-router-dom';
const { Dragger } = Upload;
const { TabPane } = Tabs;
function Result() {
  const navigate = useNavigate();
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
  const [selectedCategory, setSelectedCategory] = useState('2'); // 默认选中“反应机理图”
  const[molecular,setMolecular] =  useState({});
  const [table,setTable] = useState({});
  const [isImagesVisible, setIsImagesVisible] = useState(true);
  const [smiles,setSmiles] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [imgList,setImgList] = useState([]);
  const [htmlList,setHtmlList] = useState([]);
  const { id } = useParams(); // 获取路由参数 id
  const [storedTaskId, setStoredTaskId] = React.useState('');
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [boxes,setBoxes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTables, setSelectedTables] = useState([]);
  const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);
  const [mergeTableData, setMergeTableData] = useState(null);
  const [images, setImages] = useState([]); // 添加这行

useEffect(() => {
  // 模拟 PDF 渲染完成
  const timer = setTimeout(() => {
    setIsPdfReady(true);
  }, 5000); // 假设 PDF 渲染需要 3 秒

  return () => clearTimeout(timer);
}, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // const id = "200"
    if (token && id) {
      setStoredTaskId(id); // 将 id 赋值给 storedTaskId
      localStorage.setItem('storedTaskId', id); // 将 id 存储到 localStorage

      const smiles = "O=C=O";
      settaskid(id);
      setSmiles(smiles);
      // 调用 fetchData 函数
      fetchData(id, token);
      fetchData2(id, token);
      fetchData3(id, token);
      fetchData4(id, token);
      fetchData5(id, token);
    } else if (!token) {
      message.error('用户未登录');
    } else if (!id) {
      message.error('任务 ID 未提供');
    }
  }, [id]); // 监听 id 的变化
  // 选择条选择
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
const handleEdit = (smiles) => {
  navigate('/edit', { 
    state: { 
      initialSmiles: smiles,
      // 可以传递其他需要的数据
    }
  });
};
  //著录部分
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



//合成反应部分
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




//图片部分
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






//分子部分
//未实现
const fetchData4 = async (taskid, token) => {
  setLoading(true);
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
    setLoading(false);
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



//表格部分
//未实现
const fetchData5 = async (taskid, token) => {
  setLoading(true);
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
        const imgList =data.data.imgList
        const htmlList =data.data.htmlList
        setImgList(imgList) // 更新状态
        setHtmlList(htmlList) // 更新状态
        if (imgList === null && activeTab === 'table'&& htmlList === null) {
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
  // 根据imgList计算boxes
  useEffect(() => {
    setTimeout(() => {
    if (imgList && imgList.length > 0) {
      const boxes = imgList.map((img) => {
        const axisValues = img.axis.replace(/[[\]]/g, '').split(',').map(Number);
        return {
          pageNumber: axisValues[0], // 第几页
          x: axisValues[1],         // 左上角 x 坐标
          y: axisValues[2],         // 左上角 y 坐标
          width: axisValues[3] - axisValues[1], // 宽度（右下角 x - 左上角 x）
          height: axisValues[4] - axisValues[2], // 高度（右下角 y - 左上角 y）
        };
      });
      setBoxes(boxes);
    } else {
      setBoxes([]); // 如果imgList为空，清空boxes
    }}, 50000);
  }, [imgList]);
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
  console.log(firstTableBody);
  console.log(secondTableBody);
  // 合并两个表格的 tbody 内容
  const mergedHtml = firstTableHtml.replace('</tbody>', `${secondTableBody}</tbody>`);
  console.log(mergedHtml);
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


  const renderTabContent = () => {
    switch (activeTab) {
      case 'bibliographic':
        return ( <div >
        {record===null?( // synthesisList 为空时显示无数据提示
        <div className={resultstyles.noData}>
        无数据
        </div>):(<div  className={resultstyles.bibicontainer}><Table
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
        return <div className={resultstyles.molecularcontainer}>
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
      
      ;
      case 'table':
        return (
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
                <Button shape="circle" icon={<AreaChartOutlined />} className={resultstyles.iconButton}onClick={() => setIsMergeModalVisible(true)} />
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
        );      
      // 反应
      case 'reaction':
          return (
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
          );    
      case 'picture':
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
           {isPdfReady ? <PDFPreview url={`http://172.20.137.175:90/files/${file}`}
            boxes={boxes} />: <div className={resultstyles.loading}>正在加载...</div>}
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
