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
