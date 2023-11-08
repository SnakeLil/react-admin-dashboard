import React from 'react'
import './navbar.scss'
import { ChevronRightIcon, HamburgerIcon } from '@chakra-ui/icons'

import {
  Avatar, Stack, Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { Link,  useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../store/user/userSlice'
export default function Navbar({user,logout:reqLogout}) {
  // 定义路由数据

  const location = useLocation()
  console.log()
  
  // const token = useSelector(state=>state.user.token)
  const dispatch = useDispatch()
  const navgate = useNavigate()
  const renderPath = (path)=>{
    let routePath = path.slice(1).split('/') //将当前路径分割成字符串数组
    const pathname = (index)=>{//接受一个index值，返回index之前的数组字符串拼接后的路径
      let path = ''
      routePath.forEach((item1,index1)=>{
         if(index1<=index){
           path += '/'+item1
         }
      })
      return path
    }
    const router = {//不变的路由对象
      home:{name:'首页',path:'/home'},
      user:{name:'用户管理',path:'/user'},
      userList:{name:'用户列表',path:'/user/userList'},
      role:{name:'角色管理',path:'/role'},
      roleList:{name:'角色列表',path:'/role/roleList'},
      permission:{name:'权限管理',path:'/role/permission'},
      product:{name:'商品管理',path:'/product'},
      attr:{name:'属性管理',path:'/product/sttr'},
      brand:{name:'品牌管理',path:'/product/brand'},
      spu:{name:'SPU管理',path:'/product/spu'},
      sku:{name:'SKU管理',path:'/product/sku'},
    }
    return routePath.map((item,index)=>{//循环，返回面包屑
      return <BreadcrumbItem key={index}>
      <BreadcrumbLink  style={{ fontSize: '14px' }}>
        {/* {item} */}
        <Link to={pathname(index)}>{router[item]?.name}</Link>
        </BreadcrumbLink>
    </BreadcrumbItem>
    })
  }
  const handleLogout = async ()=>{
      let res = await reqLogout()
      if(res.code === 200) {
        dispatch(logout())
        navgate('login',{replace:true})
      }
  }
  return (
    <div className='navbar'>
      <div className="left">
        {/* 面包屑 */}
        <HamburgerIcon style={{ marginRight: '18px' }} />

        <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
          
          {renderPath(location.pathname)}
        </Breadcrumb>
      </div>
      <div className="right">
        <Stack direction='row' style={{ alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>{user.name}</span>
          {/* 下拉菜单 */}
          <Menu>
            <MenuButton transition='all 0.2s' borderRadius='md' _hover={{ bg: 'gray.100' }}>
              <Avatar name='' size='sm' src={user.avatar} />
            </MenuButton>
            <MenuList>
              <MenuItem>个人中心</MenuItem>
              <MenuItem onClick={handleLogout}>退出登录</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </div>
    </div>
  )
}
