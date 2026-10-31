import type { Activity } from "./activity-content";

const mc = (id: string, prompt_es: string, question_en: string, options: string[], correct: string, explanation: string, extra: Partial<Activity> = {}): Activity => ({
  interaction_id: id, type: "multiple_choice", prompt_es, question_en,
  options: options.map((text, i) => ({ id: String.fromCharCode(65+i), text })),
  correct_answer: correct, explanation, ...extra,
});
const fill = (id: string, prompt_es: string, stimulus_en: string, correct: string, explanation: string): Activity => ({
  interaction_id:id, type:"fill_blank", prompt_es, stimulus_en, correct_answer:correct, explanation
});

export const a2Unit1Exercises = {
  grammar: [
    mc("g01","Elige la forma correcta de ‘be’.","I ___ from Seville.",["am","is","are"],"am","Con I usamos am."),
    mc("g02","Completa la pregunta.","Where ___ your parents from?",["is","are","do"],"are","Parents es plural: are."),
    mc("g03","Elige la forma negativa correcta.","She ___ a student.",["don't","isn't","aren't"],"isn't","Con she, la negación de be es isn't."),
    mc("g04","Selecciona el auxiliar correcto.","___ you have any brothers or sisters?",["Are","Do","Does"],"Do","Con you y have usamos do."),
    mc("g05","Elige la forma correcta en tercera persona.","My brother ___ in a bank.",["work","works","working"],"works","En present simple, he/she/it añade -s."),
    fill("g06","Completa con el verbo correcto.","I ___ (live) near the city centre.","live","Con I usamos la forma base del present simple."),
    mc("g07","Elige la pregunta correcta.","Ask about someone's job.",["What do you do?","What are you do?","What you do?"],"What do you do?","La estructura es What + do + subject + base verb."),
    mc("g08","Selecciona la respuesta corta correcta.","Are they married?",["Yes, they are.","Yes, they do.","Yes, they is."],"Yes, they are.","Las respuestas cortas con be repiten be."),
    fill("g09","Completa la frase en negativo.","He ___ (not / speak) French.","doesn't speak","Con he usamos doesn't + verbo base."),
    mc("g10","Elige el orden correcto para una pregunta.","___?",["Where you work?","Where do you work?","Where does you work?"],"Where do you work?","En preguntas con you: wh-word + do + subject + base verb."),
    mc("g11","Elige el pronombre posesivo correcto.","Anna is my sister. ___ surname is Lee.",["His","Her","Their"],"Her","Her corresponde a una persona femenina."),
    fill("g12","Completa con ‘is’ o ‘are’.","My name ___ Daniel.","is","My name es singular."),
    mc("g13","Elige la opción correcta.","They ___ from Italy; they are from Spain.",["isn't","aren't","don't"],"aren't","La negación de are es aren't."),
    mc("g14","Selecciona la forma correcta.","Does your friend ___ English?",["speaks","speak","speaking"],"speak","Después de does, el verbo va en forma base."),
    mc("g15","Elige la pregunta de seguimiento adecuada.","Someone says: ‘I work in a hospital.’",["Where is it?","Do you like your job?","How old are you?"],"Do you like your job?","Una pregunta natural de seguimiento pregunta por su opinión.")
  ],
  vocabulary: [
    mc("v01","¿Qué significa ‘surname’?","surname",["nombre","apellido","dirección"],"apellido","Surname significa apellido."),
    mc("v02","Elige la palabra para ‘fecha de nacimiento’.","date of birth",["date of birth","place of work","phone number"],"date of birth","Date of birth es fecha de nacimiento."),
    mc("v03","¿Quién es tu ‘cousin’?","cousin",["tu primo/a","tu sobrino/a","tu cuñado/a"],"tu primo/a","Cousin significa primo o prima."),
    mc("v04","Completa la profesión: ‘She teaches at a school. She is a ___.’","",["teacher","nurse","driver"],"teacher","A teacher trabaja enseñando."),
    mc("v05","¿Qué significa ‘engineer’?","engineer",["ingeniero/a","enfermero/a","dependiente/a"],"ingeniero/a","Engineer significa ingeniero o ingeniera."),
    mc("v06","Elige el verbo que combina con ‘music’.","I ___ music in my free time.",["listen to","watch","meet"],"listen to","La expresión es listen to music."),
    mc("v07","¿Qué significa ‘hometown’?","hometown",["país de trabajo","ciudad natal","código postal"],"ciudad natal","Hometown es la ciudad o localidad de origen."),
    mc("v08","Elige la palabra para ‘soltero/a’.","single",["married","single","friendly"],"single","Single significa soltero o soltera."),
    mc("v09","¿Qué es un ‘neighbour’?","neighbour",["compañero de clase","vecino/a","familiar"],"vecino/a","Neighbour significa vecino o vecina."),
    mc("v10","Completa: ‘My sister is very ___. She talks to everyone.’","",["friendly","quietly","surname"],"friendly","Friendly describe a alguien amable y sociable."),
    mc("v11","¿Qué significa ‘free time’?","free time",["tiempo libre","tiempo completo","hora de llegada"],"tiempo libre","Free time es tiempo libre."),
    mc("v12","Elige la palabra para ‘afición’.","hobby",["hobby","job","age"],"hobby","Hobby significa afición o pasatiempo."),
    mc("v13","¿Qué significa ‘address’?","address",["edad","dirección","apellido"],"dirección","Address significa dirección."),
    mc("v14","Completa: ‘I’m interested ___ photography.’","",["on","at","in"],"in","La expresión correcta es interested in."),
    mc("v15","Elige la expresión para preguntar por el origen.","",["Where are you from?","How are you called?","What do you work?"],"Where are you from?","Where are you from? pregunta de dónde es alguien.")
  ],
  listening: [
    mc("l01","¿De dónde es Maya?","",["Bristol","London","Oxford"],"Bristol","Maya dice que es de Bristol.",{transcript:"Receptionist: Hello. What's your name?\nMaya: I'm Maya Patel.\nReceptionist: Nice to meet you, Maya. Where are you from?\nMaya: I'm from Bristol, but I live in London now.\nReceptionist: What do you do?\nMaya: I'm a nurse at a city hospital."}),
    mc("l02","¿Dónde vive Maya ahora?","",["Bristol","London","Manchester"],"London","Ahora vive en Londres."),
    mc("l03","¿Cuál es la profesión de Maya?","",["doctor","nurse","teacher"],"nurse","Maya trabaja como enfermera."),
    mc("l04","¿Cuál es el apellido de Maya?","",["Patel","Peter","Parker"],"Patel","Se presenta como Maya Patel."),
    mc("l05","¿Dónde trabaja?","",["At a school","At a city hospital","At a hotel"],"At a city hospital","Lo indica al final del diálogo."),
    mc("l06","¿Qué estudia Leo?","",["Business","English","Engineering"],"Engineering","Leo dice que estudia engineering.",{transcript:"Sara: Hi, Leo. Do you work or are you a student?\nLeo: I'm a student. I study engineering at university.\nSara: Do you live with your family?\nLeo: No, I share a flat with two friends.\nSara: What do you do at weekends?\nLeo: I usually play football and visit my parents."}),
    mc("l07","¿Con quién comparte piso Leo?","",["His parents","Two friends","His sister"],"Two friends","Comparte piso con dos amigos."),
    mc("l08","¿Vive con su familia?","",["Yes","No","The dialogue doesn't say"],"No","Responde: No, I share a flat..."),
    mc("l09","¿Qué suele hacer los fines de semana?","",["Play football","Go skiing","Study French"],"Play football","Suele jugar al fútbol y visitar a sus padres."),
    mc("l10","¿Dónde estudia?","",["At school","At university","At home"],"At university","Estudia en la universidad."),
    mc("l11","¿Cuántos hijos tiene Emma?","",["One","Two","Three"],"Two","Emma dice que tiene dos hijos.",{transcript:"Tom: Tell me about your family, Emma.\nEmma: I'm married and I have two children. My daughter is eight and my son is five.\nTom: Do they go to school near here?\nEmma: Yes, they do. It's a small school near our house.\nTom: And what do you enjoy doing together?\nEmma: We love cycling in the park."}),
    mc("l12","¿Cuántos años tiene la hija?","",["Five","Eight","Ten"],"Eight","Su hija tiene ocho años."),
    mc("l13","¿Dónde está el colegio?","",["Near their house","In the city centre","Near Tom's office"],"Near their house","El colegio está cerca de su casa."),
    mc("l14","¿Qué les gusta hacer juntos?","",["Cooking","Cycling in the park","Watching films"],"Cycling in the park","Les encanta montar en bicicleta en el parque."),
    mc("l15","¿Está Emma casada?","",["Yes","No","Not mentioned"],"Yes","Emma empieza diciendo I'm married.")
  ],
  reading: [
    mc("r01","¿Dónde trabaja Alex?","",["In a bookshop","In a café","In a school"],"In a bookshop","El texto dice que trabaja en una librería.",{main_text:"ALEX'S PROFILE\nHi! I'm Alex Morgan and I'm 26 years old. I'm from Cardiff, in Wales, but I live in Leeds now. I work in a bookshop in the city centre. I speak English and a little Spanish. In my free time, I enjoy running and meeting friends for coffee."}),
    mc("r02","¿De dónde es Alex?","",["Leeds","Cardiff","London"],"Cardiff","Alex es de Cardiff, aunque ahora vive en Leeds."),
    mc("r03","¿Cuántos años tiene?","",["Twenty-six","Twenty-eight","Thirty"],"Twenty-six","Tiene 26 años."),
    mc("r04","¿Qué idiomas habla?","",["English and Spanish","English and French","Welsh and German"],"English and Spanish","Habla inglés y un poco de español."),
    mc("r05","¿Qué hace en su tiempo libre?","",["Running and meeting friends","Cooking and swimming","Reading at work"],"Running and meeting friends","Le gusta correr y quedar con amigos."),
    mc("r06","¿Cuál es el horario de la clase?","",["Monday morning","Tuesday evening","Friday afternoon"],"Tuesday evening","El anuncio indica martes de 18:30 a 20:00.",{main_text:"COMMUNITY ENGLISH CLASS\nJoin our friendly English class for adults. Lessons are every Tuesday from 6:30 p.m. to 8 p.m. at Green Street Library. The course starts on 14 October. Bring a notebook and a pen. For information, email courses@greenstreet.example."}),
    mc("r07","¿Dónde son las clases?","",["At Green Street Library","At the town hall","At a school"],"At Green Street Library","Se celebran en Green Street Library."),
    mc("r08","¿Cuándo empieza el curso?","",["14 October","4 October","14 November"],"14 October","La fecha de inicio es 14 October."),
    mc("r09","¿Qué deben llevar los alumnos?","",["A laptop","A notebook and a pen","A dictionary"],"A notebook and a pen","El anuncio pide cuaderno y bolígrafo."),
    mc("r10","¿A quién va dirigido el curso?","",["Children","Adults","Teachers only"],"Adults","El anuncio dice English class for adults."),
    mc("r11","¿Qué día llega el tren?","",["Thursday","Friday","Saturday"],"Friday","El mensaje dice que llega el viernes.",{main_text:"A MESSAGE FROM NINA\nHi Sam,\nI'm visiting your town next week. My train arrives on Friday at 4:15 p.m. Can we meet near the station? I'd love to have dinner and hear about your new job. I'm staying at the Riverside Hotel for two nights. Let me know if Friday is good for you.\nNina"}),
    mc("r12","¿A qué hora llega?","",["3:45 p.m.","4:15 p.m.","4:50 p.m."],"4:15 p.m.","El tren llega a las 4:15 p. m."),
    mc("r13","¿Dónde propone quedar Nina?","",["At the hotel","Near the station","At Sam's office"],"Near the station","Propone encontrarse cerca de la estación."),
    mc("r14","¿Cuánto tiempo se queda?","",["One night","Two nights","One week"],"Two nights","Se aloja dos noches."),
    mc("r15","¿De qué quiere hablar con Sam?","",["His new job","Her English class","The train journey"],"His new job","Quiere saber sobre el nuevo trabajo de Sam.")
  ]
} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading", Activity[]>;
