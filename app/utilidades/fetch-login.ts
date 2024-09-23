'use server'

type Iuser = {
    
        email:string,
        password:string
    
}


export default async function fetchLogin(user:Iuser){
  const url =  process.env.BASE_URL
  

    const response = await fetch(`${url}user/singin/user/`,{
        method:"POST",
        headers:{
          'Content-Type':'application/josn'
        },
        body:JSON.stringify(user)
      })

  const data =  await response.json()
     
      return data


}



