import React from 'react'
import './leftbar.scss'
import { Icon } from '@chakra-ui/react'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { router } from '../../../router/index'
export default function Leftbar() {
  const routerList = router.routes[0].children
  const renderMenu = (routerList) => {
    return routerList.map(item => {
      if (item.children && item.children.length > 0) {
        return (
        <AccordionItem key={item.path}>
          <h2>
            <AccordionButton >
              <Box as="span" className='menuItem' flex='1' textAlign='left' >
                <Icon as={item.icon} boxSize={4} />
                <span>{item.name}</span>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className='subMenuItem'>
            {item.children.map(item => {
              if (item.children && item.children.length > 0) {
                renderMenu(item.children)
              } else {
                return (
                <Link to={item.path} key={item.path}>
                  <Box as="span" flex='1' textAlign='left' className='menuItem' >
                    <Icon as={item.icon} boxSize={4} />
                    <span>{item.name}</span>
                  </Box>
                </Link>
                )
              }
            })}
          </AccordionPanel>
        </AccordionItem>
        )
      } else {
        return (<AccordionItem key={item.path}>
          <h2>
            <Link to={item.path}>
              <AccordionButton >
                <Box as="span" className='menuItem' flex='1' textAlign='left' >
                  <Icon as={item.icon} boxSize={4} />
                  <span>首页</span>
                </Box>
                {/* <AccordionIcon /> */}
              </AccordionButton>
            </Link>
          </h2>
        </AccordionItem>)
      }
    })
  }
  return (
    <div className='leftbar' >
      {/* 菜单栏 */}
      <Accordion defaultIndex={[0]} allowMultiple>
        {renderMenu(routerList)}
      </Accordion>

    </div>
  )
}
