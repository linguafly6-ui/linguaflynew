import type { Activity } from "./activity-content";
type R = [string,string,string,string[],string,string];
const mc = (r:R, extra:Partial<Activity>={}):Activity => ({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,i)=>({id:String.fromCharCode(65+i),text})),correct_answer:r[4],explanation:r[5],...extra});
const fill = (id:string,prompt_es:string,stimulus_en:string,correct:string,explanation:string):Activity => ({interaction_id:id,type:"fill_blank",prompt_es,stimulus_en,correct_answer:correct,explanation});
const G:R[] = [
["g201","Elige el posesivo correcto.","This is Maria. ___ brother is Luis.",["His","Her","Their"],"Her","Her acompaña a un nombre femenino."],
["g202","Completa con have got o has got.","My sister ___ two children.",["have got","has got","is got"],"has got","Con she usamos has got."],
["g203","Selecciona la pregunta correcta.","Ask if someone has a sister.",["Has you got a sister?","Have you got a sister?","Do you got a sister?"],"Have you got a sister?","Have + sujeto + got."],
["g204","Elige la negativa correcta.","Tom ___ any brothers.",["haven't got","hasn't got","isn't got"],"hasn't got","Con Tom usamos hasn't got."],
["g205","Indica posesión.","This is ___ phone.",["Ana","Ana's","Anas"],"Ana's","Añadimos ’s al poseedor."],
["g206","Elige el posesivo correcto.","My parents love ___ garden.",["his","their","our"],"their","Their corresponde a my parents."],
["g207","Completa la frase.","We ___ a big family.",["has got","have got","is got"],"have got","Con we usamos have got."],
["g208","Respuesta corta: Have they got children?", "",["Yes, they have.","Yes, they are.","Yes, they has."],"Yes, they have.","Repetimos have en la respuesta corta."],
["g209","La hija de tu hermano es tu…","",["niece","nephew","aunt"],"niece","Niece significa sobrina."],
["g210","Completa el posesivo.","The children love ___ grandparents.",["his","her","their"],"their","The children es plural."],
["g211","Elige la frase correcta.","",["The car of my dad","My dad's car","My dads car"],"My dad's car","El posesivo ’s expresa pertenencia."],
["g212","Completa la pregunta.","___ your cousin got a pet?",["Have","Has","Is"],"Has","Cousin es tercera persona singular."],
["g213","Completa la negativa.","I ___ got any sisters.",["hasn't","haven't","don't"],"haven't","Con I usamos haven't got."],
["g214","Elige el posesivo.","Lucy and Mark love ___ family.",["his","her","their"],"their","Para dos personas usamos their."],
["g215","Elige el orden correcto.","",["How many cousins you have got?","How many cousins have you got?","How many have got you cousins?"],"How many cousins have you got?","How many + nombre + have + sujeto + got."]
];
const V:R[] = [
["v201","¿Qué significa only child?","only child",["hijo/a único/a","primo/a","familiar"],"hijo/a único/a","Persona sin hermanos."],
["v202","¿Qué significa relative?","relative",["vecino/a","familiar","pareja"],"familiar","Relative significa familiar."],
["v203","Traduce get on well with.","get on well with",["discutir con","llevarse bien con","vivir con"],"llevarse bien con","Describe una buena relación."],
["v204","Completa: I ___ my brother after school.","",["look after","look for","look at"],"look after","Look after significa cuidar."],
["v205","¿Qué significa partner?","partner",["pareja","sobrino/a","abuelo/a"],"pareja","Partner puede ser pareja."],
["v206","¿Qué son twins?","twins",["trillizos","gemelos","nietos"],"gemelos","Twins son gemelos."],
["v207","¿Cómo se dice sobrina?","",["niece","nephew","aunt"],"niece","Niece significa sobrina."],
["v208","¿Cómo se dice sobrino?","",["niece","nephew","uncle"],"nephew","Nephew significa sobrino."],
["v209","¿Qué significa grandparents?","grandparents",["padres","abuelos","nietos"],"abuelos","Grandparents son los abuelos."],
["v210","My mother's sister is my…","",["uncle","aunt","cousin"],"aunt","La hermana de tu madre es tu tía."],
["v211","¿Qué significa grandchild?","grandchild",["nieto/a","hermano/a","primo/a"],"nieto/a","Grandchild significa nieto/a."],
["v212","My parents' son is my…","",["nephew","brother","uncle"],"brother","El hijo de tus padres es tu hermano."],
["v213","¿Qué significa look after?","look after",["buscar","cuidar de","parecerse a"],"cuidar de","Look after significa cuidar."],
["v214","Completa: a good relationship ___ my sister.","",["with","at","on"],"with","La expresión es relationship with."],
["v215","¿Qué significa in-laws?","in-laws",["familia política","familia numerosa","familia cercana"],"familia política","Familia por matrimonio."]
];
const L:R[] = [
["l201","¿Quién aparece en la foto de Ben?","",["Sus padres y su hermana","Sus tíos","Sus abuelos"],"Sus padres y su hermana","Ben presenta a sus padres y a Chloe."],
["l202","¿Cómo se llama su hermana?","",["Chloe","Sophie","Emma"],"Chloe","Se llama Chloe."],
["l203","¿Tiene Ben hermanos varones?","",["Sí, dos","No, es hijo único","Sí, uno"],"No, es hijo único","Dice I'm an only child."],
["l204","¿Cuántos primos tiene?","",["Dos","Tres","Cuatro"],"Tres","Menciona tres primos."],
["l205","¿Cada cuánto se reúnen?","",["Cada semana","Cada mes","Cada año"],"Cada mes","Se reúnen every month."],
["l206","¿Quién vive con Mia?","",["Sus padres, hermano y abuela","Sus tíos","Sus primos"],"Sus padres, hermano y abuela","Mia vive con ellos."],
["l207","¿Quién ayuda a la abuela por la mañana?","",["Mia","Su padre","Su tía"],"Su padre","Su padre la ayuda por las mañanas."],
["l208","¿Cuántos años tiene el hermano de Mia?","",["Doce","Dieciséis","Veinte"],"Dieciséis","Tiene dieciséis años."],
["l209","¿Qué hacen juntos los domingos?","",["Cocinan","Ven películas","Juegan al tenis"],"Cocinan","Preparan la cena juntos."],
["l210","¿Cómo se lleva Mia con su hermano?","",["Muy bien","No muy bien","No lo dice"],"Muy bien","Dice que se llevan muy bien."],
["l211","¿De dónde son los abuelos de Jack?","",["Polonia","Italia","Irlanda"],"Polonia","Son de Polonia."],
["l212","¿Cuándo visita a sus primos?","",["En verano","En Navidad","En primavera"],"En verano","Los visita cada verano."],
["l213","¿Cuántos primos tiene Jack?","",["Uno","Cuatro","Seis"],"Cuatro","Menciona cuatro primos."],
["l214","¿Qué hace la familia para divertirse?","",["Montar en bici","Jugar a juegos de mesa","Ir de compras"],"Jugar a juegos de mesa","Les gustan los juegos de mesa."],
["l215","¿Con quién habla por videollamada?","",["Su abuelo","Su prima Anna","Su tío"],"Su prima Anna","Habla con su prima Anna."]
];
const R:R[] = [
["r201","¿Cuántos hermanos tiene Rina?","",["Uno","Dos","Tres"],"Dos","Rina tiene dos hermanos."],
["r202","¿Dónde viven sus padres?","",["Leeds","Londres","Bristol"],"Leeds","Viven en Leeds."],
["r203","¿Cómo se llama la esposa de Arjun?","",["Meera","Ravi","Eva"],"Meera","La esposa de Arjun es Meera."],
["r204","¿Quién es la hija de Arjun para Rina?","",["Su sobrina","Su prima","Su hermana"],"Su sobrina","La hija de su hermano es su sobrina."],
["r205","¿Qué día cenan juntos?","",["Viernes","Sábado","Domingo"],"Domingo","Cenan juntos los domingos."],
["r206","¿Dónde trabaja Daniel?","",["En un hospital","En una escuela","En una tienda"],"En un hospital","Daniel trabaja en un hospital."],
["r207","¿Con quién vive Daniel?","",["Su pareja y su hija","Sus padres","Su hermano"],"Su pareja y su hija","Vive con Alex y Ruby."],
["r208","¿Cómo se llama su hija?","",["Ruby","Mia","Sophie"],"Ruby","Su hija se llama Ruby."],
["r209","¿Qué hace Daniel los sábados?","",["Visita a su hermana","Cuida el jardín","Va al gimnasio"],"Visita a su hermana","Visita a Sophie los sábados."],
["r210","¿Cómo describe a su hermana?","",["Divertida y generosa","Tímida y seria","Alta y joven"],"Divertida y generosa","La describe como funny and generous."],
["r211","¿Cuándo es la reunión familiar?","",["12 de mayo","20 de junio","2 de mayo"],"12 de mayo","La invitación indica 12 May."],
["r212","¿Dónde será?","",["En el jardín de la abuela","En un restaurante","En la estación"],"En el jardín de la abuela","Será en Grandma's garden."],
["r213","¿Qué deben llevar?","",["Una bebida o postre","Un regalo","Una foto"],"Una bebida o postre","Pide traer una bebida o postre."],
["r214","¿A qué hora empieza?","",["12:30","2:00","3:30"],"12:30","Empieza a las 12:30."],
["r215","¿A quién deben confirmar?","",["Sarah","Peter","Grandma"],"Sarah","Deben avisar a Sarah."]
];
const dialogues = [
"A: Is this your family photo, Ben? B: Yes. These are my parents, and that's my sister, Chloe. A: Have you got any brothers? B: No, I'm an only child. But I've got three cousins. A: Do you see them often? B: Yes, we get together every month.",
"A: Who lives with you, Mia? B: My parents, my brother and my grandmother. A: Does she need help? B: Dad helps her in the morning. A: Do you get on well with your brother? B: Yes, very well. We cook dinner together on Sundays.",
"A: Tell me about your family, Jack. B: My grandparents are from Poland. I have four cousins there. A: Do you visit them? B: Yes, every summer. We play board games and I video-call my cousin Anna."
];
const passages = [
"THE PATEL FAMILY\nMy name is Rina Patel. I've got a big family. My parents live in a flat in Leeds, and my grandparents live nearby. I've got two brothers: Arjun and Ravi. Arjun's wife is called Meera, and their daughter is my niece. Ravi hasn't got children. We get on well, and we usually have dinner together on Sundays.",
"DANIEL'S FAMILY\nDaniel lives in Manchester with his partner, Alex, and their daughter Ruby. His parents live nearby, so they often have lunch together. Daniel has got one sister. Her name is Sophie and she is funny and generous. On Saturdays, Daniel visits Sophie and they take their children to the park.",
"FAMILY DAY\nOur family day is on 12 May at Grandma's garden. Please arrive at 12:30. We've got food for everyone, but please bring a drink or a dessert. Uncle Peter is bringing music and Aunt Sarah is organising games for the children. Please tell Sarah if you can come."
];
export const a2Unit2Exercises = {
 grammar:[...G.slice(0,5).map(x=>mc(x)),fill("g206f","Completa con el posesivo de they.","___ grandparents live in York.","Their","Their es el posesivo de they."),...G.slice(5).map(x=>mc(x))],
 vocabulary:V.map(x=>mc(x)),
 listening:L.map((x,i)=>mc(x,i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{})),
 reading:R.map((x,i)=>mc(x,i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{}))
} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
