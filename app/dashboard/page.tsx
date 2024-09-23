import style from "./dashboard.module.css"

import Image from "next/image";
import Link from "next/link";

export default function Dashboard (){

    return(
        <section className={style.container}>
            <Link href="/dashboard/cadastro">
                <Image
                
                    src="/cup.png"
                    width={60}
                    height={60}
                    alt=""
                />
            <p>Cadastrar</p>
            </Link>
         
            <Link href="/dashboard/torneios/">
                <Image
                    
                    src="/cuplist.png"
                    width={60}
                    height={60}
                    alt=""
                />
                <p>Torneios</p>
            </Link>
        </section>
    )
}