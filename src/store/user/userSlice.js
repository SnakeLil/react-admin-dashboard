import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username:'',
    avatar:'',
    token:localStorage.getItem('react_admin_dashboard_token'),
    name:'',
    roles:[],
    routes:[],
    buttons:[]
  },
  reducers: {
    increment: state => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。
      // 并不是真正的改变 state 因为它使用了 immer 库
      // 当 immer 检测到 "draft state" 改变时，会基于这些改变去创建一个新的
      // 不可变的 state
      state.value += 1
    },
    login:(state,payload)=>{
        state.token = payload.payload
        localStorage.setItem('react_admin_dashboard_token',payload.payload)
    },
    userInfo:(state,payload)=>{
        state.name = payload.payload.name
    },
    logout:state=>{
        state.token = ''
        state.username =''
        state.avatar = ''
        localStorage.removeItem('react_admin_dashboard_token')
    }

  }
})

export const { login,logout,userInfo} = userSlice.actions

export default userSlice.reducer