"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import ContainerHeader from "@/app/utilidades/components/header/header"
import {useSearchParams } from "next/navigation"
import {API} from "../../utilidades/config"
import style from "./ao-vivo.module.css"


type Tquadra = {   
    id:27,
    id_torneio: 13,
    link:string,
    quadra: string,
    torneio:string
}

export default function AoVivo(){
const [quadras,setQuadras]=useState<Tquadra[]>()
const requests = new API()
const id_torneio = useSearchParams().get('torneio')



async function fnGetJogos(){    

    if(id_torneio){
        try {
            const getQuadras = await new requests.QuadraClass().buscarQuadra(id_torneio);
            setQuadras(getQuadras)
            console.log(getQuadras)
        } catch (error) {
            console.log(error)
        }
    }

}

useEffect(()=>{
    fnGetJogos()
},[])

    return(
        <>
            <ContainerHeader/>
            <section className={style.container}>
                <h1>Lives</h1>

                <div className={style.content}>
                    {
                        quadras&&quadras.map((quadra)=>(
                        <div key={quadra.id} className={style.card}>
                                <Image
                                    src="/play.png"
                                    width={60}
                                    height={60}
                                    alt=""
                                />
                                <p><b>Torneio</b>: {quadra.torneio}</p>
                                <p><b>Quadra</b>: {quadra.quadra}</p>
                                <Link href={`live?torneio=${quadra.id_torneio}&quadra=${quadra.id}`}>Assistir</Link>
                        </div>
                        ))
                    }
                </div>
               
            </section>
            


          
        </>
    )
}