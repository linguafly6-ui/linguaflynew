import type { Activity } from "./activity-content";
type Row=[string,string,string,string[],string,string];
const make=(rows:Row[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[4],explanation:r[5],...extra(i)}));
const grammar:Row[]=[
["g1201","Elige el cuantificador.","We need ___ flour.",["many","some","a few"],"some","Flour es incontable."],
["g1202","Completa la pregunta.","How ___ eggs do we need?",["much","many","little"],"many","Eggs es contable plural."],
["g1203","Completa la pregunta.","How ___ water should I add?",["many","much","few"],"much","Water es incontable."],
["g1204","Elige el imperativo.","___ the carrots.",["Chop","Chops","Chopping"],"Chop","El imperativo usa el verbo base."],
["g1205","Completa la instrucción.","___ the oven to 180 degrees.",["Preheat","Preheats","Preheating"],"Preheat","Las instrucciones usan el imperativo."],
["g1206","Completa.","Add ___ onion.",["a","an","some"],"an","Onion comienza con sonido vocálico."],
["g1207","Elige la frase correcta.","",["Mix the eggs with milk.","Mixes the eggs.","Mixing the eggs."],"Mix the eggs with milk.","El imperativo no lleva -s."],
["g1208","Ordena el paso.","First wash the rice. ___, put it in a pan.",["Then","Because","But"],"Then","Then introduce el siguiente paso."],
["g1209","Elige el consejo.","You ___ wash your hands before cooking.",["should","would","are"],"should","Should expresa consejo."],
["g1210","Completa.","You shouldn't ___ the soup for too long.",["boiling","boils","boil"],"boil","Shouldn't va seguido del verbo base."],
["g1211","Elige el comparativo.","This recipe is ___ than the old one.",["easy","easier","easiest"],"easier","Easy cambia -y por -ier."],
["g1212","Completa.","Fresh herbs are ___ than dried herbs.",["more fragrant","most fragrant","fragrant"],"more fragrant","Los adjetivos largos usan more."],
["g1213","Elige el cuantificador.","There isn't ___ oil left.",["many","much","a few"],"much","Oil es incontable."],
["g1214","Completa.","Add ___ potatoes.",["a little","a few","much"],"a few","Potatoes es contable plural."],
["g1215","Selecciona la instrucción.","",["Stir the sauce slowly.","Stirs the sauce.","Stirring the sauce."],"Stir the sauce slowly.","Imperativo: verbo base."]
];
const vocabulary:Row[]=[
["v1201","¿Qué significa saucepan?","saucepan",["cacerola","horno","cuchillo"],"cacerola","Saucepan es una cacerola."],
["v1202","Traduce chopping board.","chopping board",["tabla de cortar","abrelatas","bandeja"],"tabla de cortar","Chopping board es tabla de cortar."],
["v1203","¿Qué significa whisk?","whisk",["batidor","rallador","cucharón"],"batidor","Whisk es un batidor."],
["v1204","Traduce flour.","flour",["harina","azúcar","sal"],"harina","Flour significa harina."],
["v1205","¿Qué significa boil?","boil",["hervir","freír","hornear"],"hervir","Boil significa hervir."],
["v1206","Traduce bake.","bake",["hornear","cortar","mezclar"],"hornear","Bake significa hornear."],
["v1207","¿Qué significa stir?","stir",["remover","pelar","pesar"],"remover","Stir significa remover."],
["v1208","Traduce a pinch of salt.","a pinch of salt",["una pizca de sal","una cucharada de azúcar","un vaso de agua"],"una pizca de sal","A pinch es una pizca."],
["v1209","¿Qué significa tablespoon?","tablespoon",["cucharada","cucharadita","taza"],"cucharada","Tablespoon es una cucharada."],
["v1210","Traduce teaspoon.","teaspoon",["cucharadita","cuchillo","plato"],"cucharadita","Teaspoon es cucharadita."],
["v1211","¿Qué significa ingredients?","ingredients",["ingredientes","instrucciones","utensilios"],"ingredientes","Ingredients son ingredientes."],
["v1212","Traduce recipe.","recipe",["receta","recibo","menú"],"receta","Recipe significa receta."],
["v1213","¿Qué significa slice?","slice",["rodaja","paquete","botella"],"rodaja","Slice es una rodaja."],
["v1214","Traduce oven.","oven",["horno","nevera","fregadero"],"horno","Oven significa horno."],
["v1215","¿Qué significa leftovers?","leftovers",["sobras","ingredientes","platos"],"sobras","Leftovers son las sobras."]
];
const listening:Row[]=[
["l1201","¿Qué prepara Maya?","",["Una tarta de manzana","Una sopa","Una ensalada"],"Una tarta de manzana","She is making an apple cake."],
["l1202","¿Cuántas manzanas necesita?","",["Dos","Cuatro","Seis"],"Dos","She needs two apples."],
["l1203","¿Cuánta harina utiliza?","",["200 gramos","100 gramos","500 gramos"],"200 gramos","The recipe needs 200 grams of flour."],
["l1204","¿A qué temperatura calienta el horno?","",["180 grados","160 grados","200 grados"],"180 grados","Preheat the oven to 180 degrees."],
["l1205","¿Cuánto tiempo debe hornearse?","",["30 minutos","10 minutos","Una hora"],"30 minutos","Bake for thirty minutes."],
["l1206","¿Qué hace primero Alex?","",["Se lava las manos","Enciende la televisión","Sirve la comida"],"Se lava las manos","He washes his hands first."],
["l1207","¿Qué corta después?","",["Cebolla y zanahorias","Pan y queso","Manzanas"],"Cebolla y zanahorias","He chops the onion and carrots."],
["l1208","¿Cuánto tiempo fríe las verduras?","",["Cinco minutos","Quince minutos","Veinte minutos"],"Cinco minutos","He cooks them for five minutes."],
["l1209","¿Cuánto caldo añade?","",["Un litro","Dos litros","Medio litro"],"Un litro","He pours in one litre of stock."],
["l1210","¿Qué hace al final?","",["Remueve y deja hervir","Añade azúcar","Apaga el fuego"],"Remueve y deja hervir","Stir and simmer the soup."],
["l1211","¿Qué quiere el cliente?","",["Pasta con verduras","Pollo asado","Una tortilla"],"Pasta con verduras","The customer orders vegetable pasta."],
["l1212","¿Qué ingrediente no quiere?","",["Chile","Tomate","Ajo"],"Chile","He asks for no chilli."],
["l1213","¿Qué salsa elige?","",["Tomate","Queso","Picante"],"Tomate","He chooses tomato sauce."],
["l1214","¿Qué consejo recibe?","",["Probar antes de añadir sal","Añadir azúcar","Cocinar una hora"],"Probar antes de añadir sal","Taste before adding salt."],
["l1215","¿Qué pide para beber?","",["Agua","Té","Zumo"],"Agua","He asks for water."]
];
const reading:Row[]=[
["r1201","¿Qué se hace antes de cocinar?","",["Leer la receta y preparar ingredientes","Encender la televisión","Servir la comida"],"Leer la receta y preparar ingredientes","Read the whole recipe first."],
["r1202","¿Por qué medir ingredientes?","",["Para usar cantidades correctas","Para cocinar siempre más rápido","Para evitar lavar"],"Para usar cantidades correctas","Measurements help follow the recipe."],
["r1203","¿Qué significa preheat the oven?","",["Precalentar el horno","Apagar el horno","Limpiar el horno"],"Precalentar el horno","Preheat means heat before cooking."],
["r1204","¿Qué se recomienda hacer con las manos?","",["Lavarlas antes de cocinar","Secarlas con harina","No mojarlas"],"Lavarlas antes de cocinar","Wash hands before handling food."],
["r1205","¿Qué palabras ordenan pasos?","",["First, next, finally","Yesterday, tomorrow","Because, although"],"First, next, finally","Sequencing words show the order."],
["r1206","¿Qué añade Ben primero a la sartén?","",["Aceite y cebolla","Leche y harina","Azúcar y manzana"],"Aceite y cebolla","He heats oil and cooks onion first."],
["r1207","¿Cuánto cocina la cebolla?","",["Cuatro minutos","Doce minutos","Treinta minutos"],"Cuatro minutos","Cook the onion for four minutes."],
["r1208","¿Qué añade después?","",["Ajo y tomates","Chocolate y leche","Arroz y yogur"],"Ajo y tomates","Garlic and tomatoes go in next."],
["r1209","¿Cuándo añade la pasta?","",["Cuando hierve el agua","Antes de llenar la olla","Después de servir"],"Cuando hierve el agua","Add pasta when water boils."],
["r1210","¿Qué hace antes de servir?","",["Prueba y ajusta el sabor","Añade harina cruda","Lava con jabón"],"Prueba y ajusta el sabor","Taste and adjust the seasoning."],
["r1211","¿Qué postre prepara Ella?","",["Ensalada de frutas","Pastel de chocolate","Sopa"],"Ensalada de frutas","Ella prepares a fruit salad."],
["r1212","¿Qué fruta utiliza?","",["Fresas, plátano y naranja","Patatas y cebolla","Limón y ajo"],"Fresas, plátano y naranja","She uses strawberries, banana and orange."],
["r1213","¿Qué añade para dar sabor?","",["Zumo de naranja","Una taza de sal","Aceite caliente"],"Zumo de naranja","She adds a little orange juice."],
["r1214","¿Cuánto enfría la ensalada?","",["Veinte minutos","Dos horas","Cinco segundos"],"Veinte minutos","Chill it for twenty minutes."],
["r1215","¿Cuál es la idea principal?","",["Seguir pasos sencillos para cocinar","Comprar comida preparada","No comer fruta"],"Seguir pasos sencillos para cocinar","The text describes a simple recipe."]
];
const dialogues=[
"A: What are you making? B: An apple cake. First, preheat the oven to 180 degrees. A: How many apples do we need? B: Two apples and 200 grams of flour. A: Should I peel them? B: Yes, peel and slice the apples. Then mix everything and bake for thirty minutes.",
"A: Can you help with dinner? B: Wash your hands and chop the onion and carrots. A: How much oil should I use? B: One tablespoon. Fry the vegetables for five minutes, then add a litre of stock. A: Should I add salt? B: A little, but taste it first.",
"A: I'd like the vegetable pasta, please. B: Tomato or cheese sauce? A: Tomato, please, but no chilli. B: No problem. The pasta takes ten minutes. A: Should I add parmesan? B: Yes, if you like. Try it before adding extra salt."
];
const passages=[
"BEFORE YOU START\nRead the whole recipe before you begin. Check that you have all the ingredients and equipment. Wash your hands and clean the work surface. Measure quantities carefully. Words such as first, next, then and finally help you follow each step in order. If the recipe says preheat the oven, turn it on before preparing the food.",
"BEN'S TOMATO PASTA\nBen is making a quick tomato pasta. First, he boils a large pan of water. He adds a tablespoon of oil to a frying pan and cooks one chopped onion for four minutes. Next, he adds garlic and fresh tomatoes. When the water boils, he adds the pasta and cooks it for ten minutes. Finally, he mixes the pasta with the sauce and tastes it before serving.",
"ELLA'S FRUIT SALAD\nElla washes strawberries, one banana and an orange. She cuts the fruit into small pieces and puts everything in a bowl. She adds a little orange juice and mixes it gently. She doesn't add sugar because the fruit is already sweet. Finally, she puts the bowl in the fridge for twenty minutes."
];
export const a2Unit12Exercises={grammar:make(grammar),vocabulary:make(vocabulary),listening:make(listening,i=>i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{}),reading:make(reading,i=>i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{})} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
