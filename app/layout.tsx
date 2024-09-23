
import { Inter } from 'next/font/google'
import styles from "./layout.module.css"
import "./global.css"
import ContainerHeader from './utilidades/components/header/header';

const inter = Inter({
  subsets:['latin'],
  weight:["300","400","500","600","800"]

})

export default function Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  
 
  
  
  return (
    <html >
       <body className={inter.className}>  
        
        {children}   
       </body>
    </html>
  );
    
   
}
