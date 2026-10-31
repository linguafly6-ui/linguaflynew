import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcademyUnit, isCefrLevel } from "@/lib/academy";
import ActivityContent, { type Activity } from "./activity-content";
import { a2Unit1Exercises } from "./a2-unit-001-exercises";
import { a2Unit2Exercises } from "./a2-unit-002-exercises";
import { a2Unit3Exercises } from "./a2-unit-003-exercises";
import { a2Unit4Exercises } from "./a2-unit-004-exercises";
import { a2Unit5Exercises } from "./a2-unit-005-exercises";
import { a2Unit6Exercises } from "./a2-unit-006-exercises";
import { a2Unit7Exercises } from "./a2-unit-007-exercises";
import { a2Unit8Exercises } from "./a2-unit-008-exercises";
import { a2Unit9Exercises } from "./a2-unit-009-exercises";
import { a2Unit10Exercises } from "./a2-unit-010-exercises";
import { a2Unit11Exercises } from "./a2-unit-011-exercises";

export const dynamic = "force-dynamic";
type Block = { block_id?: string; title?: string; duration_minutes?: number; content?: Activity[] };
type Blueprint = {
  estimated_minutes?: number; language?: string; lesson_sequence?: string[];
  grammar_lesson?: { title?: string; explanation?: string; patterns?: string[]; commonErrors?: string[] };
  vocabulary?: { term: string; translation_es?: string; part_of_speech?: string; example?: string }[];
  reading?: { title?: string; text?: string; questions?: string[][] };
  listening?: { title?: string; transcript?: string; questions?: string[][]; audio_asset_status?: string };
  speaking_task?: string; writing_task?: string; review_checklist?: string[]; editorial_notes?: string[];
};
const spanishGrammarGuides: Record<number, { explanation: string; examples: string[] }> = {
  1: { explanation: "En esta unidad se presenta la estructura gramatical indicada en el título. Lee primero cada patrón y fíjate en el orden de las palabras. Los ejemplos en inglés muestran cómo se aplica la regla; su objetivo es que puedas reconocerla y utilizarla en frases sencillas.", examples: ["Identifica el sujeto y el verbo antes de construir la frase.", "Compara los ejemplos afirmativos, negativos e interrogativos cuando aparezcan."] },
  2: { explanation: "En inglés, los adjetivos posesivos indican quién tiene o a quién pertenece algo. No cambian según el objeto poseído, sino según la persona que posee: my (mi), your (tu), his (su, de él), her (su, de ella), its (su, de un animal o cosa), our (nuestro/a) y their (su, de ellos). Para expresar posesión con un nombre propio o una persona, normalmente añadimos apóstrofo + s: Emma's brother (el hermano de Emma). Have got significa tener y se conjuga have got con I/you/we/they y has got con he/she/it.", examples: ["This is my sister. = Esta es mi hermana.", "Daniel's parents have got a new car. = Los padres de Daniel tienen un coche nuevo.", "She has got two brothers. = Ella tiene dos hermanos."] },
  3: { explanation: "Para describir a una persona usamos be para hablar de características y have para rasgos físicos que alguien tiene. Be + adjetivo: She is friendly (Ella es simpática). Have + sustantivo: He has blue eyes (Él tiene los ojos azules). En inglés, cuando usamos varios adjetivos delante de un nombre, suelen seguir un orden; en este nivel, presta atención a colocar primero la descripción general y después los detalles. Los modificadores quite (bastante), very (muy) y a bit (un poco) permiten ajustar la intensidad.", examples: ["She is quite shy. = Ella es bastante tímida.", "He has got curly hair. = Él tiene el pelo rizado.", "They are very friendly. = Son muy simpáticos."] },
  4: { explanation: "El presente simple se utiliza para hablar de rutinas, hábitos y hechos habituales. En afirmativa, añadimos -s o -es al verbo con he, she e it: I work, but she works. Para preguntas usamos do con I/you/we/they y does con he/she/it; después de does, el verbo principal vuelve a su forma base. Para negar usamos don't o doesn't. Los adverbios de frecuencia (always, usually, often, sometimes, hardly ever, never) suelen ir antes del verbo principal, pero después del verbo be.", examples: ["He gets up at seven. = Él se levanta a las siete.", "Do you work on Saturdays? = ¿Trabajas los sábados?", "She is usually tired after work. = Ella normalmente está cansada después del trabajo."] },
  5: { explanation: "Para hablar de gustos y preferencias podemos usar like, love, enjoy y hate seguidos de un verbo terminado en -ing: I enjoy reading (Disfruto leyendo). La expresión be interested in también va seguida de un nombre o de un verbo en -ing: interested in music / interested in cooking. Para comparar preferencias usamos prefer A to B; si comparamos actividades, ambas suelen llevar -ing: I prefer walking to driving (Prefiero caminar a conducir). Because introduce el motivo de algo y equivale a «porque».", examples: ["She loves playing tennis. = A ella le encanta jugar al tenis.", "I'm interested in learning English. = Estoy interesado/a en aprender inglés.", "I prefer tea to coffee because it's relaxing. = Prefiero el té al café porque es relajante."] },
  6: { explanation: "En inglés, los sustantivos contables se pueden contar y tienen singular y plural: an apple / two apples. Los incontables nombran sustancias o conceptos que normalmente no contamos por unidades: water, rice, bread. Usa many con contables en plural y much con incontables. Some suele aparecer en afirmativas y también en ofrecimientos o peticiones; any es habitual en negativas y preguntas. A few significa «unos pocos» y acompaña a contables; a little significa «un poco de» y acompaña a incontables. Para preguntar la cantidad, usa How many...? con contables y How much...? con incontables.", examples: ["There are a few apples. = Hay unas pocas manzanas.", "There isn't much milk. = No hay mucha leche.", "Would you like some water? = ¿Te apetece un poco de agua?"] },
  7: { explanation: "Para hablar de los lugares y servicios de un barrio, es importante distinguir los sustantivos contables de los incontables. Los contables tienen singular y plural (a shop / two shops); los incontables normalmente no llevan -s (traffic, information). Usa many con contables plurales y much con incontables. Some suele aparecer en afirmativas; any, en preguntas y negativas. A lot of sirve con ambos tipos. Recuerda que there is acompaña al singular o a incontable y there are al plural.", examples: ["There are many cafés near my home. = Hay muchas cafeterías cerca de mi casa.", "There isn't much traffic at night. = No hay mucho tráfico por la noche.", "Are there any parks? Yes, there are some. = ¿Hay parques? Sí, hay algunos.", "There is a lot of information online. = Hay mucha información en internet."] },
  8: { explanation: "Usa this (este/esta) y these (estos/estas) para señalar algo cercano; that (ese/esa/aquel/aquella) y those (esos/esas/aquellos/aquellas) para algo más lejano. This y that acompañan a nombres singulares; these y those, a plurales. Los pronombres posesivos mine, yours, his, hers, ours y theirs sustituyen al nombre y evitan repetirlo: This is my bag. That one is yours. Para preguntar por el propietario usamos whose: Whose phone is this? (¿De quién es este teléfono?). Recuerda la diferencia entre adjetivo posesivo + nombre (my keys) y pronombre posesivo sin nombre (the keys are mine).", examples: ["This is my bag. That one is yours. = Esta es mi bolsa. Aquella es tuya.", "These keys are ours. = Estas llaves son nuestras.", "Whose phone is this? It's hers. = ¿De quién es este teléfono? Es suyo (de ella).", "Those seats are theirs. = Aquellos asientos son suyos (de ellos)."] },
  9: { explanation: "Los adjetivos terminados en -ed describen cómo se siente una persona: bored (aburrido/a), excited (ilusionado/a), worried (preocupado/a). Los terminados en -ing describen aquello que causa esa emoción: boring (que aburre), exciting (emocionante), worrying (que preocupa). Compara: I'm bored because the film is boring (Estoy aburrido porque la película es aburrida). Usa because para introducir una razón y so para presentar un resultado. No combines ambos conectores en la misma estructura: Because I was tired, I went home / I was tired, so I went home.", examples: ["I'm excited about the trip. = Estoy ilusionado/a con el viaje.", "The journey was tiring, so we stayed at home. = El viaje fue agotador, así que nos quedamos en casa.", "She was surprised by the news. = Ella se sorprendió con la noticia.", "The lesson was interesting, and the students were interested. = La clase era interesante y los estudiantes estaban interesados."] },
  10: { explanation: "Esta unidad integra estructuras esenciales del nivel A2. Usa el presente simple para rutinas y hechos: I work in a library (Trabajo en una biblioteca). Para describir identidad, estado o características utiliza be: Are your neighbours friendly? (¿Son simpáticos tus vecinos?). Para preguntar por acciones y rutinas usa do/does: Where does your brother live? (¿Dónde vive tu hermano?). Recuerda que does va seguido del verbo en forma base y que la -s aparece en el verbo de la afirmativa: She lives, pero Does she live? Los adverbios de frecuencia suelen ir antes del verbo principal (I usually walk) y después de be (She is usually busy). Usa because para explicar motivos y but para contrastar ideas.", examples: ["What do you do? I work in a library. = ¿A qué te dedicas? Trabajo en una biblioteca.", "Where does your brother live? He lives in Cardiff. = ¿Dónde vive tu hermano? Vive en Cardiff.", "Are your neighbours friendly? Yes, they are. = ¿Son simpáticos tus vecinos? Sí.", "I usually walk to work, but I sometimes take the bus because it rains. = Normalmente voy andando al trabajo, pero a veces cojo el autobús porque llueve."] },
  11: { explanation: "Esta unidad combina vocabulario de alimentos y comidas con estructuras para comprar y cocinar. Usa sustantivos contables e incontables: an apple / some rice. Many y how many acompañan a contables; much y how much, a incontables. Some aparece en afirmativas y peticiones; any, normalmente en preguntas y negativas. Para pedir con educación, utiliza would like: I'd like a sandwich (Quisiera un sándwich). El imperativo da instrucciones: Chop the onions (Pica las cebollas). Should y shouldn't sirven para aconsejar: You should eat more vegetables (Deberías comer más verduras). Para comparar, añade -er o usa more: cheaper (más barato), more expensive (más caro).", examples: ["How many tomatoes do we need? = ¿Cuántos tomates necesitamos?", "How much rice would you like? = ¿Cuánto arroz quieres?", "I'd like some water, please. = Quisiera un poco de agua, por favor.", "Fry the onions for five minutes. = Fríe las cebollas durante cinco minutos.", "You should eat more fruit. = Deberías comer más fruta.", "This shop is cheaper than the supermarket. = Esta tienda es más barata que el supermercado."] },
};
function Questions({ items }: { items: string[][] }) {
  return <ol className="theory-question-list">{items.map((q,i)=><li key={i}><span className="question-number">{String(i+1).padStart(2,"0")}</span><div><p>{q[0]}</p>{q.length>1&&<small>Opciones: {q.slice(1,4).join(" · ")}</small>}{q[4]&&<p className="question-answer"><strong>Respuesta: {q[4]}</strong></p>}</div></li>)}</ol>;
}
function BlueprintView({ data, title, level, number }: { data: Blueprint; title: string; level: string; number: number }) {
  return <main className="unit-learning" style={{maxWidth:980,margin:"0 auto",padding:"48px 24px"}}>
    <Link href={`/academia/${level.toLowerCase()}`} className="back-link">← Academia {level}</Link>
    <div className="kicker" style={{marginTop:24}}>LINGUAFLY ACADEMY · {level} · UNIDAD {String(number).padStart(2,"0")}</div>
    <div className="kicker" style={{marginTop:12}}>BORRADOR EDITORIAL · NO PUBLICADO</div>
    <section className="unit-hero"><div className="academy-hero-meta"><span>{level}</span><span>{data.estimated_minutes ?? "—"} minutos</span><span>{data.language ?? "English"}</span></div><h1>{title}</h1><p>Contenido en revisión editorial. Esta unidad todavía no está aprobada para su publicación a estudiantes.</p></section>
    <section className="theory-content" aria-label="Contenido teórico de la unidad">
      {!!data.lesson_sequence?.length&&<section className="theory-card theory-roadmap"><div className="theory-section-label"><span className="theory-icon">✦</span><span>MAPA DE APRENDIZAJE</span></div><h2>Tu recorrido de aprendizaje</h2><p className="theory-intro">Estos son los pasos que seguirás para dominar los objetivos de esta unidad. Las indicaciones están en castellano; los ejemplos se mantienen en inglés para practicar.</p><ol className="roadmap-list">{data.lesson_sequence.map((x,i)=><li key={x}><span className="roadmap-index">{String(i+1).padStart(2,"0")}</span><span>{x.replaceAll("_"," ")}</span></li>)}</ol></section>}
      {data.grammar_lesson&&<section className="theory-card grammar-theory"><div className="theory-section-label"><span className="theory-icon">Aa</span><span>GRAMMAR · GRAMÁTICA</span></div><h2>{data.grammar_lesson.title}</h2><p className="theory-intro">{spanishGrammarGuides[number]?.explanation ?? "Lee la explicación y los ejemplos con calma. La regla se presenta en castellano y las frases en inglés sirven para ver cómo se utiliza en contexto."}</p>{!!spanishGrammarGuides[number]?.examples.length&&<div className="theory-subsection"><h3>Ejemplos explicados</h3><ul>{spanishGrammarGuides[number].examples.map((example,i)=><li key={i}>{example}</li>)}</ul></div>}{!!data.grammar_lesson.patterns?.length&&<div className="theory-subsection"><h3>Cómo se construye la frase</h3><div className="grammar-patterns">{(number===7 ? ["There are many cafés near my home. = Hay muchas cafeterías cerca de mi casa.","There isn’t much traffic at night. = No hay mucho tráfico por la noche.","Are there any parks? Yes, there are some. = ¿Hay parques? Sí, hay algunos.","There are a lot of shops, but there isn’t much parking. = Hay muchas tiendas, pero no hay mucho aparcamiento."] : data.grammar_lesson.patterns).map((x,i)=><div className="grammar-pattern" key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{x}</p></div>)}</div></div>}{!!data.grammar_lesson.commonErrors?.length&&<div className="common-errors"><h3><span aria-hidden="true">!</span> Errores frecuentes</h3><ul>{(number===7 ? ["many traffic → much traffic: «tráfico» es incontable.","informations → information: «información» no lleva -s en inglés.","There are much shops → There are many shops: shops es contable plural."] : data.grammar_lesson.commonErrors).map((x,i)=><li key={i}>{x}</li>)}</ul></div>}</section>}
      {!!data.vocabulary?.length&&<section className="theory-card vocabulary-theory"><div className="theory-section-label"><span className="theory-icon">文</span><span>VOCABULARY · VOCABULARIO</span></div><div className="theory-heading-row"><div><h2>Palabras clave</h2><p className="theory-intro">Aprende el significado en castellano y observa cómo se utiliza cada expresión en inglés.</p></div><span className="theory-count">{data.vocabulary.length} palabras</span></div><div className="vocabulary-grid">{data.vocabulary.map((x,i)=><article className="vocabulary-card" key={x.term}><span className="vocabulary-number">{String(i+1).padStart(2,"0")}</span><h3>{x.term}</h3><span className="vocabulary-meta">{x.part_of_speech??"Vocabulary"}{x.translation_es?" · "+x.translation_es:""}</span>{x.example&&<p className="vocabulary-example">“{x.example}”</p>}</article>)}</div></section>}
      <div className="theory-reading-grid">
        {data.reading&&<section className="theory-card text-skill-card"><div className="theory-section-label"><span className="theory-icon">↗</span><span>READING · COMPRENSIÓN LECTORA</span></div><h2>{data.reading.title}</h2><div className="theory-reading-text">{data.reading.text}</div>{!!data.reading.questions?.length&&<div className="theory-questions"><h3>Comprueba lo que has entendido</h3><Questions items={data.reading.questions}/></div>}</section>}
        {data.listening&&<section className="theory-card text-skill-card"><div className="theory-section-label"><span className="theory-icon">♫</span><span>LISTENING · COMPRENSIÓN ORAL</span></div><h2>{data.listening.title}</h2><div className="listening-transcript"><span>TRANSCRIPCIÓN</span><p>{data.listening.transcript}</p></div><p className="audio-status-note">Audio: {data.listening.audio_asset_status??"pendiente de verificación"}. Por ahora se ofrece el texto de apoyo, no una grabación.</p>{!!data.listening.questions?.length&&<div className="theory-questions"><h3>Comprueba lo que has entendido</h3><Questions items={data.listening.questions}/></div>}</section>}
      </div>
      {!!data.review_checklist?.length&&<section className="theory-card review-theory"><div className="theory-section-label"><span className="theory-icon">✓</span><span>REPASO · AL FINAL DE LA UNIDAD</span></div><h2>¿Ya lo tienes?</h2><p className="theory-intro">Utiliza esta lista para comprobar qué sabes hacer antes de continuar.</p><ul>{data.review_checklist.map((x,i)=><li key={i}><span>{String(i+1).padStart(2,"0")}</span>{x}</li>)}</ul></section>}
      {!!data.editorial_notes?.length&&<section className="theory-card editorial-notes"><div className="theory-section-label"><span className="theory-icon">✦</span><span>NOTAS EDITORIALES · BORRADOR</span></div><ul>{data.editorial_notes.map((x,i)=><li key={i}>{x}</li>)}</ul></section>}
    </section>
    {number === 1 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 1 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Completa las actividades y comprueba cada respuesta. El audio de listening se reproduce mediante voz sintética del navegador.</p>
      {([
        ["GRAMMAR",a2Unit1Exercises.grammar],
        ["VOCABULARY",a2Unit1Exercises.vocabulary],
        ["LISTENING",a2Unit1Exercises.listening],
        ["READING",a2Unit1Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 2 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 2 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica los posesivos, have got, las relaciones familiares y la comprensión oral y lectora. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([
        ["GRAMMAR",a2Unit2Exercises.grammar],
        ["VOCABULARY",a2Unit2Exercises.vocabulary],
        ["LISTENING",a2Unit2Exercises.listening],
        ["READING",a2Unit2Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 3 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 3 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica descripciones físicas y de personalidad, el uso de be y have y el orden de los adjetivos. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([
        ["GRAMMAR",a2Unit3Exercises.grammar],
        ["VOCABULARY",a2Unit3Exercises.vocabulary],
        ["LISTENING",a2Unit3Exercises.listening],
        ["READING",a2Unit3Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 4 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 4 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica el presente simple, las rutinas diarias y los adverbios de frecuencia. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([
        ["GRAMMAR",a2Unit4Exercises.grammar],
        ["VOCABULARY",a2Unit4Exercises.vocabulary],
        ["LISTENING",a2Unit4Exercises.listening],
        ["READING",a2Unit4Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 5 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 5 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica like, love, enjoy y hate + -ing, preferencias con prefer y vocabulario de actividades de ocio. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([
        ["GRAMMAR",a2Unit5Exercises.grammar],
        ["VOCABULARY",a2Unit5Exercises.vocabulary],
        ["LISTENING",a2Unit5Exercises.listening],
        ["READING",a2Unit5Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 6 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 6 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica los nombres contables e incontables, cuantificadores y vocabulario de alimentación, cocina y restaurantes. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([
        ["GRAMMAR",a2Unit6Exercises.grammar],
        ["VOCABULARY",a2Unit6Exercises.vocabulary],
        ["LISTENING",a2Unit6Exercises.listening],
        ["READING",a2Unit6Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 7 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 7 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica los sustantivos contables e incontables, some, any, much y many, y el vocabulario de los servicios y lugares del barrio. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([
        ["GRAMMAR",a2Unit7Exercises.grammar],
        ["VOCABULARY",a2Unit7Exercises.vocabulary],
        ["LISTENING",a2Unit7Exercises.listening],
        ["READING",a2Unit7Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 8 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 8 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica this, that, these y those, los pronombres posesivos y las preguntas con whose, además del vocabulario de pertenencias y objetos perdidos. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([
        ["GRAMMAR",a2Unit8Exercises.grammar],
        ["VOCABULARY",a2Unit8Exercises.vocabulary],
        ["LISTENING",a2Unit8Exercises.listening],
        ["READING",a2Unit8Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 9 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 9 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica los adjetivos terminados en -ed y -ing para expresar sentimientos y causas, y los conectores because y so. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([
        ["GRAMMAR",a2Unit9Exercises.grammar],
        ["VOCABULARY",a2Unit9Exercises.vocabulary],
        ["LISTENING",a2Unit9Exercises.listening],
        ["READING",a2Unit9Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 10 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 10 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Repasa el presente simple, las preguntas con be y do/does, los adverbios de frecuencia, las descripciones personales y las expresiones para hablar de rutinas e intereses. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([
        ["GRAMMAR",a2Unit10Exercises.grammar],
        ["VOCABULARY",a2Unit10Exercises.vocabulary],
        ["LISTENING",a2Unit10Exercises.listening],
        ["READING",a2Unit10Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 11 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 11 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica los alimentos, las comidas y las compras; los cuantificadores, would like, los imperativos, comparativos y consejos con should. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([
        ["GRAMMAR",a2Unit11Exercises.grammar],
        ["VOCABULARY",a2Unit11Exercises.vocabulary],
        ["LISTENING",a2Unit11Exercises.listening],
        ["READING",a2Unit11Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
        <div className="unit-next"><Link className="academy-button" href={`/academia/${level.toLowerCase()}`}>Volver al temario</Link></div>
  </main>;
}
export default async function AcademyUnitPage({ params }: { params: Promise<{ level: string; unit: string }> }) {
  const { level: rawLevel, unit: rawUnit } = await params;
  const level = rawLevel.toUpperCase(), unitNumber = Number(rawUnit);
  if (!isCefrLevel(level)) notFound();
  const unit = await getAcademyUnit(level, unitNumber);
  if (!unit) notFound();
  if (level === "A2" && unit.content.lesson_sequence) return <BlueprintView data={unit.content as Blueprint} title={unit.title} level={level} number={unitNumber}/>;
  const course = unit.content.course ?? {};
  const outcomes = Array.isArray(unit.content.learning_outcomes) ? unit.content.learning_outcomes as string[] : [];
  const blocks = Array.isArray(unit.content.blocks) ? unit.content.blocks as Block[] : [];
  const activityCount = blocks.reduce((sum, block) => sum + (block.content?.length ?? 0), 0);
  return <main><section className="unit-hero"><Link href={`/academia/${level.toLowerCase()}`} className="back-link">← Volver a Inglés {level}</Link><div className="kicker">LINGUAFLY ACADEMY · {level} · UNIDAD {String(unitNumber).padStart(2,"0")}</div><h1>{unit.title}</h1><p>Una unidad práctica para avanzar en tu inglés, consolidar conocimientos y aplicar lo aprendido.</p><div className="academy-hero-meta"><span>{course.total_duration_minutes ?? "—"} min estimados</span><span>{blocks.length} bloques</span><span>{activityCount} actividades</span></div></section><section className="unit-learning">{outcomes.length>0&&<div className="outcomes-card"><div className="kicker">AL TERMINAR ESTA UNIDAD</div><h2>Lo que vas a aprender</h2><ul>{outcomes.map((x,i)=><li key={i}><span>✓</span>{x}</li>)}</ul></div>}<div className="lesson-heading"><div className="kicker">CONTENIDO DEL CURSO</div><h2>Tu recorrido de aprendizaje</h2><p>Explora cada bloque y trabaja las actividades a tu ritmo.</p></div><div className="lesson-blocks">{blocks.map((block,index)=><article className="lesson-block" key={block.block_id??index}><div className="lesson-block-head"><span className="lesson-block-number">BLOQUE {String(index+1).padStart(2,"0")}</span><span>{block.duration_minutes?block.duration_minutes+" min":(block.content?.length??0)+" actividades"}</span></div><h3>{block.title??`Bloque ${index+1}`}</h3><ActivityContent activities={block.content??[]} mode={["B1","B2"].includes(block.block_id??"")||/vocabulario|vocabulary/i.test(block.title??"")?"vocabulary":"standard"}/></article>)}</div><div className="unit-next"><Link className="academy-button" href={`/academia/${level.toLowerCase()}`}>Volver al temario</Link></div></section></main>;
}