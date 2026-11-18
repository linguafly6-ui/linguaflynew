import Link from "next/link";

export const metadata = {
  title: "Classroom English · Misión 058 · Linguafly",
  description: "Aprende instrucciones habituales del aula en inglés."
};

export default function Mission058Page() {
  return <main>
    <section className="level-hero">
      <Link href="/academia/pre-a1" className="back-link">← Misiones Pre-A1</Link>
      <div className="kicker">LINGUAFLY QUEST · PRE-A1 · MISIÓN 058</div>
      <h1>Classroom English</h1>
      <p>Aprende a comprender y seguir instrucciones habituales del aula.</p>
    </section>
    <section className="unit-section">
      <iframe title="Misión 058 · Classroom English" src="/missions/pre-a1/058/index.html" style={{width:"100%",height:"1050px",border:"1px solid #dce6f7",borderRadius:"18px",background:"white"}} />
    </section>
  </main>;
}