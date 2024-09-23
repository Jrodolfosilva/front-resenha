"use client"

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import ContainerHeader from "../utilidades/components/header/header";
import style from "./layout.module.css"
import Loading from "../utilidades/components/loading/loading"



export default  function LayoutDashboard({children,}: Readonly<{children: React.ReactNode;}>) {

const route = useRouter()
const [token,setToken] = useState<string|null>("")
const [display,setDisplay] = useState<boolean>(false)
const url =  process.env.BASE_URL


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
    route.push('admin')
  }
  else{
    setDisplay(true)
  }
 

}

useEffect(()=>{

try {
  const CurrentUser = localStorage.getItem('admin')

  if(CurrentUser){
    const user = JSON.parse(CurrentUser)  ;
    verifyToken(user.access)
 
  }
  else{
    route.push('/admin')
  }
  

} catch (error) {
  console.log(error)
  localStorage.removeItem('admin')
  route.push('/admin')
}



},[])


  return (
 
    <>
       <ContainerHeader link="/dashboard"/>
        <main className={style.container_main}>
            {display?children:<Loading/>}
        </main>
    </>
     
 
 
    
  );
    
   
}
