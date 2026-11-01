import Link from "next/link";
import {PricingOption} from "./PricingOption";
const courses:Record<string,{level:string;name:string}>={"ingles-a1":{level:"A1",name:"Principiante"},"ingles-a2":{level:"A2",name:"Elemental"},"ingles-b1":{level:"B1",name:"Intermedio"},"ingles-b2":{level:"B2",name:"Intermedio alto"},"ingles-c1":{level:"C1",name:"Avanzado"},"ingles-c2":{level:"C2",name:"Maestría"}};
export const metadata={title:"Elige tu plan | Linguafly Academy",description:"Selecciona una suscripción mensual o anual para tu curso de inglés."};
export default async function PricingPage({searchParams}:{searchParams:Promise<{curso?:string;cancelado?:string}>}){
 const {curso,cancelado}=await searchParams;
 const course=curso||"",selected=courses[course];
 if(!selected)return <main className="student-page"><section className="student-panel"><h1>Elige primero tu nivel</h1><p>Selecciona el curso para ver sus modalidades de suscripción.</p><Link href="/suscripcion">Volver a los cursos ↗</Link></section></main>;
 return <main className="student-page"><section className="student-panel"><div className="kicker">LINGUAFLY ACADEMY · PLANES</div><h1>Elige cómo quieres pagar.</h1><p>Curso {selected.level} · {selected.name}. Selecciona una modalidad para continuar al pago seguro de Stripe.</p>{cancelado==="1"&&<p className="student-muted">Has cancelado el pago. No se ha realizado ningún cargo ni se ha creado tu cuenta.</p>}<div className="student-course-grid"><PricingOption course={course} billingPeriod="monthly" label="Mensual" description="Suscripción con cobro mensual."/><PricingOption course={course} billingPeriod="annual" label="Anual" description="Suscripción con cobro anual."/></div><p className="student-muted">El importe definitivo y la periodicidad aparecerán en Stripe antes de confirmar el pago. Crearás tu cuenta después de completar el pago.</p><Link href="/suscripcion">← Cambiar de nivel</Link></section></main>;
}
