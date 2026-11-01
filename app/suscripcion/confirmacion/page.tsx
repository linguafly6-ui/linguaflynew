import Link from "next/link";
import {CompleteAccount} from "./CompleteAccount";
export const metadata={title:"Finaliza tu cuenta | Linguafly",description:"Completa tu cuenta después del pago seguro."};
export default async function SubscriptionConfirmation({searchParams}:{searchParams:Promise<{session_id?:string}>}){
 const {session_id:sessionId}=await searchParams;
 return <main className="student-page"><section className="student-panel student-form-panel"><div className="kicker">PAGO CONFIRMADO · ÚLTIMO PASO</div><h1>Ahora crea tu cuenta.</h1><p>El pago se procesa primero. Introduce tu nombre y crea una contraseña para acceder al curso.</p>{sessionId?<CompleteAccount sessionId={sessionId}/>:<p className="student-error">No encontramos la referencia del pago. <Link href="/suscripcion">Volver a suscripciones</Link>.</p>}</section></main>;
}
