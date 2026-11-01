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
import { a2Unit12Exercises } from "./a2-unit-012-exercises";
import { a2Unit13Exercises } from "./a2-unit-013-exercises";
import { a2Unit14Exercises } from "./a2-unit-014-exercises";
import { a2Unit15Exercises } from "./a2-unit-015-exercises";
import { a2Unit16Exercises } from "./a2-unit-016-exercises";
import { a2Unit17Exercises } from "./a2-unit-017-exercises";
import { a2Unit18Exercises } from "./a2-unit-018-exercises";
import { a2Unit19Exercises } from "./a2-unit-019-exercises";
import { a2Unit20Exercises } from "./a2-unit-020-exercises";
import { a2Unit21Exercises } from "./a2-unit-021-exercises";
import { a2Unit22Exercises } from "./a2-unit-022-exercises";
import { a2Unit23Exercises } from "./a2-unit-023-exercises";
import { a2Unit24Exercises } from "./a2-unit-024-exercises";
import { a2Unit25Exercises } from "./a2-unit-025-exercises";
import { a2Unit26Exercises } from "./a2-unit-026-exercises";
import { a2Unit27Exercises } from "./a2-unit-027-exercises";
import { a2Unit28Exercises } from "./a2-unit-028-exercises";
import { a2Unit29Exercises } from "./a2-unit-029-exercises";
import { a2Unit30Exercises } from "./a2-unit-030-exercises";

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
  12: { explanation: "Para seguir una receta en inglés, combina los nombres de ingredientes con cuantificadores y verbos en imperativo. Usa a/an con un ingrediente contable singular (an onion), some con cantidades no especificadas (some flour) y much/many o how much/how many para preguntar por cantidades. Los verbos de cocina suelen aparecer en imperativo: chop (pica), mix (mezcla), pour (vierte), add (añade), stir (remueve), bake (hornea) y boil (hierve). Usa first, next, then y finally para ordenar los pasos. Should sirve para dar consejos y comparativos para elegir ingredientes o métodos: Fresh herbs are better than dried herbs.", examples: ["First, chop the onion. = Primero, pica la cebolla.", "Add 200 grams of flour. = Añade 200 gramos de harina.", "How much oil do we need? = ¿Cuánto aceite necesitamos?", "Mix the eggs with some milk. = Mezcla los huevos con un poco de leche.", "You should wash the vegetables. = Deberías lavar las verduras.", "This recipe is easier than the other one. = Esta receta es más fácil que la otra."] },
  13: { explanation: "Para pedir comida y bebida con educación, utiliza would like: I'd like a coffee, please (Quisiera un café, por favor). Para ofrecer algo, pregunta Would you like...? y responde Yes, please o No, thank you. Usa some en peticiones y ofrecimientos: Could I have some water? (¿Me podría traer agua?). How much pregunta por cantidades incontables y how many por unidades contables. Para pedir aclaraciones puedes decir Could you repeat that, please? o What does this dish come with? Utiliza comparativos para elegir entre opciones y should para dar recomendaciones.", examples: ["I'd like the chicken, please. = Quisiera el pollo, por favor.", "Could I have a glass of water? = ¿Me podría traer un vaso de agua?", "Would you like some dessert? = ¿Le apetece postre?", "How much is the soup? = ¿Cuánto cuesta la sopa?", "Could you repeat that, please? = ¿Podría repetirlo, por favor?", "The salad is cheaper than the pasta. = La ensalada es más barata que la pasta."] },
  14: { explanation: "Para comprar ropa, pregunta por la talla con What size are you? o Have you got this in a smaller size? Usa Could I try this on? para pedir probarte una prenda. Too + adjetivo expresa exceso (too tight, demasiado ajustado); not + adjetivo + enough indica que algo no alcanza una cualidad (not warm enough, no lo bastante cálido). Forma comparativos con -er en adjetivos cortos (cheaper, larger) y con more en adjetivos largos (more expensive). Should y shouldn't sirven para dar consejos. Conserva el recibo (receipt) si necesitas un cambio (exchange) o un reembolso (refund).", examples: ["Could I try this jacket on? = ¿Podría probarme esta chaqueta?", "Have you got a larger size? = ¿Tiene una talla más grande?", "These shoes are too tight. = Estos zapatos están demasiado ajustados.", "This coat is warmer than that one. = Este abrigo es más cálido que aquel.", "You should keep the receipt. = Deberías guardar el recibo.", "Can I pay by card? = ¿Puedo pagar con tarjeta?"] },
  15: { explanation: "Para hablar de precios, utiliza How much is this? (¿Cuánto cuesta esto?) con un artículo singular y How much are these? (¿Cuánto cuestan estos?) con plurales. Responde con It costs... o They cost... Usa how much para precios y sustantivos incontables, y how many para unidades contables. Para pagar, di pay by card (pagar con tarjeta) o pay in cash (pagar en efectivo). Puedes pedir el recibo con Could I have a receipt, please? y preguntar por descuentos con Is there a discount? Usa comparativos para comparar precios: cheaper (más barato), more expensive (más caro).", examples: ["How much is this notebook? = ¿Cuánto cuesta este cuaderno?", "These shoes cost £30. = Estos zapatos cuestan 30 libras.", "Can I pay by card? = ¿Puedo pagar con tarjeta?", "Is there a student discount? = ¿Hay descuento para estudiantes?", "The blue bag is cheaper than the black one. = El bolso azul es más barato que el negro.", "Could I have a receipt, please? = ¿Me puede dar el recibo, por favor?"] },
  16: { explanation: "Para hablar de tiendas y servicios, usa expresiones educadas para pedir ayuda: Could you help me, please? (¿Podría ayudarme, por favor?) y I'm looking for... (Estoy buscando...). Look for significa buscar y necesita la preposición for. Usa How many con nombres contables plurales (How many appointments...?) y how much con incontables o precios (How much does it cost?). El imperativo sirve para dar indicaciones: Turn left (Gira a la izquierda). Should expresa consejo: You should check the opening hours (Deberías comprobar el horario). Compara servicios con -er o more: cheaper (más barato), more expensive (más caro).", examples: ["I'm looking for the post office. = Estoy buscando la oficina de correos.", "Could you tell me the opening hours? = ¿Podría decirme el horario de apertura?", "How much does the repair cost? = ¿Cuánto cuesta la reparación?", "You should make an appointment. = Deberías pedir cita.", "The chemist's is smaller than the supermarket. = La farmacia es más pequeña que el supermercado.", "Turn right at the bakery. = Gira a la derecha en la panadería."] },
  17: { explanation: "Para devolver o cambiar una compra, utiliza el pasado simple para explicar qué ocurrió: I bought this yesterday (Compré esto ayer). Los verbos regulares suelen añadir -ed (damaged, wanted), mientras que algunos son irregulares: buy → bought, find → found, get → got. Los pronombres objeto me, you, him, her, it, us y them sustituyen a la persona o cosa que recibe la acción: These shoes don't fit me (Estos zapatos no me quedan bien). Para pedir una solución con educación, usa Could I have a refund, please? (¿Podría recibir un reembolso, por favor?) o Could I exchange it for another one? (¿Podría cambiarlo por otro?). Should + verbo base sirve para aconsejar: You should keep the receipt (Deberías guardar el recibo).", examples: ["I bought this jacket last week. = Compré esta chaqueta la semana pasada.", "It doesn't fit me. = No me queda bien.", "Could I exchange it for a larger size? = ¿Podría cambiarlo por una talla más grande?", "I'd like a refund, please. = Quisiera un reembolso, por favor.", "They are faulty. = Están defectuosos.", "You should keep the receipt. = Deberías guardar el recibo."] },
  18: { explanation: "Usa should y shouldn't + verbo base para dar consejos: You should eat more vegetables (Deberías comer más verduras); You shouldn't drink too many fizzy drinks (No deberías beber demasiados refrescos). Recuerda distinguir los nombres contables e incontables: many apples (muchas manzanas), much water (mucha agua), a few portions (unas pocas raciones), a little oil (un poco de aceite). Some aparece normalmente en afirmativas y ofrecimientos; any es frecuente en preguntas y negativas. El imperativo sirve para dar instrucciones: Wash the vegetables (Lava las verduras). Para comparar opciones, utiliza comparativos: healthier (más saludable), less sugar (menos azúcar).", examples: ["You should eat more fruit. = Deberías comer más fruta.", "You shouldn't eat too much salt. = No deberías comer demasiada sal.", "How much water do you drink? = ¿Cuánta agua bebes?", "How many portions do you eat? = ¿Cuántas raciones comes?", "Add a little olive oil. = Añade un poco de aceite de oliva.", "Grilled fish is healthier than fried fish. = El pescado a la plancha es más saludable que el pescado frito."] },
  20: { explanation: "Esta unidad integra el inglés que necesitas para comprar alimentos, pedir en una tienda y resolver situaciones habituales. Repasa how much con incontables (How much rice? = ¿Cuánto arroz?) y how many con contables (How many apples? = ¿Cuántas manzanas?). Utiliza would like y Could I have...? para pedir con educación. Should + verbo base sirve para aconsejar; el imperativo da instrucciones. Compara productos con cheaper (más barato) o more expensive (más caro). Para ropa, usa try on (probarse), fit (quedar bien), exchange (cambiar) y refund (reembolso).", examples: ["I'd like some fresh bread, please. = Quisiera pan fresco, por favor.", "How many portions do we need? = ¿Cuántas raciones necesitamos?", "Could I try this jacket on? = ¿Podría probarme esta chaqueta?", "These shoes are too small. = Estos zapatos son demasiado pequeños.", "You should keep the receipt. = Deberías guardar el recibo.", "This market is cheaper than the supermarket. = Este mercado es más barato que el supermercado."] },
  21: { explanation: "Para moverte por una ciudad y utilizar el transporte público, aprende a pedir y dar indicaciones. Usa imperativos: Go straight on (sigue recto), Turn left (gira a la izquierda), Cross the street (cruza la calle). Las preposiciones de lugar ayudan a localizar sitios: opposite (enfrente de), next to (al lado de), between (entre) y near (cerca de). Para preguntar por trayectos, utiliza How do I get to...? (¿Cómo llego a...?) y Which bus goes to...? (¿Qué autobús va a...?). Usa can/could para preguntar por servicios y horarios con educación. El pasado simple permite contar cómo fue un viaje: The train arrived late (El tren llegó tarde).", examples: ["How do I get to the station? = ¿Cómo llego a la estación?", "Go straight on and turn right. = Sigue recto y gira a la derecha.", "The museum is opposite the library. = El museo está enfrente de la biblioteca.", "Which bus goes to the city centre? = ¿Qué autobús va al centro?", "Could you tell me the platform, please? = ¿Podría decirme el andén, por favor?", "Our train arrived ten minutes late. = Nuestro tren llegó diez minutos tarde."] },
  22: { explanation: "Para utilizar el transporte público, aprende a consultar horarios y comprar billetes. Pregunta What time does the bus leave? (¿A qué hora sale el autobús?) y How much is a return ticket? (¿Cuánto cuesta un billete de ida y vuelta?). Usa present simple para horarios oficiales: The train leaves at 9:15 (El tren sale a las 9:15). Para planes e intenciones utiliza be going to: I'm going to take the 10 o'clock train (Voy a coger el tren de las diez). Para acuerdos ya organizados puedes usar present continuous: We're meeting at the station at eight (Hemos quedado en la estación a las ocho). Have to expresa obligación: You have to validate your ticket (Tienes que validar el billete).", examples: ["What time does the coach arrive? = ¿A qué hora llega el autocar?", "I'd like a return ticket to Oxford, please. = Quisiera un billete de ida y vuelta a Oxford, por favor.", "The train leaves from platform four. = El tren sale del andén cuatro.", "I'm going to travel by bus tomorrow. = Mañana voy a viajar en autobús.", "We're meeting outside the station at 8. = Hemos quedado fuera de la estación a las ocho.", "You have to keep your ticket. = Tienes que guardar el billete."] },
  23: { explanation: "Para organizar un viaje y hacer reservas, usa present perfect para hablar de experiencias y acciones recientes: I've booked the hotel (He reservado el hotel). Forma el present perfect con have/has + participio. Ever se usa en preguntas sobre experiencias y never en negativas con sentido afirmativo: Have you ever travelled abroad? (¿Has viajado alguna vez al extranjero?). Already indica que algo ya ha ocurrido y yet se utiliza normalmente en preguntas y negativas. Para planes futuros también puedes usar be going to y present continuous. Usa need to para expresar lo que necesitas hacer y would like to para pedir algo con cortesía.", examples: ["I've already booked our room. = Ya he reservado nuestra habitación.","Have you ever travelled by plane? = ¿Has viajado alguna vez en avión?","We haven't confirmed the dates yet. = Todavía no hemos confirmado las fechas.","She's never stayed in a hostel. = Ella nunca se ha alojado en un albergue.","We're flying to Dublin on Friday. = Volamos a Dublín el viernes.","I'd like to book a room for three nights. = Quisiera reservar una habitación para tres noches."] },
  24: { explanation: "Para desenvolverte en estaciones y aeropuertos, utiliza imperativos para seguir o dar instrucciones (Go to platform 4 = Ve al andén 4) y preposiciones de movimiento y lugar: through (a través de), across (al otro lado de), towards (hacia), opposite (enfrente de), next to (al lado de). El pasado simple sirve para explicar incidencias ya ocurridas (The train was delayed = El tren se retrasó). Para decisiones espontáneas y promesas usa will (I will help you = Te ayudaré); para planes previos, going to. En preguntas de cortesía, usa Could you...? y Can I...?", examples: ["Go through the ticket gates. = Pasa por los tornos.","The bus stopped opposite the terminal. = El autobús paró enfrente de la terminal.","I missed my connection, so I will take the next train. = Perdí mi enlace, así que cogeré el próximo tren.","Could you tell me where platform 5 is? = ¿Podría decirme dónde está el andén 5?"] },
  26: { explanation: "Para hablar de vacaciones y viajes pasados, utiliza el pasado simple: verbos regulares terminan en -ed (visited, travelled) y los irregulares tienen formas propias (go → went, see → saw, buy → bought). En preguntas usa Did + sujeto + verbo base (Did you enjoy the trip?) y en negativas didn't + verbo base (We didn't visit the castle). El verbo be en pasado cambia a was con I/he/she/it y were con you/we/they. Usa expresiones temporales como last summer, yesterday, two days ago y in 2024. Could expresa habilidades o posibilidades en el pasado: We could see the sea from our hotel. El presente perfecto permite hablar de experiencias sin indicar cuándo: I've visited Rome.", examples: ["We went to Greece last summer. = Fuimos a Grecia el verano pasado.","Did you visit the museum? = ¿Visitaste el museo?","I didn't buy any souvenirs. = No compré ningún recuerdo.","The weather was sunny and warm. = Hacía sol y calor.","We could see the mountains from our room. = Podíamos ver las montañas desde nuestra habitación.","I've never travelled by ferry. = Nunca he viajado en ferry."] },
  27: { explanation: "Para explicar retrasos e incidencias de viaje, combina el pasado continuo (was/were + verbo -ing) para una acción en progreso con el pasado simple para el hecho que la interrumpe: I was waiting when the train arrived (Estaba esperando cuando llegó el tren). While suele introducir la acción en progreso: While we were travelling, the road closed. Usa because + oración para explicar una causa y because of + sustantivo: The flight was delayed because it was raining / because of the rain. Should sirve para aconsejar (You should contact the airline) y couldn't para expresar que algo no fue posible. El presente perfecto permite hablar de una incidencia reciente con efecto actual: My suitcase hasn't arrived yet.", examples: ["I was sleeping when the alarm rang. = Estaba durmiendo cuando sonó la alarma.","While we were waiting, the train was delayed. = Mientras esperábamos, el tren se retrasó.","The flight was cancelled because of the storm. = El vuelo se canceló debido a la tormenta.","You should speak to a member of staff. = Deberías hablar con un miembro del personal.","I couldn't find my platform. = No pude encontrar mi andén.","My luggage hasn't arrived yet. = Mi equipaje todavía no ha llegado."] },
  28: { explanation: "Para comparar destinos, utiliza el comparativo de los adjetivos cortos con -er + than: cheaper than (más barato que), quieter than (más tranquilo que). Con adjetivos largos usa more + adjetivo + than: more interesting than. Para expresar igualdad utiliza as + adjetivo + as: The coast is as warm as the island (La costa es tan cálida como la isla). Para indicar inferioridad usa less + adjetivo + than: less crowded than (menos concurrido que). El superlativo se forma con -est en adjetivos cortos (the quietest) y the most + adjetivo en los largos (the most beautiful). Recuerda las formas irregulares: good → better → the best; bad → worse → the worst; far → further/farther → the furthest/farthest. Prefer A to B expresa preferencia.", examples: ["The coast is warmer than the mountains. = La costa es más cálida que las montañas.","This village is less crowded than the city. = Este pueblo está menos concurrido que la ciudad.","The island is as beautiful as the coast. = La isla es tan bonita como la costa.","It's the most peaceful place in the region. = Es el lugar más tranquilo de la región.","This is the best destination for hiking. = Este es el mejor destino para hacer senderismo.","I prefer the countryside to the city. = Prefiero el campo a la ciudad."] },
  30: { explanation: "Esta unidad integra las estructuras principales de A2 para organizar un viaje de forma autónoma. Utiliza present simple para horarios (The train leaves at nine), present continuous y be going to para planes acordados o intenciones (We are staying in York; I am going to book a room), y will para decisiones espontáneas y predicciones. Repasa el pasado simple y el present perfect para contar experiencias, los modales can/could/should para pedir ayuda y aconsejar, y el primer condicional para prever consecuencias: If we miss the train, we will take the next one. Para ordenar una explicación usa first, then, after that y finally.", examples: ["We are travelling to Bristol on Friday. = Viajamos a Bristol el viernes.", "I have already booked the hotel. = Ya he reservado el hotel.", "Could you tell me which platform we need? = ¿Podría decirme qué andén necesitamos?", "If the weather is bad, we will visit a museum. = Si hace mal tiempo, visitaremos un museo.", "First, check the timetable. Then, buy your ticket. = Primero, consulta el horario. Después, compra el billete."] },
  29: { explanation: "El primer condicional sirve para hablar de situaciones futuras posibles. Su estructura es If + presente simple, will + verbo base: If it rains, we'll stay inside (Si llueve, nos quedaremos dentro). En la cláusula con if no se utiliza will: If the weather will be bad es incorrecto. Unless significa if not: Unless the fog clears, the flight won't leave (Si la niebla no se levanta, el vuelo no saldrá). Might y may expresan posibilidad: It might snow (Puede que nieve). Should se utiliza para dar consejos: You should check the forecast. Para hablar de intensidad, usa too + adjetivo (too cold = demasiado frío) y adjetivo + enough (warm enough = lo bastante cálido).", examples: ["If it rains, we'll visit a museum. = Si llueve, visitaremos un museo.","If the sun comes out, we'll go to the beach. = Si sale el sol, iremos a la playa.","Unless the wind gets weaker, the ferry won't sail. = Si el viento no amaina, el ferry no zarpará.","It might snow tonight. = Puede que nieve esta noche.","You should take a waterproof jacket. = Deberías llevar una chaqueta impermeable.","It's too cold to swim. = Hace demasiado frío para nadar."] },
};
function Questions({ items }: { items: string[][] }) {
  return <ol className="theory-question-list">{items.map((q,i)=><li key={i}><span className="question-number">{String(i+1).padStart(2,"0")}</span><div><p>{q[0]}</p>{q.length>1&&<small>Opciones: {q.slice(1,4).join(" · ")}</small>}{q[4]&&<p className="question-answer"><strong>Respuesta: {q[4]}</strong></p>}</div></li>)}</ol>;
}
function BlueprintPractice({ data }: { data: Blueprint }) {
  const toActivities = (kind: "reading" | "listening", items?: string[][]): Activity[] =>
    (items ?? []).map((item, index) => {
      const options = item.slice(1, 4).filter(Boolean);
      const answer = item[4] ?? options[0] ?? "";
      return {
        interaction_id: `${kind}-${index + 1}`,
        type: "multiple_choice",
        prompt_es: kind === "reading" ? "Según el texto, elige la respuesta correcta." : "Según el diálogo, elige la respuesta correcta.",
        question_en: item[0],
        options: options.map((text, optionIndex) => ({ id: `${kind}-${index}-${optionIndex}`, text })),
        correct_answer: answer,
        explanation: "Vuelve al texto o escucha el diálogo para localizar la información."
      };
    });
  const vocabulary = (data.vocabulary ?? []).filter(item => item.term && item.translation_es);
  const vocabularyActivities: Activity[] = vocabulary.map((item, index) => {
    const distractors = vocabulary.filter(other => other.term !== item.term).slice((index * 3) % Math.max(1, vocabulary.length - 1), (index * 3) % Math.max(1, vocabulary.length - 1) + 3);
    const choices = [item, ...distractors].map(other => other.translation_es ?? "");
    return {
      interaction_id: `vocabulary-${index + 1}`,
      type: "multiple_choice",
      prompt_es: "Selecciona la traducción correcta.",
      question_en: item.term,
      options: choices.map((text, optionIndex) => ({ id: `vocab-${index}-${optionIndex}`, text })),
      correct_answer: item.translation_es,
      explanation: item.example ? `Ejemplo: ${item.example}` : "Repasa la lista de vocabulario."
    };
  });
  const grammarActivities: Activity[] = (data.grammar_lesson?.commonErrors ?? []).map((error, index): Activity | null => {
    const parts = error.split("→");
    const correction = parts[1]?.split(":")[0]?.trim() ?? "";
    const incorrect = parts[0]?.trim() ?? "";
    if (!correction || !incorrect) return null;
    return {
      interaction_id: `grammar-${index + 1}`,
      type: "multiple_choice",
      prompt_es: "Elige la frase correcta en inglés.",
      question_en: error.split(":")[1]?.trim() ?? "Choose the correct sentence.",
      options: [{ id: `grammar-${index}-a`, text: correction }, { id: `grammar-${index}-b`, text: incorrect }],
      correct_answer: correction,
      explanation: "La opción correcta aplica la regla gramatical explicada en esta unidad."
    };
  }).filter((item): item is Activity => item !== null);
  const sections = [
    { title: "GRAMMAR · GRAMÁTICA", activities: grammarActivities },
    { title: "VOCABULARY · VOCABULARIO", activities: vocabularyActivities },
    { title: "READING · COMPRENSIÓN LECTORA", activities: toActivities("reading", data.reading?.questions) },
    { title: "LISTENING · COMPRENSIÓN ORAL", activities: toActivities("listening", data.listening?.questions) }
  ];
  return <section className="lesson-block" style={{marginTop:32}}>
    <div className="kicker">PRACTICE · ACTIVIDADES INTERACTIVAS</div>
    <h2>Practica y comprueba tus respuestas</h2>
    <p>Las actividades se generan con el contenido de esta unidad guardado en la base de datos del curso.</p>
    {sections.filter(section => section.activities.length > 0).map(section => <section key={section.title} style={{marginTop:28}}>
      <div className="kicker">{section.title} · {section.activities.length} ACTIVITIES</div>
      <ActivityContent activities={section.activities} mode="standard"/>
    </section>)}
  </section>;
}
function BlueprintView({ data, title, level, number }: { data: Blueprint; title: string; level: string; number: number }) {
  const readingExerciseSets: Activity[][] = [
    a2Unit1Exercises.reading, a2Unit2Exercises.reading, a2Unit3Exercises.reading,
    a2Unit4Exercises.reading, a2Unit5Exercises.reading, a2Unit6Exercises.reading,
    a2Unit7Exercises.reading, a2Unit8Exercises.reading, a2Unit9Exercises.reading,
    a2Unit10Exercises.reading, a2Unit11Exercises.reading, a2Unit12Exercises.reading,
    a2Unit13Exercises.reading, a2Unit14Exercises.reading, a2Unit15Exercises.reading,
    a2Unit16Exercises.reading, a2Unit17Exercises.reading, a2Unit18Exercises.reading,
    a2Unit19Exercises.reading, a2Unit20Exercises.reading, a2Unit21Exercises.reading,
    a2Unit22Exercises.reading, a2Unit23Exercises.reading,
  ];
  const blueprintReadingText = data.reading?.text?.trim().replace(/\\s+/g, " ").toLocaleLowerCase();
  const readingAlreadyInPractice = !!blueprintReadingText && (readingExerciseSets[number - 1] ?? [])
    .some(activity => activity.main_text?.trim().replace(/\\s+/g, " ").toLocaleLowerCase() === blueprintReadingText);
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
        {data.reading&&!readingAlreadyInPractice&&<section className="theory-card text-skill-card"><div className="theory-section-label"><span className="theory-icon">↗</span><span>READING · COMPRENSIÓN LECTORA</span></div><h2>{data.reading.title}</h2><div className="theory-reading-text">{data.reading.text}</div>{!!data.reading.questions?.length&&<div className="theory-questions"><h3>Comprueba lo que has entendido</h3><Questions items={data.reading.questions}/></div>}</section>}
        {data.listening&&<section className="theory-card text-skill-card"><div className="theory-section-label"><span className="theory-icon">♫</span><span>LISTENING · COMPRENSIÓN ORAL</span></div><h2>{data.listening.title}</h2><div className="listening-transcript"><span>TRANSCRIPCIÓN</span><p>{data.listening.transcript}</p></div><p className="audio-status-note">Audio: {data.listening.audio_asset_status??"pendiente de verificación"}. Por ahora se ofrece el texto de apoyo, no una grabación.</p>{!!data.listening.questions?.length&&<div className="theory-questions"><h3>Comprueba lo que has entendido</h3><Questions items={data.listening.questions}/></div>}</section>}
      </div>
      {!!data.review_checklist?.length&&<section className="theory-card review-theory"><div className="theory-section-label"><span className="theory-icon">✓</span><span>REPASO · AL FINAL DE LA UNIDAD</span></div><h2>¿Ya lo tienes?</h2><p className="theory-intro">Utiliza esta lista para comprobar qué sabes hacer antes de continuar.</p><ul>{data.review_checklist.map((x,i)=><li key={i}><span>{String(i+1).padStart(2,"0")}</span>{x}</li>)}</ul></section>}
      {!!data.editorial_notes?.length&&<section className="theory-card editorial-notes"><div className="theory-section-label"><span className="theory-icon">✦</span><span>NOTAS EDITORIALES · BORRADOR</span></div><ul>{data.editorial_notes.map((x,i)=><li key={i}>{x}</li>)}</ul></section>}
    </section>
    <BlueprintPractice data={data}/>
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

    {number === 12 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 12 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica el vocabulario de cocina, los ingredientes, las cantidades y las instrucciones de una receta. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([
        ["GRAMMAR",a2Unit12Exercises.grammar],["VOCABULARY",a2Unit12Exercises.vocabulary],
        ["LISTENING",a2Unit12Exercises.listening],["READING",a2Unit12Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}

    {number === 13 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 13 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo pedir comida y bebida, preguntar por ingredientes y precios, expresar preferencias y solicitar aclaraciones. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([
        ["GRAMMAR",a2Unit13Exercises.grammar],["VOCABULARY",a2Unit13Exercises.vocabulary],
        ["LISTENING",a2Unit13Exercises.listening],["READING",a2Unit13Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}

    {number === 14 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 14 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo elegir ropa, preguntar por tallas y precios, probarte prendas, pagar y resolver devoluciones o cambios. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([
        ["GRAMMAR",a2Unit14Exercises.grammar],["VOCABULARY",a2Unit14Exercises.vocabulary],
        ["LISTENING",a2Unit14Exercises.listening],["READING",a2Unit14Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}

    {number === 15 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 15 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo preguntar y entender precios, comparar ofertas, pagar en efectivo o con tarjeta y resolver problemas sencillos de pago. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([["GRAMMAR",a2Unit15Exercises.grammar],["VOCABULARY",a2Unit15Exercises.vocabulary],["LISTENING",a2Unit15Exercises.listening],["READING",a2Unit15Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}

    {number === 16 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 16 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica el vocabulario de tiendas y servicios, cómo pedir ayuda, preguntar por horarios y citas, dar indicaciones y resolver necesidades cotidianas. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([["GRAMMAR",a2Unit16Exercises.grammar],["VOCABULARY",a2Unit16Exercises.vocabulary],["LISTENING",a2Unit16Exercises.listening],["READING",a2Unit16Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 17 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 17 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo explicar problemas con una compra, solicitar cambios y reembolsos, utilizar el pasado simple y comprender las políticas de devolución. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([["GRAMMAR",a2Unit17Exercises.grammar],["VOCABULARY",a2Unit17Exercises.vocabulary],["LISTENING",a2Unit17Exercises.listening],["READING",a2Unit17Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 18 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 18 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo hablar de una dieta equilibrada, identificar alimentos y nutrientes, utilizar cuantificadores y dar consejos para mantener hábitos saludables. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([["GRAMMAR",a2Unit18Exercises.grammar],["VOCABULARY",a2Unit18Exercises.vocabulary],["LISTENING",a2Unit18Exercises.listening],["READING",a2Unit18Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 19 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 19 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo comprar alimentos, preguntar por cantidades y precios, utilizar envases y medidas, y comprender conversaciones y textos en un mercado. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit19Exercises.grammar],["VOCABULARY",a2Unit19Exercises.vocabulary],["LISTENING",a2Unit19Exercises.listening],["READING",a2Unit19Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 20 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 20 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Consolida lo aprendido en situaciones reales: comprar alimentos, pedir en un restaurante, comparar productos, elegir ropa y resolver cambios o devoluciones. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit20Exercises.grammar],["VOCABULARY",a2Unit20Exercises.vocabulary],["LISTENING",a2Unit20Exercises.listening],["READING",a2Unit20Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}

    {number === 21 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 21 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo orientarte por una ciudad, pedir indicaciones, utilizar autobuses y trenes, consultar horarios y explicar incidencias sencillas durante un viaje. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit21Exercises.grammar],["VOCABULARY",a2Unit21Exercises.vocabulary],["LISTENING",a2Unit21Exercises.listening],["READING",a2Unit21Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}

    {number === 22 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 22 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo consultar horarios, comprar billetes, entender andenes y conexiones, hablar de planes de viaje y resolver retrasos. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit22Exercises.grammar],["VOCABULARY",a2Unit22Exercises.vocabulary],["LISTENING",a2Unit22Exercises.listening],["READING",a2Unit22Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 24 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 24 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo orientarte en estaciones y aeropuertos, seguir instrucciones, explicar incidencias de viaje y pedir ayuda con educación. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit24Exercises.grammar],["VOCABULARY",a2Unit24Exercises.vocabulary],["LISTENING",a2Unit24Exercises.listening],["READING",a2Unit24Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 23 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 23 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo organizar viajes, reservar alojamiento, facturar vuelos, comprender confirmaciones y modificar planes. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit23Exercises.grammar],["VOCABULARY",a2Unit23Exercises.vocabulary],["LISTENING",a2Unit23Exercises.listening],["READING",a2Unit23Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 25 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 25 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo registrarte en un hotel, pedir servicios, resolver problemas con la habitación y comprender normas y horarios. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit25Exercises.grammar],["VOCABULARY",a2Unit25Exercises.vocabulary],["LISTENING",a2Unit25Exercises.listening],["READING",a2Unit25Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 26 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 26 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo contar vacaciones y experiencias pasadas, describir destinos, actividades y recuerdos, y comprender conversaciones y relatos de viaje. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit26Exercises.grammar],["VOCABULARY",a2Unit26Exercises.vocabulary],["LISTENING",a2Unit26Exercises.listening],["READING",a2Unit26Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 27 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 27 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo explicar retrasos, cancelaciones, equipaje perdido y conexiones; pedir ayuda, comprender avisos y buscar soluciones. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit27Exercises.grammar],["VOCABULARY",a2Unit27Exercises.vocabulary],["LISTENING",a2Unit27Exercises.listening],["READING",a2Unit27Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 28 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 28 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo comparar ciudades, playas, islas y destinos rurales; hablar de precios, clima, transporte, ambiente y actividades para elegir el lugar ideal. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit28Exercises.grammar],["VOCABULARY",a2Unit28Exercises.vocabulary],["LISTENING",a2Unit28Exercises.listening],["READING",a2Unit28Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 29 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 29 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica cómo hablar del tiempo, consultar previsiones y tomar decisiones para un viaje según la lluvia, el viento, la niebla o las temperaturas. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit29Exercises.grammar],["VOCABULARY",a2Unit29Exercises.vocabulary],["LISTENING",a2Unit29Exercises.listening],["READING",a2Unit29Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
    </section>}
    {number === 30 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 30 FINAL PROJECT DRAFT</div><h2>60 interactive exercises</h2>
      <p>Prepara un viaje por tu cuenta: compara opciones, reserva alojamiento y transporte, organiza un itinerario, pide información y resuelve imprevistos. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([["GRAMMAR",a2Unit30Exercises.grammar],["VOCABULARY",a2Unit30Exercises.vocabulary],["LISTENING",a2Unit30Exercises.listening],["READING",a2Unit30Exercises.reading]] as const).map(([heading,activities])=><section key={heading} style={{marginTop:28}}><div className="kicker">{heading} · 15 ACTIVITIES</div><ActivityContent activities={activities} mode="standard"/></section>)}
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