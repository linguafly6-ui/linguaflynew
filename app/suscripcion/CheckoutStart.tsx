import Link from "next/link";
export function CheckoutStart({course}:{course:string}){
 return <Link className="student-primary-link" href={`/suscripcion/precios?curso=${encodeURIComponent(course)}`}>Suscribirme y pagar ↗</Link>;
}
