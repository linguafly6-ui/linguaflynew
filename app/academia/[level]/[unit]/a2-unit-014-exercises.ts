import type { Activity } from "./activity-content";
type Row=[string,string,string,string[],string,string];
const make=(rows:Row[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:r[0],type:"multiple_choice",prompt_es:r[1],question_en:r[2],options:r[3].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[4],explanation:r[5],...extra(i)}));
const grammar:Row[]=[
["g1401","Elige el cuantificador correcto.","I'd like ___ pair of jeans, please.",["a","some","any"],"a","Pair es un sustantivo contable singular."],
["g1402","Completa la pregunta.","How ___ are these trainers?",["much","many","few"],"much","How much pregunta por el precio."],
["g1403","Elige la pregunta correcta.","___ size are you?",["What","How many","How much"],"What","What size...? pregunta por la talla."],
["g1404","Completa la petición.","Could I ___ this jacket on?",["try","trying","tried"],"try","Could va seguido del verbo base."],
["g1405","Elige la forma educada.","",["I'd like to return this shirt.","I want return this shirt.","I liking return this shirt."],"I'd like to return this shirt.","Would like suaviza las peticiones."],
["g1406","Completa.","These shoes are ___ small for me.",["too","enough","many"],"too","Too + adjetivo expresa exceso."],
["g1407","Completa.","This coat isn't warm ___ for winter.",["enough","too","many"],"enough","Enough va después del adjetivo."],
["g1408","Elige el comparativo.","This shop is ___ than the market.",["cheaper","cheap","cheapest"],"cheaper","Cheap forma el comparativo con -er."],
["g1409","Completa.","The blue dress is more ___ than the black one.",["expensive","expensiver","expensivest"],"expensive","Los adjetivos largos usan more."],
["g1410","Pide otra talla.","Could I try a ___, please?",["larger size","large than","largest size"],"larger size","Larger es el comparativo de large."],
["g1411","Da un consejo.","You ___ check the price before you pay.",["should","would","are"],"should","Should expresa consejo."],
["g1412","Completa la negativa.","You ___ keep the receipt.",["shouldn't","don't should","aren't should"],"shouldn't","Shouldn't es la forma negativa."],
["g1413","Elige el cuantificador.","Have you got ___ smaller sizes?",["any","much","a little"],"any","Any se usa habitualmente en preguntas."],
["g1414","Completa.","I'd like ___ information about the sale.",["some","many","a few"],"some","Information es incontable; some es adecuado."],
["g1415","Elige la frase correcta.","",["Can I pay by card?","Can I to pay by card?","Do I paying by card?"],"Can I pay by card?","Can + verbo en forma base."]
];
const vocabulary:Row[]=[
["v1401","¿Qué significa fitting room?","fitting room",["probador","caja","escaparate"],"probador","Fitting room es el probador."],
["v1402","Traduce size.","size",["talla","precio","color"],"talla","Size significa talla."],
["v1403","¿Qué significa receipt?","receipt",["recibo","descuento","cambio"],"recibo","Receipt es el recibo."],
["v1404","Traduce refund.","refund",["reembolso","probador","oferta"],"reembolso","Refund es la devolución del dinero."],
["v1405","¿Qué significa exchange?","exchange",["cambio","compra","etiqueta"],"cambio","Exchange es cambiar un artículo."],
["v1406","Traduce sale.","sale",["rebajas","talla","caja"],"rebajas","Sale significa rebajas."],
["v1407","¿Qué significa cash?","cash",["efectivo","tarjeta","recibo"],"efectivo","Cash es dinero en efectivo."],
["v1408","Traduce contactless.","contactless",["pago sin contacto","pago aplazado","en efectivo"],"pago sin contacto","Contactless es pago sin contacto."],
["v1409","¿Qué significa loose?","loose",["holgado","ajustado","caro"],"holgado","Loose describe ropa poco ajustada."],
["v1410","Traduce tight.","tight",["ajustado","holgado","elegante"],"ajustado","Tight significa ajustado."],
["v1411","¿Qué significa cotton?","cotton",["algodón","cuero","lana"],"algodón","Cotton es algodón."],
["v1412","Traduce changing room.","changing room",["vestuario / probador","almacén","mostrador"],"vestuario / probador","Changing room es probador."],
["v1413","¿Qué significa label?","label",["etiqueta","bolsillo","manga"],"etiqueta","Label es etiqueta."],
["v1414","Traduce receipt number.","receipt number",["número de recibo","número de talla","número de caja"],"número de recibo","Receipt number identifica el recibo."],
["v1415","¿Qué significa out of stock?","out of stock",["agotado","rebajado","nuevo"],"agotado","Out of stock significa que no queda disponible."]
];
const listening:Row[]=[
["l1401","¿Qué busca la clienta?","",["Unos vaqueros","Un abrigo","Un vestido"],"Unos vaqueros","She is looking for jeans."],
["l1402","¿Qué talla necesita?","",["La 10","La 8","La 12"],"La 10","She asks for a size ten."],
["l1403","¿Cómo le quedan los vaqueros?","",["Demasiado ajustados","Demasiado largos","Perfectos"],"Demasiado ajustados","They are too tight."],
["l1404","¿Qué talla prueba después?","",["Una más grande","Una más pequeña","La misma"],"Una más grande","The assistant brings a larger size."],
["l1405","¿Qué decide comprar?","",["Los vaqueros","Una falda","Una camisa"],"Los vaqueros","She decides to buy the jeans."],
["l1406","¿Qué problema tiene el cliente?","",["La cremallera está rota","El color es distinto","Falta una etiqueta"],"La cremallera está rota","The zip is broken."],
["l1407","¿Qué presenta?","",["El recibo","El pasaporte","Una tarjeta regalo"],"El recibo","He shows the receipt."],
["l1408","¿Qué solución elige?","",["Un reembolso","Un artículo distinto","Un vale para café"],"Un reembolso","He asks for a refund."],
["l1409","¿Cómo pagó originalmente?","",["Con tarjeta","En efectivo","Con cheque"],"Con tarjeta","He paid by card."],
["l1410","¿Qué le devuelve la tienda?","",["El dinero a la tarjeta","Dinero en efectivo","Un descuento"],"El dinero a la tarjeta","The refund goes back to his card."],
["l1411","¿Qué busca la amiga?","",["Un abrigo de algodón","Unas botas","Una camiseta deportiva"],"Un abrigo de algodón","She is shopping for a cotton coat."],
["l1412","¿Qué color prefiere?","",["Verde","Negro","Azul"],"Verde","She prefers the green one."],
["l1413","¿Por qué duda?","",["Es más caro","Es demasiado pequeño","No está en rebajas"],"Es más caro","The green coat costs more."],
["l1414","¿Qué consejo recibe?","",["Comparar los precios","Comprar dos abrigos","Pagar en efectivo"],"Comparar los precios","Her friend suggests comparing prices."],
["l1415","¿Qué decide al final?","",["Esperar y pensarlo","Comprar el más caro","Devolver el abrigo"],"Esperar y pensarlo","She decides to think about it."]
];
const reading:Row[]=[
["r1401","¿Qué conviene hacer antes de comprar?","",["Comprobar la talla","Tirar el recibo","Quitar la etiqueta"],"Comprobar la talla","Check the size before buying."],
["r1402","¿Dónde puedes probarte la ropa?","",["En el probador","En la caja","En el almacén"],"En el probador","Use the fitting room."],
["r1403","¿Qué debes guardar para una devolución?","",["El recibo","La bolsa de otra tienda","El catálogo"],"El recibo","Keep the receipt."],
["r1404","¿Qué significa out of stock?","",["Agotado","En oferta","Disponible"],"Agotado","It is not available."],
["r1405","¿Qué pregunta sirve para pagar?","",["Can I pay by card?","What size is it?","Where is the fitting room?"],"Can I pay by card?","Ask about payment with this phrase."],
["r1406","¿Qué compra Mia?","",["Una chaqueta","Unos zapatos","Un bolso"],"Una chaqueta","Mia buys a jacket."],
["r1407","¿Por qué cambia de talla?","",["La primera le queda pequeña","La primera es muy larga","La primera es cara"],"La primera le queda pequeña","The first jacket is too small."],
["r1408","¿Qué talla le queda bien?","",["La mediana","La pequeña","La grande"],"La mediana","The medium size fits."],
["r1409","¿Qué material elige?","",["Algodón","Cuero","Lana"],"Algodón","She chooses cotton."],
["r1410","¿Cómo paga?","",["Sin contacto","En efectivo","Con cheque"],"Sin contacto","She pays contactless."],
["r1411","¿Qué quiere devolver Leo?","",["Unos zapatos","Unos pantalones","Una camisa"],"Unos zapatos","Leo wants to return shoes."],
["r1412","¿Cuál es el problema?","",["Son incómodos","El color destiñe","Falta un cordón"],"Son incómodos","They are uncomfortable."],
["r1413","¿Qué necesita para la devolución?","",["El recibo y la caja","Una foto","Una tarjeta de socio"],"El recibo y la caja","The shop asks for the receipt and box."],
["r1414","¿Qué opción elige?","",["Un cambio por otra talla","Un reembolso completo","Un vale regalo"],"Un cambio por otra talla","He exchanges them for another size."],
["r1415","¿Qué recomienda el texto?","",["Probarse los artículos y guardar el recibo","Comprar siempre la talla habitual","Quitar las etiquetas antes de probar"],"Probarse los artículos y guardar el recibo","Try items on and keep receipts."]
];
const dialogues=[
"A: Can I help you? B: Yes, I'm looking for a pair of jeans. A: What size are you? B: A size ten, please. A: These are size ten. B: They are a little too tight. Have you got a larger size? A: Certainly. Try these. B: These fit much better. I'll take them.",
"A: Hello. I'd like to return these shoes, please. B: Is there a problem? A: Yes, they're uncomfortable. Here's the receipt. B: Would you like an exchange or a refund? A: A refund, please. B: Certainly. You paid by card, so the money will go back to your card.",
"A: Which coat do you prefer? B: I like the green cotton one, but it's more expensive. A: The blue one is cheaper. B: Yes, but the green one is warmer. A: You should compare the prices online first. B: Good idea. I'll think about it before I buy it."
];
const passages=[
"SHOPPING FOR CLOTHES
When you buy clothes, check the size and read the label. You can ask, Have you got this in a smaller size? or Could I try this on? Use the fitting room before you decide. Compare prices and materials: cotton is comfortable, while some coats are warmer than others. Keep your receipt in case you need to exchange an item or ask for a refund. You can usually pay by card or cash.",
"MIA'S NEW JACKET
Mia needs a jacket for the winter. She finds a blue jacket, but the small size is too tight. The assistant brings a medium one, and it fits much better. Mia checks the label and sees that it is made of cotton. It costs more than the first jacket, but it is warmer. She decides to buy it and pays contactless. She keeps the receipt in her bag.",
"LEO RETURNS HIS SHOES
Leo bought a pair of shoes last week, but they are uncomfortable. He visits the shop with the shoes in their box and his receipt. The assistant asks if he wants a refund or an exchange. Leo chooses a different size because he likes the shoes. The new pair fits well, so he takes them home. The assistant reminds him to keep the receipt."
];
export const a2Unit14Exercises={grammar:make(grammar),vocabulary:make(vocabulary),listening:make(listening,i=>i===0?{transcript:dialogues[0]}:i===5?{transcript:dialogues[1]}:i===10?{transcript:dialogues[2]}:{}),reading:make(reading,i=>i===0?{main_text:passages[0]}:i===5?{main_text:passages[1]}:i===10?{main_text:passages[2]}:{})} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
