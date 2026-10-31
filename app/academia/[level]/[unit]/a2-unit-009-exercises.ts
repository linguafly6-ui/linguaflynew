import type { Activity } from "./activity-content";
type Row=[string,string,string,string[],string,string];
const make=(rows:Row[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[4],explanation:r[5],...extra(i)}));
const G:Row[]=[
["g901","Elige la forma correcta.","I was ___ after the long journey.",["tiring","tired","tire"],"tired","-ed describe sentimientos."],
["g902","Completa.","The journey was really ___.",["tired","tiring","tire"],"tiring","-ing describe la causa de la sensación."],
["g903","Elige la opción correcta.","The film was ___, so I fell asleep.",["bored","boring","bore"],"boring","Boring describe algo que aburre."],
["g904","Completa.","We were ___ by the surprise party.",["surprising","surprised","surprise"],"surprised","Surprised describe cómo se sintieron."],
["g905","Elige la opción.","The news was very ___.",["surprised","surprising","surprises"],"surprising","La noticia causa sorpresa."],
["g906","Completa.","She felt ___ because the exam was difficult.",["worried","worrying","worry"],"worried","Worried describe el sentimiento."],
["g907","Elige.","Moving house is ___.",["exhausted","exhausting","exhaust"],"exhausting","La actividad causa cansancio."],
["g908","Completa.","I was ___ when I heard the good news.",["exciting","excited","excite"],"excited","Excited describe cómo se siente alguien."],
["g909","Elige because o so.","I stayed at home ___ I was ill.",["because","so","but"],"because","Because introduce una razón."],
["g910","Elige because o so.","It was raining, ___ we took a taxi.",["because","so","although"],"so","So introduce un resultado."],
["g911","Completa.","He was tired ___ he worked late.",["so","because","and"],"because","El trabajo tarde es la causa."],
["g912","Completa.","The lesson was interesting, ___ everyone listened.",["because","so","although"],"so","So conecta causa y resultado."],
["g913","Detecta la frase correcta.","",["I'm boring today.","I'm bored today.","I bored today."],"I'm bored today.","Bored describe cómo se siente la persona."],
["g914","Elige.","The students were ___ in the topic.",["interesting","interested","interest"],"interested","Interested describe el interés que sienten."],
["g915","Corrige la conexión.","",["Because I was late, so I ran.","Because I was late, I ran.","Because I late, I ran."],"Because I was late, I ran.","No combines because y so en esta estructura."]
];
const V:Row[]=[
["v901","¿Qué significa excited?","excited",["ilusionado/a","preocupado/a","decepcionado/a"],"ilusionado/a","Excited expresa entusiasmo."],
["v902","Traduce worried.","worried",["sorprendido/a","preocupado/a","aliviado/a"],"preocupado/a","Worried significa preocupado/a."],
["v903","¿Qué significa surprised?","surprised",["sorprendido/a","aburrido/a","agotado/a"],"sorprendido/a","Surprised significa sorprendido/a."],
["v904","Traduce disappointed.","disappointed",["decepcionado/a","emocionado/a","tranquilo/a"],"decepcionado/a","Disappointed significa decepcionado/a."],
["v905","¿Qué significa boring?","boring",["que aburre","aburrido/a (sentimiento)","sorprendente"],"que aburre","Boring describe la causa."],
["v906","Traduce tiring.","tiring",["agotador","aliviado","interesante"],"agotador","Tiring significa agotador."],
["v907","¿Qué significa relieved?","relieved",["aliviado/a","preocupado/a","sorprendido/a"],"aliviado/a","Relieved expresa alivio."],
["v908","Traduce because.","because",["por eso","porque","aunque"],"porque","Because introduce una razón."],
["v909","Completa.","I was ___ when I passed the exam.",["relieved","boring","tiring"],"relieved","Aprobar produce alivio."],
["v910","Elige.","She is ___ about her driving test.",["worried","worrying","boring"],"worried","Worried describe el sentimiento."],
["v911","¿Qué significa fascinating?","fascinating",["fascinante","decepcionado","agotador"],"fascinante","Fascinating despierta mucho interés."],
["v912","Traduce confusing.","confusing",["confuso (que confunde)","confundido/a","aliviado/a"],"confuso (que confunde)","Confusing describe algo difícil de entender."],
["v913","Completa.","I'm excited ___ the trip.",["about","because","so"],"about","La expresión es excited about."],
["v914","Elige.","The match was ___. Everyone enjoyed it.",["excited","exciting","excite"],"exciting","El partido causó entusiasmo."],
["v915","¿Qué significa experience?","experience",["experiencia","examen","explicación"],"experiencia","Experience significa experiencia."]
];
const L:Row[]=[
["l901","¿Cómo se siente Lucy al terminar?","",["Aliviada","Aburrida","Decepcionada"],"Aliviada","Dice que está relieved."],
["l902","¿Cómo describe el examen?","",["Fácil","Difícil","Interesante"],"Difícil","Dice que fue difficult."],
["l903","¿Qué le sorprendió?","",["Algunas preguntas","El aula","La hora"],"Algunas preguntas","Unas preguntas eran confusas."],
["l904","¿Por qué estaba preocupada?","",["Preguntas confusas","Llegó tarde","No estudió"],"Preguntas confusas","Las preguntas la preocuparon."],
["l905","¿Qué hizo para tranquilizarse?","",["Respiró profundamente","Salió del aula","Llamó a una amiga"],"Respiró profundamente","Tomó una deep breath."],
["l906","¿Qué plan tenían el sábado?","",["Hacer un picnic","Ir de compras","Visitar familia"],"Hacer un picnic","Habían planeado un picnic."],
["l907","¿Por qué cambiaron el plan?","",["Mal tiempo","Museo cerrado","Cansancio"],"Mal tiempo","El tiempo era terrible."],
["l908","¿Adónde fueron?","",["A un museo","A un restaurante","A la playa"],"A un museo","Visitaron un museo."],
["l909","¿Cómo fue la exposición?","",["Fascinante","Aburrida","Confusa"],"Fascinante","La exposición fue fascinating."],
["l910","¿Cómo se sintieron?","",["Sorprendidos","Enfadados","Preocupados"],"Sorprendidos","Disfrutaron más de lo esperado."],
["l911","¿Por qué estaba cansado el narrador?","",["Caminaron horas","Trabajó toda la noche","Perdió el autobús"],"Caminaron horas","Caminaron durante horas."],
["l912","¿Cómo se sintió al final?","",["Feliz","Decepcionado","Aburrido"],"Feliz","Dice que se sintió happy."],
["l913","¿Qué palabra expresa alivio?","",["relieved","confusing","boring"],"relieved","Relieved expresa alivio."],
["l914","¿Qué conector introduce la razón?","",["because","so","then"],"because","Because introduce una causa."],
["l915","¿Qué conector presenta el resultado?","",["so","because","when"],"so","So introduce el resultado."]
];
const Q:Row[]=[
["r901","¿Qué plan tenía al principio?","",["Un picnic","Una excursión","Ir al cine"],"Un picnic","Había planeado un picnic."],
["r902","¿Por qué cambiaron los planes?","",["El tiempo era terrible","El museo cerró","No había comida"],"El tiempo era terrible","The weather was terrible."],
["r903","¿Cómo se sintieron al principio?","",["Decepcionados","Ilusionados","Aburridos"],"Decepcionados","Se sintieron disappointed."],
["r904","¿Adónde decidieron ir?","",["A un museo","A un parque","A casa"],"A un museo","Decidieron visitar un museo."],
["r905","¿Qué esperaba el narrador?","",["Que fuera aburrido","Que fuera corto","Que estuviera cerrado"],"Que fuera aburrido","Pensó que sería boring."],
["r906","¿Cómo resultó la exposición?","",["Fascinante","Decepcionante","Agotadora"],"Fascinante","Fue fascinating."],
["r907","¿Qué les sorprendió?","",["Cuánto disfrutaron","El precio","El tamaño"],"Cuánto disfrutaron","Se sorprendieron de cuánto la disfrutaron."],
["r908","¿Por qué estaba cansado?","",["Caminaron horas","Durmió poco","Hizo deporte"],"Caminaron horas","Caminaron durante horas."],
["r909","¿Cómo se sintió al final?","",["Feliz","Enfadado","Preocupado"],"Feliz","Se sintió feliz."],
["r910","¿Qué expresa «the film was boring»?","",["La película causaba aburrimiento","La persona estaba aburrida","La película estaba preocupada"],"La película causaba aburrimiento","Boring describe la causa."],
["r911","¿Qué expresa «I was bored»?","",["La persona se sentía aburrida","La persona era aburrida","La situación aburría"],"La persona se sentía aburrida","Bored describe el sentimiento."],
["r912","¿Qué conector introduce una razón?","",["because","so","but"],"because","Because equivale a porque."],
["r913","¿Qué conector introduce una consecuencia?","",["so","because","or"],"so","So equivale a así que."],
["r914","¿Cuál es la idea principal?","",["Un plan cambió y acabó bien","Una visita de trabajo","Un examen difícil"],"Un plan cambió y acabó bien","La experiencia fue mejor de lo esperado."],
["r915","¿Qué muestra la experiencia?","",["Un cambio de planes puede acabar bien","Los museos son aburridos","El tiempo nunca cambia"],"Un cambio de planes puede acabar bien","La visita inesperada fue positiva."]
];
const d=["A: How was your exam, Lucy? B: It was difficult, but I'm relieved because it's finished. A: Were you surprised by the questions? B: Yes, a few were confusing. I was worried at first, so I took a deep breath and read them again.","A: Did you enjoy the trip? B: Yes, it was exciting, but the journey was tiring. A: Were you tired when you arrived? B: Very! But the hotel was amazing, so I felt relaxed.","A: Why are you disappointed? B: The concert was cancelled because the singer was ill. A: That's annoying. B: Yes, but we watched a funny film instead, so the evening wasn't boring."];
const p=["A DAY THAT CHANGED\nLast Saturday, I planned a picnic with my friends. In the morning, the weather was terrible, so we felt disappointed. We decided to visit a museum instead. At first, I thought it would be boring, but the exhibition was fascinating. We were surprised by how much we enjoyed it. I was tired in the evening because we walked around for hours, but I felt happy.","AN UNEXPECTED RESULT\nMaya was worried about her first day at a new school because she didn't know anyone. The morning was confusing, and she felt nervous. Then a friendly student showed her the classrooms and introduced her to some classmates. The lessons were interesting, so Maya soon felt more relaxed. At the end of the day, she was excited about going back.","A WEEKEND TO REMEMBER\nOur train was delayed, so we arrived late at the seaside. At first, everyone was disappointed because we had planned a long walk. The weather was windy and the beach looked empty. However, we found a small café with a fascinating view. The hot chocolate was delicious, and the owner was friendly. We were tired but happy because the unexpected afternoon was wonderful."];
export const a2Unit9Exercises={grammar:make(G),vocabulary:make(V),listening:make(L,i=>i===0?{transcript:d[0]}:i===5?{transcript:d[1]}:i===10?{transcript:d[2]}:{}),reading:make(Q,i=>i===0?{main_text:p[0]}:i===5?{main_text:p[1]}:i===10?{main_text:p[2]}:{})} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
