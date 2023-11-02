import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './login.scss'
export default function Login() {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const handelLogin = (e)=>{
        e.preventDefault()
    }
  return (
    <div>
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
                    placeholder='Username' 
                    />
                    <input type="password" name='password'   placeholder='Password' />
                    <button onClick={handelLogin}>登录</button>

                </form>

            </div>
        </div>
    </div>
    </div>
  )
}
