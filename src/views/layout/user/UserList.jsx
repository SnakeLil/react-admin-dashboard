import React, { useEffect, useRef, useState } from 'react'
import { getAllUser, getAllRoles, assignRoles, deleteUser ,addOrUpdateUser} from '../../../api/acl/user/index'
import { Modal, Popconfirm, Card, Col, Table, Row, message, Pagination, Drawer, Button, Form, Input, Checkbox } from 'antd'

import { PlusCircleOutlined, QuestionCircleOutlined, SearchOutlined, RedditOutlined, EditOutlined, SwapOutlined, DeleteOutlined } from '@ant-design/icons'
import './userList.scss'
import MySpin from '../../../components/spin/MySpin';
export default function UserList() {
  const [modalOpen, setModalOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [spinning, setSpinning] = useState(false)
  const [open, setOpen] = useState(false);
  const [allRolesList, setAllRolesList] = useState([])//所有角色列表数组
  const [assignRolesList, setAssignRolesList] = useState([])
  const [username, setUsername] = useState('')
  const [user, setUser] = useState({
    id: '',
    username: '',
    password: '',
    name: '',
    phone:'',
  })
  const userRole = useRef({
    roleIdList: [],
    userId: '',
  })
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
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button icon={<RedditOutlined />} onClick={() => { handleClickAsignRoles(record) }}>分配角色</Button>
          <Button icon={<EditOutlined />} onClick={()=>{handleClickEditUser(record)}}>编辑</Button>
          <Popconfirm
            description={`确定删除该用户吗?`}
            okText="确认"
            cancelText="取消"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
            onConfirm={() => { confirmDeluser(record) }}>
            <Button icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>

        </div>
      ),
    },
  ];

  const [filter, setFilter] = useState('')
  const [userList, setUserList] = useState([])
  // 分页器
  const pagination = useRef({
    current: 1,
    pageSize: 5,
    total: 0,
  })

  // 获取用户列表请求
  const handleGetAllUser = async (filter) => {
    setSpinning(true)
    // let res = await getAllUser( tableParams.current, tableParams.pageSize, '')
    let res = await getAllUser(pagination.current.current, pagination.current.pageSize, filter ? filter : '')
    if (res.code === 200) {
      setUserList(res.data.records.map(item => {
        return {
          key: item.id,
          ...item
        }
      }))
      pagination.current.total = res.data.total
      setSpinning(false)
    } else {
      messageApi.open({
        type: 'error',
        content: '服务器异常',
      });
    }
    setSpinning(false)
  }
  useEffect(() => {
    handleGetAllUser()
  }, [])

  // 分页器每页条数变化
  const onShowSizeChange = (current, size) => {
    // setTableParams(pre => { return { ...pre, pageSize: size, current: current } })
    pagination.current.current = current
    pagination.current.pageSize = size
    handleGetAllUser()
  }
  // 分页器页码变化事件
  const onChange = (page, pageSize) => {
    console.log(page)
    // setTableParams(pre => { return { ...pre, current: page, pageSize: pageSize } })
    pagination.current.current = page
    pagination.current.pageSize = pageSize
    handleGetAllUser()
  }
  // 点击搜索
  const searchHandler = () => {
    handleGetAllUser(filter)
  }
  // 点击分配角色
  const handleClickAsignRoles = async (record) => {
    setUsername(record.username)
    userRole.current.userId = record.id
    setOpen(true)
    let res = await getAllRoles(record.id)
    if (res.code === 200) {
      setAllRolesList(res.data.allRolesList.map(item => { //设置所有角色多选选项
        return { key: item.id, value: item.id, label: item.roleName, }
      }))
      setAssignRolesList(res.data.assignRoles.map(item => {  //选中的角色列表【id，id】
        return item.id
      }))


    } else {
      message.error(res.msg)
    }
  }
  // 抽屉close
  const onClose = () => {
    setOpen(false);
  };

  // 角色分配checkBox cahnge事件
  const checkOnChange = (e) => {
    setAssignRolesList(e)
  }
  // 角色分配check全选cahnge事件
  const onAllCheckChange = (e) => {
    if (e.target.checked) {
      setAssignRolesList(allRolesList.map(item => item.value))
    } else {
      setAssignRolesList([])
    }

  }
  // 点击保存
  const save = async () => {
    userRole.current.roleIdList = assignRolesList
    let res = await assignRoles(userRole.current)
    if (res.code === 200) {
      message.success('分配成功')
      setOpen(false)
      handleGetAllUser()
    } else {
      message.error(res.message)
    }
  }
  // 点击确定删除用户
  const confirmDeluser = async (record) => {
    let res = await deleteUser(record.id)
    if (res.code === 200) {
      message.success('删除成功')
      handleGetAllUser()
    } else {
      message.error(res.message)
    }
  }
  // 点金添加用户按钮
  const handleClickAddUser = () => {
    setUser({id: '',username: '',password: '',name: '',phone:'',})
    setModalOpen(true)
  }
  // 点击编辑用户
  const handleClickEditUser = (record)=>{
    setUser({id: '',username: '',password: '',name: '',phone:'',})
    setModalOpen(true)
    setUser(pre=>({...pre,
      id:record.id,
      username:record.username,
      name:record.name,
      // password:record.password,
      phone:record.phone
    }))
  }
  // 点击确认修改/添加用户
  const handleAddOrUpdateUser = async()=>{
    let res = await addOrUpdateUser(user)
    if (res.code === 200) {
      message.success('保存成功')
      setModalOpen(false)
      handleGetAllUser()
    } else {
      message.error(res.message)
    }
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
                <Input placeholder='请输入用户名' value={filter} onChange={(e) => setFilter(e.target.value)} />
              </Form.Item>
            </Form>
          </Col>
          <Col >
            <Button style={{ marginLeft: '30px' }} icon={<SearchOutlined />} onClick={searchHandler}>查询</Button>
            <Button style={{ marginLeft: '10px' }} icon={<SwapOutlined />} onClick={() => { handleGetAllUser('') }}>重置</Button>
            <Button style={{ marginLeft: '130px' }} icon={<PlusCircleOutlined />} onClick={handleClickAddUser}>添加用户</Button>
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

        <MySpin spinning={spinning} />
        <Drawer
          title={'分配角色'}
          placement="right"
          width={680}
          onClose={onClose}
          open={open}
          closable={false}
          footer={
            <div style={{ width: '100%', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px' }}>
              <Button onClick={onClose}>取消</Button>
              <Button onClick={save} type="primary">
                保存
              </Button>
            </div>
          }
        >
          <Form layout='vertical' size='large'>
            <Form.Item label="用户名">
              <Input disabled value={username} placeholder='请输入用户名' style={{ width: '300px' }} />
            </Form.Item>
            <Form.Item label="角色列表">
              <Checkbox onChange={(e) => { onAllCheckChange(e) }} checked={assignRolesList.length === allRolesList.length} >全选</Checkbox>
              <br />
              <br />
              <Checkbox.Group options={allRolesList} value={assignRolesList} onChange={(e) => { checkOnChange(e) }} />
            </Form.Item>
          </Form>


        </Drawer>
        {/* 添加/修改用户对话框 */}
        <Modal
          title={user.id?'修改用户':"添加用户"}
          footer={
            <div style={{ width: '100%', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px' }}>
              <Button onClick={() => { setModalOpen(false) }}>取消</Button>
              <Button 
              disabled={user.id? !(user.name.trim().length&&user.username.trim().length&&user.phone.trim().length)
                :
                !(user.name.trim().length&&user.username.trim().length&&user.password.trim().length&&user.phone.trim().length)} 
              onClick={handleAddOrUpdateUser} type="primary">
                保存
              </Button>
            </div>
          }
          centered
          maskClosable
          keyboard
          onCancel={() => { setModalOpen(false) }}
          open={modalOpen}
          width='1000'
          style={{ minHeight: '600px' }}
        >
          <Card style={{ width: '500px', minHeight: '450px' }}>
            <Form size='large' layout='vertical'>
              <Form.Item label="用户名" >
                <Input placeholder='请输入用户名' value={user.username} 
                onChange={(e)=>{setUser(pre=>({...pre,username:e.target.value}))}} 
                style={{ width: '300px' }} />
              </Form.Item>
              <Form.Item label="姓名" >
                <Input placeholder='请输入姓名' value={user.name}  style={{ width: '300px' }} 
                onChange={(e)=>{setUser(pre=>({...pre,name:e.target.value}))}} />
              </Form.Item>
              <Form.Item label="电话" >
                <Input placeholder='请输入电话号码' value={user.phone}  style={{ width: '300px' }} 
                onChange={(e)=>{setUser(pre=>({...pre,phone:e.target.value}))}} />
              </Form.Item>
              <Form.Item label="密码">
                <Input placeholder='请输入密码' value={user.password} disabled={user.id} style={{ width: '300px' }} 
                onChange={(e)=>{setUser(pre=>({...pre,password:e.target.value}))}}/>
              </Form.Item>
            </Form>
          </Card>
        </Modal>
      </Card>
    </div>
  )
}
