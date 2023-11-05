import React, { useEffect, useState } from 'react'
import Leftbar from '../../components/layout/leftbar/Leftbar'
import Navbar from '../../components/layout/navbar/Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './layout.scss'
import { getUserInfo,logout } from '../../api/user'
import { useDispatch } from 'react-redux'
import { userInfo } from '../../store/user/userSlice'
export default function Layout() {
  // const path = window.location.pathname
  const path = useLocation().pathname
  const navgate = useNavigate()
  const dispatch = useDispatch()
  const [user,setUser] = useState({
    username:'',
    name:'',
    avatar:'',
    roles:[],
    routes:[],
    buttons:[]
  })
  useEffect(()=>{
    const getInfo = async ()=>{
      // 获取用户信息
      let res = await getUserInfo()
      if(res.code === 200) {
        setUser(pre=>{
          return {...pre,name:res.data.name,avatar:res.data.avatar}
        })
        dispatch(userInfo({
          name:res.data.name
        }))
        if(path === '/'){
          // 重定向到home
          navgate('home',{replace:true})
        }
      }else {
        // 用户信息获取失败，重定向到login
        navgate('login',{replace:true})
      }
    }
    getInfo()// 获取用户信息

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
          <Navbar user={user} logout={logout}/>
        </div>
        <div className="layout-content">
          <Outlet />
        </div>
      </div>

    </div>

  )
}
