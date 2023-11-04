import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './login.scss'
import { login as reqLogin } from '../../api/user'
import {
    Alert,
    AlertIcon,

} from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { login } from '../../store/user/userSlice'
export default function Login() {
    const [username, setUsername] = useState('admin')
    const [password, setPassword] = useState('atguigu123')
    const [alert, setAlert] = useState(false)
    const [err,setErr] = useState(false)
    const dispatch = useDispatch()
    const navgate = useNavigate()
    const handelLogin = async (e) => {
        e.preventDefault()
        const user = {
            username: username,
            password: password
        }
        let res = await reqLogin(user)
        if (res.code === 200) {
            navgate('/', { replace: true })
            setAlert(true)
            dispatch(login(res.data))
        }else {
            setErr(true)
        }
    }
    return (
        <div>
            {alert?
            <Alert status={err?'warning':'success'} variant='subtle' justifyContent='center' alignItems='center' >
                <AlertIcon />
                {err?'失败':'登陆成功'}
            </Alert>:null
            }
            <div className='login'>
                <div className="card">
                    <div className="left">
                        <h1>Hello Login.</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur error nesciunt suscipit deserunt
                            nostrum facere officia quo eaque unde reprehenderit dolorem.</p>
                        <span>Dont't you have an account?</span>
                        <Link to='/register'><button>Register</button></Link>
                    </div>
                    <div className="right">
                        <h2>登录</h2>
                        <form>
                            <input type="text" name='username'
                                placeholder='Username' value={username}
                                onChange={(e) => { setUsername(e.target.value) }}
                            />
                            <input type="password" name='password'
                                placeholder='Password' value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <button onClick={handelLogin}>登录</button>

                        </form>
                    </div>
                </div>

            </div>

        </div>
    )
}
