'use client'

import {useForm,SubmitHandler,FieldValues} from "react-hook-form"
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css"
import fetchLogin from "../utilidades/fetch-login";
import { useRouter } from "next/navigation";
import {API} from '../utilidades/config'



type Idataformlogin = {
  email: string
  password: string
}

type Idatalogin = {
  status:string,
  name:string,
  token:{
    access:string,
    refresh:string
  },
  detail?:string
}

export default function Admin() {
const [erro,setErro] = useState<string>()
const {handleSubmit,formState,register,reset} =  useForm()
const route =  useRouter()
const request =  new API()

 const fnsubmit: SubmitHandler<Idataformlogin|FieldValues> = async(data) =>{
     
    const user ={
        "email" : data.email,
        "password" : data.password
      }

      try {
        const DataLogin:Idatalogin = await fetchLogin(user)

        if(DataLogin.detail){
          setErro(DataLogin.detail)
          reset()
        }
        else{
          localStorage.setItem('admin',JSON.stringify(DataLogin))
          route.push("/dashboard")
        }
      } catch (error) {
        
        setErro("Sistema fora do ar")
        reset()
      }
     
}

async function verifyToken (token:string){

  const response = await fetch(`http://127.0.0.1:8000/api/v1/verify/`,{
    method:"POST",
    headers: {
      'Content-Type' : 'Application/json'
    },
    body: JSON.stringify({
      'token':`${token}`
    })
  })

  if(response.status !== 200){
    localStorage.removeItem('admin')
    return
  }
  else{
    route.push('/dashboard')
  }
 

}

useEffect(()=>{

try {
  const CurrentUser = localStorage.getItem('admin')

  if(CurrentUser){
    const user = JSON.parse(CurrentUser)  ;
    verifyToken(user.access)
 
  }
   

} catch (error) {
  console.log(error)
  localStorage.removeItem('admin')
  route.push('/admin')
}



},[])

  return (
    <main className={styles.main} >
      <section className={styles.container_login}>
        
        <form onSubmit={handleSubmit(fnsubmit)} >
            <div className="header">
              <Image
                src="/resenha.webp"
                width={150}
                height={120}
                alt="Logo"
                priority
              />
            </div>
            <label htmlFor="">
              <input type="email" {...register('email')} id="email" placeholder="Email" />
            </label>
            <label htmlFor="">
              <input type="password" {...register('password')} id="password" placeholder="Senha" />
            </label>
            <input type="submit" 
              value={formState.isSubmitting?"Aguarde...":"Acessar"} 
              disabled={formState.isSubmitting} />
              {erro&&<span className="error">{erro}</span>}
              
          </form>
          
      </section>
        
    </main>
  );
}
