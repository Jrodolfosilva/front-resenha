"use client"

import React, { useEffect, useState } from "react";
import {useForm,SubmitHandler,FieldValues} from "react-hook-form"
import { InputMask } from 'primereact/inputmask'; 
import style from "./page.module.css"
import { usePathname, useRouter } from "next/navigation";
import { Requests } from "../../../utilidades/Requests";
import Image from "next/image";
import Link from "next/link";
import {API} from "../../../utilidades/config"


type ITorneio = {
    torneio:string,
    celular:string,
    logo:string
}
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



export default function Altera(){
    const route = useRouter()
    
    const [step,setStep] = useState(0)
    const [error,setError] = useState<null | string>()

    const {handleSubmit,formState,register,reset} =  useForm()
    const requests =  new Requests()
    const [torneio,setTorneio] = useState<ITorneio>()
    const [quadras,SetQuadras] = useState<Quadra[]>()
    const [equipes,SetEquipes] = useState<any>()
    const id_torneio =  usePathname().split('/')[3]
    const CurrentUser = localStorage.getItem('admin')
    const api =  new API()
    const requestsConfigTorneio = new api.TorneioClass()
    const requestsConfigQuadra = new api.QuadraClass()
    const requestsConfigEquipe = new api.EquipeClass()
   
    useEffect(()=>{

        if(!id_torneio){
            alert('Você precisa informar o ID do torneio')
        
        }
        getTorneioInfo(id_torneio)


    },[])

    const getTorneioInfo =  async(id:string)=>{
        const responseTorneio = await requestsConfigTorneio.torneioBuscar(id)
        const responseQuadras = await requestsConfigQuadra.buscarQuadra(id)
        const responseEquipe = await requestsConfigEquipe.buscarEquipe(id)

        setTorneio(responseTorneio[0])
        SetQuadras(responseQuadras.reverse())
        SetEquipes(responseEquipe.reverse())
        

    }

    const fnsubmitTorneio: SubmitHandler<Data|FieldValues> = async(data) =>{
       
       
        const torneio = new FormData()
        torneio.append('file',data.file[0])
        torneio.append('celular',data.celular)
        torneio.append('torneio',data.torneio)

       try {

        if(CurrentUser){
            const user = JSON.parse(CurrentUser)  ;
            const token = user.access
       
            const responseTorneio = await requestsConfigTorneio.torneioEditar(torneio,token,id_torneio)
            
            console.log(responseTorneio)
            if(responseTorneio == 200){
                setStep(1)
            }
         }
       
       } catch (error) {
            console.log(error)
            setError('Erro ao atualizar torneio')
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
                const responseQuadras =  await requests.ListarQuardas(id_torneio)
                SetQuadras(responseQuadras)
            }

        }
           
    } catch (error) {
        setError('Erro ao cadastrar quadra')
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
                    
                    const responseQuadras =  await requests.ListarQuardas(id_torneio)
                     SetQuadras(responseQuadras)
        
                }
            } catch (error) {
                setError('Erro ao excluir quadra')
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
                if(response.id){
                    const responseEquipe =  await requests.ListarEquipes(id_torneio)
                    SetEquipes(responseEquipe.reverse())
                }
    
            }
               
                } catch (error) {
                    console.log(error)
                    setError('Erro ao cadastrar Equipe')
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
                SetEquipes(responseEquipe.reverse())    
            }
        } catch (error) {
            setError('Erro ao excluir Equipe')
            console.log(error)
        }
    
}


    return(
        <section className={style.section}>
    
           {
            step===0&& 
            
            <div className={style.container} id="form">
            <form action="" onSubmit={handleSubmit(fnsubmitTorneio)}>
                
                <Image
                    src={torneio?.logo || '/resenha.webp'}
                    width={200}
                    height={200}
                    sizes="100%"
                    alt=""
                />
                 <label htmlFor="file">
                <p>Alterar logo</p>
                <input type="file" {...register('file')} id="file" accept="image/*" />
                </label>
                <input type="text" {...register('torneio')} id="nome"  placeholder="Nome do Torneio"  defaultValue={torneio?.torneio}/>
                <InputMask mask="(99) 99999-9999" {...register('celular')} id="celular" placeholder="(99) 9 9999 - 9999" value={torneio?.celular}  />
               
                <input type="submit" disabled={formState.isLoading } value={formState.isLoading?'Salvando...':"Continuar"} />
                <Link href="/dashboard" className={style.back}>Voltar</Link>

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
            <button onClick={()=>setStep(0)} className={style.back}>Voltar</button>


            <button className={style.next} onClick={()=>setStep(2)}>Continuar</button>
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
                   route.push('/dashboard/torneios')
                    localStorage.removeItem("idTorneio")
                }}>Salva alterações</button>
                <p className="error">{error}</p>
                </div>
           }
        </section>
    )
}