import {CheckoutStart} from "./CheckoutStart";
// Stripe Checkout precedes all learner-account creation.
const levels=[["A1","Principiante","ingles-a1"],["A2","Elemental","ingles-a2"],["B1","Intermedio","ingles-b1"],["B2","Intermedio alto","ingles-b2"],["C1","Avanzado","ingles-c1"],["C2","Maestría","ingles-c2"]];
export const metadata={title:"Suscríbete a un curso de inglés",description:"Elige tu nivel y paga tu suscripción a Linguafly Academy."};
export default async function SubscriptionPage({searchParams}:{searchParams:Promise<{cancelado?:string}>}){
 const {cancelado}=await searchParams;
 return <main className="student-page"><section className="student-panel"><div className="kicker">LINGUAFLY ACADEMY · SUSCRIPCIÓN</div><h1>Elige tu próximo nivel.</h1><p>Selecciona el curso y accederás directamente al pago seguro de Stripe. Crearás tu cuenta después de completar el pago.</p>{cancelado==="1"&&<p className="student-muted">Has cancelado el proceso de pago. No se ha creado ninguna cuenta ni se ha realizado ningún cargo.</p>}<div className="student-course-grid">{levels.map(([level,name,key])=><div className="student-course" key={key}><strong>{level}</strong><span>{name}</span><CheckoutStart course={key}/></div>)}</div><p className="student-muted">Stripe mostrará el importe y la periodicidad antes de confirmar. La cuenta y el acceso al curso se crean únicamente después de verificar el pago.</p></section></main>;
}
