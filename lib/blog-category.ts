const LABELS: Record<string, string> = {
  gramatica: "Gramática",
  metodos: "Métodos de aprendizaje",
  trabajo: "Inglés profesional",
  examenes: "Exámenes y certificaciones",
  viajes: "Viajes y vida diaria",
  actualidad: "Actualidad",
  habilidades: "Habilidades lingüísticas",
  idiomas: "Idiomas",
  "curso-a1": "Curso A1",
  "curso-a2": "Curso A2",
  "curso-b1": "Curso B1",
  "curso-b2": "Curso B2",
  "curso-c1": "Curso C1",
  "curso-c2": "Curso C2",
};

export function normalizeCategory(value: string | null | undefined): string {
  const key = (value || "").trim().toLowerCase().replace(/\s+/g, "-");
  return LABELS[key] || (key ? key.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Otros");
}
