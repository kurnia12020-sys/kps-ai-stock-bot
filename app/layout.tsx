import './globals.css';import type {Metadata} from 'next';
export const metadata:Metadata={title:'KPS AI Stock Bot — Private',description:'Asisten analisis saham pribadi Kucing Pintar Saham',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>}
