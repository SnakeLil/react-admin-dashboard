import React, { useEffect } from 'react'
import Leftbar from '../../components/layout/leftbar/Leftbar'
import Navbar from '../../components/layout/navbar/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import './layout.scss'
export default function Layout() {
  const path = window.location.pathname
  const navgate = useNavigate()
  useEffect(()=>{
    if(path === '/'){
      navgate('home',{replace:true})
    }
  },[])
  return (
    <div className="layout-container">
      <div className="layout-left">
        <div className='title'>
        <h1 style={{fontSize:'24px',fontWeight:'bold',letterSpacing:'0.2ch',marginBottom:'23px',color:'rgb(54, 54, 54)'}}>Lilsnak管理系统</h1>
        </div>
        <div className="menu">
          <Leftbar />
        </div>
      </div>
      <div className="layout-right">
        <div className="layout-nav">
          <Navbar />
        </div>
        <div className="layout-content">
          <Outlet />
        </div>
      </div>

    </div>
  )
}
