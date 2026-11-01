import Link from "next/link";

export const metadata = {
  title: "Confirmación de suscripción | Linguafly",
  description: "Estamos confirmando tu suscripción de Linguafly Academy.",
};

export default function SubscriptionConfirmation() {
  return (
    <main className="student-page">
      <section className="student-panel student-form-panel">
        <div className="kicker">LINGUAFLY ACADEMY · SUSCRIPCIÓN</div>
        <h1>Estamos confirmando tu pago.</h1>
        <p>Stripe ha recibido el proceso de pago. En unos instantes activaremos tu acceso cuando recibamos la confirmación segura del banco.</p>
        <p>Si el curso todavía aparece pendiente, vuelve a consultar tu área de alumno en unos segundos.</p>
        <Link className="student-primary-link" href="/mi-aprendizaje">Ir a mi aprendizaje ↗</Link>
      </section>
    </main>
  );
}
