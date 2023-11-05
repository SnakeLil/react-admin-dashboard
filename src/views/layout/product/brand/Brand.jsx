import React ,{useState,useRef}from 'react'
import './brand.scss'
import { Card, Button ,message,Table,Pagination} from 'antd';
import { PlusOutlined } from '@ant-design/icons'
export default function Brand() {
  const [messageApi, contextHolder] = message.useMessage();
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '品牌名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'logo',
      dataIndex: 'logo',
      key: 'logo',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button>修改</Button>
          <Button>删除</Button>
        </div>
      ),
    },
  ];
  const brandList = useState([])

  // 分页器
  const pagination = useRef({
    current: 1,
    pageSize: 8,
    total: 0,
  })
  // 分页器每页条数变化
  const onShowSizeChange = (current, size) => {
    // setTableParams(pre => { return { ...pre, pageSize: size, current: current } })
    pagination.current.current=current
    pagination.current.pageSize=size
  }
  // 分页器页码变化事件
  const onChange = (page, pageSize) => {
    console.log(page)
    // setTableParams(pre => { return { ...pre, current: page, pageSize: pageSize } })
    pagination.current.current=page
    pagination.current.pageSize=pageSize
    console.log(pagination)
  }


  return (
    <div className='brand'>
      <Card style={{ width: '100 %' }}>
        <Button icon={<PlusOutlined />}>添加品牌</Button>
        <div style={{ width: '100%',marginTop: '30px'  }}>

          <Table columns={columns} dataSource={brandList} bordered pagination={false} />
          <Pagination
            style={{ marginTop: '30px' }}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            total={pagination.current.total}
            current={pagination.current.current}
            pageSize={pagination.current.pageSize}
            onChange={onChange}
            pageSizeOptions={[1, 2, 5, 10, 15, 20, 25, 30]}
            showQuickJumper
          />
        </div>
      </Card>
    </div>
  )
}