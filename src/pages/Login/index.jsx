import React, { useState } from 'react'; // 确保导入 useState 钩子
import { useNavigate } from 'react-router-dom'; // 确保导入 useNavigate
import loginstyles from './login.module.scss'; // 确保样式文件路径正确
import { message } from 'antd';  // 引入 antd 的 message 组件
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // 记住密码的状态

  // 处理登录表单提交
  const handleLogin = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const loginData = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        
        message.success("登录成功"); // 使用 message 显示成功提示
        navigate('/home');
      } else {
        message.error("登录失败"); // 使用 message 显示失败提示
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      message.error('登录请求失败'); // 使用 message 显示错误提示
    }
  };

  // 处理导航到忘记密码页面
  const handleNavigateToForgotPassword = () => {
    navigate('/reset');
  };

  // 处理导航到注册页面
  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className={loginstyles.container}>
      <div className={loginstyles.logo}>
        <span>PatMDAP</span>
      </div>

      <div className={loginstyles.card}>
        <h1>登录</h1>
        <form onSubmit={handleLogin}>
          <div className={loginstyles.inputGroup}>
            <label htmlFor="email">电子邮件</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={loginstyles.inputGroup}>
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={loginstyles.checkboxGroup}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">记住密码</label>
          </div>
          <button className={loginstyles.loginbutton} type="submit">登录</button>
        </form>
        <div className={loginstyles.links}>
          <a onClick={handleNavigateToForgotPassword} style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
            忘记密码
          </a>
          <a onClick={handleNavigateToRegister} style={{ marginTop: '10px' }}>
            注册账号
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;