import type { Activity } from "./activity-content";
type Item=[string,string,string,string,string];
const make=(p:string,rows:Item[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:`${p}${String(i+1).padStart(2,"0")}`,type:"multiple_choice",prompt_es:r[0],question_en:"",options:[r[1],r[2],r[3]].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[1],explanation:r[4],...extra(i)}));
const grammar:Item[]=[
["We ___ a hotel room for next weekend.","have booked","has booked","booking","Present perfect con we + have."],
["She has ___ her flight online.","reserved","reserve","reserving","Have/has + participio."],
["I'm going to ___ my suitcase tonight.","pack","packing","packed","Going to + verbo base."],
["They ___ staying at a small guesthouse.","are","is","am","Present continuous para un plan organizado."],
["We haven't chosen a hotel ___.","yet","already","ever","Yet en negativas y preguntas."],
["Have you ___ travelled abroad?","ever","never","yet","Ever pregunta por experiencias."],
["I've ___ visited Rome twice.","already","yet","ever","Already en afirmativas."],
["He has never ___ by plane.","travelled","travel","travelling","Never + participio."],
["Our flight ___ at 6:40 tomorrow.","leaves","leave","leaving","Present simple para horarios."],
["We need ___ the booking before Friday.","to confirm","confirming","confirmed","Need + to infinitive."],
["The room is ___ expensive for us.","too","enough","many","Too + adjetivo."],
["This hotel isn't cheap ___.","enough","too","many","Adjetivo + enough."],
["If we book early, we ___ get a better price.","can","must to","are","Can expresa posibilidad."],
["I would like ___ a room with a sea view.","to book","booking","booked","Would like + to infinitive."],
["Choose the correct question.","Have you booked the tickets?","Did you have booked the tickets?","Have booked you the tickets?","Present perfect: have + sujeto + participio."]
];
const vocabulary:Item[]=[
["Translate: booking confirmation.","confirmación de reserva","tarjeta de embarque","pasaporte","Booking confirmation."],
["What is accommodation?","alojamiento","equipaje","destino","Accommodation = alojamiento."],
["Translate: departure date.","fecha de salida","fecha de llegada","fecha de caducidad","Departure date."],
["What does available mean?","disponible","agotado","incluido","Available = disponible."],
["Translate: single room.","habitación individual","habitación doble","habitación familiar","Single room."],
["What is a round trip?","viaje de ida y vuelta","viaje de solo ida","excursión guiada","Round trip."],
["Translate: cancellation policy.","política de cancelación","seguro de viaje","confirmación","Cancellation policy."],
["What is a luggage allowance?","franquicia de equipaje","recogida de llaves","servicio de habitaciones","Luggage allowance."],
["Translate: check-in.","registro de entrada","registro de salida","transbordo","Check-in."],
["What does fully booked mean?","completo, sin plazas","abierto todo el día","con descuento","Fully booked."],
["Translate: travel insurance.","seguro de viaje","tarjeta de transporte","reserva de asiento","Travel insurance."],
["What is a destination?","destino","origen","andén","Destination."],
["Translate: facilities.","instalaciones y servicios","facturas","horarios","Facilities."],
["What does refundable mean?","reembolsable","no disponible","de ida","Refundable."],
["Translate: itinerary.","itinerario","alojamiento","equipaje","Itinerary."]
];
const listening:Item[]=[
["Where is the couple going?","To Edinburgh","To London","To Cardiff","Van a Edimburgo."],
["When are they travelling?","Next Friday","This Monday","Next month","Viajan el próximo viernes."],
["What kind of room do they book?","A double room","A single room","A family room","Reservan habitación doble."],
["How many nights will they stay?","Three","Two","Four","Tres noches."],
["Is breakfast included?","Yes","No","The receptionist is unsure","El desayuno está incluido."],
["What time does the flight leave?","At 7:20","At 8:20","At 6:20","Sale a las 7:20."],
["How much luggage can the passenger take?","One small bag","Two large suitcases","No luggage","Una bolsa pequeña."],
["What does the passenger need to show?","A passport","A hotel bill","A driving licence","El pasaporte."],
["Why do they change their booking?","They want to stay one more night","The hotel is closed","Their flight is cancelled","Quieren una noche más."],
["Is the extra night available?","Yes","No","Only in another hotel","Sí, hay disponibilidad."],
["What time is check-in?","After 3 p.m.","Before 10 a.m.","At midday","Después de las tres."],
["When must guests check out?","Before 11 a.m.","After 3 p.m.","At 1 p.m.","Antes de las once."],
["What is included in the price?","Wi-Fi and breakfast","Airport transfers","Dinner","Wi-Fi y desayuno."],
["Can they cancel for free?","Yes, until Wednesday","No, never","Only on the arrival day","Hasta el miércoles."],
["How do they receive confirmation?","By email","By post","By text message only","Por correo electrónico."]
];
const reading:Item[]=[
["What should travellers do before paying?","Check the dates and details","Pack their bags","Print the hotel menu","Comprobar fechas y detalles."],
["When is the booking confirmed?","After payment","Before choosing dates","At check-out","Tras el pago."],
["What can guests do if plans change?","Read the cancellation policy","Ignore the booking","Change the hotel name","Consultar la política de cancelación."],
["What information is in the confirmation?","Booking number and dates","Weather forecast","Restaurant reviews","Número y fechas de reserva."],
["Why should travellers arrive early at the airport?","To allow time for check-in and security","To find a hotel","To buy souvenirs","Para facturar y pasar seguridad."],
["What time does the hotel check-in start?","At 3 p.m.","At noon","At 5 p.m.","A las tres."],
["Is breakfast included?","Yes, every morning","Only on Sunday","No, it costs extra","Sí, cada mañana."],
["How can guests reach the city centre?","By the hotel shuttle","Only by taxi","On foot in five minutes","En el autobús del hotel."],
["What must guests show at reception?","Their booking confirmation","A train timetable","A restaurant receipt","La confirmación."],
["When must guests leave the room?","Before 11 a.m.","Before 3 p.m.","At midnight","Antes de las once."],
["Why does Leo contact the airline?","To change his return flight","To book a hotel","To cancel his passport","Para cambiar el vuelo de vuelta."],
["What date does he choose?","The 18th of August","The 8th of August","The 28th of August","El 18 de agosto."],
["Does the new flight cost more?","Yes, there is a small fee","No, it is free","It is half the price","Sí, hay una pequeña tasa."],
["How does Leo get the new ticket?","By email","At the airport desk","By post","Por correo."],
["What should Leo check after the change?","The new flight details","The hotel breakfast","The luggage colour","Los nuevos detalles del vuelo."]
];
const dialogues=[
"Traveller: Hello. I'd like to book a double room for two adults, please. Receptionist: Certainly. What dates would you like? Traveller: From the 12th to the 15th of June. Receptionist: We have a room available. Breakfast is included, and the total is £240. Traveller: Great. Can I cancel if my plans change? Receptionist: Yes, free cancellation is available until the 8th of June. Traveller: Perfect. Please send the confirmation by email.",
"Passenger: I'd like to check in for the 7:20 flight to Dublin. Agent: Of course. May I see your passport? Passenger: Here you are. Agent: Are you checking in a suitcase? Passenger: No, I only have this small bag. Agent: That's fine. Your gate is number  fourteen. Boarding starts at 6:45. Passenger: Thank you. Is the flight on time? Agent: Yes, everything is on schedule.",
"Guest: Excuse me. Could I change my reservation? Receptionist: Certainly. What would you like to change? Guest: I'd like to stay one extra night, until Saturday. Receptionist: Let me check. Yes, we have a room available. Guest: Is breakfast included? Receptionist: Yes, and check-out is before 11 a.m. Guest: That's excellent. Could you email the new confirmation? Receptionist: Of course."
];
const passages=[
"BOOKING A HOTEL\nWhen you book accommodation online, check the dates, location and room type carefully. Read the cancellation policy before you pay. Some hotels offer free cancellation until a specific date, while others charge a fee. A booking confirmation usually includes your reservation number, arrival and departure dates, room details and total price. Save the email on your phone and take it with you. Contact the hotel if any information is incorrect. Remember to check the check-in and check-out times before you travel.",
"GETTING READY TO FLY\nBefore going to the airport, check your flight time and the airline's luggage rules. Many airlines allow one small cabin bag, but the size and weight limits are different. Online check-in often opens 24 hours before departure. At the airport, follow the signs to security and your departure gate. Keep your passport and boarding pass somewhere easy to find. Arrive early, especially if you need to check in a suitcase. Check the airport screens regularly because gates and departure times can change.",
"CHANGING A TRAVEL PLAN\nLeo planned to return home on the 12th of August, but he needed to stay abroad for another week. He visited the airline's website and found a flight on the 18th. The new ticket was more expensive, so he paid a small change fee. The airline sent a new confirmation by email. Leo checked the date, departure time and baggage allowance carefully. He also contacted his hotel to ask for one extra night. Both changes were confirmed, and he saved the new documents on his phone."
];
export const a2Unit23Exercises={grammar:make("g23",grammar),vocabulary:make("v23",vocabulary),listening:make("l23",listening,i=>i%5===0?{transcript:dialogues[Math.floor(i/5)]}:{}),reading:make("r23",reading,i=>i%5===0?{main_text:passages[Math.floor(i/5)]}:{})} satisfies Record<"grammar"|"vocabulary"|"listening"|"reading",Activity[]>;
