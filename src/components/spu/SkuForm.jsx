import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, message, Table, Form, Modal, Upload, Input, Popconfirm, Select, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusOutlined, EditOutlined, QuestionCircleOutlined, PushpinTwoTone } from '@ant-design/icons'
import { getSpuImageList, getSpuSaleList, addSkuForSpu } from '../../api/product/spu';
import { getAttrInfoList } from '../../api/product/category';
import { useDispatch, useSelector } from 'react-redux';
export default function SkuForm({ setSence, spu }) {
  const { Option } = Select;
  const { TextArea } = Input;
  const columns = [
    {
      title: '选择',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 150,
      render: (value, record) => {
        return <div key={record.id} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', }}>
          <span style={{ width: '30px', height: '30px', border: '1px solid gray', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'rgb(228, 93, 75)', fontWeight: 'bold' }}>
            {record.imgUrl === skuImgUrl ? '√' : ''}
          </span>
        </div>
      }

    },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      align: 'center',
      render: (value,record) => {
        return (
          <div key={record.id} style={{ width: '100%', height: '100%', display: 'flex', gap: '50px', justifyContent: 'center', alignItems: 'center' }}>
            <img src={value} alt="" style={{ width: '50px', height: '50px' }} />
          </div>
        )
      }
    },
    {
      title: '图片名',
      dataIndex: 'imgName',
      key: 'imgName',
      align: 'center',
      render: (value,record) => {
        return <span key={record.id}>{value?.split('.')[0]}</span>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
      width: 150,
      ellipsis: true,
    },

    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 300,
      render: (value, record) => (
        <div key={record.id} style={{ width: '100%', height: '65px', display: 'flex', gap: '50px', justifyContent: 'center', alignItems: 'center' }}>
          <Button icon={<PushpinTwoTone />} onClick={() => { handleSetDefaultImg(record) }} >设为默认图片</Button>
        </div>
      ),
    },
  ];
  const [skuData, setSkuData] = useState({ //一个完整的sku对象
    id: '',
    category3Id: '',
    spuId: '',
    tmId: '',
    skuName: '',//sku名
    price: '',
    weight: '',
    skuDesc: '',
    skuAttrValueList: [],//平台属性列表
    skuSaleAttrValueList: [], //销售属性列表
    skuDefaultImg: '',//设置的sku默认图的图片地址
    // isSale: '',//上下架用的，在sku管理中会用到
  })
  const skuInfo = useRef()
  const categoryStore = useSelector(state => state.category)
  const [spuImgList, setSpuImgList] = useState([1]) //图片table数据
  const [spuSaleList, setSpuSaleList] = useState([])//显示销售属性
  const [skuAttrValueList, setSkuAttrValueList] = useState([]) //显示三级分类下的平台属性

  const [skuSaleAttrValueList, setSkuSaleAttrValueList] = useState([]) //收集：sku选择的销售属性列表（属性id->属性值id）
  const [attrValueList, setAttrValueList] = useState([])//收集：sku选择的平台属性列表
  const [skuImgUrl, setSkuImgUrl] = useState('')//收集：sku选择的默认图片
  // 根据spu id获取销售属性列表
  const getSaleAttrList = async () => {
    let res = await getSpuSaleList(spu.id)
    if (res.code === 200) {
      setSpuSaleList(res.data)

    }
  }
  // 根据三级分类获取平台属性列表，属性管理中的请求
  const getSkuAttrValueList = async () => {
    let res = await getAttrInfoList(categoryStore.category1Id, categoryStore.category2Id, spu.category3Id)
    if (res.code === 200) {
      setSkuAttrValueList(res.data)
    } else {
      message.error(res.message)
    }
  }
  // 根据spuid获取图片列表
  const getAllSpuImgList = async () => {
    let res = await getSpuImageList(spu?.id)
    if (res.code === 200) {
      setSpuImgList(res.data.map(item => {
        return { ...item, key: item.id }
      }))
    } else {
      message.error(res.message)
    }
  }
  useEffect(() => {//组件首次渲染
    getSkuAttrValueList()
    if (spu.id) {
      setSkuData(pre => ({ ...pre, spuId: spu.id, tmId: spu.tmId, category3Id: spu.category3Id }))
      getSaleAttrList()
      getAllSpuImgList()
    }
  }, [])



  // 点击保存
  const save = async () => {
    skuInfo.current = skuData
    skuInfo.current.skuAttrValueList = attrValueList
    skuInfo.current.skuSaleAttrValueList = skuSaleAttrValueList
    skuInfo.current.skuDefaultImg = skuImgUrl
    try {
      let res = await addSkuForSpu(skuInfo.current)
      if (res.code === 200) {
        setSence(0)
        skuInfo.current = {}
        setSkuData({ id: '', category3Id: '', spuId: '', tmId: '', skuName: '', price: '', weight: '', skuDesc: '', skuAttrValueList: [], skuSaleAttrValueList: [], skuDefaultImg: '', })
        message.success('添加成功')
      } else {
        message.error(res.message)
      }
    } catch (err) {
      message.error(err.message)
    }

  }
  // 点击取消
  const cancel = () => {
    setSence(0)
    setSkuData({ id: '', category3Id: '', spuId: '', tmId: '', skuName: '', price: '', weight: '', skuDesc: '', skuAttrValueList: [], skuSaleAttrValueList: [], skuDefaultImg: '', })
  }

  // 销售属性选择框变化事件
  const onsaleAttrValueChange = (e) => {
    let arr = e.split(':')
    let saleAttrId = arr[0]
    let saleAttrValueId = arr[1]
    setSkuSaleAttrValueList(pre => [...pre, { saleAttrId, saleAttrValueId }]) //存入销售属性和属性值数组完成


  }
  // 平台属性选择框change事件
  const onAttrValueChange = (e) => {
    let arr = e.split(':')
    let attrId = arr[0]
    let valueId = arr[1]
    setAttrValueList(pre => [...pre, { attrId, valueId }])
  }
  // 点击设为默认图片
  const handleSetDefaultImg = (record) => {
    console.log(record)
    setSkuImgUrl(record.imgUrl)
  }
  return (
    <div>
      <Card style={{ width: '100 %', marginTop: '30px' }}>
        <Form size='large' layout='vertical' >
          <Form.Item label='SKU名称' >
            <Input placeholder='请输入SKU名称' style={{ width: '200px ' }}
              onChange={(e) => { setSkuData(pre => ({ ...pre, skuName: e.target.value })) }} />
          </Form.Item>
          <Form.Item label='价格(元)'>
            <Input type='number' placeholder='请输入SKU价格' style={{ width: '200px ' }}
              onChange={(e) => { setSkuData(pre => ({ ...pre, price: e.target.value })) }} />
          </Form.Item>
          <Form.Item label='重量(kg)'>
            <Input type='number' placeholder='请输入SKU重量' style={{ width: '200px ' }}
              onChange={(e) => { setSkuData(pre => ({ ...pre, weight: e.target.value })) }} />
          </Form.Item>
          <Form.Item label='SKU描述'>
            <TextArea rows={4}
              placeholder='请输入SKU描述' style={{ width: '600px ' }}
              onChange={(e) => { setSkuData(pre => ({ ...pre, skuDesc: e.target.value })) }}
            />
          </Form.Item>
          {/* 平台属性 */}
          <Form.Item label='平台属性:' >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
              {skuAttrValueList.map(item => {
                return (
                  <Form.Item label={item.attrName} key={item.id}>
                    <Select placeholder='请输入属性名' style={{ width: '200px ' }} onChange={(e) => { onAttrValueChange(e) }} >
                      {item.attrValueList.map(item1 => {
                        return (
                          <Option key={item1.id} value={`${item.id}:${item1.id}`}>{item1.valueName}</Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                )
              })}
            </div>
          </Form.Item>
          {/* 平台属性 */}

          {/* 销售属性 */}
          <Form.Item label='销售属性:'>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
              {spuSaleList.map(item => {
                return (
                  <Form.Item label={item.saleAttrName} key={item.id}>
                    <Select placeholder='请选择属性值' style={{ width: '200px ' }}
                      onChange={(e) => { onsaleAttrValueChange(e) }}
                    >
                      {item.spuSaleAttrValueList.map(item1 => {
                        return (
                          <Option key={item1.id} value={`${item.id}:${item1.id}`}>{item1.saleAttrValueName}</Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                )
              })}

            </div>
          </Form.Item>
          {/* 销售属性 */}

          {/* 商品图片 */}
          <Form.Item label='商品图片'>

          </Form.Item>
          <Table columns={columns} dataSource={spuImgList} bordered pagination={false} style={{ margin: '30px 0' }} />
          <Button onClick={save} >保存</Button>
          <Button style={{ marginLeft: '20px' }} onClick={cancel}>取消</Button>
        </Form>

      </Card>
    </div>
  )
}
