import { createSlice } from '@reduxjs/toolkit'


export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    category1Id: '',
    category2Id: '',
    category3Id: '',
    c1Arr: [],
    c2Arr: [],
    c3Arr: []
  },
  reducers: {

    getC1: (state, action) => {
      state.c1Arr = action.payload
      // console.log(action.payload)
    },
    // 获取1级全部分类,存进仓库
    setCategory1Id: (state, action) => {
      state.category1Id = action.payload
      //  console.log(action)
    },
    setC2Arr: (state, action) => {
      state.c2Arr = action.payload
    },
    // ,存c2Id
    setCategory2Id: (state, action) => {
      state.category2Id = action.payload
      //  console.log(action)
    },
    // 发请求存c3分类数据
    setC3Arr:(state,action)=>{
      state.c3Arr=action.payload
    },
    // 存c3Id
    setCategory3Id:(state,action)=>{
      state.category3Id=action.payload
    },
    // 清空仓库
    clearCategory:  (state) =>  {
      state.c1Arr = []
      state.c2Arr = []
      state.c3Arr = []
      state.category1Id = ''
      state.category2Id = ''
      state.category3Id = ''
    }


  }
})

export const { setCategory1Id, getC1, setC2Arr,setCategory2Id ,setC3Arr,setCategory3Id,clearCategory} = categorySlice.actions

export default categorySlice.reducer