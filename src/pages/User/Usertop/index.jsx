import { Outlet } from 'react-router'
import MyHeader from '@/pages/User/Usertop/components/MyHeader/index.jsx'
import MyLoading from '@/pages/User/Usertop/components/MyLoading/index.jsx'
import MyBreadcrumb from '@/components/MyBreadcrumb/index.jsx'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { beforeLevelBreadList, updateBreadList } from '@/stores/breadStore.js'
import usertopstyles from './index.module.scss'

function Usertop() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  // 定义一个数组，包含你希望显示 Breadcrumb 的路径
  const allowedPaths = ['/smallmoltable', '/smallmoltable/smallmoldetail', '/bigmarcoshow', '/bigmarcoresult', '/bigmarcoshow/bigmarcodetail'] // 替换成你希望显示 Breadcrumb 的路径

  // 根据当前路径是否在允许的路径数组中来决定是否渲染 <MyBreadcrumb /> 组件
  const shouldRenderBreadcrumb = allowedPaths.includes(location.pathname)

  const updateBread = () => {
    if (location.pathname === '/') {
      // initialBreadList()
    }
    if (location.pathname === '/smallmoltable') {
      updateBreadList(searchParams.get('type') + '(' + searchParams.get('kind') + ')', location.pathname + location.search, 1)
    }
    if (location.pathname === '/smallmoltable/smallmoldetail') {
      beforeLevelBreadList(2)
    }
    if (location.pathname === '/bigmarcoshow') {
      beforeLevelBreadList(3)
    }
    if (location.pathname === '/bigmarcoshow/bigmarcodetail') {
      beforeLevelBreadList(4)
    }
  }

  useEffect(() => {
    updateBread()
  }, [location.pathname])

  // 解决跳转新页面滚动条不在顶部的问题
  useEffect(() => {
    if (document) {
      if (document.documentElement || document.body) {
        document.documentElement.scrollTop = document.body.scrollTop = 0 // 切换路由时手动置顶
      }
    }
  }, [location?.pathname])

  return (
    <div className={usertopstyles.container}>
      <MyHeader />
      <div className={usertopstyles.content}>
        {shouldRenderBreadcrumb && <MyBreadcrumb />}
        <Outlet />
        <MyLoading />
      </div>
    </div>
  )
}

export default Usertop