import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import resetstyles from '../Login/login.module.scss';
import { message } from 'antd';  // 引入 antd 的 message 组件
function Reset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [email,setEmail] = useState('');
  const [name,setName] = useState('');
  const toLogin = () => {
    navigate('/login'); 
  };
  // 处理重置密码表单提交
  const handleResetPassword = async (event) => {
    event.preventDefault();
    const requestData = {
      confirmedPassword,
      email,
      name,
      password,
    };

    try {
      const response = await fetch('/api/user/reset', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
    
      const result = await response.json();
    
      if (result.code === "200") {
        message.success('密码重置成功'); // 显示成功提示
        navigate('/login');
      } else {
        message.error('密码重置失败'); // 显示失败提示
      }
    } catch (error) {
      console.error('请求失败:', error);
      message.error('请求失败'); // 显示请求失败提示
    }
  };

  return (
    <div className={resetstyles.container}>
      <div className={resetstyles.logo}>
        <span>PatMDAP</span>
      </div>

      <div className={resetstyles.card}>
        <h1>重置密码</h1>
        <form onSubmit={handleResetPassword}>
        <div className={resetstyles.inputGroup}>
            <label htmlFor="name">用户名</label>
            <input
              type="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={resetstyles.inputGroup}>
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={resetstyles.inputGroup}>
            <label htmlFor="password">新密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={resetstyles.inputGroup}>
            <label htmlFor="confirmedPassword">确认新密码</label>
            <input
              type="password"
              id="confirmedPassword"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit"className={resetstyles.resetbutton}>重置密码</button>
          <button type="back" onClick={toLogin} className={resetstyles.resetbutton}>返回登录</button>
        </form>
      </div>
    </div>
  );
}

export default Reset;