import request from '@/utils/request.js'

// lead 根据smiles式搜索
export function leadSearchBySmiles(smiles, method, type, Threshold, pageNum = 1, pageSize = 10) {
	return request({
		url: `http://172.20.137.175:8080/lead/smiles/${smiles}`,
		method: 'GET',
		params: {
			smiles,
			method,
			type,
			Threshold,
			pageNum,
			pageSize,
		},
	})
}
// lead search 1:相似度 2: 子结构
export function leadSearch(smiles, method, Threshold, pageNum = 1, pageSize = 10) {
	return request({
		url: `http://172.20.137.175:8080/lead/search`,
		method: 'GET',
		params: {
			smiles,
			method,
			Threshold,
			pageNum,
			pageSize,
		},
	})
}
// lead search 1:相似度 2: 子结构
export function macrosSearch(smiles, method, Threshold, pageNum = 1, pageSize = 10) {
	return request({
		url: `http://172.20.137.175:8080/macros/search`,
		method: 'GET',
		params: {
			smiles,
			method,
			Threshold,
			pageNum,
			pageSize,
		},
	})
}
// type 1:相似度 2: 子结构
export function macrosBigSearch(smiles, type, threshold) {
	return request({
		url: `http://172.20.137.175:8080/macros/nsearch`,
		method: 'POST',
		data: {
			smiles,
			type,
			threshold,
		},
	})
}

// 激酶查询 by name
export function kinaseSearchByKey(name) {
	return request({
		url: `http://172.20.137.175:8080/lead/name/${name}`,
		method: 'GET',
	})
}

// 激酶查询 by target
export function kinaseSearchByTarget(target, pageNum, pageSize) {
	return request({
		url: `http://172.20.137.175:8080/tar/serach`,
		method: 'GET',
		params: {
			target,
			pageNum,
			pageSize,
		},
	})
}
