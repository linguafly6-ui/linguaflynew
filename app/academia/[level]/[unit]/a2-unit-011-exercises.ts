import type { Activity } from "./activity-content";
type R=[string,string,string,string[],string,string];
const make=(rows:R[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[4],explanation:r[5],...extra(i)}));
const G:R[]=[
["g1101","Elige el cuantificador correcto.","There are ___ apples in the bowl.",["much","a few","any"],"a few","A few se usa con sustantivos contables en plural."],
["g1102","Completa.","We haven't got ___ milk.",["some","any","many"],"any","Any es habitual en negativas."],
["g1103","Elige la opción correcta.","How ___ rice do we need?",["many","much","a few"],"much","Rice es incontable; usamos how much."],
["g1104","Completa.","I'd like ___ orange juice, please.",["some","any","many"],"some","Some se usa en ofrecimientos y peticiones."],
["g1105","Elige la frase correcta.","",["There are much eggs.","There is some cheese.","There are a little bread."],"There is some cheese.","Cheese es incontable; usamos there is."],
["g1106","Completa la petición.","I ___ like a chicken sandwich, please.",["would","will","am"],"would","La fórmula educada es would like."],
["g1107","Elige la respuesta adecuada.","Would you like some tea?",["Yes, please.","Yes, I like.","Yes, I would like."],"Yes, please.","Una respuesta natural es Yes, please."],
["g1108","Completa la instrucción.","___ the onions for five minutes.",["Fry","Frying","Fried"],"Fry","El imperativo usa el verbo base."],
["g1109","Elige el consejo correcto.","You ___ eat more vegetables.",["should","would","are"],"should","Should expresa consejo."],
["g1110","Completa.","You shouldn't ___ too much salt.",["eating","eat","ate"],"eat","Shouldn't va seguido del verbo base."],
["g1111","Elige el comparativo correcto.","This soup is ___ than that one.",["more hot","hotter","hottest"],"hotter","Hot forma el comparativo hotter."],
["g1112","Completa.","Fresh fruit is usually ___ than sweets.",["healthy","healthier","healthiest"],"healthier","Healthy cambia -y por -ier."],
["g1113","Elige la opción correcta.","There is ___ bread left.",["a few","a little","many"],"a little","A little acompaña a incontables."],
["g1114","Completa la pregunta.","How ___ tomatoes do we need?",["much","many","little"],"many","Tomatoes es contable plural."],
["g1115","Selecciona la frase correcta.","",["Would you like a coffee?","Do you like a coffee?","You would like coffee?"],"Would you like a coffee?","Would you like...? sirve para ofrecer o pedir."]
];
const V:R[]=[
["v1101","¿Qué significa ingredients?","ingredients",["ingredientes","cubiertos","recetas"],"ingredientes","Ingredients significa ingredientes."],
["v1102","Traduce wholemeal bread.","wholemeal bread",["pan integral","pan blanco","pan rallado"],"pan integral","Wholemeal bread es pan integral."],
["v1103","¿Qué significa dairy products?","dairy products",["productos lácteos","frutos secos","verduras"],"productos lácteos","Dairy products son productos lácteos."],
["v1104","Traduce receipt.","receipt",["recibo","receta","descuento"],"recibo","Receipt es el recibo de compra."],
["v1105","¿Qué significa aisle?","aisle",["pasillo","caja","estante"],"pasillo","Aisle es un pasillo de tienda."],
["v1106","Traduce tin of beans.","tin of beans",["lata de judías","bolsa de arroz","botella de leche"],"lata de judías","Tin es una lata."],
["v1107","¿Qué significa low-fat?","low-fat",["bajo en grasa","sin azúcar","integral"],"bajo en grasa","Low-fat significa bajo en grasa."],
["v1108","Traduce change.","change",["cambio","tarjeta","precio"],"cambio","Change es el dinero que te devuelven."],
["v1109","¿Qué significa weighed?","weighed",["pesado","cortado","cocinado"],"pesado","Weighed significa pesado."],
["v1110","Completa.","Can I pay by ___?",["card","receipt","aisle"],"card","Pay by card es pagar con tarjeta."],
["v1111","¿Qué significa side dish?","side dish",["guarnición","plato principal","postre"],"guarnición","Side dish acompaña al plato principal."],
["v1112","Traduce takeaway.","takeaway",["comida para llevar","comida casera","desayuno"],"comida para llevar","Takeaway es comida para llevar."],
["v1113","¿Qué significa spicy?","spicy",["picante","dulce","salado"],"picante","Spicy significa picante."],
["v1114","Completa.","The ___ is at the end of the supermarket.",["checkout","ingredient","menu"],"checkout","Checkout es la caja para pagar."],
["v1115","¿Qué significa portion?","portion",["ración","oferta","ingrediente"],"ración","Portion es una ración."]
];
const L:R[]=[
["l1101","¿Qué quiere comprar la clienta?","",["Verduras y arroz","Pan y queso","Pescado y patatas"],"Verduras y arroz","She asks for vegetables and rice."],
["l1102","¿Cuántos tomates necesita?","",["Seis","Tres","Ocho"],"Seis","She needs six tomatoes."],
["l1103","¿Qué tipo de arroz elige?","",["Integral","Blanco","Basmati"],"Integral","She chooses wholemeal/brown rice."],
["l1104","¿Cuánto cuesta el arroz?","",["Dos libras","Una libra","Tres libras"],"Dos libras","The rice costs two pounds."],
["l1105","¿Cómo paga?","",["Con tarjeta","En efectivo","Con una aplicación"],"Con tarjeta","She pays by card."],
["l1106","¿Qué prepara Sam?","",["Una sopa de verduras","Una ensalada","Un pastel"],"Una sopa de verduras","Sam is making vegetable soup."],
["l1107","¿Qué debe añadir primero?","",["Cebolla y zanahoria","Tomates y queso","Arroz y leche"],"Cebolla y zanahoria","He starts with onion and carrot."],
["l1108","¿Cuánto tiempo debe freírlas?","",["Cinco minutos","Diez minutos","Dos minutos"],"Cinco minutos","Fry them for five minutes."],
["l1109","¿Cuánto caldo necesita?","",["Un litro","Medio litro","Dos litros"],"Un litro","He adds one litre of stock."],
["l1110","¿Qué consejo le dan sobre la sal?","",["No añadir demasiada","Añadir una cucharada","No usar verduras"],"No añadir demasiada","Don't add too much salt."],
["l1111","¿Qué pide el cliente?","",["Un sándwich de pollo y té","Una sopa y café","Una ensalada y agua"],"Un sándwich de pollo y té","He orders a chicken sandwich and tea."],
["l1112","¿Qué pan elige?","",["Integral","Blanco","Sin gluten"],"Integral","He asks for wholemeal bread."],
["l1113","¿Qué quiere sin el sándwich?","",["Tomate","Queso","Lechuga"],"Tomate","He asks for no tomato."],
["l1114","¿Cuánto cuesta el pedido?","",["Ocho libras","Seis libras","Diez libras"],"Ocho libras","The total is eight pounds."],
["l1115","¿Qué pregunta hace al final?","",["Si puede pagar con tarjeta","Si hay una mesa libre","Si tienen postre"],"Si puede pagar con tarjeta","He asks to pay by card."]
];
const Q:R[]=[
["r1101","¿Qué recomienda el texto para una comida equilibrada?","",["Verduras, fruta y cereales integrales","Solo carne y patatas","Dulces y bebidas azucaradas"],"Verduras, fruta y cereales integrales","The guide recommends vegetables, fruit and whole grains."],
["r1102","¿Qué bebida es una buena opción diaria?","",["Agua","Refresco","Bebida energética"],"Agua","Water is recommended."],
["r1103","¿Qué se aconseja limitar?","",["Sal y azúcar","Fruta y verduras","Agua"],"Sal y azúcar","The guide says to limit salt and sugar."],
["r1104","¿Qué significa low-fat?","",["Bajo en grasa","Alto en fibra","Sin azúcar"],"Bajo en grasa","Low-fat means with less fat."],
["r1105","¿Por qué conviene leer las etiquetas?","",["Para comparar ingredientes y cantidades","Para saber quién cocinó","Para encontrar recetas"],"Para comparar ingredientes y cantidades","Labels show ingredients and nutritional information."],
["r1106","¿Qué compra Leo para la receta?","",["Tomates, cebolla y lentejas","Pollo, queso y pan","Manzanas, leche y arroz"],"Tomates, cebolla y lentejas","Those are the ingredients on his list."],
["r1107","¿Qué hace antes de cocinar?","",["Lava las verduras","Fríe el pan","Hierve la leche"],"Lava las verduras","He washes the vegetables first."],
["r1108","¿Cuándo añade las lentejas?","",["Después de freír la cebolla","Antes de lavar todo","Al final, después de servir"],"Después de freír la cebolla","He adds them after cooking the onion."],
["r1109","¿Cuánto tiempo cocina la sopa?","",["Veinte minutos","Cinco minutos","Una hora"],"Veinte minutos","The soup simmers for twenty minutes."],
["r1110","¿Qué consejo da la receta?","",["Probar antes de añadir más sal","Añadir mucho azúcar","No usar agua"],"Probar antes de añadir más sal","Taste it before adding extra salt."],
["r1111","¿Dónde está la leche?","",["En el pasillo cuatro","En la caja","Junto a la entrada"],"En el pasillo cuatro","The shop assistant says aisle four."],
["r1112","¿Qué tamaño de yogur compra?","",["Un paquete pequeño","Un paquete grande","No compra yogur"],"Un paquete pequeño","He chooses a small pack."],
["r1113","¿Qué hace si no encuentra un producto?","",["Pregunta a un empleado","Se va de la tienda","Compra otra cosa sin preguntar"],"Pregunta a un empleado","The text advises asking a shop assistant."],
["r1114","¿Qué debe guardar después de pagar?","",["El recibo","La cesta","La etiqueta"],"El recibo","Keep the receipt in case there is a problem."],
["r1115","¿Cuál es la idea principal?","",["Comprar y cocinar con atención a los ingredientes","Comer fuera todos los días","Evitar todos los hidratos"],"Comprar y cocinar con atención a los ingredientes","The text combines shopping and healthy cooking."]
];
const dialogues=[
"A: Excuse me, where are the vegetables? B: They're in aisle two. A: I need six tomatoes and some carrots. B: The tomatoes are two pounds a kilo. A: I'll take half a kilo, please. Can I pay by card? B: Of course. Here's your receipt.",
"A: What are you cooking, Sam? B: Vegetable soup. First, fry the onion and carrot for five minutes. Then add a litre of stock and some lentils. A: Should I add salt? B: Just a little. Don't add too much. Let it cook for twenty minutes.",
"A: Hello. I'd like a chicken sandwich and a tea, please. B: Would you like white or wholemeal bread? A: Wholemeal, please, and no tomato. B: Certainly. That's eight pounds. A: Can I pay by card? B: Yes, of course."
];
const passages=[
"EATING WELL EVERY DAY\nA balanced meal can include vegetables, fruit, protein and whole grains. Try to eat different colours of vegetables and choose water as your everyday drink. You don't need to stop eating your favourite food, but you should limit too much salt and sugar. Read food labels when you shop because they help you compare ingredients and quantities. Choose low-fat options when you can, and remember that a healthy diet can still be enjoyable.",
"LEO'S LENTIL SOUP\nLeo wanted to cook a cheap and healthy dinner. He bought tomatoes, an onion and a packet of lentils. First, he washed and cut the vegetables. Then he fried the onion in a little oil for five minutes. He added the tomatoes, lentils and one litre of water. The soup cooked for twenty minutes. Leo tasted it before adding salt. It was delicious, and there was enough for lunch the next day.",
"A QUICK SUPERMARKET SHOP\nNina went to the supermarket after work. She needed milk, eggs, bread and some fruit. She asked a shop assistant where the milk was, and he showed her aisle four. The eggs were cheaper than last week, so she bought a large box. At the checkout, she paid by card and checked the receipt. One item was on the receipt twice, so the cashier corrected it and gave her the difference."
];
export const a2Unit11Exercises={grammar:make(G),vocabulary:make(V),listening:make(L,i=>i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{}),reading:make(Q,i=>i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{})} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
