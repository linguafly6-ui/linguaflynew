import type { Activity } from "./activity-content";
type R=[string,string,string,string[],string,string];
const mc=(r:R,extra:Partial<Activity>={}):Activity=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,i)=>({id:String.fromCharCode(65+i),text})),correct_answer:r[4],explanation:r[5],...extra});
const G:R[]=[
["g301","Elige be o have.","She ___ tall and slim.",["is","has","are"],"is","Usamos be con adjetivos de apariencia."],
["g302","Completa con have o has.","He ___ blue eyes.",["is","have","has"],"has","Con he usamos has + nombre."],
["g303","Elige la forma correcta.","My friends ___ very friendly.",["is","are","has"],"are","Con sujeto plural usamos are."],
["g304","Completa la descripción.","I ___ short, curly hair.",["am","have","has"],"have","Have describe pelo y otros rasgos."],
["g305","Elige el orden correcto.","",["black long hair","long black hair","hair black long"],"long black hair","Los adjetivos preceden al nombre y el largo suele ir antes del color."],
["g306","Completa con el intensificador.","She's ___ tall: 1.85 metres.",["very","a bit","quite a few"],"very","Very intensifica el adjetivo."],
["g307","Elige la frase correcta.","",["He has tall.","He is tall.","He are tall."],"He is tall.","Tall es adjetivo: usamos be."],
["g308","Completa la frase.","She ___ freckles and green eyes.",["is","have","has"],"has","Con she usamos has."],
["g309","¿Qué opción describe personalidad?","",["curly","reliable","freckles"],"reliable","Reliable describe el carácter."],
["g310","Completa con quite.","He's ___ shy, but he talks to everyone.",["quite","many","much"],"quite","Quite modifica adjetivos."],
["g311","Selecciona la opción correcta.","My sister ___ a friendly person.",["is","has","are"],"is","Usamos is + adjetivo/nombre descriptivo."],
["g312","Completa con have.","They ___ dark hair.",["has","have","are"],"have","Con they usamos have."],
["g313","Elige la descripción correcta.","",["She has blue eyes.","She is blue eyes.","She have blue eyes."],"She has blue eyes.","Have + nombre para rasgos físicos."],
["g314","Ordena los adjetivos.","He has ___ hair.",["curly short","short curly","hair short"],"short curly","El largo va antes de la textura en esta combinación."],
["g315","Elige la opción natural.","I'm ___ quiet, but not shy.",["a bit","a few","many"],"a bit","A bit suaviza un adjetivo."]
];
const V:R[]=[
["v301","¿Qué significa slim?","slim",["delgado/a","alto/a","calvo/a"],"delgado/a","Slim describe una complexión delgada."],
["v302","¿Qué significa build?","build",["peinado","complexión","pecas"],"complexión","Build se refiere a la complexión física."],
["v303","Traduce curly.","curly",["liso","rizado","corto"],"rizado","Curly hair es pelo rizado."],
["v304","Traduce straight (hair).","straight",["ondulado","rizado","liso"],"liso","Straight hair es pelo liso."],
["v305","¿Qué significa freckles?","freckles",["pecas","arrugas","hoyuelos"],"pecas","Freckles son pecas."],
["v306","¿Qué significa friendly?","friendly",["amable","tímido","perezoso"],"amable","Friendly describe a alguien amable."],
["v307","Traduce shy.","shy",["extrovertido","tímido","ruidoso"],"tímido","Shy significa tímido."],
["v308","¿Qué significa reliable?","reliable",["fiable","impaciente","despistado"],"fiable","Reliable es una persona en quien se puede confiar."],
["v309","¿Qué significa outgoing?","outgoing",["reservado","extrovertido","serio"],"extrovertido","Outgoing describe a alguien sociable."],
["v310","Traduce beard.","beard",["bigote","barba","cejas"],"barba","Beard significa barba."],
["v311","¿Qué significa bald?","bald",["calvo","pecoso","delgado"],"calvo","Bald describe a una persona sin pelo."],
["v312","¿Qué significa wavy hair?","wavy hair",["pelo ondulado","pelo corto","pelo liso"],"pelo ondulado","Wavy significa ondulado."],
["v313","Traduce cheerful.","cheerful",["alegre","antipático","callado"],"alegre","Cheerful describe a alguien alegre."],
["v314","¿Qué significa appearance?","appearance",["personalidad","apariencia","altura"],"apariencia","Appearance es el aspecto físico."],
["v315","¿Qué significa patient?","patient",["paciente","impaciente","tímido"],"paciente","Patient describe a alguien que tiene paciencia."]
];
const L:R[]=[
["l301","¿Cómo es físicamente Mr Lewis?","",["Bajo, pelo negro","Alto, pelo gris corto","Alto, pelo largo"],"Alto, pelo gris corto","El diálogo dice quite tall y short grey hair."],
["l302","¿Qué lleva Mr Lewis?","",["Gafas","Gorra","Barba"],"Gafas","Lleva glasses."],
["l303","¿Cómo es su personalidad?","",["Amable y paciente","Serio e impaciente","Tímido y antipático"],"Amable y paciente","Es friendly and patient."],
["l304","¿Qué hace cuando hay un problema?","",["Ayuda a los estudiantes","Llama a sus padres","Cambia de clase"],"Ayuda a los estudiantes","Siempre ayuda a los estudiantes."],
["l305","¿Qué edad aproximada tiene?","",["Veinte años","Cuarenta y tantos","Sesenta y tantos"],"Cuarenta y tantos","He's in his forties."],
["l306","¿Cómo es físicamente Olivia?","",["Baja y robusta","Alta y delgada","Baja y delgada"],"Alta y delgada","Olivia is tall and slim."],
["l307","¿Cómo tiene el pelo?","",["Corto y rubio","Largo y rizado","Largo y castaño"],"Largo y castaño","Tiene long brown hair."],
["l308","¿Qué lleva Olivia?","",["Gafas","Pendientes grandes","Sombrero"],"Gafas","She wears glasses."],
["l309","¿Cómo es su personalidad?","",["Organizada y amable","Tímida y perezosa","Ruidosa y desordenada"],"Organizada y amable","Es organised and friendly."],
["l310","¿Qué hace los fines de semana?","",["Corre en el parque","Trabaja en casa","Visita a su abuela"],"Corre en el parque","She goes running at weekends."],
["l311","¿Cómo es Ben?","",["Tiene barba y pelo rizado","Es calvo y alto","Tiene pelo largo y liso"],"Tiene barba y pelo rizado","Ben has curly hair and a beard."],
["l312","¿Qué rasgo de personalidad tiene?","",["Es muy fiable","Es impaciente","Es bastante tímido"],"Es muy fiable","His friends say he is reliable."],
["l313","¿Qué actividad le gusta?","",["Cocinar","Tocar la guitarra","Nadar"],"Tocar la guitarra","He plays the guitar."],
["l314","¿Cómo es su hermana?","",["Muy extrovertida","Bastante tímida","Muy seria"],"Muy extrovertida","His sister is outgoing."],
["l315","¿Qué dice Ben sobre su aspecto?","",["Lleva gafas","Tiene pecas","Es muy alto"],"Tiene pecas","He has freckles."]
];
const R:R[]=[
["r301","¿Cómo es Hannah?","",["Baja y con pelo rizado","Alta y delgada","Alta y con barba"],"Alta y delgada","Hannah is quite tall and slim."],
["r302","¿Cómo tiene el pelo Hannah?","",["Largo, liso y castaño","Corto y negro","Rizado y rubio"],"Largo, liso y castaño","Tiene long, straight brown hair."],
["r303","¿Qué lleva Hannah?","",["Gafas","Sombrero","Pendientes"],"Gafas","Hannah wears glasses."],
["r304","¿Cómo es Mark?","",["Tímido pero servicial","Ruidoso y antipático","Desorganizado"],"Tímido pero servicial","Mark is a little shy but helpful."],
["r305","¿Qué rasgo comparten Hannah y Mark?","",["Son buenos compañeros","Tienen barba","Llevan gafas"],"Son buenos compañeros","Both are good colleagues."],
["r306","¿Cómo es físicamente Sam?","",["Alto y atlético","Bajo y delgado","Alto y calvo"],"Alto y atlético","Sam is tall and athletic."],
["r307","¿Cómo tiene el pelo?","",["Corto y oscuro","Largo y rubio","Rizado y rojo"],"Corto y oscuro","He has short dark hair."],
["r308","¿Qué hace Sam en su tiempo libre?","",["Escala","Pinta","Baila"],"Escala","He enjoys climbing."],
["r309","¿Cómo describe a su personalidad?","",["Amable y paciente","Serio y antipático","Tímido y desorganizado"],"Amable y paciente","He is kind and patient."],
["r310","¿Por qué le gusta trabajar con él?","",["Siempre ayuda al equipo","Nunca habla","Llega tarde"],"Siempre ayuda al equipo","He always helps the team."],
["r311","¿Cómo es la nueva vecina?","",["Tiene pecas y pelo ondulado","Es calva y lleva barba","Tiene pelo liso y negro"],"Tiene pecas y pelo ondulado","She has freckles and wavy hair."],
["r312","¿Cómo es su personalidad?","",["Sociable y alegre","Seria y tímida","Impaciente y callada"],"Sociable y alegre","She is outgoing and cheerful."],
["r313","¿Qué hace los viernes?","",["Organiza cenas","Va al gimnasio","Estudia francés"],"Organiza cenas","She often invites neighbours for dinner."],
["r314","¿Qué piensa el narrador de ella?","",["Es una vecina estupenda","Es demasiado seria","Es difícil conocerla"],"Es una vecina estupenda","The narrator says she's a great neighbour."],
["r315","¿Qué detalle físico se menciona?","",["Pelo ondulado","Ojos azules","Pelo muy corto"],"Pelo ondulado","The text mentions wavy hair."]
];
const dialogues=[
"The new teacher is called Mr Lewis. He's in his forties and he's quite tall. He's got short grey hair and glasses. He looks serious, but he's actually very friendly and patient. He always helps students when they have a problem.",
"Olivia is my colleague. She's tall and slim, with long brown hair. She wears glasses and she's very organised and friendly. At weekends, she goes running in the park. She's a bit quiet at first, but she's very easy to talk to.",
"My friend Ben has curly hair and a beard. He's not very tall, and he has freckles. He's reliable and cheerful. He plays the guitar in a band. His sister is much more outgoing, and she loves meeting new people."
];
const passages=[
"TWO PEOPLE IN MY OFFICE\nI work with two very different people. Hannah is quite tall and slim. She has long, straight brown hair and wears glasses. She's friendly and very organised. Mark is shorter and has curly hair and a beard. He is a little shy, but he's extremely helpful and reliable. They are both good colleagues.",
"SAM, A GREAT TEAMMATE\nSam is tall and athletic. He has short dark hair and brown eyes. He enjoys climbing and cycling. Sam is kind and patient, and he always helps the team when we have a difficult task. He isn't very talkative in big meetings, but he is confident when he explains his ideas.",
"OUR NEW NEIGHBOUR\nOur new neighbour is called Anna. She's in her thirties and has wavy brown hair and freckles. She's outgoing and cheerful. She works in a library and loves reading. On Fridays, she often invites neighbours for dinner. She's a great neighbour and we enjoy talking to her."
];
export const a2Unit3Exercises={
 grammar:G.map(x=>mc(x)),
 vocabulary:V.map(x=>mc(x)),
 listening:L.map((x,i)=>mc(x,i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{})),
 reading:R.map((x,i)=>mc(x,i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{}))
} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
