import React from 'react'
import { Button, Flex } from 'antd';
export default function Home() {

  return (
    <div>Home
        <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="dashed">Dashed Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
    </div>
  )
}
