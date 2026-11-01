import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudent } from "@/lib/student-auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
export const dynamic = "force-dynamic";
type Row = { course_key:string; mastery_tag:string; failure_count:number; success_streak:number; due_at:string; last_attempt_at:string|null };
type DB = { prepare(sql:string): { bind(...values:string[]): { all<T>():Promise<{results?:T[]}> } } };
export default async function ErrorReviewPage() {
  const student = await getStudent();
  if (!student) redirect("/acceso");
  const { env } = await getCloudflareContext();
  const db = (env as unknown as { COURSE_DB:DB }).COURSE_DB;
  const result = await db.prepare("SELECT course_key,mastery_tag,failure_count,success_streak,due_at,last_attempt_at FROM learner_skill_reviews WHERE learner_id=? ORDER BY due_at ASC")
    .bind(student.learner_id).all<Row>();
  const rows = result.results ?? [];
  const due = rows.filter(row => row.due_at <= new Date().toISOString().replace("T"," ").slice(0,19));
  return <main className="student-page"><section className="student-panel">
    <Link href="/mi-aprendizaje" className="student-back">← Mi aprendizaje</Link>
    <div className="kicker">LINGUAFLY · REPASO PERSONAL</div><h1>Repasar mis errores</h1>
    <p>Los conceptos que te han costado quedan guardados en tu cuenta. Vuelve a practicarlos para consolidarlos.</p>
    <div className="student-course-grid"><div className="student-course"><strong>{rows.length}</strong><span>Conceptos en seguimiento</span></div><div className="student-course"><strong>{due.length}</strong><span>Repasos pendientes</span></div></div>
    {rows.length===0 ? <p>Aún no hay errores guardados. Cuando falles una actividad compatible, aparecerá aquí.</p> : <div className="error-review-list">{rows.map(row=><article className="student-course" key={row.course_key+row.mastery_tag}>
      <strong>{row.mastery_tag}</strong><span>{row.course_key.toUpperCase().replace("INGLES-","Inglés ")} · {row.failure_count} {row.failure_count===1?"error":"errores"}</span>
      <span>{row.success_streak} aciertos consecutivos · Próximo repaso: {new Date(row.due_at.replace(" ","T")+"Z").toLocaleString("es-ES")}</span>
    </article>)}</div>}
  </section></main>;
}
