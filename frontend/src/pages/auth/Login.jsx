import './Auth.css'
import {Link} from 'react-router-dom'
import {useState} from 'react'
export default function Login(){

    const [email, setEmail] = useState('')
    const [password,setPassword] =useState('')
    


    return <>
    <div className="container">
        <h1>Login</h1>
        <form action="">
           <div className='input-container'>
             <label htmlFor="email">Email Address</label>
            <input type="text"  name="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="example@company.com"/>
           </div>
           <div className='input-container'> 
             <label htmlFor="password" >Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} name='password' required/>
            <p><Link >Forgot password</Link></p>
           </div>
            <button className='submit' type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to='../register'>Register</Link></p>
    </div>
    </>
}