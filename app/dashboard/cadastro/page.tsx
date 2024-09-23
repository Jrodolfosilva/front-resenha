"use client"

import React, { useState } from "react";
import {useForm,SubmitHandler,FieldValues} from "react-hook-form"
import { InputMask } from 'primereact/inputmask'; 
import style from "./page.module.css"
import { useRouter } from "next/navigation";
import { Requests } from "../../utilidades/Requests";
import Image from "next/image";
import Link from "next/link";


type Data = {
    torneio:string;
    celular:string;
    file:FileList
}
type Quadra ={
    quadra: string,
    link:string,
    id?:string,
    id_torneio?:string
}
type Equipe = {
    id?:string,
    id_torneio:string,
    equipe:string
}



export default function Cadastro(){
    const router = useRouter()
    const [step,setStep] = useState(0)
    const [error,setError] = useState<null | string>()
    const {handleSubmit,formState,register,reset} =  useForm()
    const requests =  new Requests()
    const [quadras,SetQuadras] = useState<Quadra[]>()
    const [equipes,SetEquipes] = useState<any>()
    const [id_torneio, setId_torneio] = useState<string>()
    const CurrentUser = localStorage.getItem('admin')
 
      
    const fnsubmitTorneio: SubmitHandler<Data|FieldValues> = async(data) =>{
        const torneio = new FormData()
        torneio.append('file',data.file[0])
        torneio.append('celular',data.celular)
        torneio.append('torneio',data.torneio)

       try {
        if(CurrentUser){
            const user = JSON.parse(CurrentUser)  ;
            const response = await requests.CriarTorneio(torneio,user.access)
            
            if(response.id){
               
                setId_torneio(response.id)
                setStep(1)
            }
            else{
                setError("Não foi possivel criar o torneio!")
            }
         }
       
       } catch (error) {
            console.log(error)
            alert("Erro no servidor")
       }
    }

    const fnsubmitQuadra: SubmitHandler<Quadra|FieldValues> = async(data) =>{
       
        const quadra = {
            quadra: data.quadra,
            link:data.link,
            torneio: id_torneio
        }
        try {
                if(CurrentUser && id_torneio){
                    const user = JSON.parse(CurrentUser)  ;
                    const response = await requests.CriarQuadra(quadra,user.access).finally(()=>reset())
                    if(response[0].id){
                        setError("")
                        const responseQuadras =  await requests.ListarQuardas(id_torneio)
                        SetQuadras(responseQuadras.reverse())
                    }
                   
                }
            
            } catch (error) {
                setError("Verifique o nome da Quadra e tente novamente")
           }
    
    }

    const fnremoverQuadra = async(id_quadra?:string)=>{
            try {
                if(CurrentUser && id_quadra && id_torneio){
                    const token:string = JSON.parse(CurrentUser).access
                    const Iquadra ={
                        token,
                        id_torneio: id_torneio,
                        id:id_quadra
                    }
                    const response = await requests.RemoverQuadra(Iquadra)

                    SetQuadras((states)=> states?.filter((i)=>i.id !== Iquadra.id))

                }
            } 
            catch (error) {
                setError("Não foi possivel excluir")
            }
        
    }

    const fnsubmitEquipe: SubmitHandler<Equipe|FieldValues> = async(data) =>{
    
         try {
            if(CurrentUser && id_torneio){
                const user = JSON.parse(CurrentUser)  ;

                const Equipe = {
                    equipe: data.equipe,
                    torneio: id_torneio
                  }
                
                const response = await requests.CriarEquipe(Equipe,user.access)

                if(response.status){
                    setError("Não foi possivel cadastrar Equipe")
                }
                
              
                if(response.id){
                    const responseEquipe =  await requests.ListarEquipes(id_torneio)
                    SetEquipes(responseEquipe.reverse())
                    
                }
                
    
            }
               
                } catch (error) {
                   
                    setError("Não foi possível cadastrar equipe!")

               }
    
    
        
    }

    const fnremoverEquipe = async(id_equipe?:string)=>{
        try {
            if(CurrentUser && id_equipe && id_torneio){
                const token:string = JSON.parse(CurrentUser).access
    
                const Iequipe ={
                    token,
                    torneio: id_torneio,
                    equipe:id_equipe
                }
    
                const response = await requests.RemoverEquipe(Iequipe)
                const responseEquipe =  await requests.ListarEquipes(id_torneio)
                SetEquipes(responseEquipe)

                
    
    
            }
        } catch (error) {
            setError("Não foi possivel remover equipe")
        }
    
}


    return(
        <section className={style.section}>
    
           {
            step===0&& 
            
            <div className={style.container} id="form">
            <h1>Cadastrar Torneio</h1>
            <form action="" onSubmit={handleSubmit(fnsubmitTorneio)}>

                <input type="text" {...register('torneio', { required: true })} id=""  placeholder="Nome do Torneio"/>
                <InputMask mask="(99) 99999-9999" {...register('celular', { required: true })} id="celular" placeholder="(99) 9 9999 - 9999" />
                <label htmlFor="file">
                <p>Logo do Torneio</p>
                <input type="file" {...register('file', { required: true })} id="file" accept="image/*" />
                </label>
                <input type="submit" disabled={formState.isLoading } value={formState.isLoading?'Cadastrando...':"Cadastrar"} />
                <Link href="/dashboard" className={style.back}>Voltar</Link>
                <p className="error">{error}</p>
            </form>
            </div> 

           }
           {
            step===1&& 
            <div className={style.container} id="formTorneio">
            <div>
            <h1>Quadras</h1>
             <form name="formTorneio" action="" onSubmit={handleSubmit(fnsubmitQuadra)}>
                
                 <input type="text" {...register('quadra', { required: true })} id=""  placeholder="Nome da Quadra"/>
                 <input type="text" {...register('link', { required: true })} id="link" placeholder="Link da Live"/>
                 <input type="submit" className={style.add} value="+Adicionar" />
             </form>
            </div>
            <div className={style.list}>


             {
             quadras?.map((q:Quadra)=>(
                <div key={q.quadra}>
                    <p>{q.quadra}</p>
                    <button onClick={()=>fnremoverQuadra(q.id)}>
                        X
                    </button>
                </div>
             ))
             
             }


            </div>

            <button className={style.next} onClick={()=>{setStep(2); setError("")}}>Continuar</button>
            <p className="error">{error}</p>
            </div>
           }
           {
                step===2&& 
                <div className={style.container} id="form">
                <div>
                <h1>Equipe</h1>
                <form action=""onSubmit={handleSubmit(fnsubmitEquipe)} >
                    <input type="text" {...register('equipe')} id="equipe"  placeholder="Nome da Equipe" required/>
                    <input type="submit"  className={style.add} value="+ Adicionar" />
                </form>
                </div>
                <div className={style.list}>
                    
                {
                        equipes?.map((e:Equipe)=>(
                        <div key={e.id}>
                            <p>{e.equipe}</p>
                            <button onClick={()=>fnremoverEquipe(e.id)}>
                                X
                            </button>
                        </div>
                        ))
                
                  }


                </div>
                <button onClick={()=>setStep(1)} className={style.back}>Voltar</button>
                <button className={style.next} onClick={()=>{
                    
                    localStorage.removeItem("idTorneio")
                    router.push('/dashboard/torneios')
                    
                }}>Finalizar</button>
                <p className="error">{error}</p>
                </div>

               
           }
          
        </section>
    )
}