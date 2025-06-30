/* eslint-disable no-unused-vars */
import './Auth.css'
import {Link, useNavigate} from 'react-router-dom'
import {useState} from 'react'
export default function Register(){

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password,setPassword] =useState('')
    const [confirmedPassword,setConfirmedPassword] = useState('')
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const submitForm = async()=>{

      console.log({username, email, password})
      try{ 
        const response = await fetch("http://localhost:5000/register",{
          method: "POST",
          headers:{'Content-Type':"application/json"},
          body:JSON.stringify({username,email,password})
        })
        
        const result = await response.json();
        if(result.success){
          navigate('/')
          setIsRegistered(true)
          console.log("Registered succesfully!")
        }else{
          console.log(result.error)
        }
      }
      catch(error){
        console.log("Unable to register",error)
      }
    }
    if(isRegistered){
      
      console.log("going to home page")
    }

    return <>
    <div className="container">
        <h1>Register</h1>
        <form action={()=>submitForm()}>
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
            <button className='submit' type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to='../login'>Login</Link></p>
    </div>
    </>
}