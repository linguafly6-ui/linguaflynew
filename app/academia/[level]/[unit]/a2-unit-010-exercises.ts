import type { Activity } from "./activity-content";
type R=[string,string,string,string[],string,string];
const make=(rows:R[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[4],explanation:r[5],...extra(i)}));
const G:R[]=[
["g1001","Elige la forma correcta.","___ you a student?",["Do","Are","Does"],"Are","Con be, la pregunta empieza por Are."],
["g1002","Completa la pregunta.","Where ___ your sister live?",["do","is","does"],"does","Con he/she/it usamos does."],
["g1003","Elige la respuesta correcta.","What ___ you do?",["are","do","does"],"do","Do forma preguntas con you."],
["g1004","Selecciona la frase correcta.","",["He usually goes by bus.","He is usually go by bus.","He usually go by bus."],"He usually goes by bus.","En tercera persona singular añadimos -s al verbo."],
["g1005","Completa.","My colleagues ___ very friendly.",["is","are","do"],"are","Colleagues es plural; usamos are."],
["g1006","Elige la posición correcta del adverbio.","I ___ have lunch at one.",["usually","am usually","usually am"],"usually","El adverbio suele ir antes del verbo principal."],
["g1007","Completa la pregunta.","___ your neighbours work nearby?",["Are","Do","Does"],"Do","Work es verbo principal; con neighbours usamos do."],
["g1008","Elige la opción correcta.","She ___ two brothers.",["have","has","is"],"has","Con she usamos has."],
["g1009","Completa.","I am ___ available on Friday.",["not","don't","doesn't"],"not","La negación de be se forma con not."],
["g1010","Elige la pregunta correcta.","",["Does he work here?","Do he work here?","Is he work here?"],"Does he work here?","Does + sujeto + verbo en forma base."],
["g1011","Completa con and, but o because.","I like cycling ___ it keeps me fit.",["but","because","and"],"because","Because introduce la razón."],
["g1012","Elige el conector adecuado.","I work in town, ___ I live near the park.",["but","because","so"],"but","But contrasta dos ideas."],
["g1013","Detecta el error corregido.","",["Where does she lives?","Where does she live?","Where do she live?"],"Where does she live?","Después de does, el verbo va en forma base."],
["g1014","Elige la frase correcta.","",["Do you are available?","Are you available?","Does you available?"],"Are you available?","Las preguntas con be no llevan do."],
["g1015","Completa.","He ___ usually tired after work.",["is","does","has"],"is","El adverbio va después de be."]
];
const V:R[]=[
["v1001","¿Qué significa profile?","profile",["perfil","horario","vecindario"],"perfil","Profile significa perfil."],
["v1002","Traduce colleague.","colleague",["compañero/a de trabajo","vecino/a","cliente"],"compañero/a de trabajo","Colleague es compañero/a de trabajo."],
["v1003","¿Qué significa neighbour?","neighbour",["vecino/a","hermano/a","jefe/a"],"vecino/a","Neighbour significa vecino/a."],
["v1004","Traduce routine.","routine",["rutina","reunión","receta"],"rutina","Routine significa rutina."],
["v1005","¿Qué significa available?","available",["disponible","ocupado/a","parecido/a"],"disponible","Available significa disponible."],
["v1006","Traduce similar.","similar",["parecido/a","amable","ruidoso/a"],"parecido/a","Similar significa parecido/a."],
["v1007","¿Qué significa introduce?","introduce",["presentar","invitar","recordar"],"presentar","Introduce significa presentar."],
["v1008","Traduce conversation.","conversation",["conversación","conversión","conferencia"],"conversación","Conversation significa conversación."],
["v1009","Completa.","I work with five ___ at the office.",["colleagues","neighbours","profiles"],"colleagues","Colleagues son compañeros de trabajo."],
["v1010","Elige la palabra adecuada.","I get up at seven every day. It's my morning ___.",["routine","conversation","profile"],"routine","Routine es rutina."],
["v1011","¿Qué expresión significa «tiempo libre»?","",["free time","full time","first time"],"free time","Free time significa tiempo libre."],
["v1012","Completa.","Let me ___ you to my friend, Sara.",["introduce","available","similar"],"introduce","Introduce someone es presentar a alguien."],
["v1013","¿Qué significa outgoing?","outgoing",["extrovertido/a","tímido/a","impaciente"],"extrovertido/a","Outgoing describe a una persona sociable."],
["v1014","Elige la expresión correcta.","We have a lot ___ common.",["in","on","at"],"in","La expresión es have a lot in common."],
["v1015","Traduce neighbourhood.","neighbourhood",["barrio","centro deportivo","compañía"],"barrio","Neighbourhood significa barrio."]
];
const L:R[]=[
["l1001","¿Cómo se llama la persona nueva?","",["Karim","Alex","Sophie"],"Karim","Sophie pregunta el nombre y responde Karim."],
["l1002","¿Dónde vive Karim?","",["Cerca del parque","En el centro","Junto al trabajo"],"Cerca del parque","Karim dice que vive near the park."],
["l1003","¿A qué se dedica Karim?","",["Es cocinero","Es profesor","Es recepcionista"],"Es cocinero","Dice: I'm a chef."],
["l1004","¿Cuándo tiene libre?","",["Los lunes","Los viernes","Los domingos"],"Los lunes","Karim tiene Mondays free."],
["l1005","¿Qué le gusta hacer?","",["Jugar al baloncesto y quedar con amigos","Cocinar y leer","Montar en bici y nadar"],"Jugar al baloncesto y quedar con amigos","Menciona playing basketball and meeting friends."],
["l1006","¿Dónde trabaja Alex?","",["En un centro deportivo","En una biblioteca","En un hospital"],"En un centro deportivo","Alex trabaja en a sports centre."],
["l1007","¿A qué hora suele empezar?","",["A las ocho","A las nueve","A las diez"],"A las ocho","Usually starts work at eight."],
["l1008","¿Qué día empieza más tarde?","",["Los viernes","Los martes","Los lunes"],"Los viernes","On Fridays Alex starts later."],
["l1009","¿Cómo se describe Alex?","",["Extrovertido/a","Muy tímido/a","Impaciente"],"Extrovertido/a","Alex says I'm quite outgoing."],
["l1010","¿Por qué se une al grupo?","",["Para hacer amigos","Para buscar trabajo","Para aprender a cocinar"],"Para hacer amigos","Quiere make new friends."],
["l1011","¿Qué actividad hace algunos fines de semana?","",["Senderismo","Tenis","Natación"],"Senderismo","Alex sometimes goes hiking."],
["l1012","¿Dónde vive la hermana de Alex?","",["Cerca","En Cardiff","En el extranjero"],"Cerca","His younger sister lives nearby."],
["l1013","¿Qué conector introduce una razón?","",["because","but","and"],"because","Because introduce una razón."],
["l1014","¿Qué significa usually?","",["normalmente","nunca","raramente"],"normalmente","Usually expresa frecuencia habitual."],
["l1015","¿Qué pregunta por la profesión?","",["What do you do?","Where do you live?","How old are you?"],"What do you do?","What do you do? pregunta a qué te dedicas."]
];
const Q:R[]=[
["r1001","¿Dónde vive Alex?","",["En un piso cerca del centro","En una casa en el campo","En un piso junto al mar"],"En un piso cerca del centro","El texto dice I live in a flat near the town centre."],
["r1002","¿Cuál es su trabajo?","",["Recepcionista","Cocinero","Entrenador"],"Recepcionista","Alex works as a receptionist."],
["r1003","¿Dónde trabaja?","",["En un centro deportivo","En una escuela","En una tienda"],"En un centro deportivo","Trabaja en a sports centre."],
["r1004","¿Cuándo empieza más tarde?","",["Los viernes","Los lunes","Los sábados"],"Los viernes","On Fridays I start later."],
["r1005","¿Cómo es Alex?","",["Bastante extrovertido/a","Muy serio/a","Tímido/a"],"Bastante extrovertido/a","Dice I'm quite outgoing."],
["r1006","¿Dónde vive su hermana?","",["Cerca","Lejos","Con Alex"],"Cerca","His younger sister lives nearby."],
["r1007","¿Por qué se une al grupo?","",["Para hacer amigos y conocer gente con intereses similares","Para encontrar piso","Para cambiar de trabajo"],"Para hacer amigos y conocer gente con intereses similares","Quiere conocer personas con intereses parecidos."],
["r1008","¿Qué le gusta hacer?","",["Montar en bici y cocinar","Cantar y bailar","Pintar y correr"],"Montar en bici y cocinar","Enjoys cycling and cooking."],
["r1009","¿Qué hace a veces los fines de semana?","",["Va de senderismo","Trabaja de noche","Visita a sus compañeros"],"Va de senderismo","Sometimes goes hiking at weekends."],
["r1010","¿Qué significa «nearby»?","",["Cerca","Lejos","Pronto"],"Cerca","Nearby significa cerca."],
["r1011","Elige la pregunta correcta sobre el trabajo de Alex.","",["Where does Alex work?","Where Alex works?","Where do Alex works?"],"Where does Alex work?","Does + sujeto + verbo base."],
["r1012","¿Qué forma se usa con «your colleagues»?","",["are","is","does"],"are","Colleagues es plural."],
["r1013","¿Cuál es la posición habitual de usually?","",["Antes del verbo principal","Siempre al final","Antes del sujeto"],"Antes del verbo principal","I usually start work."],
["r1014","¿Qué significa «similar interests»?","",["Intereses parecidos","Intereses nuevos","Intereses profesionales"],"Intereses parecidos","Similar interests son intereses parecidos."],
["r1015","¿Cuál es la idea principal del texto?","",["Alex se presenta y explica su vida e intereses","Alex busca una casa","Alex describe su último viaje"],"Alex se presenta y explica su vida e intereses","Es un perfil personal para un grupo comunitario."]
];
const dialogues=[
"A: Hi, I'm Sophie. Are you new to the group? B: Yes, I am. My name's Karim. I live near the park. A: What do you do? B: I'm a chef. I usually work in the evenings, but I have Mondays free. A: What do you enjoy doing? B: I love playing basketball and meeting friends.",
"A: What do you do, Alex? B: I work as a receptionist at a sports centre. A: Do you work every day? B: I usually work from Monday to Friday. I start at eight, but on Fridays I start later. A: Are you enjoying the job? B: Yes, my colleagues are friendly.",
"A: Are you available this weekend, Maya? B: I'm free on Sunday, but I'm busy on Saturday because I visit my parents. A: Do you enjoy hiking? B: Yes, I do. I usually go with my neighbour. A: Great. Let's meet near the park."
];
const passages=[
"MY COMMUNITY PROFILE\nHello, I'm Alex Morgan. I live in a flat near the town centre and work as a receptionist at a sports centre. I usually start work at eight, but on Fridays I start later. I'm quite outgoing and I enjoy meeting people. I have a younger sister who lives nearby. I'm joining this community group because I'd like to make new friends and find people with similar interests. I enjoy cycling and cooking, and I sometimes go hiking at weekends.",
"A TYPICAL WEEK\nMy name is Daniel and I work in a small bookshop. I usually get up at half past six and walk to work because the shop is near my home. My colleague Priya is very friendly, but she lives outside town and takes the bus. We have lunch together at one. After work, I sometimes play tennis or meet my neighbours. At weekends, I visit my parents and cook dinner with my brother.",
"MEETING NEW PEOPLE\nLast month, I joined a local photography group. At first, I was nervous because I didn't know anyone. The other members were welcoming and introduced themselves. We meet every Thursday evening, but we sometimes organise trips at weekends. I enjoy taking pictures of buildings and people. I have already made two good friends, and we often share ideas online."
];
export const a2Unit10Exercises={grammar:make(G),vocabulary:make(V),listening:make(L,i=>i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{}),reading:make(Q,i=>i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{})} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
