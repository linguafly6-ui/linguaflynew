"use client";

import { useState } from "react";

export function CheckoutButton({ course, label = "Completar pago" }: { course: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function start() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/student/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ course }),
      });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "No se pudo abrir el pago.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar el pago.");
      setBusy(false);
    }
  }
  return <div><button type="button" onClick={start} disabled={busy}>{busy ? "Abriendo Stripe…" : label}</button>{error && <p className="student-error" role="alert">{error}</p>}</div>;
}

export function BillingPortalButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function openPortal() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/student/portal", { method: "POST" });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "No se pudo abrir el portal.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al abrir facturación.");
      setBusy(false);
    }
  }
  return <div><button className="student-logout" type="button" onClick={openPortal} disabled={busy}>{busy ? "Abriendo portal…" : "Gestionar facturación y cancelar suscripción"}</button>{error && <p className="student-error" role="alert">{error}</p>}</div>;
}
