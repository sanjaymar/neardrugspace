import { NavLink, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router'
import { useState } from 'react'
import styles from './index.module.scss'
import { Spin } from 'antd'

const searchEnum = {
	'/search/name': 'Search By NameAndTarget',
	'/search/target': 'Search By Target',
	'/search/structure': 'Chemical Structure Search',
	'/search/property': 'Molecular Weight Search',
}

function Search() {
	const location = useLocation()
	return (
		<div className={styles.wrapper}>
			<div className={`innerWidth ${styles.content}`}>
				{location.pathname !== '/search/nameandtarget' && <div className={styles.label}>{searchEnum[location.pathname]}</div>}
				<Outlet />
			</div>
		</div>
	)
}

export default Search
