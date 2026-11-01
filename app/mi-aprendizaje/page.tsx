import Link from "next/link";
import {redirect} from "next/navigation";
import {getStudent} from "@/lib/student-auth";
import {getAcademyLevels} from "@/lib/academy";
import {getCloudflareContext} from "@opennextjs/cloudflare";
type DB={prepare(sql:string):{bind(...v:string[]):{all<T>():Promise<{results?:T[]}>}}};
export const dynamic="force-dynamic";
export default async function StudentDashboard(){const student=await getStudent();if(!student)redirect("/acceso");const {env}=await getCloudflareContext(),db=(env as unknown as {COURSE_DB:DB}).COURSE_DB;const result=await db.prepare("SELECT course_key FROM course_enrolments WHERE learner_id=? AND status='active'").bind(student.learner_id).all<{course_key:string}>();const enrolled=new Set((result.results??[]).map(x=>x.course_key));const levels=await getAcademyLevels();const courses=levels.filter(x=>enrolled.has(x.course_key));return <main className="student-page"><section className="student-panel"><div className="kicker">MI LINGUAFLY · ÁREA DE ALUMNO</div><h1>Hola, {student.display_name}.</h1><p>Estos son los cursos en los que estás inscrito.</p>{courses.length?<div className="student-course-grid">{courses.map(c=><Link className="student-course" href={`/academia/${c.level.toLowerCase()}`} key={c.level}><strong>{c.level}</strong><span>{c.units} unidades</span><b>Entrar al curso ↗</b></Link>)}</div>:<p>Aún no tienes cursos activos. <Link href="/suscripcion">Explorar cursos</Link></p>}<form action="/api/student/logout" method="post"><button className="student-logout">Cerrar sesión</button></form></section></main>}
