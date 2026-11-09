import React from 'react'
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router';

const Protected = ({ children }) => {
  const {loading,user}=useAuth();
  if(loading){
    return <div>Loading...</div>
  }
  if(!user){
    return <Navigate to="/login" replace={true} />
  }
  return (
    children
  )
}//react pass props as object so if i used (children) then it will give error or either dont read the data proprly so we have to use {children} in props

export default Protected
