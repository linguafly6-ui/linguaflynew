"use client";
import {useState} from "react";
export function CheckoutStart({course}:{course:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 async function start(){setBusy(true);setError("");try{const response=await fetch("/api/student/checkout",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({course})});const data=await response.json() as {url?:string;error?:string};if(!response.ok||!data.url)throw new Error(data.error||"No se pudo abrir Stripe.");window.location.assign(data.url);}catch(e){setError(e instanceof Error?e.message:"No se pudo iniciar el pago.");setBusy(false);}}
 return <div><button type="button" onClick={start} disabled={busy}>{busy?"Abriendo pago seguro…":"Suscribirme y pagar ↗"}</button>{error&&<p className="student-error" role="alert">{error}</p>}</div>;
}
