import React, { useEffect } from 'react'
import {getAllUser} from '../../../api/acl/index'
export default function UserList() {
  
  useEffect(()=>{
    const handleGetAllUser = async ()=>{
      let res = await getAllUser(2,5,'')
      if(res.code ===200) {
        console.log(res)
      }
    }
    handleGetAllUser()
  },[])
  return (
    <div>UserList</div>
  )
}
