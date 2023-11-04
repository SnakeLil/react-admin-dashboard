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
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../store/user/userSlice'
export default function Navbar({user,logout:reqLogout}) {
  const location = useLocation()
  const token = useSelector(state=>state.user.token)
  const dispatch = useDispatch()
  const navgate = useNavigate()
  const renderPath = (path)=>{
    return path.slice(1).split('/').map((item,index)=>{
      return <BreadcrumbItem key={index}>
      <BreadcrumbLink href={path} style={{ fontSize: '14px' }}>{item}</BreadcrumbLink>
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
