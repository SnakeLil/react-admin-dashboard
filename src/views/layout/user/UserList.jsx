import React, { useEffect, useRef, useState } from 'react'
import { getAllUser } from '../../../api/acl/index'
import { Popconfirm, Card, Col, Table, Row, message, Pagination } from 'antd'
import { Button, Form, Input } from 'antd';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons'
import './userList.scss'
export default function UserList() {
  const [messageApi, contextHolder] = message.useMessage();
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户角色',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime) => <div style={{ width: '100%' }}>{createTime}</div>
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (updateTime) => <div style={{ width: '100%' }}>{updateTime}</div>
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button>分配权限</Button>
          <Button>编辑</Button>
          <Button>删除</Button>

        </div>
      ),
    },
  ];
  const [filter,setFilter] = useState('')
  const [userList, setUserList] = useState([])
  // 分页器
  const [tableParams, setTableParams] = useState(
    {
      current: 1,
      pageSize: 5,
      total: 0,
    },
  );
  const pagination = useRef({
    current: 1,
    pageSize: 5,
    total: 0,
  })

  // 获取用户列表请求
  const handleGetAllUser = async (filter) => {

    // let res = await getAllUser( tableParams.current, tableParams.pageSize, '')
    let res = await getAllUser( pagination.current.current, pagination.current.pageSize, filter? filter : '')
    if (res.code === 200) {
      setUserList(res.data.records.map(item => {
        return {
          key: item.id,
          ...item
        }
      }))
      pagination.current.total = res.data.total
      // setTableParams(pre => {
      //   return {
      //     ...pre,
      //     total: res.data.total,
      //     current: res.data.current,
      //     pageSize: res.data.size

      //   }
      // })
      // console.log(tableParams)
    } else {
      messageApi.open({
        type: 'error',
        content: '服务器异常',
      });
    }
  }
  useEffect(() => {
    handleGetAllUser()
  }, [])

  // 分页器每页条数变化
  const onShowSizeChange = (current, size) => {
    // setTableParams(pre => { return { ...pre, pageSize: size, current: current } })
    pagination.current.current=current
    pagination.current.pageSize=size
    handleGetAllUser()
  }
  // 分页器页码变化事件
  const onChange = (page, pageSize) => {
    console.log(page)
    // setTableParams(pre => { return { ...pre, current: page, pageSize: pageSize } })
    pagination.current.current=page
    pagination.current.pageSize=pageSize
    console.log(pagination)
    handleGetAllUser()
  }
  // 点击搜索
  const searchHandler = ()=>{
    handleGetAllUser(filter)
  }
  return (
    <div className='userList'>
      <Card style={{ display: 'flex', flexDirection: 'row' }}>
        <Row style={{ marginTop: '20px' }}>
          <Col >
            <Form
              name="basic"
              style={{
                maxWidth: 300,
              }}
              autoComplete="off"
            >
              <Form.Item label="用户名" name="username">
                <Input placeholder='请输入用户名' value={filter} onChange={(e)=>setFilter(e.target.value)}/>
              </Form.Item>
            </Form>
          </Col>
          <Col >
            <Button style={{ marginLeft: '30px' }} icon={<SearchOutlined />} onClick={searchHandler}>查询</Button>
            <Button style={{ marginLeft: '10px' }} icon={<SwapOutlined />} onClick={()=>{handleGetAllUser('')}}>重置</Button>
          </Col>
        </Row>
        {/* 表格 */}
        <div style={{ width: '100%' }}>

          <Table columns={columns} dataSource={userList} bordered pagination={false} />
          <Pagination
            style={{ marginTop: '30px' }}
            showSizeChanger
            // onShowSizeChange={(current, size) => { handleGetAllUser(current, size) }}
            onShowSizeChange={onShowSizeChange}
            total={pagination.current.total}
            // current={tableParams.current}
            current={pagination.current.current}
            // pageSize={tableParams.pageSize}
            pageSize={pagination.current.pageSize}
            // onChange={(page, pageSize) => { handleGetAllUser(page, pageSize) }}
            onChange={onChange}
            pageSizeOptions={[1, 2, 5, 10, 15, 20, 25, 30]}
            showQuickJumper
          />
        </div>


      </Card>
    </div>
  )
}
