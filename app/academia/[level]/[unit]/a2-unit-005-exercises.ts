import type { Activity } from "./activity-content";
type R=[string,string,string,string[],string,string];
const mc=(r:R,extra:Partial<Activity>={}):Activity=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,i)=>({id:String.fromCharCode(65+i),text})),correct_answer:r[4],explanation:r[5],...extra});
const G:R[]=[
["g501","Elige la forma correcta.","I enjoy ___ books in my free time.",["read","reading","to read"],"reading","Enjoy va seguido de verbo en -ing."],
["g502","Completa la frase.","She loves ___ tennis at weekends.",["play","playing","to playing"],"playing","Love + gerundio expresa una actividad que gusta."],
["g503","Elige la opción correcta.","We are interested ___ learning French.",["on","at","in"],"in","La expresión es be interested in."],
["g504","Completa la frase.","He hates ___ early on Sundays.",["get up","getting up","to getting up"],"getting up","Hate puede ir seguido de verbo en -ing."],
["g505","Elige la comparación correcta.","I prefer cycling ___ driving.",["than","to","from"],"to","La estructura es prefer A to B."],
["g506","Completa con el verbo en -ing.","They enjoy ___ board games.",["play","playing","plays"],"playing","Enjoy + forma -ing."],
["g507","Selecciona la frase correcta.","",["I'm interested in photography.","I interested in photography.","I'm interested on photography."],"I'm interested in photography.","Necesitamos be + interested in."],
["g508","Completa la frase.","My sister loves ___ photographs.",["take","taking","takes"],"taking","Después de loves usamos -ing en este contexto."],
["g509","Elige la forma correcta.","He doesn't like ___ alone.",["working","work","works"],"working","Like puede ir seguido de gerundio."],
["g510","Completa con because.","I enjoy hiking ___ it's relaxing.",["but","because","so"],"because","Because introduce una razón."],
["g511","Elige la frase correcta.","",["She prefers read to write.","She prefers reading to writing.","She prefers reading than writing."],"She prefers reading to writing.","Para comparar dos actividades: prefer + -ing + to + -ing."],
["g512","Completa la frase.","Are you interested in ___ a club?",["join","joining","joined"],"joining","Después de in usamos gerundio."],
["g513","Selecciona la forma correcta.","They hate ___ in long queues.",["wait","waiting","waits"],"waiting","Hate + -ing."],
["g514","Elige la opción correcta.","I prefer staying at home ___ going out.",["to","than","for"],"to","Prefer A to B."],
["g515","Completa la frase.","She enjoys ___ time with her friends.",["spend","spending","spends"],"spending","Enjoy + verbo en -ing."]
];
const V:R[]=[
["v501","¿Qué significa go hiking?","go hiking",["hacer senderismo","ir de compras","montar en bicicleta"],"hacer senderismo","Go hiking es hacer senderismo."],
["v502","Traduce play board games.","play board games",["jugar a videojuegos","jugar a juegos de mesa","jugar al fútbol"],"jugar a juegos de mesa","Board games son juegos de mesa."],
["v503","¿Qué significa take photographs?","take photographs",["hacer fotografías","ver fotografías","comprar una cámara"],"hacer fotografías","Take photographs significa hacer fotos."],
["v504","¿Qué significa join a club?","join a club",["organizar una fiesta","apuntarse a un club","dejar un equipo"],"apuntarse a un club","Join a club es hacerse socio o apuntarse."],
["v505","Traduce spend time.","spend time",["perder tiempo","pasar tiempo","ahorrar tiempo"],"pasar tiempo","Spend time significa pasar tiempo."],
["v506","¿Qué significa creative?","creative",["creativo/a","deportivo/a","tímido/a"],"creativo/a","Creative describe a alguien creativo."],
["v507","Traduce outdoors.","outdoors",["en casa","al aire libre","en el trabajo"],"al aire libre","Outdoors significa al aire libre."],
["v508","¿Qué significa relaxing?","relaxing",["agotador","relajante","ruidoso"],"relajante","Relaxing describe algo que relaja."],
["v509","Completa la expresión.","I ___ music in the evening.",["listen to","look at","wait for"],"listen to","La expresión es listen to music."],
["v510","¿Qué significa go cycling?","go cycling",["ir en bicicleta","ir a correr","ir a pescar"],"ir en bicicleta","Go cycling es salir en bici."],
["v511","Traduce do yoga.","do yoga",["hacer yoga","dar una clase","jugar al tenis"],"hacer yoga","Do yoga significa hacer yoga."],
["v512","¿Qué significa keen on?","keen on",["estar cansado de","tener mucho interés en","estar preocupado por"],"tener mucho interés en","Keen on expresa entusiasmo o interés."],
["v513","Completa la colocación.","take ___ in a competition",["part","place","time"],"part","Take part in significa participar."],
["v514","¿Qué significa indoor activities?","indoor activities",["actividades al aire libre","actividades en interiores","actividades peligrosas"],"actividades en interiores","Indoor se refiere a espacios interiores."],
["v515","Traduce free time.","free time",["tiempo libre","tiempo completo","tiempo de viaje"],"tiempo libre","Free time es tiempo libre."]
];
const L:R[]=[
["l501","¿Qué actividad le encanta a Emma?","",["Montar en bicicleta","Ir de compras","Cocinar"],"Montar en bicicleta","Emma dice I love cycling."],
["l502","¿Qué no le gusta hacer?","",["Visitar lugares","Ir de compras","Montar en bicicleta"],"Ir de compras","Dice que no le gusta shopping."],
["l503","¿Cuándo prefiere salir?","",["Por la mañana","Por la tarde","Por la noche"],"Por la mañana","Prefiere ir por la mañana porque hay menos gente."],
["l504","¿Qué propone su amigo?","",["Ir en bici el sábado","Jugar al tenis","Visitar un museo"],"Ir en bici el sábado","Le propone ir cycling on Saturday."],
["l505","¿Por qué prefiere la mañana?","",["Es más barato","Hay menos ruido y gente","Hace más calor"],"Hay menos ruido y gente","Dice que it's quieter."],
["l506","¿Qué afición tiene Daniel?","",["Hacer fotografías","Cantar","Cocinar"],"Hacer fotografías","Daniel enjoys taking photographs."],
["l507","¿Dónde suele hacer fotos?","",["En la ciudad y el campo","Solo en casa","En el gimnasio"],"En la ciudad y el campo","Hace fotos tanto en la ciudad como en el campo."],
["l508","¿Qué actividad le interesa a su amiga?","",["La jardinería","La fotografía","La natación"],"La jardinería","Su amiga está interesada en gardening."],
["l509","¿A qué club quieren apuntarse?","",["A uno de fotografía","A uno de cocina","A uno de lectura"],"A uno de fotografía","Deciden join a photography club."],
["l510","¿Por qué quiere Daniel compartir la afición?","",["Para conocer gente","Para ganar dinero","Para viajar"],"Para conocer gente","Le gusta conocer a otras personas."],
["l511","¿Qué prefiere hacer Lucy los domingos?","",["Quedarse en casa y leer","Ir de compras","Salir a correr"],"Quedarse en casa y leer","Lucy prefers staying home and reading."],
["l512","¿Qué actividad odia?","",["Cocinar","Levantarse temprano","Ver películas"],"Levantarse temprano","Dice que hates getting up early."],
["l513","¿Qué le gusta hacer a su hermano?","",["Escalar","Pintar","Bailar"],"Escalar","Su hermano loves climbing."],
["l514","¿Con qué frecuencia va al rocódromo?","",["Una vez por semana","Dos veces por semana","Cada día"],"Dos veces por semana","Va twice a week."],
["l515","¿Qué plan hacen para el sábado?","",["Ir a escalar","Ver una película","Cocinar juntos"],"Ir a escalar","Deciden ir climbing on Saturday."]
];
const R:R[]=[
["r501","¿Qué quiere probar Sam este año?","",["Una nueva afición","Un nuevo trabajo","Un deporte profesional"],"Una nueva afición","Sam wants to try a new hobby."],
["r502","¿Qué disfruta haciendo Sam?","",["Hacer fotografías","Jugar al fútbol","Pintar"],"Hacer fotografías","He enjoys taking photographs."],
["r503","¿Qué no le gusta a Sam?","",["Trabajar solo todo el tiempo","Salir con amigos","Aprender cosas nuevas"],"Trabajar solo todo el tiempo","He doesn't like working alone all the time."],
["r504","¿Qué tipo de actividades le gustan a Nina?","",["Actividades al aire libre","Videojuegos","Compras"],"Actividades al aire libre","Nina loves outdoor activities."],
["r505","¿A qué club deciden apuntarse?","",["A uno de cocina","A uno de fotografía","A uno de senderismo"],"A uno de cocina","Join a weekend cooking club."],
["r506","¿Por qué prefiere Sam aprender con otras personas?","",["Es más divertido","Es más rápido","Es obligatorio"],"Es más divertido","He says it is more fun."],
["r507","¿Qué afición tiene Daniel?","",["La fotografía","La jardinería","El ajedrez"],"La fotografía","Daniel enjoys taking photographs."],
["r508","¿Qué hace con sus fotos?","",["Las comparte en un blog","Las vende en una tienda","Las guarda en el trabajo"],"Las comparte en un blog","He shares his pictures on a small blog."],
["r509","¿Qué le interesa a su amiga?","",["La jardinería","La música clásica","El ciclismo"],"La jardinería","She is interested in gardening."],
["r510","¿Qué deciden hacer juntos?","",["Unirse a un club de fotografía","Abrir una tienda","Viajar al extranjero"],"Unirse a un club de fotografía","They decide to join a photography club."],
["r511","¿Qué prefiere Lucy los domingos?","",["Leer en casa","Ir de compras","Hacer senderismo"],"Leer en casa","Lucy prefers staying at home and reading."],
["r512","¿Qué no le gusta hacer a Lucy?","",["Levantarse temprano","Leer novelas","Escuchar música"],"Levantarse temprano","She hates getting up early."],
["r513","¿Qué actividad disfruta su hermano?","",["Escalar","Cocinar","Nadar"],"Escalar","Her brother loves climbing."],
["r514","¿Con qué frecuencia escala?","",["Dos veces por semana","Una vez al mes","Todos los días"],"Dos veces por semana","He goes to the climbing centre twice a week."],
["r515","¿Qué tienen en común Lucy y su hermano?","",["Les gusta probar actividades nuevas","Odia salir de casa","Prefieren hacer deporte solos"],"Les gusta probar actividades nuevas","Both are open to trying new activities."]
];
const dialogues=[
"Emma: What do you like doing at weekends? Alex: I love cycling and I enjoy visiting new places. I don't really like shopping. Emma: Would you like to go cycling on Saturday? Alex: Yes, that sounds great. I prefer going in the morning because it's quieter.",
"Daniel: I enjoy taking photographs, especially outdoors. Mia: Are you interested in photography too? Daniel: Yes, and I'm interested in learning more about editing. Mia: I love gardening, but I'd like to try photography. Daniel: Let's join a photography club. It's a good way to meet people.",
"Lucy: What do you prefer doing on Sundays? Ben: I prefer staying at home and reading. I hate getting up early. Lucy: My brother loves climbing. He goes to the climbing centre twice a week. Ben: I enjoy trying new activities. Shall we go climbing on Saturday? Lucy: Great idea!"
];
const passages=[
"FINDING A NEW HOBBY\nSam wants to try a new hobby this year. He enjoys taking photographs, but he doesn't like working alone all the time. His friend Nina loves outdoor activities and goes hiking every month. They are both interested in cooking, so they decide to join a weekend cooking club. Sam prefers learning with other people because it is more fun.",
"DANIEL'S PHOTOGRAPHY CLUB\nDaniel enjoys taking photographs in the city and in the countryside. He shares his pictures on a small blog. His friend Mia is interested in gardening, but she also wants to learn photography. They look for a local club and find one that meets every Thursday. Daniel likes learning new skills and meeting creative people, so he is excited about joining.",
"WHAT DO YOU LIKE DOING?\nLucy prefers staying at home and reading on Sundays. She hates getting up early, but her brother loves climbing. He goes to the climbing centre twice a week and often invites Lucy. She isn't very confident yet, but she enjoys trying new activities. This Saturday, they are going to climb together with two friends."
];
export const a2Unit5Exercises={
 grammar:G.map(x=>mc(x)),
 vocabulary:V.map(x=>mc(x)),
 listening:L.map((x,i)=>mc(x,i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{})),
 reading:R.map((x,i)=>mc(x,i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{}))
} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
