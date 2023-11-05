import { createSlice } from '@reduxjs/toolkit'
import {getAttrOneList,getAttrTwoList,getAttrThreeList} from '../../api/product/category'


export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    category1Id:'',
    category2Id:'',
    category3Id:'',
    c1Arr:[],
    c2Arr:[],
    c3Arr:[]
  },
  reducers: {
    increment: state => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。
      // 并不是真正的改变 state 因为它使用了 immer 库
      // 当 immer 检测到 "draft state" 改变时，会基于这些改变去创建一个新的
      // 不可变的 state
      state.value += 1
    },
    // 获取1级全部分类
    setCategory1Id: async (state, action) => {
      let res = await getAttrOneList()
      if(res.code == 200) {
       state.c1Arr = res.data
       console.log(res)
      }

    },
    // 根据一级分类获取二级分类
    getCategory2: async (state, action) => {
      let res = await getAttrTwoList(action.payload.category1Id)
      if(res.code == 200) {
       state.c2Arr = res.data
      }
    },
    // 根据二级分类获取三级分类
    getCategory3: async (state, action) => {
      let res = await getAttrThreeList(state.category2Id)
      if(res.code == 200) {
       state.c3Arr = res.data
      }
    },


  }
})

export const { setCategory1Id,getCategory2,getCategory3} = categorySlice.actions

export default categorySlice.reducer