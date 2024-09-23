"use client"

import ContainerHeader from "./utilidades/components/header/header";
import style from "./page.module.css"
import {API} from './utilidades/config'
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";



type Ttorneio = {
    torneio :  string,
    logo: string,
    celular: string,
    id: number
}

export default function Home(){

const [torneios,setTorneios] = useState<Ttorneio[]>()
const requests = new API();


async function fnGetTorneios (){
    
    try {
        const requestTorneios = await new requests.TorneioClass().torneioBuscar();
        setTorneios(requestTorneios)
        console.log(requestTorneios)
    } catch (error) {
        console.log(error)
    }

}

useEffect(()=>{fnGetTorneios()},[])

    return(
        <div className={style.container}>
            <ContainerHeader/>
            <h1>Torneios <b>AO VIVO</b></h1>
            <section>
            {
                torneios?.map((torneio)=>(
                    <Link href={`/ao-vivo/${torneio?.torneio.toLowerCase().replaceAll(" ", "-").normalize('NFD').replace(/[\u0300-\u036f]/g, "")}?torneio=${torneio.id}`} key={torneio?.id}>
                        <Image
                            src={torneio?.logo}
                            width={300}
                            height={200}
                            alt="" />
                            <h2>{torneio.torneio}</h2>
                        
                    </Link>
                    
                ))
            }
            </section>
        </div>
    )
}