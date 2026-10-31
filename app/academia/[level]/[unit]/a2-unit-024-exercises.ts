import type { Activity } from "./activity-content";
type Item=[string,string,string,string,string];
const make=(p:string,rows:Item[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:`${p}${String(i+1).padStart(2,"0")}`,type:"multiple_choice",prompt_es:r[0],question_en:"",options:[r[1],r[2],r[3]].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[1],explanation:r[4],...extra(i)}));
const grammar:Item[]=[
["___ through the ticket gates and turn left.","Go","Going","Goes","El imperativo usa el verbo en forma base."],
["The information desk is ___ the entrance.","opposite","between","through","Opposite = enfrente de."],
["Walk ___ the bridge to reach the bus station.","across","at","under of","Across = cruzando de un lado al otro."],
["The train ___ twenty minutes late yesterday.","arrived","arrives","arriving","Pasado simple de arrive."],
["We ___ our connection because the first train was late.","missed","miss","missing","Pasado simple de miss."],
["Don't ___ your luggage unattended.","leave","leaves","leaving","Don't + verbo base."],
["The taxi is waiting ___ the terminal.","outside","between","across","Outside = fuera de."],
["I can't find my gate. I ___ ask a member of staff.","will","am","did","Will expresa una decisión espontánea."],
["They ___ going to travel by coach tomorrow.","are","is","was","Be going to: they are."],
["Could you tell me ___ platform 8 is?","where","what","who","Where introduce una pregunta indirecta de lugar."],
["The café is ___ the pharmacy and the toilets.","between","through","across","Between va seguido de dos referencias."],
["She ___ her passport at the hotel last night.","left","leaves","leaving","Pasado simple de leave."],
["You ___ show your boarding pass before boarding.","must","must to","musts","Must + verbo base."],
["The airport bus is ___ than a taxi.","cheaper","cheapest","more cheap","Comparativo de cheap."],
["I ___ help you with that suitcase.","will","am","did","Will puede expresar ofrecimiento." ]];
const vocabulary:Item[]=[
["Translate: departure board.","panel de salidas","panel de llegadas","control de pasaportes","Departure board."],
["What is a boarding pass?","tarjeta de embarque","billete de tren","reserva de hotel","Boarding pass."],
["Translate: luggage claim.","recogida de equipajes","control de seguridad","mostrador de facturación","Baggage/luggage claim."],
["What does gate mean at an airport?","puerta de embarque","andén","taquilla","Gate."],
["Translate: ticket barrier.","torno de acceso","cinta de equipaje","sala de espera","Ticket barrier."],
["What is a delay?","retraso","cancelación","transbordo","Delay."],
["Translate: information desk.","mostrador de información","máquina de billetes","control de seguridad","Information desk."],
["What does platform mean?","andén","puerta de embarque","terminal","Platform."],
["Translate: security check.","control de seguridad","recogida de equipajes","facturación","Security check."],
["What is a connecting train?","tren de enlace","tren directo","último tren","Connecting train."],
["Translate: lost property office.","oficina de objetos perdidos","taquilla","sala VIP","Lost property office."],
["What does crowded mean?","abarrotado","vacío","puntual","Crowded."],
["Translate: one-way ticket.","billete de solo ida","billete de ida y vuelta","abono mensual","One-way ticket."],
["What is a terminal?","terminal","maleta","retraso","Terminal."],
["Translate: staff.","personal","pasajeros","horarios","Staff." ]];
const listening:Item[]=[
["Where does the passenger want to go?","To platform 6","To the taxi rank","To the café","Quiere ir al andén 6."],
["How does the assistant tell him to get there?","Go straight and turn right","Take the lift downstairs","Go outside the station","Sigue recto y gira a la derecha."],
["What is next to platform 6?","The coffee shop","The ticket office","The toilets","La cafetería está junto al andén."],
["Why is the train delayed?","A signal problem","Heavy snow","A staff meeting","Problema de señalización."],
["How long is the delay?","Twenty minutes","Ten minutes","Forty minutes","Veinte minutos."],
["Which flight is the passenger taking?","Flight BA218","Flight BA281","Flight BA812","Vuelo BA218."],
["What does the passenger need to show?","A passport and boarding pass","A hotel booking","A train ticket","Pasaporte y tarjeta de embarque."],
["How many bags is she checking in?","One suitcase","Two suitcases","No bags","Una maleta."],
["Where is the departure gate?","Gate 14","Gate 4","Gate 40","Puerta 14."],
["When does boarding begin?","At 10:25","At 10:45","At 11:25","A las 10:25."],
["What has the traveller lost?","A black backpack","A blue suitcase","A passport","Una mochila negra."],
["Where did he last see it?","On the airport bus","At the hotel","In the café","En el autobús del aeropuerto."],
["What is inside the backpack?","A laptop and a notebook","A passport and keys","Clothes and shoes","Un portátil y un cuaderno."],
["Who will contact him?","The lost property team","The airline pilot","The hotel manager","El equipo de objetos perdidos."],
["What should he do if they find it?","Return to the information desk","Buy a new ticket","Go through security again","Volver al mostrador de información." ]];
const reading:Item[]=[
["Where should passengers check the platform?","On the departure board","At the hotel reception","On their passport","En el panel de salidas."],
["How early should passengers arrive?","At least fifteen minutes early","One minute early","After the train leaves","Al menos quince minutos antes."],
["What should passengers keep ready?","Their ticket","Their hotel key","Their shopping receipt","El billete."],
["What should they do if they need help?","Ask station staff","Leave the station","Wait outside","Preguntar al personal."],
["What is the main advice?","Check information and allow enough time","Run to every platform","Leave luggage anywhere","Comprobar información y prever tiempo."],
["Where should passengers go after landing?","Passport control","The departure gate","The ticket office","Al control de pasaportes."],
["Where can they collect their bags?","At baggage reclaim","At the check-in desk","At the boarding gate","En la recogida de equipajes."],
["What should they do if a bag is missing?","Report it to the airline desk","Leave the airport","Buy another boarding pass","Comunicarlo al mostrador de la aerolínea."],
["Why should they check the airport screens?","Gates can change","Hotels can close","Passports can expire","Las puertas pueden cambiar."],
["What document do they need to leave the airport?","No special document is mentioned","A train ticket","A hotel invoice","El texto no menciona un documento especial."],
["Why did Maya miss her train?","Her bus arrived late","She forgot her passport","The station was closed","El autobús llegó tarde."],
["What did the station worker suggest?","Taking the next train","Taking a flight","Going back home","Coger el siguiente tren."],
["Did Maya need to buy another ticket?","No, her ticket was valid","Yes, a new ticket","Only a bus ticket","No, el billete seguía siendo válido."],
["What time did the next train leave?","At 16:40","At 16:10","At 17:40","A las 16:40."],
["What did Maya learn?","To leave more time for connections","To avoid travelling by train","To book a taxi every time","Dejar más tiempo para los enlaces." ]];
const dialogues=[
"Passenger: Excuse me, how do I get to platform 6? Assistant: Go straight ahead and turn right after the café. Passenger: Is it far? Assistant: No, it's next to platform 5, opposite the lifts. Passenger: Thank you. Assistant: You're welcome. Follow the signs and you can't miss it.",
"Agent: Good morning. Can I see your passport and boarding pass, please? Passenger: Of course. Agent: Are you checking in any luggage? Passenger: Yes, one suitcase. Agent: Please put it on the belt. Your flight leaves from gate 14. Boarding starts at 10:25. Passenger: Great. Where is security? Agent: Go through those doors and follow the signs.",
"Traveller: Hello. I've lost my black backpack. Staff: Where did you last see it? Traveller: On the airport bus, about twenty minutes ago. Staff: What's inside? Traveller: A laptop and a notebook. Staff: I'll contact the bus team. Please leave your phone number. Traveller: Thank you. Staff: We will call you if we find it."
];
const passages=[
"FINDING YOUR PLATFORM\nAt a busy railway station, always check the departure board before you go to your platform. The number can change, especially when trains are delayed. Keep your ticket ready and follow the signs. If you are not sure where to go, ask a member of staff at the information desk. Arrive at least fifteen minutes early so you have time to find your train. Never leave your bags unattended, and listen carefully to announcements.",
"ARRIVING AT THE AIRPORT\nAfter your plane lands, follow the signs to passport control and baggage reclaim. Check the screens to find the correct carousel for your flight. If your suitcase does not arrive, speak to the airline staff before leaving the airport. Keep your baggage receipt and describe your suitcase clearly. If you have a connecting flight, check the departure board for your next gate and allow enough time to walk there.",
"A MISSED TRAIN\nMaya was travelling to Bristol last Tuesday. Her airport bus arrived late, so she missed her 16:10 train. She went to the information desk and explained what happened. The station worker checked her ticket and said it was still valid for the next service. The next train left at 16:40 from platform 3. Maya bought a coffee and waited near the platform. She decided to leave more time for connections on her next journey."
];
export const a2Unit24Exercises={grammar:make("g24",grammar),vocabulary:make("v24",vocabulary),listening:make("l24",listening,i=>i%5===0?{transcript:dialogues[Math.floor(i/5)]}:{}),reading:make("r24",reading,i=>i%5===0?{main_text:passages[Math.floor(i/5)]}:{})} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
