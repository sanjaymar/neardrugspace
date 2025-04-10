import React, { useState } from 'react'; // 确保导入 useState 钩子
import { useNavigate } from 'react-router-dom'; // 确保导入 useNavigate
import registerstyles from '../Login/login.module.scss'; // 确保样式文件路径正确
import { message } from 'antd'; // 引入 antd 的 message 组件
function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');

  // 处理注册表单提交
  const handleRegister = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    if (password !== confirmedPassword) {
      alert('密码不匹配');
      return;
    }
    const registerData = {
      name: name,
      email: email,
      password: password,
      confirmedPassword: confirmedPassword,
      phone: phone,
      title: title,
      company: company,
    };
    // 设置超时时间为5000毫秒（5秒）
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('请求超时'));
    }, 10000);
  });
   // 确保 fetchOptions 在这里被声明
   const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  };

    try {
      const response = await Promise.race([fetch('/api/user/register', fetchOptions), timeout]);
      
      if (response.ok) { // 如果返回HTTP状态码200
        message.success('注册成功'); // 使用 message 显示成功提示
        navigate('/login'); // 跳转到登录页面
      } else {
        message.error('注册失败'); // 使用 message 显示失败提示
      }
    } catch (error) {
      console.error('注册请求失败:', error);
      message.error('注册请求失败'); // 使用 message 显示错误提示
    }
  };

  return (
    <div className={registerstyles.container}>
      <div className={registerstyles.logo}>
        <span>PatMDAP</span>
      </div>

      <div className={registerstyles.card}>
        <h1>注册</h1>
        <form onSubmit={handleRegister}>
          <div className={registerstyles.inputGroup}>
            <label htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={registerstyles.inputGroup}>
            <label htmlFor="email">电子邮件</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={registerstyles.inputGroup}>
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={registerstyles.inputGroup}>
            <label htmlFor="confirmedPassword">确认密码</label>
            <input
              type="password"
              id="confirmedPassword"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              required
            />
          </div>
          <div className={registerstyles.inputGroup}>
            <label htmlFor="phone">电话</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className={registerstyles.inputGroup}>
            <label htmlFor="title">职称</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={registerstyles.inputGroup}>
            <label htmlFor="company">公司</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={registerstyles.registerbutton} onClick={handleRegister}>注册</button>
          <button type="submit" className={registerstyles.registerbutton} onClick={() => navigate('/login')}>返回登录</button>
        </form>
      </div>
    </div>
  );
}

export default Register;