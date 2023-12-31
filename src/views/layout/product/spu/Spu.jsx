import React ,{useEffect, useRef,useState}from 'react'
import Category from '../../../../components/category/Category'
import { Card, Button, message, Table, Pagination, Form, Upload, Modal, Input, Popconfirm } from 'antd';
import {DeleteOutlined, EyeOutlined, PlusOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { getSpuList ,deleteSpu,getSkuListBySpu} from '../../../../api/product/spu';
import { useDispatch, useSelector } from 'react-redux';
import MySpin from '../../../../components/spin/MySpin';
import SpuForm from '../../../../components/spu/SpuForm';
import SkuForm from '../../../../components/spu/SkuForm';
import {  clearCategory} from '../../../../store/category/categorySlice';

export default function Spu() {
  const [spuList, setSpuList] = useState([])
  const [spinning,setSpinning] = useState(false)
  const categoryStore = useSelector(state=>state.category)
  const [sence,setSence ] = useState(0)
  const [spuData,setSpuData ]  = useState({})
  const [skuList,setSkuList] = useState([])//spu的sku列表数据
  const dispatch = useDispatch()
  const [modalOpen,setModalOpen] = useState(false)
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 150,

    },
    {
      title: 'spu名称',
      dataIndex: 'spuName',
      key: 'spuName',
      align: 'center',
      width: 350,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      ellipsis: true,
      width: 400,

    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 600,
      render: (_, record) => (
        <div style={{ width: '100%', height: '100%', display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
          <Button icon={<PlusOutlined />} title='添加sku' onClick={()=>{handleClickAddSku(record)}}>添加</Button>
          <Button icon={<EditOutlined />} title='修改spu' onClick={()=>{handleClickModifySpu(record)}}>修改</Button>
          <Button icon={<EyeOutlined />} title='查看sku列表' onClick={()=>{handleLookSku(record)}}>查看</Button>
          <Popconfirm
            description={`确定删除吗?`}
            okText="确认"
            cancelText="取消"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
            onConfirm={() => {confirmDelSpu(record) }}>
            <Button icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const skuColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 50,

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
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      
      width: 60,
    },
    {
      title: '重量',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      
      width: 60,
    },
    {
      title: '图片',
      dataIndex: 'skuDefaultImg',
      key: 'skuDefaultImg',
      align: 'center',
      width: 200,
      render:(value,record)=>{
        return (
          <div style={{display:'flex',justifyContent:'center'}}>
            <img src={value} alt="" style={{width:'60px',height:'60px'}}/>
          </div>
        )
      }
    },
  ]
  
  // 获取spu列表的请求
  const getAllSpu = async()=>{
    setSpinning(true)
    let res = await getSpuList(pagination.current.current,pagination.current.pageSize,categoryStore.category3Id)
    if(res.code ===200) {
      setSpinning(false)
      setSpuList(res.data.records.map(item=>{
        return {...item,key:item.id}
      }))
      pagination.current.total = res.data.total
    }else {
      setSpinning(false)
      message.error(res.message)
    }
  }
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
    getAllSpu()
  }
  // 分页器页码变化事件
  const onChange = (page, pageSize) => {
    pagination.current.current = page
    pagination.current.pageSize = pageSize
    getAllSpu()
  }
  useEffect(()=>{ //组件渲染时清空仓库分类数据
    dispatch(clearCategory())
    setSence(0)
    setSpuList((pre)=>[])
  },[])
  
  useEffect(()=>{
    if(categoryStore.category3Id) {
      getAllSpu()
    }
  },[categoryStore.category3Id])


  // 点击确定删除spu
  const confirmDelSpu = async(record) =>{
    let res = await deleteSpu(record.id)
    if(res.code === 200) {
      message.success('删除成功')
      getAllSpu()
    }else {
      message.error(res.message)
    }
  }
  // 点击添加spu
  const handleClickAddSpu = ()=>{
    setSpuData([])
    setSence(1)
  }
  // 点击添加sku
  const handleClickAddSku = (record)=>{
    setSence(2)
    setSpuData(record)
  }
  // 点击修改spu按钮
  const handleClickModifySpu = (record)=>{
    setSence(1)
    setSpuData(record)

  }
  // 点击查看sku列表
  const handleLookSku = async(record)=>{
    setModalOpen(true)
    let res = await getSkuListBySpu(record.id)
    if(res.code === 200) {
      setSkuList(res.data)
    }else {
      message.error(res.message)
    }
  }
  return (
    <div>
      {/* {sence===0?<Category view={sence}/>:null} */}
      <Category view={sence}/>
      {/* spu列表 */}
      {sence === 0?
      <Card style={{ width: '100 %',marginTop:'30px' }}>
        <Button icon={<PlusOutlined />} onClick={handleClickAddSpu} disabled={!categoryStore.category3Id}>添加SPU</Button>
        <div style={{ width: '100%', marginTop: '30px' }}>

          <Table columns={columns} dataSource={spuList} bordered pagination={false} />
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
      :sence === 1?
      // {/* 添加/修改spu组件 */}
      <SpuForm setSence={setSence} spu={spuData} getAllSpu={getAllSpu}/>
      :sence === 2?
      // {/* 添加sku组件 */}
      <SkuForm spu={spuData} setSence={setSence} />
      :null}
      <MySpin spinning={spinning} />

      {/* 对话框组件，显示查看某个spu的sku列表 */}

      <Modal
        title="SKU列表"
        footer={null}
        centered
        maskClosable
        keyboard
        onCancel={()=>{setModalOpen(false)}}
        open={modalOpen}
        width='1000'
        style={{minHeight:'600px'}}
        >
          <Card style={{width:'1000px',minHeight:'600px'}}>
        <Table columns={skuColumns} dataSource={skuList} bordered pagination={false}/>
        </Card>
      </Modal>
    </div>
  )
}
