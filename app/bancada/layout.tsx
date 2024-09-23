"use client"

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import ContainerHeader from "../utilidades/components/header/header";
import Loading from "../utilidades/components/loading/loading";




export default  function LayoutJogo({children,}: Readonly<{children: React.ReactNode;}>) {

const route = useRouter()
const [display,setDisplay] = useState<boolean>(true)


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
    localStorage.removeItem('bancada')
  
  }
  else{
    setDisplay(true)
  }
 

}

useEffect(()=>{

try {
  const CurrentUser = localStorage.getItem('bancada')

  if(CurrentUser){
    const user = JSON.parse(CurrentUser).access  ;
    verifyToken(user)
 
  }

} catch (error) {
  console.log(error)
  localStorage.removeItem('bancada')

}



},[])


  return (
    <>
     <ContainerHeader/>
        <main >
            {display?children:<Loading/>}
        </main>
    
    </>
     
    
  );
    
   
}
