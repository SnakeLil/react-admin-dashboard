import React, { useEffect, useState } from 'react'
import { Card, Button, message, Table, Form, Modal, Upload, Input, Popconfirm, Select, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusOutlined, EditOutlined, QuestionCircleOutlined, PushpinTwoTone } from '@ant-design/icons'
import { getSpuImageList ,getSpuSaleList} from '../../api/product/spu';
export default function SkuForm({setSence,spu}) {
  const { Option } = Select;
  const { TextArea } = Input;
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 150,

    },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      align: 'center',
      render: (value) => {
        return(
         <div style={{ width: '100%', height: '100%', display: 'flex', gap: '50px', justifyContent: 'center', alignItems: 'center' }}>
          <img src={value} alt="" style={{width:'50px',height:'50px'}}/>
        </div>
        )
      }
    },
    {
      title: '图片名',
      dataIndex: 'imgName',
      key: 'imgName',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 300,
      render: (value, record) => (
        <div style={{ width: '100%', height: '100%', display: 'flex', gap: '50px', justifyContent: 'center', alignItems: 'center' }}>
          <Button icon={<PushpinTwoTone />} >设为默认图片</Button>
        </div>
      ),
    },
  ];
  const [skuData , setSkuData] = useState({ //一个完整的sku对象
    id:'',
    category3Id: '',
    spuId: '',
    tmId: '',
    skuName:  '',//sku名
    price: '',
    weight: '',
    skuDesc: '',
    skuAttrValueList:[],//平台属性列表
    skuSaleAttrValueList:[], //销售属性列表
    skuDefaultImg:'',//设置的sku默认图的图片地址
    isSale:'',//上下架用的，在sku管理中会用到
  })
  const [spuImgList, setSpuImgList] = useState([1]) //图片table数据

  useEffect(()=>{//组件首次渲染
    if(spu.id){
      setSkuData(pre=>({...pre,spuId:spu.id,tmId:spu.tmId,category3Id:spu.category3Id}))
    }

  },[])



  // 点击保存
  const save = async () => {

  }
  // 点击取消
  const cancel = () => {
    setSence(0)
  }
  return (
    <div>
      <Card style={{ width: '100 %', marginTop: '30px' }}>
        <Form size='large' layout='vertical' >
          <Form.Item label='SKU名称' >
            <Input placeholder='请输入SKU名称' style={{ width: '200px ' }} 
            onChange={(e) => { setSkuData(pre=>({...pre,skuName:e.target.value}))}} />
          </Form.Item>
          <Form.Item label='价格(元)'>
            <Input type='number' placeholder='请输入SKU价格' style={{ width: '200px ' }}
             onChange={(e) => { setSkuData(pre=>({...pre,price:e.target.value}))}}  />
          </Form.Item>
          <Form.Item label='重量(kg)'>
            <Input type='number' placeholder='请输入SKU重量' style={{ width: '200px ' }}
             onChange={(e) => { setSkuData(pre=>({...pre,weight:e.target.value}))}} />
          </Form.Item>
          <Form.Item label='SKU描述'>
            <TextArea rows={4} 
             placeholder='请输入SKU描述' style={{ width: '600px ' }} 
             onChange={(e) => { setSkuData(pre=>({...pre,skuDesc:e.target.value}))}}
            />
          </Form.Item>
          {/* 平台属性 */}
          <Form.Item label='平台属性:' >
            <Form size='large' layout='inline'>
              <Form.Item name='prop' label='属性名'>
                <Select placeholder='请输入属性名' style={{ width: '200px ' }} onChange={(e) => { }} >
                  <Option value='1'>颜色</Option>
                </Select>
              </Form.Item>
              <Form.Item name='value' label='属性值'>
                <Select placeholder='请输入属性名' style={{ width: '200px ' }} onChange={(e) => { }} >
                  <Option value='1'>颜色</Option>
                </Select>
              </Form.Item>
            </Form>
          </Form.Item>
          {/* 平台属性 */}

          {/* 销售属性 */}
          <Form.Item label='销售属性:'>
            <Form size='large' layout='inline'>
              <Form.Item name='prop' label='属性名'>
                <Select placeholder='请选择属性名' style={{ width: '200px ' }} onChange={(e) => { }} >
                  <Option value='1'>颜色</Option>
                </Select>
              </Form.Item>
              <Form.Item name='value' label='属性值'>
                <Select placeholder='请输入属性名' style={{ width: '200px ' }} onChange={(e) => { }} >
                  <Option value='1'>颜色</Option>
                </Select>
              </Form.Item>
            </Form>
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
