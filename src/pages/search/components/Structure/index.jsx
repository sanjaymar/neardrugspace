import { useEffect, useRef, useState } from 'react'
import { Button, Empty, Image, Input, message, Radio, Select, Spin, Table, Typography } from 'antd'
import qs from 'qs'
import { leadSearch, macrosBigSearch, macrosSearch } from '../../service.js'
import { CDN } from '@/utils/imgaeCDN.js'
import mystyle from './index.module.scss'
import {useNavigate} from "react-router";
import {updateBreadList} from "@/stores/breadStore.js";
import {useLocation} from "react-router-dom";

const { Title } = Typography
const { Search } = Input

function Structure() {
	const btnref = useRef()
	const navigate = useNavigate()
	const location = useLocation()
	const [ketcher, setKetcher] = useState('')
	const [ketcherSmiles, setKetcherSmiles] = useState('')
	const [searchOpt, setSearchOpt] = useState(1)
	const [rangeOpt, setRangeOpt] = useState(1)
	const [simThreshold, setSimThreshold] = useState(0.7) // 相似度值
	const [maxResult, setMaxResult] = useState(10) // 返回结果最大个数
	const [isLoading, setisLoading] = useState(false)
	const [isShowResult, setisShowResult] = useState(false)
	const [searchResult, setSearchResult] = useState([])
	const [res, setRes] = useState({})

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			align: 'center',
		},
		{
			title: 'structure',
			align: 'center',
			render: (data, index) => {
				return <Image src={CDN + qs.stringify({ type: 1, smiles: index.smiles })} width={100} />
			},
		},
		{
			title: 'Smiles',
			dataIndex: 'smiles',
			key: 'smiles',
			align: 'center',
			render: (data, index) => {
				return <a onClick={() => navToDetail(index)}>{data}</a>
			},
		},
	]

	const navToDetail = (detail) => {
		if (rangeOpt === 1) {
			updateBreadList('Search by chemical structure', location.pathname, 1)
			navigate('/smallmoltable/smallmoldetail?id=' + detail.id)
			updateBreadList(detail.name, `/smallmoltable/smallmoldetail?id=${detail.id}`, 2)
		} else {
			updateBreadList('Search by chemical structure', location.pathname, 1)
			navigate('/bigmarcoshow/bigmarcodetail?id=' + detail.id)
			updateBreadList(`Search : ${ketcherSmiles}`, location.pathname, 2)
			updateBreadList(ketcherSmiles, location.pathname, 3)
			updateBreadList(detail.formula, `/bigmarcoshow/bigmarcodetail?id=${detail.id}`, 4)
		}
	}

	const onSearch = (smiles) => {
		const ketcher = initKetcher()
		ketcher.setMolecule(smiles)
	}

	const submitSmiles = (e) => {
		btnref.current.disabled = true
		setisLoading(true)
		const ketcher = initKetcher()
		ketcher
			.getSmiles()
			.then((res) => {
				console.log(res)
				setKetcherSmiles(res)
				return res
			})
			.catch((e) => {
				console.log(e)
			})
			.then((res) => {
				if (res) {
					setRes({})
					setSearchResult([])
					setisShowResult(true)
					console.log(searchOpt, rangeOpt, simThreshold)
					if (rangeOpt === 1) {
						leadSearch(res, searchOpt, simThreshold)
							.then((res) => {
								if (res.code === '200') {
									console.log(res)
									message.success('Success')
									setSearchResult(res.data.records)
									setRes(res.data)
									btnref.current.disabled = false
									setisLoading(false)
								}
							})
							.catch((e) => {
								if (e.code === 'ERR_NETWORK') {
									message.error('ERR_NETWORK')
									btnref.current.disabled = false
									setisLoading(false)
								}
							})
					}
					if (rangeOpt === 2) {
						macrosBigSearch(res, searchOpt, simThreshold)
							.then((res) => {
								if (res.code === '200') {
									console.log(res)
									message.success('Success')
									setSearchResult(res.data)
									setRes(res.data)
									btnref.current.disabled = false
									setisLoading(false)
								}
							})
							.catch((e) => {
								if (e.code === 'ERR_NETWORK') {
									message.error('ERR_NETWORK')
									btnref.current.disabled = false
									setisLoading(false)
								}
							})
					}
				} else {
					message.error('input is null')
					setisLoading(false)
					btnref.current.disabled = false
				}
			})
	}

	const pageSizeChange = (pageNum, pageSize) => {
		leadSearch(ketcherSmiles, searchOpt, simThreshold, pageNum, pageSize)
			.then((res) => {
				if (res.code === '200') {
					setSearchResult(res.data.records)
					setRes(res.data)
					btnref.current.disabled = false
					setisLoading(false)
				}
			})
			.catch((e) => {
				if (e.code === 'ERR_NETWORK') {
					message.error('ERR_NETWORK')
					btnref.current.disabled = false
					setisLoading(false)
				}
			})
	}

	const initKetcher = () => {
		// console.log('初始化了！')
		const ketcherFrame = document.getElementById('idKetcher')
		let ketcher = null
		if ('contentDocument' in ketcherFrame) {
			ketcher = ketcherFrame.contentWindow.ketcher
		} else {
			ketcher = document.frames.idKetcher.window.ketcher
		}
		setKetcher(ketcher)
		return ketcher
	}
	const selectOpt = (e) => {
		// console.log('radio checked', e.target.value);
		setSearchOpt(e.target.value)
	}

	const selectRangeOpt = (e) => {
		setRangeOpt(e.target.value)
	}
	const selectThreshold = (value) => {
		// console.log(`selected ${value}`);
		setSimThreshold(value)
	}
	const selectMaxResult = (value) => {
		setMaxResult(value)
	}

	useEffect(() => {
		initKetcher()
	}, [])

	return (
		<div className={mystyle.container}>
			<div className={mystyle.box}>
				<Title level={3} style={{ marginTop: 0 }}>
					Search by chemical structure
				</Title>
				<div className={mystyle.content}>
					<iframe className={mystyle.iframe} id="idKetcher" src="/standalone/index.html" />
					<div className={mystyle.rightPart}>
						<Title level={3} style={{ marginTop: 0 }}>
							Search Options
						</Title>
						<Radio.Group onChange={selectOpt} value={searchOpt}>
							<Radio value={1}>Similarity</Radio>
							<Radio value={2}>Substructure</Radio>
						</Radio.Group>
						<Title level={4} style={{ marginTop: '12px' }}>
							Search scope
						</Title>
						<Radio.Group onChange={selectRangeOpt} value={rangeOpt}>
							<Radio value={1}>Small molecule</Radio>
							<Radio value={2}>Big molecule</Radio>
						</Radio.Group>
						<Title level={4} style={{ marginTop: '12px' }}>
							Keyboard Input
						</Title>
						<Search placeholder="input search SMILES" onSearch={onSearch} style={{ width: 200 }} />
						{searchOpt === 1 && (
							<div>
								<Title level={4} style={{ marginTop: '12px' }}>
									Similarity threshold
								</Title>
								<Select
									defaultValue={simThreshold}
									style={{ width: 200 }}
									onChange={selectThreshold}
									options={[
										{ value: 0.7, label: '0.7' },
										{ value: 0.8, label: '0.8' },
										{ value: 0.9, label: '0.9' },
										{ value: 1.0, label: '1.0' },
									]}
								/>
							</div>
						)}
						{/*<Title level={4} style={{ marginTop: '12px' }}>*/}
						{/*	Maximum Results*/}
						{/*</Title>*/}
						{/*<Select*/}
						{/*	defaultValue={maxResult}*/}
						{/*	style={{ width: 200 }}*/}
						{/*	onChange={selectMaxResult}*/}
						{/*	options={[*/}
						{/*		{ value: 10, label: '10' },*/}
						{/*		{ value: 20, label: '20' },*/}
						{/*		{ value: 50, label: '50' },*/}
						{/*		{ value: 100, label: '100' },*/}
						{/*	]}*/}
						{/*/>*/}
						<div>
							<Button ref={btnref} onClick={(e) => submitSmiles(e)} type={'primary'} style={{ width: '100px', marginTop: '30px' }}>
								Search
							</Button>
						</div>
					</div>
				</div>
			</div>
			{isLoading && (
				<div className={mystyle.isloading}>
					<Spin />
				</div>
			)}
			{isShowResult && (
				<div className={mystyle.results}>
					<Title level={3}>Search Results</Title>
					{searchResult.length === 0 ? (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
					) : rangeOpt === 1 ? (
						<Table
							rowKey="id"
							loading={isLoading}
							dataSource={searchResult}
							columns={columns}
							pagination={{
								total: res.total,
								onChange: (page, pageSize) => pageSizeChange(page, pageSize),
							}}
						/>
					) : (
						<Table rowKey="id" loading={isLoading} dataSource={searchResult} columns={columns} />
					)}
				</div>
			)}
		</div>
	)
}

export default Structure
