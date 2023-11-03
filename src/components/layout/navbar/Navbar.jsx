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
import { useLocation } from 'react-router-dom'
export default function Navbar() {
  const location = useLocation()
  console.log(location)
  const renderPath = ()=>{
    
  }
  return (
    <div className='navbar'>
      <div className="left">
        {/* 面包屑 */}
        <HamburgerIcon style={{ marginRight: '18px' }} />

        <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
          
          <BreadcrumbItem>
            <BreadcrumbLink href='#' style={{ fontSize: '14px' }}>Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href='#' style={{ fontSize: '14px' }}>About</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#' style={{ fontSize: '14px' }}>Contact</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="right">
        <Stack direction='row' style={{ alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>username</span>
          {/* 下拉菜单 */}
          <Menu>
            <MenuButton transition='all 0.2s' borderRadius='md' _hover={{ bg: 'gray.400' }}>
              <Avatar name='' size='sm' src='https://bit.ly/broken-link' />
            </MenuButton>
            <MenuList>
              <MenuItem>个人中心</MenuItem>
              <MenuItem>退出登录</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </div>
    </div>
  )
}
