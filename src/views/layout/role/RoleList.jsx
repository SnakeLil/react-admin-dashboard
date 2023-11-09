import React, { useEffect, useRef, useState } from 'react'
import { Modal, Popconfirm, Card, Table, Row, message, Pagination, Drawer, Button, Form, Input, Tree } from 'antd'
import MySpin from '../../../components/spin/MySpin';
import { ContactsOutlined, PlusCircleOutlined, QuestionCircleOutlined, SearchOutlined,  EditOutlined, SwapOutlined, DeleteOutlined } from '@ant-design/icons'
import { getRoleList, addOrUpdateRole, deleteRoleReq, getRoleMenu ,assignRoleMenu} from '../../../api/acl/role';
export default function RoleList() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [filter, setFilter] = useState('')
  const [roleList, setRoleList] = useState([])
  // const [roleMenuList, setRoleMenuList] = useState([])
  const [role, setRole] = useState({
    id: '',
    roleName: '',
  })
  //树
  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const selectRoles = useRef([])
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },

    {
      title: '角色名',
      dataIndex: 'roleName',
      key: 'roleName',

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
          <Button icon={<ContactsOutlined />} onClick={() => { handleClickAsignPermission(record) }}>分配权限</Button>
          <Button icon={<EditOutlined />} onClick={() => { handleClickEditRole(record) }}>编辑</Button>
          <Popconfirm
            description={`确定删除该用户吗?`}
            okText="确认"
            cancelText="取消"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
            onConfirm={() => { handleConfirmDelRole(record) }}>
            <Button icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>

        </div>
      ),
    },
  ];

  // 分页器
  const pagination = useRef({
    current: 1,
    pageSize: 5,
    total: 0,
  })
  // 获取所有角色
  const getAllRole = async (filter) => {
    setSpinning(true)
    let res = await getRoleList(pagination.current.current, pagination.current.pageSize, filter ? filter : '')
    if (res.code === 200) {
      setSpinning(false)
      setRoleList(res.data.records.map(item => {
        return { ...item, key: item.id }
      }))
      pagination.current.total = res.data.total

    } else {
      setSpinning(false)
      message.error(res.message)
    }
  }
  useEffect(() => {
    getAllRole()
  }, [])
  // 点击搜索
  const searchHandler = () => {
    getAllRole(filter)
  }
  // 分页器每页条数变化
  const onShowSizeChange = (current, size) => {
    // setTableParams(pre => { return { ...pre, pageSize: size, current: current } })
    pagination.current.current = current
    pagination.current.pageSize = size
    getAllRole()
  }
  // 分页器页码变化事件
  const onChange = (page, pageSize) => {
    // setTableParams(pre => { return { ...pre, current: page, pageSize: pageSize } })
    pagination.current.current = page
    pagination.current.pageSize = pageSize
    getAllRole()
  }
  // 点击确定删除角色
  const handleConfirmDelRole = async (record) => {
    let res = await deleteRoleReq(record.id)
    if (res.code === 200) {
      message.success('删除成功')
      getAllRole()
    } else {
      message.error(res.message)
    }
  }
  // 点击添加角色按钮
  const handleAddRole = () => {
    setRole({ id: '', roleName: '', })
    setModalOpen(true)
  }
  // 点击修改角色按钮
  const handleClickEditRole = (record) => {
    setRole({ id: '', roleName: '', })
    setModalOpen(true)
    setRole(pre => ({ ...pre, id: record.id, roleName: record.roleName }))
  }
  // 点击保存，添加/修改角色
  const handleAddOrUpdateRole = async () => {
    let res = await addOrUpdateRole(role)
    if (res.code === 200) {
      message.success(role.id ? '修改成功' : '添加成功')
      setModalOpen(false)
      getAllRole()
    } else {
      message.error(res.message)
    }
  }
  const roleListFilter = (data)=>{//处理返回的角色数据，返回树结构数据
    return JSON.parse(JSON.stringify(data)).map(item=>{
      if(item.children && item.children.length>0){
        item.children = roleListFilter(item.children)
        return {
          title:item.name,
          key: item.id,
          children:item.children
        }
      }
      return {
        title:item.name,
        key: item.id,
      }
    })
  }
  
  const roleListCheckFilter = (data)=>{
    data.forEach(item=>{
      if(item.select&&(item.children.length ===0||!item.children)){
        setCheckedKeys(arr => [...arr, item.id])
      }
      if(item.children && item.children.length>0){
        roleListCheckFilter(item.children)
        
      }
      
      
    })
    
  }
  // 点击分配权限按钮
  const handleClickAsignPermission = async (record) => {
    setCheckedKeys([])
    setOpen(true)
    setRole(pre=>({...pre,id:record.id}))
    let res = await getRoleMenu(record.id)
    if (res.code === 200) {
      setTreeData(roleListFilter(res.data))
      // console.log(res.data)
      roleListCheckFilter(res.data)
      
      
    }else {
      message.error(res.message)
    }
  }
  // 抽屉close
  const onClose = () => {
    setOpen(false);
    setCheckedKeys([])
  };
  // 点击分配权限的保存按钮 发送请求
  const save = async() => {
    let res = await assignRoleMenu(role.id,selectRoles.current)
    if(res.code === 200) {
      message.success('分配权限成功')
      onClose()

    }else {
      message.error(res.message)
    }
  }

  const onExpand = (expandedKeysValue)=>{
    setExpandedKeys(expandedKeysValue);
  }
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(pre=>checkedKeysValue);
    selectRoles.current = checkedKeysValue;
  };
  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };
  return (
    <div>
      <Card style={{ display: 'flex', flexDirection: 'row' }}>
        <Row style={{ marginTop: '20px' }}>
          <Form
            name="basic"

            autoComplete="off"
          >
            <Form.Item label="用户名" name="username">
              <Input placeholder='请输入用户名' value={filter} onChange={(e) => setFilter(e.target.value)} />
            </Form.Item>
          </Form>
          <Button style={{ marginLeft: '30px' }} icon={<SearchOutlined />} onClick={searchHandler}>查询</Button>
          <Button style={{ marginLeft: '10px' }} icon={<SwapOutlined />} onClick={() => { getAllRole('') }}>重置</Button>
          <Button style={{ marginLeft: '130px' }} icon={<PlusCircleOutlined />} onClick={handleAddRole}>添加角色</Button>
        </Row>
        {/* 表格 */}
        <div style={{ width: '100%' }}>

          <Table columns={columns} dataSource={roleList} bordered pagination={false} />
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
          title={'分配权限'}
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
          <Tree
          defaultExpandAll
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={true}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={treeData}
          />
        </Drawer>

        {/* 添加/修改用户对话框 */}
        <Modal
          title={role.id ? '修改角色' : "添加角色"}
          footer={
            <div style={{ width: '100%', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px' }}>
              <Button onClick={() => { setModalOpen(false) }}>取消</Button>
              <Button
                disabled={!role.roleName.trim().length}
                onClick={handleAddOrUpdateRole} type="primary">
                保存
              </Button>
            </div>
          }
          centered
          maskClosable
          keyboard
          onCancel={() => { setModalOpen(false) }}
          open={modalOpen}
          width='800'
          style={{ minHeight: '500px' }}
        >
          <Card style={{ width: '500px', minHeight: '350px' }}>
            <Form size='large' layout='vertical'>
              <Form.Item label="角色名" >
                <Input placeholder='请输入角色名' value={role.roleName}
                  onChange={(e) => { setRole(pre => ({ ...pre, roleName: e.target.value })) }}
                  style={{ width: '300px' }} />
              </Form.Item>
            </Form>
          </Card>
        </Modal>
      </Card>
    </div>
  )
}
