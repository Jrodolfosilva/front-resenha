
'use client'

import style from "./page.module.css"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {API} from "../../utilidades/config"
import { jwtDecode } from "jwt-decode";
import {useForm,SubmitHandler,FieldValues} from "react-hook-form"

interface IEquipe {
    id: string,
    equipe:string
}

interface IdataForm {
    equipeA:string,
    equipeB:string
}


export default function Jogo (){
    
    const [equipes,setEquipes] = useState<IEquipe[]>([]);
    const [error,setError] = useState<null | string>()
    const route = useRouter();
    const {handleSubmit,formState,register,reset} =  useForm();
    const request = new API();
    let token = localStorage.getItem('bancada'); 
    let jogo =  localStorage.getItem('jogo')

    useEffect(()=>{
        if(jogo){
            const id = JSON.parse(jogo).id
            route.push(`jogo/${id}`)
        }
        if(token){
            const access = JSON.parse(token).access
            const decoded = jwtDecode(access);       
                //@ts-ignore
                fnGetEquipes(decoded?.torneio)
        }
    },[])
   
   
    async function fnGetEquipes(id_torneio:string){

        try {
           await new request.EquipeClass().buscarEquipe(id_torneio)
            .then((data)=>{
                if(data.length > 1){
                    setEquipes(data)
                    setError("")
                }

            })
            

        } catch (error) {
            
       
        }
   
    }

  


    const fnsubmit: SubmitHandler<IdataForm | FieldValues> = async(data) =>{
        setError(null)
        if(!token){
            setError('Precisa fazer login')
            return
        }
        if(data.equipeA !== data.equipeB){
            const access = JSON.parse(token).access
            try {
                const criarJogo = await new request.JogoClass().createJogo(access,data.equipeA,data.equipeB)

                if(criarJogo[1].id){
                    localStorage.setItem('jogo',JSON.stringify(criarJogo[1]))
                    route.push(`jogo/${criarJogo[1].id}`)
                }  
            } catch (error) {
                console.log(error)
                setError("Não foi possivel iniciar partida")
            }
        }
        else{
            setError("Verifique as equipes")
           
        }
       
            

    }


    return(
        <section className={style.container}>
                      
            <h1>Jogo</h1>
            <form onSubmit={handleSubmit(fnsubmit)}>
                <label htmlFor="equipeA">
                    <select  defaultValue="" {...register('equipeA')} id="equipeA">
                        <option value="" disabled>Selecionar</option>
                    {equipes&&equipes?.map((equipe)=>(
                        <option key={equipe.id} value={equipe.id}>{equipe.equipe}</option>
                    ))}
                    </select>
                </label>
                <label htmlFor="equipeB">
                    <select defaultValue="" {...register('equipeB')} id="equipeB">
                        <option value="" disabled>Selecionar</option>
                        {equipes&&equipes?.map((equipe)=>(
                        <option key={equipe.id} value={equipe.id}>{equipe.equipe}</option>
                    ))}
                </select>   
                </label>
                <input type="submit" value="Inicar jogo" />
                <p className="error">{error}</p>
            </form>
        
           
        </section>
    )
}