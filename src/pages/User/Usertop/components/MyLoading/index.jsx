import { Spin } from 'antd'
import { useBaseStore } from '@/stores/baseStore.js'
import styles from './index.module.scss'

function MyLoading(props) {
	const isLoading = useBaseStore((state) => state.isLoading)
	return (
		<>
			{isLoading && (
				<div className={styles.isLoading}>
					<Spin />
				</div>
			)}
		</>
	)
}

export default MyLoading
