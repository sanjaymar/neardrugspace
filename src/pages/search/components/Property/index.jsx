import { Button, Input, Typography } from 'antd'
import propstyle from './index.module.scss'

const { Title } = Typography

function Property(props) {
	return (
		<div className={propstyle.container}>
			<Title level={3} style={{ marginTop: 0 }}>
				Search by Ring Size
			</Title>
			<div className={propstyle.inputpart}>
				<div>
					<span>Minimum weight</span>
					<Input placeholder="Basic usage" />
				</div>
				<div>
					<span>Maximum weight</span>
					<Input placeholder="Basic usage" />
				</div>
			</div>

			<Title level={3} style={{ marginTop: 10 }}>
				Search by Ring Size
			</Title>
			<div className={propstyle.inputpart}>
				<div>
					<span>Minimum weight</span>
					<Input placeholder="Basic usage" />
				</div>
				<div>
					<span>Maximum weight</span>
					<Input placeholder="Basic usage" />
				</div>
			</div>

			<Title level={3} style={{ marginTop: 10 }}>
				Search by Ring Size
			</Title>
			<div className={propstyle.inputpart}>
				<div>
					<span>Minimum weight</span>
					<Input placeholder="Basic usage" />
				</div>
				<div>
					<span>Maximum weight</span>
					<Input placeholder="Basic usage" />
				</div>
			</div>

			<Title level={3} style={{ marginTop: 10 }}>
				Search by Ring Size
			</Title>
			<div className={propstyle.inputpart}>
				<div>
					<span>Minimum weight</span>
					<Input placeholder="Basic usage" />
				</div>
				<div>
					<span>Maximum weight</span>
					<Input placeholder="Basic usage" />
				</div>
			</div>
			<div className={propstyle.bottombtn}>
				<Button type="primary">Search</Button>
			</div>
		</div>
	)
}

export default Property
