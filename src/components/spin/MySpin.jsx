import React, { useState } from 'react'
import {  Spin } from 'antd';
export default function MySpin(props) {
  // const [spinning, setSpinning] = useState(false)
  return (
    <>
       <Spin spinning={props.spinning?props.spinning:false} fullscreen  size="large"/>
    </>
  )
}
