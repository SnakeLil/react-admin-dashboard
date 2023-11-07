import React, { useState } from 'react'
import {  Spin } from 'antd';
export default function MySpin(props) {
  return (
    <>
       <Spin spinning={props.spinning?props.spinning:false} fullscreen={props.fullscreen?props.fullscreen:true}  size="large"/>
    </>
  )
}
