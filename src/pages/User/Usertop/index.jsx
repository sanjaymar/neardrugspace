import { Outlet } from 'react-router'


import usertopstyles from './index.module.scss'

function Usertop() {


  return (
    <div className={usertopstyles.container}>
    <div className={usertopstyles.logo}>
      <span>PatMDAP</span>
    </div>
      <div className={usertopstyles.content}>
        <Outlet />
      </div>
    </div>
  )
}

export default Usertop