'use client'


import style from "./jogo.module.css"
import {FieldValues, useForm} from 'react-hook-form'
import {useRouter } from "next/navigation"
import Image from "next/image"
import {API} from "../../../utilidades/config"
import { useEffect, useState } from "react"



export default function Placar(){
    const {register,handleSubmit} = useForm()
    const router = useRouter()
    const requests = new API()
    const dados_Jogo =  localStorage.getItem('jogo')
    const token = localStorage.getItem('bancada')
    const [socket,setSocket] = useState<WebSocket>();


    useEffect(()=>{
        if(dados_Jogo){
            const dados = JSON.parse(dados_Jogo)
            try {
                let connect =  
                new WebSocket(`ws://localhost:8000/ws/chat/?torneio=${dados.id_torneio}&quadra=${dados.id_quadra}&equipe_A=${dados.id_equipe_A}&equipe_B=${dados.id_equipe_B}`);
                setSocket(connect)
            } catch (error) {
                
            }
        }

    },[])
   
    
    async function fnSumit(data:FieldValues){
       
        let msg = {
            placar_A: data.placar_A,
            placar_B: data.placar_B,
            rodada: "1"
        }
        let body =  JSON.stringify( msg)
        try {
        socket?.send(body);
    
        socket.onmessage = (e)=>{
            console.log(e)
        }


        alert('Placar atualizado')
        } catch (error) {
            console.log(error)
        }
    }

    async function EncerrarJogo(){

        if(dados_Jogo && token){
            try {
                const dados = JSON.parse(dados_Jogo)
                console.log(dados)
                const access = JSON.parse(token).access
                await new requests.JogoClass().encerrarJogo(dados.id_torneio, dados.id_quadra,dados.id,access)
                localStorage.removeItem('jogo');
                router.push('/bancada/jogo')

            } catch (error) {
                console.log(error)
            }
    
        }        
    }

    return(
        <section className={style.container}>
            <h1>Placar</h1>
            <form onSubmit={handleSubmit(fnSumit)}>
                <div className={style.container_inputs}>
                    <label htmlFor="">
                        <p>Equipe A</p>
                        <input type="number" {...register('placar_A')} min={0} defaultValue={0}  id="placar_A" placeholder="0" />
                    </label>
                       <Image src="/cruz.png" width={60} height={60} alt="X"/>
                    <label htmlFor="">
                        <p>Equipe B</p>
                        <input type="number"  min={0}  {...register('placar_B')} id="placar_B" defaultValue={0} placeholder="0" />
                    </label>
                </div>
                <div  className={style.container_buttons}>
                    <select name="rodada" id="rodada" defaultValue="">
                        <option value="" disabled>Rodada</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                <input type="submit" value="Atualizar" />
                </div>
                
            </form>
            <button onClick={()=>EncerrarJogo()}>
                    Encerrar partida
                </button>
        </section>
    )
}