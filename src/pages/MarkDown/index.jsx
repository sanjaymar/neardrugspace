import React, { useState, useEffect, useRef } from 'react';
import markdownstyles from './index.module.scss';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import subscript from 'markdown-it-sub';
import superscript from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import deflist from 'markdown-it-deflist';
import abbreviation from 'markdown-it-abbr';
import insert from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import markdownItKatex from '@iktakahiro/markdown-it-katex';
import 'katex/dist/katex.min.css';  // 引入 KaTeX 样式文件
import markdownItMultimdTable from 'markdown-it-multimd-table';
import PDFPreview from './PDFPreview.jsx';
import { m } from 'framer-motion';
import { useParams } from 'react-router-dom';
const { Dragger } = Upload;

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(subscript)
  .use(superscript)
  .use(footnote)
  .use(deflist)
  .use(abbreviation)
  .use(insert)
  .use(mark)
  .use(markdownItKatex)          // 添加 Katex 插件
  .use(markdownItMultimdTable);   // 添加表格增强插件

function MarkDown() {
  const [file, setFile] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setUserToken] = useState('');
  const [taskid, setTaskId] = useState('');
  const [syncScroll, setSyncScroll] = useState(true);
  const { id } = useParams(); // 获取路由参数 id
  const [storedTaskId, setStoredTaskId] = React.useState('');
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && id) {
      setUserToken(token);
      setStoredTaskId(id); // 将 id 赋值给 storedTaskId

        fetchMarkdownData(id, token);

    } else if (!token) {
          message.error('用户未登录');
        } else if (!id) {
          message.error('任务 ID 未提供');
        }
      }, [id]); // 监听 id 的变化

  const fetchMarkdownData = async (taskid, token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/apiResult/markdown/${taskid}`, {
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
        setFile(data.data.fileUrl);
        setMarkdown(data.data.markdown);
      } 
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    if (!syncScroll) return;
    const target = e.target;
    if (target === editorRef.current) {
      previewRef.current.scrollTop = target.scrollTop;
    } else {
      editorRef.current.scrollTop = target.scrollTop;
    }
  };

  const handleSave = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '提取的markdown.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={markdownstyles.allcontainer}>
      <Dragger
        fileList={file ? [{ uid: '-1', name: file, status: 'done' }] : []}
        className={markdownstyles.draggerCustom}
        showUploadList={false}
        disabled
      >
      <div className={markdownstyles.previewContainer}>
          <PDFPreview url={`http://172.20.137.175:90/files/${file}`} />
        </div>
      </Dragger>

      <div className={markdownstyles.right}>
          <MdEditor
              ref={editorRef}
              value={markdown}
              className={markdownstyles.editor}
              config={{
                view: {
                  menu: false,
                  md: true,
                  html: true,
                },
                shortcuts: true,
                htmlClass: 'markdown-body', // 添加自定义 class
                markdownClass: 'markdown-body', // 添加自定义 class
                  // 新增表格渲染配置
                table: {
                  maxRow: 20,
                  maxCol: 6
                }
              }}
              style={{
                height: '100%',
                width: '100%'
              }}
          renderHTML={text => mdParser.render(text)}
          onChange={({ text }) => setMarkdown(text)}
          onScroll={handleScroll}
        />
        <Button
          icon={<SaveOutlined />}
          onClick={handleSave}
        >
          保存 Markdown
        </Button>
      </div>
    </div>
  );
}

export default MarkDown;
