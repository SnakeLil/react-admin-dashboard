import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, message, Table, Pagination, Form, Tag, Tabs, Input, Popconfirm, Drawer } from 'antd';
import { ArrowUpOutlined,ArrowDownOutlined,DeleteOutlined,BarChartOutlined,SnippetsOutlined,HighlightOutlined,MoneyCollectOutlined,BoxPlotOutlined, EyeOutlined, PlusOutlined, EditOutlined, QuestionCircleOutlined ,AimOutlined,ExperimentOutlined,FileImageOutlined} from '@ant-design/icons'
import { getSkuList, onSale, offSale,getSkuInfo, delSku } from '../../../../api/product/sku';
import MySpin from '../../../../components/spin/MySpin';
export default function Sku() {
  const [skuList, setSkuList] = useState([]) //
  const [spinning, setSpinning] = useState(false) //全屏loading
  const [skuInfo, setSkuInfo] = useState({}) //单个sku的数据，用于展示和上下架
  const [open, setOpen] = useState(false);
  const skuColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 120,
      fixed: 'left',

    },
    {
      title: '名称',
      dataIndex: 'skuName',
      key: 'skuName',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'skuDesc',
      key: 'skuDesc',
      align: 'center',
      ellipsis: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: '图片',
      dataIndex: 'skuDefaultImg',
      key: 'skuDefaultImg',
      align: 'center',
      width: 200,
      render: (value, record) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={value} alt="" style={{ width: '60px', height: '60px' }} />
          </div>
        )
      }
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      align: 'center',

      width: 120,
    },
    {
      title: '重量',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',

      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: 120,
      ellipsis: true,

    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
      width: 80,
      ellipsis: true,

    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={{ width: '100%', height: '100%', display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
          <Button icon={!record.isSale?<ArrowUpOutlined style={{color:'#85a5ff'}}/>:<ArrowDownOutlined style={{color:'#8c8c8c'}}/> } title={!record.isSale?'上架':'下架'} onClick={() => { handleClickIsSale(record)}}>{!record.isSale?'上架':'下架'}</Button>
          <Button icon={<EditOutlined />} title='修改spu' onClick={() => {handleModifySku(record) }}>修改</Button>
          <Button icon={<EyeOutlined />} title='查看sku列表' onClick={() => { handleClickToGetSkuById(record) }}>查看</Button>
          <Popconfirm
            description={`确定删除吗?`}
            okText="确认"
            cancelText="取消"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
            onConfirm={() => { handleConfirmDel(record) }}>
            <Button icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </div>
      ),
    },

  ]
  // tabs 标签页数据，展示sku的数据
  const [items,setItems] = useState([
    {
      key: '1',
      label: (
      <span>
        <SnippetsOutlined />
        商品名称
      </span>),
      children:'',
    },
    {
      key: '2',
      label:(
        <span>
          <HighlightOutlined />
          商品描述
        </span>),
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label:(
        <span>
          <MoneyCollectOutlined />
          商品价格
        </span>),
      children: 'Content of Tab Pane 3',
    },
    {
      key: '4',
      label:(
        <span>
          <BoxPlotOutlined />
          商品重量
        </span>),
      children: 'Content of Tab Pane 3',
    },

    {
      key: '5',
      label:(
        <span>
          <FileImageOutlined />
          默认图片
        </span>),
      children: 'Content of Tab Pane 3',
    },
    {
      key: '6',
      label:(
        <span>
          <ExperimentOutlined />
          平台属性
        </span>),
      children: 'Content of Tab Pane 3',
    },
    {
      key: '7',
      label:(
        <span>
          <AimOutlined />
          销售属性
        </span>),
      children: 'Content of Tab Pane 3',
    },
    {
      key: '8',
      label:(
        <div>
          <BarChartOutlined />
          查看全部
        </div>),
      children: '',
      disabled: true,
    },
  ]);
  // 分页器
  const pagination = useRef({
    current: 1,
    pageSize: 8,
    total: 0,
  })
  // 分页器每页条数变化
  const onShowSizeChange = (current, size) => {
    pagination.current.current = current
    pagination.current.pageSize = size
    getAllSku()

  }
  // 分页器页码变化事件
  const onChange = (page, pageSize) => {
    pagination.current.current = page
    pagination.current.pageSize = pageSize
    getAllSku()
  }
  // 获取sku列表数据
  const getAllSku = async () => {
    setSpinning(true)
    let res = await getSkuList(pagination.current.current, pagination.current.pageSize)
    if (res.code === 200) {
      setSpinning(false)
      setSkuList(res.data.records.map(item => {
        return { ...item, key: item.id }
      }))
      pagination.current.total = res.data.total
    } else {
      setSpinning(false)
      message.error(res.message)
    }
  }

  // 组件渲染
  useEffect(() => {
    getAllSku()
  }, [])

  // 点击确认删除sku
  const handleConfirmDel = async (record) => {
    let res = await delSku(record.id)
    if (res.code === 200) {
      message.success('删除成功')
      getAllSku()
    } else {
      message.error(res.message)
    }
  }
  // 点击查看按钮  根据skuid获取sku数据
  const handleClickToGetSkuById = async (record) => {
    let res = await getSkuInfo(record.id)
    setOpen(true)
    if (res.code === 200) {
      setSkuInfo(res.data)
      setItems(pre=>pre.map((item,index)=>{
        if(index ===0) item.children = res.data.skuName
        else if(index ===1) item.children = res.data.skuDesc
        else if(index ===2) item.children = res.data.price
        else if(index ===3) item.children = res.data.weight
        else if(index ===4) item.children = (<div >
          <img src={res.data.skuDefaultImg} alt="" style={{width:'200px',height:'200px'}}/>
          </div>)
          // 平台属性
        else if(index ===5) item.children = (<div >
          {res.data.skuAttrValueList.map(item=>{
            return <Tag key={item.id} color="green">{item.attrName} : {item.valueName}</Tag>
          })
          }
        </div>)
        // 销售属性
        else if(index ===6) item.children = (<div >
          {res.data.skuSaleAttrValueList.map(item=>{
            return <Tag key={item.id} color="geekblue">{item.saleAttrName} : {item.saleAttrValueName}</Tag>
          })
          }
        </div>)
        // 全部属性
        else if(index ===7) item.children = (<Card>
          {JSON.stringify(res.data)}
        </Card>)
        return item
      }))
    } else {
      message.error(res.message)
    }
  }
  // 抽屉close
  const onClose = () => {
    setOpen(false);
  };

// 点击修改sku
const handleModifySku = (record)=>{
  message.info('功能未完成~~~')
}
// 点击上下架
const handleClickIsSale = async (record)=>{
  if(record.isSale){
    // isSale是1，已上架的产品，点击下架
    let res = await offSale(record.id)
    if(res.code === 200){
      message.success('下架成功')
      getAllSku()
    }else {
      message.error(res.message)
    }
  }else {
    // isSale是0，未上架的产品，点击下架
    let res = await onSale(record.id)
    if(res.code === 200){
      message.success('上架成功')
      getAllSku()
    }else {
      message.error(res.message)
    }
  }
  console.log(record)
}
  return (
    <div>
      <Card>
        <Table columns={skuColumns} dataSource={skuList} bordered pagination={false} scroll={{ x: 2000, }}>

        </Table>

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
      </Card>
      <Drawer
        title={'SKU数据'}
        placement="right"
        width={736}
        onClose={onClose}
        open={open}
        closable={false}
      >
        <Tabs
          defaultActiveKey="1"
          centered
          items={items}
          tabPosition='left'
        />
      </Drawer>
      <MySpin spinning={spinning} />
    </div>
  )
}
