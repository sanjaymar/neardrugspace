import React from 'react'
import ReactDOM from 'react-dom/client'
import 'reset-css' // 样式初始化
import App from './App.jsx'
import '@/assets/styles/global.scss' // 全局样式
// 解决浏览器环境缺少 global 对象的问题
if (typeof global === 'undefined') {
	window.global = window;
  }
ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
