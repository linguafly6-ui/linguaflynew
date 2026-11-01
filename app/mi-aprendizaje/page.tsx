import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudent } from "@/lib/student-auth";
import { getAcademyLevels } from "@/lib/academy";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { BillingPortalButton, CheckoutButton } from "./BillingActions";

type DB = { prepare(sql: string): { bind(...values: string[]): { all<T>(): Promise<{ results?: T[] }> } } };
export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const student = await getStudent();
  if (!student) redirect("/acceso");
  const { env } = await getCloudflareContext();
  const db = (env as unknown as { COURSE_DB: DB }).COURSE_DB;
  const result = await db.prepare("SELECT course_key,status FROM course_enrolments WHERE learner_id=?").bind(student.learner_id).all<{ course_key: string; status: string }>();
  const enrolments = new Map((result.results ?? []).map((row) => [row.course_key, row.status]));
  const levels = await getAcademyLevels();
  const activeCourses = levels.filter((course) => enrolments.get(course.course_key) === "active");
  const pendingCourses = levels.filter((course) => enrolments.get(course.course_key) === "pending");
  return <main className="student-page"><section className="student-panel"><div className="kicker">MI LINGUAFLY · ÁREA DE ALUMNO</div><h1>Hola, {student.display_name}.</h1><p>Gestiona tus cursos y tu suscripción.</p>
    {activeCourses.length > 0 && <><h2>Mis cursos activos</h2><div className="student-course-grid">{activeCourses.map((course) => <Link className="student-course" href={`/academia/${course.level.toLowerCase()}`} key={course.level}><strong>{course.level}</strong><span>{course.units} unidades</span><b>Entrar al curso ↗</b></Link>)}</div></>}
    {pendingCourses.length > 0 && <><h2>Completa tu suscripción</h2><div className="student-course-grid">{pendingCourses.map((course) => <div className="student-course" key={course.level}><strong>{course.level}</strong><span>Pago pendiente</span><CheckoutButton course={course.course_key}/></div>)}</div></>}
    {activeCourses.length === 0 && pendingCourses.length === 0 && <p>Aún no tienes cursos. <Link href="/suscripcion">Explorar cursos</Link></p>}
    {activeCourses.length > 0 && <BillingPortalButton/>}
    <form action="/api/student/logout" method="post"><button className="student-logout" type="submit">Cerrar sesión</button></form>
  </section></main>;
}
