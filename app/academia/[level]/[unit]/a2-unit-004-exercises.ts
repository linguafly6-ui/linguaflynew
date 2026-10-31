import type { Activity } from "./activity-content";
type R=[string,string,string,string[],string,string];
const mc=(r:R,extra:Partial<Activity>={}):Activity=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,i)=>({id:String.fromCharCode(65+i),text})),correct_answer:r[4],explanation:r[5],...extra});
const G:R[]=[
["g401","Elige la forma correcta.","She ___ up at six every day.",["get","gets","getting"],"gets","Con she añadimos -s al presente simple."],
["g402","Completa la frase.","I ___ take the bus to work.",["usually","usual","use"],"usually","Usually es un adverbio de frecuencia."],
["g403","Elige la posición correcta.","",["He goes always to bed early.","He always goes to bed early.","He goes to bed early always."],"He always goes to bed early.","El adverbio suele ir antes del verbo principal."],
["g404","Completa con do o does.","___ your brother work on Saturdays?",["Do","Does","Is"],"Does","Con he/she/it usamos does."],
["g405","Elige la negativa correcta.","Maya ___ coffee in the evening.",["don't drink","doesn't drinks","doesn't drink"],"doesn't drink","Después de doesn't usamos el verbo en forma base."],
["g406","¿Dónde colocamos sometimes con be?","","",["She sometimes is tired.","She is sometimes tired.","Sometimes she tired is."],"She is sometimes tired.","Los adverbios de frecuencia van después de be."],
["g407","Completa la pregunta.","How often ___ you exercise?",["are","do","does"],"do","Para preguntar por hábitos usamos do + sujeto."],
["g408","Elige la expresión correcta.","I visit my grandparents ___.",["twice a week","two time week","twice in week"],"twice a week","La expresión es twice a week."],
["g409","Corrige el error.","He ___ to work by train.",["go","goes","going"],"goes","Con he el verbo lleva -es en goes."],
["g410","Elige la frase correcta.","",["She doesn't usually cook.","She don't usually cooks.","She doesn't usually cooks."],"She doesn't usually cook.","Doesn't va seguido de la forma base."],
["g411","Completa con never.","I ___ eat breakfast late; I always get up early.",["never","ever","usually"],"never","Never expresa frecuencia cero."],
["g412","Elige la pregunta correcta.","Ask about someone's routine.",["What time you get up?","What time do you get up?","What time does you get up?"],"What time do you get up?","En preguntas con you usamos do + sujeto + verbo."],
["g413","Completa la frase.","We ___ at home on Fridays.",["are often","often are","often"],"are often","Con be, often se coloca después del verbo."],
["g414","Elige la forma correcta.","My father ___ the washing-up after dinner.",["do","does","doing"],"does","Do se convierte en does con he/she/it."],
["g415","Selecciona la expresión de frecuencia.","I go swimming one time every week.",["once a week","one in week","one time by week"],"once a week","Once a week significa una vez por semana."]
];
const V:R[]=[
["v401","¿Qué significa get up?","get up",["acostarse","levantarse","vestirse"],"levantarse","Get up significa levantarse."],
["v402","Traduce commute.","commute",["desplazarse al trabajo","cocinar","descansar"],"desplazarse al trabajo","Commute es desplazarse habitualmente al trabajo."],
["v403","¿Qué significa do the washing-up?","do the washing-up",["hacer la compra","fregar los platos","lavar la ropa"],"fregar los platos","Es la expresión habitual en inglés británico."],
["v404","Completa la expresión.","___ up the kitchen after dinner.",["Tidy","Get","Take"],"Tidy","Tidy up significa ordenar."],
["v405","¿Qué significa once a week?","once a week",["una vez al día","una vez por semana","cada dos semanas"],"una vez por semana","Once a week = una vez por semana."],
["v406","Traduce on weekdays.","on weekdays",["los fines de semana","entre semana","por las noches"],"entre semana","Weekdays son los días laborables."],
["v407","¿Qué significa take a break?","take a break",["hacer una pausa","tomar el autobús","salir de casa"],"hacer una pausa","Take a break es hacer una pausa."],
["v408","Completa la expresión.","I usually ___ to bed at eleven.",["go","make","do"],"go","La colocación correcta es go to bed."],
["v409","¿Qué significa do the laundry?","do the laundry",["hacer la colada","fregar los platos","limpiar el suelo"],"hacer la colada","Laundry se refiere a la ropa que se lava."],
["v410","Traduce have a shower.","have a shower",["ducharse","desayunar","vestirse"],"ducharse","Have a shower significa ducharse."],
["v411","¿Qué significa get dressed?","get dressed",["despertarse","vestirse","irse a dormir"],"vestirse","Get dressed significa vestirse."],
["v412","Elige el verbo habitual.","I ___ breakfast at half past seven.",["have","make up","take"],"have","La colocación habitual es have breakfast."],
["v413","¿Qué significa at weekends?","at weekends",["entre semana","a mediodía","los fines de semana"],"los fines de semana","At weekends es la expresión británica."],
["v414","Completa la colocación.","I ___ the bus to the office.",["take","do","make"],"take","Take the bus significa coger el autobús."],
["v415","¿Qué significa relax?","relax",["relajarse","desplazarse","ordenar"],"relajarse","Relax significa descansar o relajarse."]
];
const L:R[]=[
["l401","¿A qué hora se levanta Alex?","",["A las 6:00","A las 6:30","A las 7:00"],"A las 6:30","Alex dice que se levanta a las six thirty."],
["l402","¿A qué hora empieza a trabajar?","",["A las 8:00","A las 8:30","A las 9:00"],"A las 8:00","Empieza a las ocho."],
["l403","¿Cómo va al trabajo?","",["En coche","En tren","En autobús"],"En tren","Siempre coge el tren."],
["l404","¿Cuántos días trabaja desde casa la otra persona?","",["Dos","Tres","Cinco"],"Tres","Trabaja desde casa three days a week."],
["l405","¿Desayuna Alex en casa?","",["Sí","No","Solo los domingos"],"Sí","Dice que desayuna en casa."],
["l406","¿Qué hace Priya antes del trabajo?","",["Sale a correr","Pasea al perro","Va al gimnasio"],"Sale a correr","Priya goes running before work."],
["l407","¿Con qué frecuencia corre?","",["Todos los días","Dos veces por semana","Una vez al mes"],"Dos veces por semana","Corre twice a week."],
["l408","¿Qué hace después de cenar?","",["Ve la televisión","Estudia español","Llama a su madre"],"Estudia español","Estudia español durante media hora."],
["l409","¿Cuándo hace la compra?","",["Los lunes","Los sábados","Los viernes"],"Los sábados","Hace la compra los sábados por la mañana."],
["l410","¿Sale mucho entre semana?","",["Sí, casi todas las noches","No, casi nunca","Solo los martes"],"No, casi nunca","Hardly ever go out on weekdays."],
["l411","¿A qué hora termina el turno de Sam?","",["A las 3:00","A las 4:00","A las 5:00"],"A las 3:00","Su turno termina a las three."],
["l412","¿Qué hace Sam después del trabajo?","",["Va a nadar","Cocina","Visita a sus padres"],"Va a nadar","Va a la piscina después del trabajo."],
["l413","¿Con qué frecuencia visita a su hermana?","",["Cada semana","Una vez al mes","Dos veces al año"],"Una vez al mes","La visita once a month."],
["l414","¿Qué suele hacer los domingos?","",["Trabajar","Preparar comida para la semana","Limpiar la oficina"],"Preparar comida para la semana","Prepara comidas para la semana siguiente."],
["l415","¿A qué hora se acuesta normalmente?","",["A las 9:30","A las 10:30","A las 11:30"],"A las 10:30","Usually goes to bed at half past ten."]
];
const R:R[]=[
["r401","¿Dónde trabaja Maya?","",["En una librería","En un hospital","En una oficina"],"En una librería","Maya works in a bookshop."],
["r402","¿Cómo suele ir al trabajo?","",["En autobús","Andando","En tren"],"Andando","She walks to work."],
["r403","¿A qué hora empieza?","",["A las ocho","A las nueve","A las diez"],"A las nueve","She starts at nine."],
["r404","¿Con qué frecuencia sale entre semana?","",["A menudo","Nunca","Casi nunca"],"Casi nunca","Hardly ever means casi nunca."],
["r405","¿Qué hace los martes?","",["Yoga","Natación","Tenis"],"Yoga","On Tuesdays, she does yoga."],
["r406","¿Cuántos días trabaja Leo desde casa?","",["Uno","Dos","Cuatro"],"Dos","He works from home two days a week."],
["r407","¿Qué hace Leo a la hora de comer?","",["Come con compañeros","Va al gimnasio","Vuelve a casa"],"Come con compañeros","He usually has lunch with colleagues."],
["r408","¿Cuándo hace la compra?","",["Los miércoles","Los jueves","Los domingos"],"Los jueves","He shops on Thursday evenings."],
["r409","¿Qué hace para relajarse?","",["Lee novelas","Juega al fútbol","Ve películas"],"Lee novelas","He reads a novel before bed."],
["r410","¿Trabaja Leo los fines de semana?","",["Siempre","A veces","Nunca"],"A veces","Sometimes he works on Saturday mornings."],
["r411","¿A qué hora empieza el turno de Sam?","",["A las siete","A las ocho","A las nueve"],"A las siete","His shift starts at seven."],
["r412","¿Qué hace después del turno?","",["Nada","Va a nadar","Estudia"],"Va a nadar","He goes swimming after work."],
["r413","¿Con qué frecuencia ve a su hermana?","",["Una vez al mes","Cada día","Cada domingo"],"Una vez al mes","He visits his sister once a month."],
["r414","¿Qué prepara el domingo?","",["La ropa de trabajo","Comida para la semana","La lista de la compra"],"Comida para la semana","He prepares meals for the week."],
["r415","¿Qué cambio ha hecho Sam recientemente?","",["Se acuesta más temprano","Ha dejado de nadar","Trabaja más horas"],"Se acuesta más temprano","He now goes to bed earlier."]
];
const dialogues=[
"Alex: What time do you start work? Ben: I usually start at eight. I get up at six thirty and have breakfast at home. I always take the train; I don't drive. Alex: Do you work from home? Ben: No, but I finish at four on Fridays. Alex: I work from home three days a week, so I don't commute every day.",
"Priya: Do you have a busy routine? Emma: Yes. I get up at six and go running before work. Priya: How often do you run? Emma: Twice a week. After dinner, I study Spanish for half an hour. I do the shopping on Saturday mornings, and I hardly ever go out on weekdays.",
"Sam: My routine has changed this year. I work in a café, and my shift finishes at three. I go swimming after work three times a week. I visit my sister once a month, and on Sundays I prepare meals for the week. I usually go to bed at half past ten now."
];
const passages=[
"A BUSY BUT BALANCED WEEK\nMaya works in a bookshop. She usually gets up at seven and walks to work because the shop is near her flat. She starts at nine and finishes at five. She sometimes meets a friend after work, but she hardly ever goes out on weekdays. On Tuesdays, she does yoga. At weekends, she visits her parents and does the washing-up after Sunday lunch.",
"LEO'S WORKING WEEK\nLeo works in a small design office. He gets up at half past six and has breakfast with his partner. He works from home two days a week. On the other days, he takes the bus and usually has lunch with colleagues. He does the shopping on Thursday evenings and reads a novel before bed. At weekends, he sometimes works on Saturday mornings, but he never works on Sundays.",
"A NEW ROUTINE FOR SAM\nSam works in a café near the station. His shift starts at seven, so he gets up early. He finishes at three and goes swimming after work. He used to watch television every evening, but now he reads or cooks. He visits his sister once a month. On Sundays, he prepares meals for the week and goes to bed earlier than before."
];
export const a2Unit4Exercises={
 grammar:G.map(x=>mc(x)),
 vocabulary:V.map(x=>mc(x)),
 listening:L.map((x,i)=>mc(x,i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{})),
 reading:R.map((x,i)=>mc(x,i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{}))
} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
