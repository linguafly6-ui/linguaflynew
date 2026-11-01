"use client";
import {useState} from "react";
export function PricingOption({course,billingPeriod,label,description}:{course:string;billingPeriod:"monthly"|"annual";label:string;description:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 async function start(){
  setBusy(true);setError("");
  try{
   const response=await fetch("/api/student/checkout",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({course,billingPeriod})});
   const raw=await response.text();
   let data:{url?:string;error?:string};
   try{data=JSON.parse(raw) as {url?:string;error?:string};}
   catch{throw new Error("No se ha podido conectar con el pago. Inténtalo de nuevo en unos minutos.");}
   if(!response.ok||!data.url)throw new Error(data.error||"No se pudo abrir Stripe.");
   window.location.assign(data.url);
  }catch(e){setError(e instanceof Error?e.message:"No se pudo iniciar el pago.");setBusy(false);}
 }
 return <article className="student-course"><strong>{label}</strong><span>{description}</span><button type="button" onClick={start} disabled={busy}>{busy?"Abriendo Stripe…":"Elegir este plan ↗"}</button>{error&&<p className="student-error" role="alert">{error}</p>}</article>;
}
