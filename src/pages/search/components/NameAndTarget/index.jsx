import { Button, Input, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { changeLoading } from '@/stores/baseStore.js'
import { kinaseSearchByKey, kinaseSearchByTarget } from '@/pages/Search/service.js'
import { updateBreadList } from '@/stores/breadStore.js'
import { useLocation } from 'react-router-dom'
import preclinical from '@/assets/imgs/phase/preclinical.png'
import phaseI from '@/assets/imgs/phase/phaseI.png'
import phaseII from '@/assets/imgs/phase/phaseII.png'
import phaseIII from '@/assets/imgs/phase/phaseIII.png'
import approved from '@/assets/imgs/phase/approved.png'

import styles from './index.module.scss'

function NameAndTarget(props) {
	const navigate = useNavigate()
	const location = useLocation()
	const [drugName, setDrugName] = useState('')
	const [targetName, setTargetName] = useState('')
	const resetDrugName = () => {
		setDrugName('')
	}
	const resetTargetName = () => {
		setTargetName('')
	}
	const toSmallMolTable = (phase) => {
		const type = 'KINASE'
		const kind = phase
		navigate(`/smallmoltable?type=${type}&kind=${kind}`)
	}
	const handleSearchByName = async () => {
		if (drugName === '') {
			message.error('Input is empty!')
		} else {
			changeLoading(true)
			const res = await kinaseSearchByKey(drugName)
			setTimeout(function () {
				changeLoading(false)
				if (res.code === '200') {
					message.success('search success')
					updateBreadList(`Search : ${drugName}`, location.pathname, 1)
					navigate(`/smallmoltable/smallmoldetail?id=${res.data.leadEi.id}`)
					updateBreadList(drugName, `/smallmoltable/smallmoldetail?id=${res.data.leadEi.id}`, 2)
				} else if (res.code === '500') {
					message.error(res.msg)
				} else {
					message.error('internet error')
				}
			}, 1000)
		}
	}
	const handleSearchByTarget = async () => {
		if (targetName === '') {
			message.error('Input is empty!')
		} else {
			changeLoading(true)
			const res = await kinaseSearchByTarget(targetName, 1, 10)
			setTimeout(function () {
				changeLoading(false)
				if (res.code === '200') {
					console.log(res)
					message.success('search success')
					updateBreadList('SearchByTarget', location.pathname, 1)
					navigate(`/bigmarcoresult?targetName=${targetName}`)
					updateBreadList(`Search : ${targetName}`, location.pathname, 2)
					updateBreadList(`${targetName}`, `/bigmarcoresult?targetName=${targetName}`, 3)
				} else if (res.code === '500') {
					message.error(res.msg)
				} else {
					message.error('internet error')
				}
			}, 1000)
		}
	}
	return (
		<div className={styles.container}>
			<div className={styles.searchBox}>
				<div className={styles.searchPart}>
					<div className={styles.title}>Drug Name</div>
					<Input size={'large'} value={drugName} placeholder={'please input drug name'} onChange={(e) => setDrugName(e.target.value)} />
				</div>
				<div className={styles.btnPart}>
					<Button onClick={() => setDrugName('Imatinib')}>Exemple</Button>
					<Button danger onClick={resetDrugName}>
						Reset
					</Button>
					<Button type={'primary'} onClick={handleSearchByName}>
						Search
					</Button>
				</div>
			</div>
			<div className={styles.searchBox}>
				<div className={styles.searchPart}>
					<div className={styles.title}>Target Name</div>
					<Input size={'large'} value={targetName} placeholder={'please input target name'} onChange={(e) => setTargetName(e.target.value)} />
				</div>
				<div className={styles.btnPart}>
					<Button onClick={() => setTargetName('P02747')}>Exemple</Button>
					<Button danger onClick={resetTargetName}>
						Reset
					</Button>
					<Button type={'primary'} onClick={handleSearchByTarget}>
						Search
					</Button>
				</div>
			</div>
			<div className={styles.molBox} style={{ margin: '50px auto' }}>
				<div className={styles.molTitle}>Kinase</div>
				<div className={styles.category}>
					<div className={styles.picBox} onClick={() => toSmallMolTable('Preclinical')}>
						<img src={preclinical} />
						<span>Preclinical</span>
					</div>
					<div className={styles.picBox} onClick={() => toSmallMolTable('Phase1')}>
						<img src={phaseI} />
						<span>Phase I</span>
					</div>
					<div className={styles.picBox} onClick={() => toSmallMolTable('Phase2')}>
						<img src={phaseII} />
						<span>Phase II</span>
					</div>
					<div className={styles.picBox} onClick={() => toSmallMolTable('Phase3')}>
						<img src={phaseIII} />
						<span>Phase III</span>
					</div>
					<div className={styles.picBox} onClick={() => toSmallMolTable('Approved')}>
						<img src={approved} />
						<span>Approved</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NameAndTarget
