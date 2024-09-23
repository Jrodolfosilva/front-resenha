'use client'

import {useForm,SubmitHandler,FieldValues} from "react-hook-form"

import Image from "next/image";
import styles from "./page.module.css"
import {API} from "../utilidades/config";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";




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

type Ibancada = {
  access?:string,
    refresh?:string,
    status?:number
}

export default function Bancada() {

const {handleSubmit,formState,register} =  useForm()
const route =  useRouter()
const [erro,setErro] = useState<string>()

 const fnsubmit: SubmitHandler<Idataformlogin|FieldValues> = async(data) =>{
     const request = new API();
     const user ={
        "email" : data.email,
        "password" : data.password
      }

      try {
        const DataLogin:Ibancada = await new request.AuthClass().tokenBancada(user.email,user.password)
        localStorage.setItem("bancada",JSON.stringify(DataLogin))  
        
       
        if(DataLogin.status !== 200){
          setErro('Verifique Email/senha')
        }
        if(DataLogin.access){
          route.push('/bancada/jogo')
        }

      } catch (error) {
        setErro("Erro, tente mais tarde")
        console.log("catch")
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
    console.log(response.status)
    localStorage.removeItem('bancada')
    return
  }
  else{
    route.push('/bancada/jogo')
  }
 

}

useEffect(()=>{

try {
  const CurrentUser = localStorage.getItem('bancada')

  if(CurrentUser){
    const user = JSON.parse(CurrentUser)  ;
    verifyToken(user.access)
 
  }
   

} catch (error) {
  console.log(error)
  localStorage.removeItem('Bancada')
  route.push('/bancada')
}



},[])




  return (
    <main className={styles.main} >
      <section className={styles.container_login}>
        
        <form onSubmit={handleSubmit(fnsubmit)} >
            <div className="header">
              <Image
                src="/resenha.png"
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
              value={formState.isSubmitting?"Aguarde...":"Acesso bancada"} 
              disabled={formState.isSubmitting} />
              {erro&&<span className="error">{erro}</span>}

          </form>
          
      </section>
        
    </main>
  );
}
