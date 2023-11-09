import React, { useEffect, useState } from 'react'
import { Modal, Popconfirm, Card, Table, Row, message, Pagination, Drawer, Button, Form, Input, Tree } from 'antd'
import MySpin from '../../../components/spin/MySpin';
import { ContactsOutlined, PlusCircleOutlined, QuestionCircleOutlined, SearchOutlined,  EditOutlined, SwapOutlined, DeleteOutlined } from '@ant-design/icons'
import { deletePermission, getMenuList } from '../../../api/acl/permission';
export default function Permission() {
  const [dataList,setDataList] = useState([])
  
  const columns = [
    {
      title: '',
      dataIndex: '',
      key: '',
      align: 'center',

    },
    {
      title: '权限值',
      dataIndex: 'name',
      key: 'name',

    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 200,
      ellipsis: true,
    },

    {
      title: '操作',
      key: 'action',
      width: 400,
      render: (_, record) => (
        <div key={record.id} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button icon={<ContactsOutlined />} onClick={() => { }}>添加菜单</Button>
          <Button icon={<EditOutlined />} onClick={() => {  }}>编辑</Button>
          <Popconfirm
            description={`确定删除该用户吗?`}
            okText="确认"
            cancelText="取消"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
            onConfirm={() => {handleDelMenu(record) }}>
            <Button icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>

        </div>
      ),
    },
  ];
  const getAllMenu = async ()=>{
    let res = await getMenuList()
    if(res.code ===200) {
      console.log(res)
      setDataList(res.data.map(item=>{
        return {...item,key:item.id}
      }))
    }
  }
  useEffect(()=>{
    getAllMenu()
  },[])

  // 点击确定删除
  const handleDelMenu = async(record)=>{
    let res = await deletePermission(record.id)
    if(res.code === 200){
      message.success('删除成功')
      getAllMenu()
    }else {
      message.error(res.message)
    }
  }
  return (
    <div>
      <Card>
      <Table columns={columns} dataSource={dataList} bordered pagination={false} />
      </Card>
    </div>
  )
}
