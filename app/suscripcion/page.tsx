import Link from "next/link";
const levels=[["A1","Principiante","ingles-a1"],["A2","Elemental","ingles-a2"],["B1","Intermedio","ingles-b1"],["B2","Intermedio alto","ingles-b2"],["C1","Avanzado","ingles-c1"],["C2","Maestría","ingles-c2"]];
export const metadata={title:"Inscríbete en un curso de inglés",description:"Elige tu nivel y crea tu cuenta en Linguafly Academy."};
export default function SubscriptionPage({searchParams}:{searchParams:Promise<{curso?:string}>}){
 return <main className="student-page"><section className="student-panel"><div className="kicker">LINGUAFLY ACADEMY · INSCRIPCIÓN</div><h1>Elige tu próximo nivel.</h1><p>Selecciona el curso al que quieres acceder. Después crearás tu cuenta y podrás entrar a tus unidades.</p><div className="student-course-grid">{levels.map(([level,name,key])=><Link className="student-course" href={`/registro?curso=${key}`} key={key}><strong>{level}</strong><span>{name}</span><b>Continuar ↗</b></Link>)}</div><p className="student-muted">La inscripción digital activa el acceso al curso. No se realiza ningún cobro en este paso.</p></section></main>;
}
