import type { Activity } from "./activity-content";
type Row=[string,string,string,string[],string,string];
const make=(rows:Row[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[4],explanation:r[5],...extra(i)}));
const grammar:Row[]=[
["g1301","Elige la petición educada.","___ a glass of water, please.",["I'd like","I like","I liking"],"I'd like","Would like expresa una petición educada."],
["g1302","Completa la pregunta.","___ you like some dessert?",["Do","Would","Are"],"Would","Would you like...? sirve para ofrecer."],
["g1303","Elige la respuesta natural.","Would you like a coffee?",["Yes, please.","Yes, I like.","Yes, I would like."],"Yes, please.","Yes, please es una respuesta natural."],
["g1304","Completa la petición.","Could I ___ the menu, please?",["have","has","having"],"have","Could I have...? es una petición cortés."],
["g1305","Elige el cuantificador.","Could I have ___ rice, please?",["some","many","a few"],"some","Some se usa en peticiones."],
["g1306","Completa.","How ___ is the chicken sandwich?",["much","many","few"],"much","How much pregunta por el precio."],
["g1307","Completa la pregunta.","How ___ eggs are in the omelette?",["much","many","little"],"many","Eggs es contable plural."],
["g1308","Elige la frase correcta.","",["I'd like a tea, please.","I like a tea, please.","I would liking tea."],"I'd like a tea, please.","Would like + nombre."],
["g1309","Pide que repitan.","Could you ___ that, please?",["repeat","repeats","repeating"],"repeat","Could you va seguido del verbo base."],
["g1310","Pregunta por un ingrediente.","What does this dish ___ with?",["come","comes","coming"],"come","Does va seguido del verbo base."],
["g1311","Completa el consejo.","You ___ try the vegetable soup.",["should","would","are"],"should","Should expresa recomendación."],
["g1312","Elige el comparativo.","The salad is ___ than the burger.",["healthy","healthier","healthiest"],"healthier","Healthy cambia -y por -ier."],
["g1313","Completa.","This café is ___ expensive than that one.",["more","most","much"],"more","Los adjetivos largos usan more."],
["g1314","Elige la petición.","___ I have the bill, please?",["Could","Do","Am"],"Could","Could I have...? es cortés."],
["g1315","Completa la respuesta.","No, thank you. I'm ___, thanks.",["fine","like","would"],"fine","I'm fine, thanks rechaza un ofrecimiento."]
];
const vocabulary:Row[]=[
["v1301","¿Qué significa menu?","menu",["carta / menú","cuenta","camarero"],"carta / menú","Menu es la carta."],
["v1302","Traduce bill.","bill",["cuenta","plato","reserva"],"cuenta","Bill es la cuenta."],
["v1303","¿Qué significa starter?","starter",["entrante","plato principal","postre"],"entrante","Starter es el entrante."],
["v1304","Traduce main course.","main course",["plato principal","guarnición","bebida"],"plato principal","Main course es el plato principal."],
["v1305","¿Qué significa side dish?","side dish",["guarnición","postre","aperitivo"],"guarnición","Side dish acompaña al plato principal."],
["v1306","Traduce tap water.","tap water",["agua del grifo","agua con gas","zumo natural"],"agua del grifo","Tap water es agua del grifo."],
["v1307","¿Qué significa sparkling water?","sparkling water",["agua con gas","agua del grifo","agua fría"],"agua con gas","Sparkling water es agua con gas."],
["v1308","Traduce waiter.","waiter",["camarero","cocinero","cliente"],"camarero","Waiter es camarero."],
["v1309","¿Qué significa bill, please?","bill, please",["la cuenta, por favor","la carta, por favor","una mesa, por favor"],"la cuenta, por favor","Se utiliza para pedir la cuenta."],
["v1310","Traduce well-done.","well-done",["muy hecho","poco hecho","sin sal"],"muy hecho","Well-done describe carne muy hecha."],
["v1311","¿Qué significa dairy-free?","dairy-free",["sin lácteos","sin gluten","bajo en grasa"],"sin lácteos","Dairy-free significa sin lácteos."],
["v1312","Traduce spicy.","spicy",["picante","dulce","amargo"],"picante","Spicy significa picante."],
["v1313","¿Qué significa portion?","portion",["ración","receta","precio"],"ración","Portion es una ración."],
["v1314","Traduce booking.","booking",["reserva","descuento","pedido"],"reserva","Booking es reserva."],
["v1315","¿Qué significa service charge?","service charge",["cargo por servicio","propina incluida siempre","precio del menú"],"cargo por servicio","Service charge es el cargo por servicio."]
];
const listening:Row[]=[
["l1301","¿Qué mesa pide la pareja?","",["Una mesa para dos","Una mesa para cuatro","Una mesa para seis"],"Una mesa para dos","They ask for a table for two."],
["l1302","¿Qué bebida pide la mujer?","",["Agua con gas","Té","Zumo de naranja"],"Agua con gas","She orders sparkling water."],
["l1303","¿Qué plato elige el hombre?","",["Pollo a la parrilla","Pasta","Pescado"],"Pollo a la parrilla","He chooses grilled chicken."],
["l1304","¿Qué pregunta sobre el plato?","",["Si lleva frutos secos","Si es picante","Si incluye postre"],"Si lleva frutos secos","He asks about nuts."],
["l1305","¿Qué pide para empezar?","",["Una ensalada","Una sopa","Pan de ajo"],"Una ensalada","They order a salad to start."],
["l1306","¿Qué quiere beber el cliente?","",["Un café","Un té","Un refresco"],"Un café","He asks for a coffee."],
["l1307","¿Qué tipo de leche solicita?","",["Leche de avena","Leche entera","Leche sin lactosa"],"Leche de avena","He asks for oat milk."],
["l1308","¿Qué tamaño pide?","",["Pequeño","Mediano","Grande"],"Pequeño","He orders a small coffee."],
["l1309","¿Cómo paga?","",["Con tarjeta","En efectivo","Con el móvil"],"Con tarjeta","She pays by card."],
["l1310","¿Qué pide al final?","",["El recibo","La carta","Otra bebida"],"El recibo","He asks for a receipt."],
["l1311","¿Qué problema tiene el plato?","",["Está frío","Está demasiado salado","No es el pedido correcto"],"Está frío","The customer says the food is cold."],
["l1312","¿Qué hace el camarero?","",["Se disculpa y ofrece cambiarlo","Pide el pago","Ignora al cliente"],"Se disculpa y ofrece cambiarlo","The waiter apologises and offers a replacement."],
["l1313","¿Qué quiere el cliente?","",["Que calienten el plato","Un postre gratis","Una mesa nueva"],"Que calienten el plato","He asks them to heat the meal."],
["l1314","¿Qué bebida ofrece el camarero?","",["Agua","Café","Té"],"Agua","The waiter offers water."],
["l1315","¿Cómo termina la conversación?","",["El cliente da las gracias","El cliente se marcha enfadado","El camarero trae la cuenta"],"El cliente da las gracias","The customer thanks the waiter."]
];
const reading:Row[]=[
["r1301","¿Qué conviene hacer antes de pedir?","",["Leer la carta","Pagar la cuenta","Elegir la propina"],"Leer la carta","Read the menu before ordering."],
["r1302","¿Qué expresión sirve para pedir educadamente?","",["I'd like...","I want now...","Give me..."],"I'd like...","I'd like is polite."],
["r1303","¿Qué se debe preguntar si hay una alergia?","",["Por los ingredientes","Por el precio del café","Por el horario"],"Por los ingredientes","Ask about ingredients and allergens."],
["r1304","¿Qué significa side dish?","",["Guarnición","Entrante","Postre"],"Guarnición","A side dish comes with the main course."],
["r1305","¿Qué se pide al terminar?","",["La cuenta","La reserva","La carta"],"La cuenta","Ask for the bill."],
["r1306","¿Qué busca Tom en la cafetería?","",["Un desayuno","Una cena","Un helado"],"Un desayuno","Tom wants breakfast."],
["r1307","¿Qué bebida pide?","",["Té con leche","Café solo","Agua con gas"],"Té con leche","He orders tea with milk."],
["r1308","¿Qué comida elige?","",["Tostada con huevos","Tarta de manzana","Sopa de verduras"],"Tostada con huevos","He chooses toast and eggs."],
["r1309","¿Qué pregunta sobre el pan?","",["Si es integral","Si está caliente","Si tiene mantequilla"],"Si es integral","He asks for wholemeal bread."],
["r1310","¿Cómo paga?","",["Con tarjeta","En efectivo","Con monedas"],"Con tarjeta","He pays by card."],
["r1311","¿Qué problema encuentra Ana?","",["El pedido incluye queso","La cuenta es demasiado baja","No hay mesa"],"El pedido incluye queso","Her dish arrives with cheese."],
["r1312","¿Por qué es un problema?","",["No puede comer lácteos","No le gusta el tomate","Está demasiado frío"],"No puede comer lácteos","She cannot eat dairy products."],
["r1313","¿Qué hace el restaurante?","",["Prepara otro plato","Le cobra dos veces","Cierra la cocina"],"Prepara otro plato","They prepare a new dairy-free meal."],
["r1314","¿Qué comprueba Ana antes de comer?","",["Que no tenga lácteos","Que tenga más sal","Que esté frío"],"Que no tenga lácteos","She checks the ingredients."],
["r1315","¿Qué enseña el texto?","",["Cómo explicar un problema con educación","Cómo cocinar una tarta","Cómo reservar un hotel"],"Cómo explicar un problema con educación","The story models polite problem-solving."]
];
const dialogues=[
"A: Good evening. A table for two, please. B: Certainly. Here are the menus. A: I'd like a salad to start. B: And for your main course? A: Grilled chicken, please. B: Would you like still or sparkling water? A: Sparkling, please. B: Does anyone have allergies? A: Could you tell me if the chicken contains nuts? B: I'll check with the kitchen.",
"A: Hello. What can I get you? B: I'd like a small coffee, please. A: Would you like milk? B: Oat milk, please. A: Anything to eat? B: A slice of toast with eggs. Is the bread wholemeal? A: Yes, it is. B: Great. Can I pay by card? A: Of course.",
"A: Excuse me, I'm afraid this dish is cold. B: I'm very sorry. Would you like me to heat it or bring another one? A: Could you bring another one, please? I can't eat dairy, so could you check that it has no cheese? B: Certainly. I'll speak to the kitchen. A: Thank you very much."
];
const passages=[
"ORDERING AT A RESTAURANT\nWhen you eat out, look at the menu and choose a starter, a main course and perhaps a dessert. Use polite expressions such as I'd like the fish, please, or Could I have some water? Ask the waiter about ingredients if you have an allergy. You can ask What does this dish come with? to learn about side dishes. At the end of the meal, say Could we have the bill, please? If you do not understand, ask the waiter to repeat or explain.",
"TOM'S BREAKFAST\nTom stops at a café before work. He reads the menu and orders tea with milk and toast with eggs. He asks if the bread is wholemeal, and the waiter says yes. Tom also asks for some tomato on the side. The café is busy, but the waiter is friendly and repeats the order to check it. Tom pays by card and takes his receipt. He is happy because the breakfast is quick and cheaper than the one near his office.",
"ANA'S FOOD ALLERGY\nAna orders a vegetable dish at a restaurant and tells the waiter that she cannot eat dairy products. When the meal arrives, she notices cheese on top. She politely explains the problem: Excuse me, I asked for a dairy-free dish. The waiter apologises and takes the meal back to the kitchen. He checks the ingredients with the chef and brings a new dish without cheese or butter. Ana thanks him for helping and enjoys her dinner."
];
export const a2Unit13Exercises={grammar:make(grammar),vocabulary:make(vocabulary),listening:make(listening,i=>i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{}),reading:make(reading,i=>i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{})} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
