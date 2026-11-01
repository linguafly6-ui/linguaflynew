import Link from "next/link";
const levels = [["A1", "Principiante", "ingles-a1"], ["A2", "Elemental", "ingles-a2"], ["B1", "Intermedio", "ingles-b1"], ["B2", "Intermedio alto", "ingles-b2"], ["C1", "Avanzado", "ingles-c1"], ["C2", "Maestría", "ingles-c2"]];
export const metadata = { title: "Suscríbete a un curso de inglés", description: "Elige tu nivel y suscríbete a Linguafly Academy." };
export default function SubscriptionPage() {
  return <main className="student-page"><section className="student-panel"><div className="kicker">LINGUAFLY ACADEMY · SUSCRIPCIÓN</div><h1>Elige tu próximo nivel.</h1><p>Selecciona el curso al que quieres suscribirte. Crearás tu cuenta y después completarás el pago seguro en Stripe.</p><div className="student-course-grid">{levels.map(([level, name, key]) => <Link className="student-course" href={`/registro?curso=${key}`} key={key}><strong>{level}</strong><span>{name}</span><b>Continuar ↗</b></Link>)}</div><p className="student-muted">El precio y la periodicidad se mostrarán en Stripe antes de confirmar el pago. El acceso se activa tras la confirmación de la suscripción.</p></section></main>;
}
