import Link from "next/link";
import { getArticles } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await getArticles(3);
  return <main>
    <section className="hero"><div className="eyebrow">Aprender inglés · Cambiar perspectivas</div>
      <h1>Tu siguiente paso<br/>empieza con <em>inglés.</em></h1>
      <p className="hero-copy">Gana confianza para comunicarte, abrir oportunidades y llegar más lejos. Aprende con un enfoque práctico, claro y pensado para tu vida real.</p>
      <div className="hero-actions"><a className="button-primary" href="mailto:hola@linguafly.app">Empieza tu camino ↗</a><a className="text-link" href="#metodo">Descubre nuestro método ↓</a></div>
      <div className="hero-note">MENOS BLOQUEOS. MÁS CONVERSACIONES. MÁS POSIBILIDADES.</div>
    </section>
    <section className="section" id="metodo"><div className="section-head"><div><div className="kicker">Una forma diferente de aprender</div><h2>El inglés tiene que<br/>funcionar en tu mundo.</h2></div><p className="section-intro">No se trata solo de memorizar reglas. Se trata de entender, expresarte y usar el idioma con seguridad cada día.</p></div>
      <div className="features"><article className="feature"><div className="feature-num">01 / PRÁCTICA</div><h3>Aprende haciendo</h3><p>Trabaja con situaciones reales y convierte cada aprendizaje en una herramienta útil.</p></article><article className="feature"><div className="feature-num">02 / PROGRESO</div><h3>Avanza con dirección</h3><p>Construye una base sólida y desarrolla habilidades paso a paso, a tu ritmo.</p></article><article className="feature"><div className="feature-num">03 / CONFIANZA</div><h3>Habla sin miedo</h3><p>Gana soltura para participar en conversaciones, estudios y oportunidades profesionales.</p></article></div>
    </section>
    <section className="section programs" id="programas"><div className="section-head"><div><div className="kicker">Tu próximo capítulo</div><h2>Un objetivo. Un camino.<br/>Nuevas posibilidades.</h2></div></div><div className="program-grid"><article className="program-card dark"><div className="kicker">INGLÉS PARA LA VIDA REAL</div><h3>Haz que cada palabra cuente.</h3><p>Desarrolla comprensión, vocabulario y expresión para comunicarte con naturalidad en los momentos que importan.</p><a className="arrow" href="mailto:hola@linguafly.app">↗</a></article><article className="program-card"><div className="kicker">RECURSOS Y CONSEJOS</div><h3>La curiosidad también enseña.</h3><p>Ideas, guías y recursos para seguir aprendiendo dentro y fuera de clase.</p><Link className="arrow" href="/blog">Explorar el blog ↗</Link></article></div></section>
    <section className="section blog-strip"><div className="blog-top"><div><div className="kicker">Linguafly journal</div><h2>Aprende algo nuevo hoy.</h2></div><Link href="/blog">Ver todos los artículos ↗</Link></div>
      {articles.length ? <div className="article-grid home-blog-grid">{articles.map(article => <Link className="article-card" href={`/blog/${article.slug}`} key={article.id}><div className="article-category">{article.category || "Aprender inglés"}</div><h2>{article.title}</h2><p>{article.excerpt || article.description || ""}</p><small>{article.read_time ? article.read_time+" min de lectura" : "Linguafly"} · Leer ↗</small></Link>)}</div> : <div className="blog-preview">Consejos prácticos, explicaciones claras y recursos para que tu inglés avance contigo. Descubre los últimos artículos en nuestro blog.</div>}
    </section>
  </main>;
}
