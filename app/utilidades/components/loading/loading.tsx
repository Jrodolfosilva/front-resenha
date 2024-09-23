
import Image from "next/image"
import style from "./loading.module.css"

export default function Loading(){


    return(
        <div className={style.container}>
            <Image
                src="/sp.gif"
                width={80}
                height={80}
                alt=""
            />
        </div>
    )
}