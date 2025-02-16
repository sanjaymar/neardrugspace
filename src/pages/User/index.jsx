import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Form, Row, Col, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'; // 导入返回图标
import userstyles from './index.module.scss';

function User() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/reset');
  };

  const handleBack = () => {
    navigate('/main'); // 导航到 /main 页面
  };

  return (
    <div className={userstyles.container}>
      <Card
        title={
          <div className={userstyles.cardTitle}>
           
            <span style={{ fontSize: '24px', fontWeight: 'bold',marginLeft:'35%'}}>用户中心</span>
            <Button 
              type="link" 
              icon={<ArrowLeftOutlined />} 
              shape="circle"  // 圆形按钮
              onClick={handleBack} 
              style={{ fontSize: '24px',fontWeight: 'bold', marginLeft:'25%',marginTop:'-15px' }}>
              </Button>
          </div>
        }
        className={userstyles.card}
      >
        <Form layout="vertical" className={userstyles.form}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="ID">
                <Input
                  value={userInfo.id}
                  disabled
                  bordered={false}
                  style={{ fontSize: '16px', color: '#666', border: '1px solid #d9d9d9' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="用户名">
                <Input
                  value={userInfo.name}
                  disabled
                  bordered={false}
                  style={{ fontSize: '16px', color: '#666', border: '1px solid #d9d9d9' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="邮箱">
                <Input
                  value={userInfo.email}
                  disabled
                  bordered={false}
                  style={{ fontSize: '16px', color: '#666', border: '1px solid #d9d9d9' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Space style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button type="primary" onClick={handleChangePassword} style={{ marginRight: '30px' }}>
            修改密码
          </Button>
          <Button danger onClick={handleLogout}>
            退出登录
          </Button>
        </Space>
      </Card>
    </div>
  );
}

export default User;
