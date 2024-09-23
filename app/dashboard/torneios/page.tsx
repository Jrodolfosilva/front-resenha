'use client'

import { useEffect, useState } from "react"
import style from "./dashboard.module.css"
import { Requests } from "@/app/utilidades/Requests"
import Image from "next/image"
import Link from "next/link"
import {API} from "../../utilidades/config"
import { useRef } from "react"



interface Itorneio {
    id: number,
    torneio:string,
    celular:string,
    logo: string
}

interface IquadraUsers {
    user_id: number,
    user_email:string,
    user_password: string,
    torneio_id: number,
    torneio: string,
    quadra_id: number,
    quadra: string
}





export default function Torneios(){


const [torneios,setTorneios] = useState<Itorneio[]>([])
const [usuarios,setUsuarios] = useState<IquadraUsers[] | null>()
const api = new API()
const userCurrent = localStorage.getItem('admin')
const modalRef = useRef<HTMLDialogElement>(null)



async function fngetUsuarios (id_torneio:number|string) {

    if(userCurrent){
        const request = new api.QuadraClass()
        const user = JSON.parse(userCurrent)

        try {
            const data = await request.buscarUsuarioQuadra(user.access,id_torneio)  
            const array = Object.entries(data).map(([chave, valor]) => valor as IquadraUsers[]);
            console.log(array)
            
            if(!data?.status && modalRef.current){
                setUsuarios(array[0])
                modalRef.current.showModal()
            }
            else{
                setUsuarios(null)
                modalRef.current?.showModal()
            }
          
        } catch (error) {
            console.log(error)
            alert('Não foi possivel buscar os Usuários')
        }



    }
   
}

async function fngetTorneio() {
    try {

        const request =  new Requests()
    
        const data:Itorneio[] = await request.ListarTorneios()

        setTorneios(data.reverse())      
       
        
    } catch (error) {
        console.log(error)
        alert('Não foi possivel conectar ao servidor!')
    }
}

async function removerTorneio(id_torneio:number){
    const remover =  new api.TorneioClass()
    
    
    try {
        if(userCurrent){
            const user =  JSON.parse(userCurrent)
            const data = await remover.torneioDeletar(user.access,id_torneio)
            setTorneios((prevTorneios) => prevTorneios.filter((t: Itorneio) => t.id !== id_torneio));

        }
        
    } catch (error) {
        
    }

}

async function encerrarTorneio(id_torneio:number){
    const encerrar =  new api.TorneioClass()
    
    
    try {
        if(userCurrent){
            const user =  JSON.parse(userCurrent)
            await encerrar.torneioEncerrar(user.access,id_torneio)
            setTorneios((prevTorneios) => prevTorneios.filter((t: Itorneio) => t.id !== id_torneio));

        }
        
    } catch (error) {
        
    }

}




useEffect(()=>{
    fngetTorneio()
},[])



    return(
        <section className={style.container}>
            <div className={style.header}>
                <div className={style.caminho}>
                    <Link href="/dashboard">
                        <Image src="/home.png" width={32} height={32} alt=""/>
                    </Link>
                    <h1>Torneios</h1>
                </div>
            </div>
           
            <div className={style.container_torneio}>
                {
                    torneios?.map((torneio)=>(
                        <div  key={torneio.id} className={style.torneio}>
                            <Image
                                src={`http://127.0.0.1:8000${torneio.logo}`}
                                width={60}
                                height={60}
                                alt=""
                            />
                            <div>
                                <h4>{torneio.torneio}</h4>
                                <p>{torneio.celular}</p>
                            </div>
                            <div className={style.action}>
                                <button onClick={()=>fngetUsuarios(torneio.id)} >
                                    <Image
                                     src="/users.png"
                                     width={20}
                                     height={20}
                                     alt=""                                   
                                    />
                                    Usuários
                                </button>
                                <Link  href={`/dashboard/cadastro/${torneio.id}`} >
                                    <Image
                                    src="/Pencil.png"
                                    width={20}
                                    height={20}
                                    alt=""
                                    />
                                    Editar
                                </Link>
                                
                                <button onClick={()=>removerTorneio(torneio.id)}>
                                    <Image
                                     src="/Trash.png"
                                     width={20}
                                     height={20}
                                     alt=""                                   
                                    />
                                    Excluir
                                </button>
                                <button onClick={()=>encerrarTorneio(torneio.id)}>
                                    <Image
                                     src="/stop.png"
                                     width={20}
                                     height={20}
                                     alt=""                                   
                                    />
                                    Encerrar
                                </button>
                            </div>
                            <dialog ref={modalRef}>
                                <h2>Usuários</h2>
                                <button onClick={()=>{
                                    modalRef.current?.close()
                                }}>X</button>
                                {
                                        !usuarios&&<p>Nenhum usuário cadastrado!</p>
                                    }
                                <section>
                                    {
                                  usuarios&&usuarios?.map((user)=>(
                                        <div key={user.user_id}>
                                            <p><b>Quadra</b>: <span>{user.quadra}</span></p>
                                            <p><b>Usuário</b>: <span>{user.user_email}</span></p>
                                            <p><b>Senha</b>: <span>{user.user_password}</span></p><br/>
                                        </div>
                                    ))
                                    }
                                    
                                </section>
                                

                            </dialog>

                        </div>
                        
                    ))
                    
                }
            </div>
        </section>
    )
}

