import React from 'react'
import {useNavigate,Link } from 'react-router';
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";

const Register = () => {
  const navigate = useNavigate();
  const [username,setUsername]=React.useState("");
  const [email,setEmail]=React.useState("");
  const [password,setPassword]=React.useState("");
  
  const {loading,handleRegister}=useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({username,email,password});
    navigate("/login");
  };

  if(loading){
    return <div>Loading...</div>;
  }
  return (
    <main>
      <div className="from-container" >
        <h1>Register</h1>
        <form onSubmit={handleSubmit} >
          <div className='input-group'>
            <label htmlFor="username">username</label>
            <input type="username" id="username" name="username" placeholder='enter your username'
            value={username}
            onChange={(e)=>setUsername(e.target.value)} />
          </div>

          <div className='input-group'>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder='enter your email address' 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className='input-group'>
            <label htmlFor="password">password</label>
            <input type="password" id="password" name="password" placeholder='enter your password' 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <button className='button primary-button'>Register</button>
        </form>

          <p>have already account ? <Link to={"/login"}> Login</Link></p>
      </div>
    </main>
  )
}
export default Register
