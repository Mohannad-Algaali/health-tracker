import './Auth.css'
import {Link} from 'react-router-dom'
import {useState} from 'react'
export default function Register(){

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password,setPassword] =useState('')
    const [confirmedPassword,setConfirmedPassword] = useState('')
    


    return <>
    <div className="container">
        <h1>Register</h1>
        <form action="">
           <div className='input-container'>
             <label For="Username">Username</label>
            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} required placeholder="John"/>
           </div><div className='input-container'>
             <label For="email">Email Address</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="example@company.com"/>
           </div>
           <div className='input-container'> 
             <label htmlFor="password" >Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} name='password' required/>
           </div>
           <div className='input-container'> 
             <label htmlFor="password" >Confirm Password</label>
            <input type="password" placeholder="Confirm password" value={confirmedPassword} onChange={(e)=>setConfirmedPassword(e.target.value)} name='password' required/>
           </div>
            <button className='submit' type="submit">Login</button>
        </form>
        <p>Already have an account? <Link to='../login'>Login</Link></p>
    </div>
    </>
}