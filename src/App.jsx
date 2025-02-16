import { Suspense } from 'react'
import RenderRouter from './router'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import {useTranslation} from "react-i18next";
function App() {
	const { t } = useTranslation()
	return (
		<BrowserRouter>
			<Suspense>
				<ConfigProvider
					theme={{
						components: {
							Menu: {
								/* 这里是你的组件 token */
								// darkItemSelectedColor: '#000',
								// darkItemSelectedBg: '#fff',
								// itemSelectedBg: '#e7e7e7',
								// itemSelectedColor: '00b96b',
							},
						},
						token: {
							// Seed Token，影响范围大
							// colorPrimary: '#00b96b',
							// borderRadius: 2,
							//
							// // 派生变量，影响范围小
							// colorBgContainer: '#f6ffed',
						},
					}}
				>
					<RenderRouter />
				</ConfigProvider>
			</Suspense>
		</BrowserRouter>
		
	)
}

export default App
