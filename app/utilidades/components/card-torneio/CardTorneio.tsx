import Link from "next/link";
import style from "./card-torneio.module.css"

interface Itorneio {
    torneio:{
        torneio:string;
    id:number;
    logo:string;
    celular:string
    }
}

export default function CardTorneio (torneio:Itorneio){

    return(
        <Link href={`/dashboard/${torneio.torneio.id}`} className={style.container_cardTorneio}>
            <h2>Torneio: <span>{torneio.torneio.torneio}</span></h2>
            <p>ID: <span>{torneio.torneio.id}</span></p>
            <button>Editar</button>
            <button>Excluir</button>
        </Link>
    )
}