"use client"

import { useSearchParams } from "next/navigation"
import style from "./live.module.css"
import ContainerHeader from "@/app/utilidades/components/header/header"
import { useEffect, useState } from "react"



type Tjogo = {
    id: number;
    equipe_A: string;
    equipe_B: string;
    id_equipe_A: number;
    id_equipe_B: number;
    id_quadra: number;
    id_torneio: number;
    link: string;
    quadra: string;
    torneio: string;
  };
  

export default function Live (){
const [jogo,setJogo] = useState<Tjogo>()
const [error,setError] = useState(false)
const [message,setMessage] = useState({message:{
    "placar_A":0,
    "placar_B":0,
    "rodada":1
}})
const id_torneio = useSearchParams().get('torneio')
const id_quadra = useSearchParams().get('quadra')


async function getJogo(){
    
   if(id_torneio && id_quadra){
    try {
        const data = await fetch(`http://127.0.0.1:8000/api/v1/create/jogo/consultar/?torneio=${id_torneio}&quadra=${id_quadra}`, {
            method: 'GET',
            cache: "no-store"
        })

        let response = await data.json();
        
        if(data.status != 200 || response.length === 0){
            setError(true)
        }

        setJogo(response[0])

    } catch (error) {
        console.log(error)
        setError(true)
    }
   }

}

useEffect(()=>{
    getJogo()
    
},[])

useEffect(()=>{

    if(jogo){   
            
        try {
            let connect = new WebSocket(`ws://localhost:8000/ws/chat/?torneio=${jogo.id_torneio}&quadra=${jogo.id_quadra}&equipe_A=${jogo.id_equipe_A}&equipe_B=${jogo.id_equipe_B}`);
            connect.onmessage = (e)=>{
                let text = JSON.parse(e.data)
                setMessage(text)
            }   
                  
        } catch (error) {
            console.log(error)
        }
    }

},[jogo])




    return(
        <>
        <ContainerHeader/>
        <div className={style.container}>
           {
            error?(
                <h1>Ainda não está transmitindo ⚽</h1>
              
            ):(
                <section>
            <iframe  src="https://www.youtube.com/embed/gGeMpxK-c8Y" //src={jogo?.link}  
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen></iframe>
                <div className={style.content_placar}>
                    <div className={style.equipes}>{jogo?.equipe_A}: {message?.message.placar_A}</div>
                                <p>X</p>
                    <div className={style.equipes}><span>{message?.message.placar_B}</span> : {jogo?.equipe_B}</div>
                    <div> {message?.message.rodada} : Tempo/Rodada</div>
                </div>
            </section>
            )
           }
        </div>
        </>
    )
}