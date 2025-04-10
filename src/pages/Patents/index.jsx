import { useState } from 'react';
import Dragger from 'antd/es/upload/Dragger';
import { UploadOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons';
import { Button, Form, message, Spin, Typography } from 'antd';
import patentstyle from './patent.module.scss';

function Patents() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const handleFileChange = (info) => {
    if (info.file.status === 'removed') {
      setFile(null);
      return;
    }
    const uploadedFile = info.fileList[0]?.originFileObj;
    setFile(uploadedFile || null);
  };

  const handleSubmit = async () => {
    if (!file) {
      message.error("请先上传文件");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      message.error("请先登录");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/patents', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('请求失败');
      const data = await response.json();

      if (data.code === '200') {
        setResultUrl(data.data);
        message.success("文件处理成功");
      } else {
        throw new Error(data.msg || '处理失败');
      }
    } catch (error) {
      message.error(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={patentstyle.patentContainer}>
      <div className={patentstyle.headerNote}>
      该功能用于获取分子结构信息，用于创建复杂的Markush结构，并根据自动分析的核心结构，输出各个取代基变体，生成专利权利要求书。帮用户解决手动生成验证Markush通式耗时耗力、容易出错、过程复杂的问题，提高专利申请效率和质量。
      </div>

      <div className={patentstyle.uploadSection}>
        <Form onFinish={handleSubmit} className={patentstyle.uploadform}>
          <Dragger
            name="file"
            multiple={false}
            onChange={handleFileChange}
            fileList={file ? [file] : []}
            beforeUpload={() => false}
            showUploadList={false}
          >
            {file ? (
              <div className={patentstyle.filePreview}>
                <FileOutlined className={patentstyle.fileIcon} />
                <div className={patentstyle.fileInfo}>
                  <Typography.Text strong>{file.name}</Typography.Text>
                  <Typography.Text type="secondary">
                    {(file.size / 1024).toFixed(1)} KB
                  </Typography.Text>
                </div>
              </div>
            ) : (
              <div className={patentstyle.uploadPrompt}>
                <UploadOutlined className={patentstyle.uploadIcon} />
                <p className={patentstyle.uploadText}>点击或拖拽文件到此区域</p>
                <p className={patentstyle.uploadHint}>支持任意文件类型</p>
              </div>
            )}
          </Dragger>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={patentstyle.submitButton}
            disabled={!file || loading}
          >
            {loading ? '处理中...' : '开始处理'}
          </Button>
        </Form>

        <div className={patentstyle.processingArea}>
          {loading && (
            <div className={patentstyle.loadingContainer}>
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
                tip="文件处理中，请稍候..."
                className={patentstyle.spin}
              />
              <Typography.Text type="secondary">
                通常需要30秒到2分钟，请勿关闭页面
              </Typography.Text>
            </div>
          )}

          {!loading && resultUrl && (
            <div className={patentstyle.resultContainer}>
              <Typography.Title level={4} className={patentstyle.resultTitle}>
                🎉 处理完成！
              </Typography.Title>
              <div className={patentstyle.downloadSection}>
                <Typography.Link
                  href={resultUrl}
                  strong
                  className={patentstyle.downloadLink}
                >
                  点击下载处理结果
                </Typography.Link>
                <Typography.Text type="secondary">
                  链接24小时内有效
                </Typography.Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Patents;