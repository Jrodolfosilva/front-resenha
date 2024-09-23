import Image from "next/image"
import style from "./header.module.css"
import Link from "next/link"


type TProps = {
    link?: string
}
export default function ContainerHeader({link}:TProps){

    console.log(link)

    return(
        <header className={style.container_header}>
            <Link href={`${link?link:"/"}`}>
                <Image
                    src="/resenha.webp"
                    width={80}
                    height={60}
                    alt="Logo"
                    priority
                />
            </Link>
            
        </header>
    )
}