import type { Activity } from "./activity-content";
type R=[string,string,string,string[],string,string];
const mc=(r:R,extra:Partial<Activity>={}):Activity=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,i)=>({id:String.fromCharCode(65+i),text})),correct_answer:r[4],explanation:r[5],...extra});
const G:R[]=[
["g601","Elige la forma correcta.","There isn't ___ milk in the fridge.",["some","any","many"],"any","En negativas usamos any con nombres incontables."],
["g602","Completa la pregunta.","How ___ apples do we need?",["much","many","any"],"many","Many acompaña a sustantivos contables en plural."],
["g603","Elige la opción correcta.","I'd like ___ water, please.",["a","some","many"],"some","Some se usa en peticiones y ofertas."],
["g604","Completa la frase.","There is ___ orange on the table.",["a","an","some"],"an","Orange empieza por sonido vocálico: an orange."],
["g605","Elige much o many.","How ___ sugar do you want?",["much","many","few"],"much","Sugar es incontable; usamos much."],
["g606","Selecciona la frase correcta.","",["There are much eggs.","There is some cheese.","There is many bread."],"There is some cheese.","Cheese es incontable y concuerda con is."],
["g607","Completa la frase.","We haven't got ___ bananas.",["some","any","much"],"any","Any se usa en frases negativas."],
["g608","Elige la forma correcta.","I'd like ___ sandwich and a cup of tea.",["a","an","some"],"a","Sandwich es contable singular y empieza por consonante."],
["g609","Completa con a few o a little.","There are ___ tomatoes in the salad.",["a little","a few","much"],"a few","Tomatoes es contable plural."],
["g610","Completa con a few o a little.","Add ___ olive oil to the pan.",["a few","a little","many"],"a little","Oil es incontable."],
["g611","Elige la pregunta correcta.","",["How much eggs are there?","How many eggs are there?","How many milk is there?"],"How many eggs are there?","How many se usa con nombres contables plurales."],
["g612","Selecciona la frase correcta.","",["I don't eat much meat.","I don't eat many meat.","I don't eat a meat."],"I don't eat much meat.","Meat es incontable."],
["g613","Completa la frase.","Would you like ___ coffee?",["any","some","many"],"some","Some es natural en ofrecimientos."],
["g614","Elige la opción correcta.","There ___ two bottles of water on the table.",["is","are","be"],"are","El sujeto plural two bottles requiere are."],
["g615","Completa la frase.","We need ___ bread, but we don't need ___ eggs.",["some / any","any / some","many / much"],"some / any","Some en afirmativa y any en negativa."]
];
const V:R[]=[
["v601","¿Qué significa ingredients?","ingredients",["ingredientes","instrucciones","cubiertos"],"ingredientes","Ingredients son los ingredientes de una receta."],
["v602","Traduce a frying pan.","a frying pan",["una olla","una sartén","una bandeja"],"una sartén","A frying pan es una sartén."],
["v603","¿Qué significa boil?","boil",["freír","hervir","cortar"],"hervir","Boil significa hervir."],
["v604","Completa la expresión.","___ the vegetables into small pieces.",["Chop","Bake","Pour"],"Chop","Chop significa cortar en trozos."],
["v605","¿Qué significa dairy products?","dairy products",["productos lácteos","frutos secos","bebidas calientes"],"productos lácteos","Dairy products incluye leche, queso y yogur."],
["v606","Traduce seafood.","seafood",["carne roja","marisco y pescado","verduras"],"marisco y pescado","Seafood se refiere al pescado y marisco."],
["v607","¿Qué significa spicy?","spicy",["dulce","picante","salado"],"picante","Spicy describe comida con especias o picante."],
["v608","Elige el verbo adecuado.","___ a cake in the oven.",["Bake","Boil","Fry"],"Bake","Bake es cocinar al horno."],
["v609","¿Qué significa menu?","menu",["menú o carta","receta","factura"],"menú o carta","Menu es la carta de un restaurante."],
["v610","Traduce bill en un restaurante.","the bill",["la mesa","la cuenta","la propina"],"la cuenta","The bill es la cuenta."],
["v611","¿Qué significa starter?","starter",["postre","plato principal","entrante"],"entrante","Starter es el primer plato o entrante."],
["v612","Completa la colocación.","I'd like to ___ a table for two.",["book","cook","order"],"book","Book a table significa reservar una mesa."],
["v613","¿Qué significa homemade?","homemade",["casero","congelado","picante"],"casero","Homemade significa hecho en casa."],
["v614","Traduce takeaway.","takeaway",["comida para llevar","comida gratis","desayuno"],"comida para llevar","Takeaway es comida preparada para llevar."],
["v615","¿Qué significa delicious?","delicious",["amargo","delicioso","crudo"],"delicioso","Delicious significa muy rico o delicioso."]
];
const L:R[]=[
["l601","¿Qué pide la clienta para empezar?","",["Una sopa de tomate","Una ensalada","Pan con queso"],"Una sopa de tomate","Pide tomato soup as a starter."],
["l602","¿Qué elige como plato principal?","",["Pescado","Pollo","Pasta"],"Pescado","Su plato principal es grilled fish."],
["l603","¿Qué bebida pide?","",["Agua con gas","Zumo de naranja","Té"],"Agua con gas","Pide sparkling water."],
["l604","¿Qué ingrediente no quiere?","",["Cebolla","Queso","Tomate"],"Cebolla","Pide que no pongan onion."],
["l605","¿Qué pide de postre?","",["Helado","Tarta de manzana","Fruta"],"Tarta de manzana","Elige apple pie."],
["l606","¿Qué prepara Leo para cenar?","",["Pasta con verduras","Arroz con pollo","Sopa"],"Pasta con verduras","Leo prepara pasta with vegetables."],
["l607","¿Qué ingrediente añade al agua?","",["Limón","Azúcar","Sal"],"Limón","Añade lemon al agua."],
["l608","¿Cuánto tiempo hierve la pasta?","",["Ocho minutos","Diez minutos","Quince minutos"],"Diez minutos","La pasta hierve for ten minutes."],
["l609","¿Qué añade al final?","",["Queso","Nata","Pimienta"],"Queso","Añade un poco de cheese al final."],
["l610","¿Para cuántas personas cocina?","",["Una","Dos","Cuatro"],"Dos","La receta es para two people."],
["l611","¿A qué hora es la reserva?","",["A las siete","A las ocho","A las nueve"],"A las ocho","La reserva está hecha para eight o'clock."],
["l612","¿Cuántas personas son?","",["Dos","Tres","Cuatro"],"Cuatro","La reserva es para four people."],
["l613","¿Dónde quiere sentarse el grupo?","",["En la terraza","Cerca de la ventana","Fuera del restaurante"],"Cerca de la ventana","Piden a table near the window."],
["l614","¿Qué opción necesita una persona?","",["Sin gluten","Vegetariana","Sin lactosa"],"Vegetariana","Una persona asks for a vegetarian option."],
["l615","¿Cómo van a pagar?","",["En efectivo","Con tarjeta","Por separado"],"Con tarjeta","Deciden pagar by card."]
];
const R:R[]=[
["r601","¿Qué ingredientes usa Mia para la ensalada?","",["Tomate, pepino y queso","Patata, cebolla y pollo","Arroz, pescado y limón"],"Tomate, pepino y queso","La receta incluye tomatoes, cucumber and cheese."],
["r602","¿Qué hace primero?","",["Lava las verduras","Enciende el horno","Hierve el arroz"],"Lava las verduras","Primero washes the vegetables."],
["r603","¿Qué añade al aliño?","",["Aceite y limón","Leche y azúcar","Mantequilla y sal"],"Aceite y limón","El aliño lleva olive oil and lemon juice."],
["r604","¿Cuánto tarda en preparar la ensalada?","",["Diez minutos","Veinte minutos","Treinta minutos"],"Diez minutos","La receta tarda about ten minutes."],
["r605","¿Para qué ocasión prepara Mia la ensalada?","",["Un picnic","Una fiesta de cumpleaños","Una cena de Navidad"],"Un picnic","She makes it for a picnic."],
["r606","¿Qué recomienda el texto para un desayuno saludable?","",["Fruta y yogur","Patatas fritas","Pastel y refresco"],"Fruta y yogur","Fruit and yoghurt are suggested."],
["r607","¿Por qué es importante desayunar?","",["Da energía por la mañana","Ayuda a dormir","Sustituye la cena"],"Da energía por la mañana","Breakfast gives you energy for the morning."],
["r608","¿Qué bebida propone el artículo?","",["Agua","Bebida energética","Refresco"],"Agua","The article recommends drinking water."],
["r609","¿Qué debería limitarse?","",["El azúcar","La fruta","El agua"],"El azúcar","It suggests limiting sugary food."],
["r610","¿Qué consejo da sobre las porciones?","",["No comer demasiado","Saltarse el desayuno","Comer muy deprisa"],"No comer demasiado","It recommends sensible portions."],
["r611","¿Qué tipo de restaurante visita Tom?","",["Uno italiano","Uno japonés","Uno mexicano"],"Uno italiano","Tom visits a small Italian restaurant."],
["r612","¿Qué pide su amiga?","",["Una pizza vegetariana","Un filete","Una sopa de pescado"],"Una pizza vegetariana","His friend orders a vegetarian pizza."],
["r613","¿Qué problema tiene el primer plato?","",["Tiene frutos secos","Está frío","Es demasiado picante"],"Tiene frutos secos","The dish contains nuts, so she asks the waiter."],
["r614","¿Qué hace el camarero?","",["Comprueba los ingredientes","Cambia la mesa","Trae otra bebida"],"Comprueba los ingredientes","The waiter checks the ingredients with the chef."],
["r615","¿Cómo describen la comida?","",["Deliciosa y fresca","Cara y fría","Demasiado salada"],"Deliciosa y fresca","They say the food is delicious and fresh."]
];
const dialogues=[
"Waiter: Good evening. Are you ready to order? Customer: Yes, please. I'd like tomato soup to start and grilled fish for my main course. Waiter: Would you like anything to drink? Customer: Sparkling water, please. And could you make sure there is no onion in the soup? Waiter: Of course. Would you like a dessert? Customer: Apple pie, please.",
"Leo: What are you cooking tonight? Ana: Pasta with vegetables. First, chop the onions and tomatoes. Then boil the pasta for ten minutes. Leo: Do we have any cheese? Ana: Yes, there's some in the fridge. I'll add a little at the end. Leo: Great. How many people are we cooking for? Ana: Just the two of us.",
"Customer: Hello. I'd like to book a table for four at eight o'clock. Restaurant: Certainly. Would you prefer inside or outside? Customer: A table near the window, please. One person is vegetarian. Restaurant: No problem. We have several vegetarian dishes. Customer: Excellent. Can we pay by card? Restaurant: Of course."
];
const passages=[
"A SIMPLE SUMMER SALAD\nMia loves making quick meals at home. Her favourite summer salad is easy to prepare. First, she washes some tomatoes and a cucumber. Then she cuts them into small pieces and adds some cheese. For the dressing, she mixes olive oil, lemon juice and a little salt. The salad takes about ten minutes and is perfect for a picnic. Mia sometimes adds olives, but she never uses mayonnaise.",
"HOW TO EAT WELL\nA healthy diet does not need to be complicated. Try to eat different kinds of food every day. Fruit and vegetables provide important vitamins, while bread, rice and pasta give you energy. Milk, yoghurt and cheese are useful dairy products. Drink plenty of water and do not eat too much sugar. It is also a good idea to have breakfast because it helps you start the day. Remember to choose sensible portions and enjoy your meals.",
"AN EVENING AT THE RESTAURANT\nTom and his friends visit a small Italian restaurant on Friday evening. Tom orders vegetable soup, and his friend Ella chooses a vegetarian pizza. Ella has a food allergy, so she asks the waiter about the ingredients. The waiter checks with the chef and explains that one dish contains nuts. Ella chooses another meal. Everyone enjoys the fresh food, and they ask for the bill at the end. They decide to come back next month."
];
export const a2Unit6Exercises={
 grammar:G.map(x=>mc(x)),
 vocabulary:V.map(x=>mc(x)),
 listening:L.map((x,i)=>mc(x,i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{})),
 reading:R.map((x,i)=>mc(x,i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{}))
} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
