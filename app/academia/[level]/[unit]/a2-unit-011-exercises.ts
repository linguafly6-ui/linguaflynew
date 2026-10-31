import type { Activity } from "./activity-content";
type R=[string,string,string,string[],string,string];
const make=(rows:R[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[4],explanation:r[5],...extra(i)}));
const G:R[]=[
["g1101","Elige el pasado simple correcto.","Yesterday I ___ my grandparents.",["visit","visited","visiting"],"visited","En verbos regulares añadimos -ed."],
["g1102","Completa.","She ___ to London last year.",["go","goed","went"],"went","Go es irregular: went."],
["g1103","Elige la forma negativa.","We ___ watch TV last night.",["didn't","don't","weren't"],"didn't","Did not + verbo en forma base."],
["g1104","Completa la pregunta.","___ you enjoy the film?",["Did","Do","Were"],"Did","Did forma preguntas en pasado simple."],
["g1105","Elige la opción correcta.","They ___ at home yesterday.",["was","were","are"],"were","Were se usa con you/we/they."],
["g1106","Completa.","I ___ very tired after the trip.",["was","were","am"],"was","Was se usa con I/he/she/it."],
["g1107","Selecciona la frase correcta.","",["He didn't went to work.","He didn't go to work.","He not go to work."],"He didn't go to work.","Después de didn't, el verbo va en forma base."],
["g1108","Elige el pasado de have.","We ___ a great time.",["haved","had","has"],"had","Have es irregular: had."],
["g1109","Completa.","My friends ___ late for the train.",["was","were","did"],"were","Friends es plural; pasado de be: were."],
["g1110","Elige el pasado de see.","I ___ an old friend in town.",["saw","seed","seen"],"saw","See es irregular: saw."],
["g1111","Completa la pregunta.","Where ___ she go on holiday?",["was","did","does"],"did","Did + sujeto + verbo base."],
["g1112","Elige la expresión temporal correcta.","We moved here ___ 2022.",["last","ago","in"],"in","Usamos in con años."],
["g1113","Completa.","He arrived two hours ___.",["last","ago","yesterday"],"ago","Ago va después de una cantidad de tiempo."],
["g1114","Elige la frase correcta.","",["Did you went out?","Did you go out?","Were you go out?"],"Did you go out?","Tras did usamos go, no went."],
["g1115","Completa.","They ___ the museum because it was closed.",["didn't visit","didn't visited","not visited"],"didn't visit","Did not + infinitivo sin to."]
];
const V:R[]=[
["v1101","¿Qué significa journey?","journey",["viaje","equipaje","billete"],"viaje","Journey significa viaje."],
["v1102","Traduce suitcase.","suitcase",["maleta","mochila","mapa"],"maleta","Suitcase es maleta."],
["v1103","¿Qué significa campsite?","campsite",["camping","estación","alojamiento"],"camping","Campsite es un lugar para acampar."],
["v1104","Traduce crowded.","crowded",["abarrotado","tranquilo","perdido"],"abarrotado","Crowded describe un lugar lleno de gente."],
["v1105","¿Qué significa amazing?","amazing",["increíble","aburrido","caro"],"increíble","Amazing significa increíble."],
["v1106","Traduce return ticket.","return ticket",["billete de ida y vuelta","billete sencillo","reserva"],"billete de ida y vuelta","Return ticket incluye ida y vuelta."],
["v1107","¿Qué significa sightseeing?","sightseeing",["hacer turismo","hacer senderismo","ir de compras"],"hacer turismo","Sightseeing es visitar lugares de interés."],
["v1108","Traduce guidebook.","guidebook",["guía de viaje","mapa de metro","pasaporte"],"guía de viaje","Guidebook es una guía."],
["v1109","Completa.","We stayed in a small ___ near the beach.",["hotel","journey","ticket"],"hotel","Hotel es alojamiento."],
["v1110","Elige la palabra correcta.","The train was very ___. There were no free seats.",["crowded","amazing","quiet"],"crowded","Crowded significa abarrotado."],
["v1111","¿Qué significa abroad?","abroad",["en el extranjero","en el centro","al aire libre"],"en el extranjero","Abroad significa en el extranjero."],
["v1112","Traduce luggage.","luggage",["equipaje","alojamiento","paisaje"],"equipaje","Luggage es equipaje."],
["v1113","Completa.","We went ___ and visited three famous buildings.",["sightseeing","camping","shopping"],"sightseeing","Go sightseeing es hacer turismo."],
["v1114","¿Qué significa memorable?","memorable",["inolvidable","peligroso","incómodo"],"inolvidable","Memorable significa digno de recordar."],
["v1115","Elige el verbo adecuado.","We ___ a room online before the trip.",["booked","missed","packed"],"booked","Book a room significa reservar una habitación."]
];
const L:R[]=[
["l1101","¿Adónde fueron el fin de semana?","",["A York","A Oxford","A Bristol"],"A York","El diálogo comienza con el viaje a York."],
["l1102","¿Cómo viajaron?","",["En tren","En coche","En autobús"],"En tren","They travelled by train."],
["l1103","¿Por qué llegaron tarde?","",["El tren se retrasó","Perdieron el autobús","Hubo mucho tráfico"],"El tren se retrasó","The train was delayed."],
["l1104","¿Qué visitaron primero?","",["El museo del castillo","Una playa","Un mercado"],"El museo del castillo","Fueron al castle museum."],
["l1105","¿Cómo describieron el museo?","",["Interesante","Aburrido","Demasiado pequeño"],"Interesante","They said it was interesting."],
["l1106","¿Qué hizo Emma el sábado?","",["Hizo senderismo","Fue de compras","Visitó a su familia"],"Hizo senderismo","Emma went hiking."],
["l1107","¿Qué tiempo hizo?","",["Llovió por la mañana","Nevó todo el día","Hizo mucho calor"],"Llovió por la mañana","It rained in the morning."],
["l1108","¿Qué llevó Emma?","",["Una chaqueta impermeable","Un vestido","Un paraguas rojo"],"Una chaqueta impermeable","She took a waterproof jacket."],
["l1109","¿Qué encontraron al final del camino?","",["Una cafetería","Un hotel","Una estación"],"Una cafetería","They found a café."],
["l1110","¿Cómo se sintió al final?","",["Cansada pero contenta","Enfadada","Decepcionada"],"Cansada pero contenta","Tired but happy."],
["l1111","¿Cuándo reservó Tom el hotel?","",["Dos semanas antes","El mismo día","Un año antes"],"Dos semanas antes","He booked it two weeks earlier."],
["l1112","¿Qué problema tuvo la habitación?","",["La ventana no cerraba","No había cama","No tenía baño"],"La ventana no cerraba","The window didn't close."],
["l1113","¿Qué hizo el recepcionista?","",["Les cambió de habitación","Les devolvió el dinero","Llamó a un taxi"],"Les cambió de habitación","He gave them another room."],
["l1114","¿Qué hicieron por la tarde?","",["Visitaron el casco antiguo","Fueron al aeropuerto","Durmieron"],"Visitaron el casco antiguo","They explored the old town."],
["l1115","¿Cómo fue el viaje en general?","",["Muy bueno","Un desastre","Demasiado caro"],"Muy bueno","They had a great weekend."]
];
const Q:R[]=[
["r1101","¿Cuándo hizo el viaje Mia?","",["El mes pasado","El año pasado","La semana que viene"],"El mes pasado","Last month."],
["r1102","¿Adónde viajó?","",["A Edimburgo","A Londres","A Cardiff"],"A Edimburgo","She travelled to Edinburgh."],
["r1103","¿Con quién viajó?","",["Con su hermana","Con sus padres","Sola"],"Con su hermana","She went with her sister."],
["r1104","¿Cómo llegaron?","",["En tren","En avión","En coche"],"En tren","They travelled by train."],
["r1105","¿Dónde se alojaron?","",["En una casa de huéspedes","En un camping","En un albergue"],"En una casa de huéspedes","They stayed in a guest house."],
["r1106","¿Qué hicieron el primer día?","",["Visitaron el castillo","Fueron a la playa","Hicieron una excursión en barco"],"Visitaron el castillo","They visited the castle."],
["r1107","¿Por qué no hicieron el paseo planeado?","",["Porque llovía mucho","Porque estaban enfermas","Porque el camino estaba cerrado"],"Porque llovía mucho","It rained heavily."],
["r1108","¿Qué hicieron en su lugar?","",["Visitaron una galería","Volvieron a casa","Fueron al cine"],"Visitaron una galería","They went to an art gallery."],
["r1109","¿Qué compró Mia?","",["Una postal","Un libro","Una bufanda"],"Una postal","She bought a postcard."],
["r1110","¿Cómo describe el viaje?","",["Memorable","Aburrido","Estresante"],"Memorable","She calls it memorable."],
["r1111","¿Cuál es el pasado de go?","",["went","goed","gone"],"went","Go es irregular: went."],
["r1112","¿Qué forma sigue a didn't?","",["El verbo base","El pasado","El verbo con -ing"],"El verbo base","Didn't + infinitivo sin to."],
["r1113","¿Qué significa «three days ago»?","",["Hace tres días","Dentro de tres días","Durante tres días"],"Hace tres días","Ago expresa tiempo transcurrido."],
["r1114","¿Qué auxiliar se usa para preguntar en pasado simple?","",["did","do","does"],"did","Did se usa con todos los sujetos."],
["r1115","¿Cuál es la idea principal?","",["Una escapada y las experiencias del viaje","Una mudanza de ciudad","Un día de trabajo"],"Una escapada y las experiencias del viaje","El texto cuenta una escapada pasada."]
];
const dialogues=[
"A: How was your weekend in York? B: It was great. We travelled by train on Saturday morning, but it was delayed. A: What did you do first? B: We visited the castle museum. It was really interesting. A: Did you eat there? B: Yes, we had lunch in a small café.",
"A: Did you go hiking on Saturday, Emma? B: Yes, I did. It rained in the morning, so I took my waterproof jacket. A: Was the walk difficult? B: A little, but we found a café at the end. I was tired but happy.",
"A: How was your hotel, Tom? B: It was good after we changed rooms. A: What happened? B: The window didn't close, so I spoke to reception. The receptionist gave us another room. A: What did you do afterwards? B: We explored the old town."
];
const passages=[
"A WEEKEND IN EDINBURGH\nLast month, Mia travelled to Edinburgh with her sister. They went by train and stayed in a small guest house near the centre. On the first day, they visited the castle and took lots of photos. The next morning, it rained heavily, so they didn't go on the walk they planned. Instead, they visited an art gallery and had lunch in a traditional café. Mia bought a postcard for her friend. She said the weekend was memorable because they discovered interesting places and had a wonderful time together.",
"A DAY BY THE SEA\nOn Sunday, Ben and his friends drove to the coast. They left early because they wanted to avoid traffic. When they arrived, the beach was quiet and the weather was sunny. They walked along the coast, took pictures and ate sandwiches near the harbour. In the afternoon, they visited a small aquarium. Ben didn't swim because the water was cold, but he enjoyed the day. They arrived home at seven o'clock, tired but pleased.",
"MY FIRST CAMPING TRIP\nTwo months ago, I went camping with my cousins. We booked a campsite near a lake and travelled there by bus. I packed a warm jacket, a sleeping bag and some food. The first night was cold, but we made a fire and told stories. The next day, we walked around the lake and saw lots of birds. I forgot my camera, so I used my phone to take photos. It was a simple holiday, but I loved it."
];
export const a2Unit11Exercises={grammar:make(G),vocabulary:make(V),listening:make(L,i=>i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{}),reading:make(Q,i=>i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{})} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
