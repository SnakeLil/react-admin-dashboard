import React from 'react'
import './home.scss'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
export default function Home() {
  const name = useSelector(state=>state.user?.name)
  return (
    <div className='home'>
       <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <h1 className="title" >WELCOM TO LILSNAKE</h1>
        <Card style={{width:'100%',marginTop:'60px'}}>
        <CardBody>
            <div style={{display:'flex',alignItems:'center',gap:'40px'}}>
                 {/* <img :src="(userStore.avatar as string)" alt="" style="width: 100px;height: 100px;border-radius: 50%;">  */}
                <img src="https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/gp/wallhaven-gpmjxe.png?w=2560&h=1440&fmt=webp"
                 alt="" 
                 style={{width:'100px',height:'100px',borderRadius:'50%'}}/>
            
            <span style={{fontSize:'24px',fontWeight:'bold'}}>{name}</span>
            </div>
        </CardBody>
        </Card>
    </div>

    </div>
  )
}
