import React from 'react'
import ReactDOM from 'react-dom/client'
import 'reset-css' // 样式初始化
import App from './App.jsx'
import '@/assets/styles/global.scss' // 全局样式
ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
