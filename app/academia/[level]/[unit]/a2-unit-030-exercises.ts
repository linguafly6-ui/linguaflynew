import type { Activity } from "./activity-content";
type Item=[string,string,string,string,string];
const make=(p:string,rows:Item[],extra:(i:number)=>Partial<Activity>=()=>({})):Activity[]=>rows.map((r,i)=>({interaction_id:`a2u30_${p}${String(i+1).padStart(2,"0")}`,type:"multiple_choice",prompt_es:r[0],question_en:"",options:[r[1],r[2],r[3]].map((text,j)=>({id:String.fromCharCode(65+j),text})),correct_answer:r[1],explanation:r[4],...extra(i)}));
const grammar:Item[]=[
["Our train ___ at 8:45 tomorrow morning.","leaves","is leave","leave","Los horarios oficiales usan present simple."],
["We ___ in a small hotel near the station on Friday.","are staying","stay yesterday","stays","Present continuous para un plan acordado."],
["I ___ a return ticket online tonight.","am going to buy","buying","bought tomorrow","Be going to expresa una intención."],
["The phone is ringing. I ___ it.","will answer","am answer","answering","Will puede expresar una decisión espontánea."],
["Have you ever ___ alone?","travelled","travel","travelling","Present perfect: have + participio."],
["She ___ the hotel already.","has booked","have book","booking","Has + participio con she."],
["We haven't chosen a destination ___.","yet","already","ever","Yet es habitual en negativas y preguntas."],
["Could you ___ me the way to the bus station?","tell","telling","told","Could you + verbo base para pedir ayuda."],
["You ___ keep your passport somewhere safe.","should","should to","are","Should + verbo base para aconsejar."],
["If we miss the connection, we ___ a taxi.","will take","take yesterday","taking","First conditional: if + presente, will + verbo."],
["The museum is ___ than the castle from our hotel.","farther","more far","farthest than","Far tiene comparativo irregular: farther/further."],
["There isn't ___ time before boarding.","much","many","a few","Much acompaña a nombres incontables."],
["How ___ suitcases are you taking?","many","much","often","Many acompaña a nombres contables plurales."],
["First, check in. ___, go through security.","Then","Yesterday","Never","Then sirve para ordenar pasos."],
["They ___ to Edinburgh last summer.","went","have go","go tomorrow","Past simple para un momento terminado del pasado."]
];
const vocabulary:Item[]=[
["A detailed plan of places and activities for a trip is an ___.","itinerary","invoice","interview","Itinerary = itinerario."],
["A place where you can sleep when travelling is accommodation.","accommodation","luggage","departure","Accommodation = alojamiento."],
["A document that allows you to travel to another country is a ___.","passport","platform","receipt","Passport = pasaporte."],
["The place where you wait for a train is a ___.","platform","aisle","lobby","Platform = andén."],
["A journey to another place and back is a ___.","return trip","single room","boarding pass","Return trip = viaje de ida y vuelta."],
["A ticket for a journey in one direction is a ___ ticket.","single","return","seasonal","Single ticket = billete sencillo."],
["The bags you take on a journey are your ___.","luggage","facilities","sights","Luggage = equipaje."],
["A paper or digital document to board a plane is a ___.","boarding pass","timetable","guidebook","Boarding pass = tarjeta de embarque."],
["The time when a plane or train leaves is its ___.","departure","arrival","delay","Departure = salida."],
["The time when you reach a place is your ___.","arrival","booking","platform","Arrival = llegada."],
["To arrange and pay for a room before travelling is to ___.","book","miss","cancel out","Book = reservar."],
["A place with a kitchen and rooms that you rent is an ___.","apartment","airport","agency","Apartment = apartamento."],
["A person who shows visitors around a place is a tour ___.","guide","driver's licence","passenger","Tour guide = guía turístico."],
["An unexpected problem during a journey is an ___.","incident","itinerary","invitation","Incident = incidencia."],
["Money you get back after cancelling a booking is a ___.","refund","platform","forecast","Refund = reembolso."]
];
const listening:Item[]=[
["Where are Maya and Tom going?","To Bath","To Glasgow","To the airport","Van a Bath."],
["How are they travelling?","By train","By plane","By car","Viajan en tren."],
["What time does the train leave?","At 9:20","At 8:20","At 10:20","Sale a las 9:20."],
["What has Maya already booked?","The hotel","The museum","The taxi","Ya ha reservado el hotel."],
["Where will they meet?","Outside the station","At the hotel bar","At the airport","Quedan fuera de la estación."],
["What does the receptionist ask for?","A passport","A driving test","A library card","Pide un pasaporte."],
["How many nights is the room booked for?","Two nights","One night","Four nights","La habitación es para dos noches."],
["What time is breakfast?","From seven to ten","From six to eight","From ten to twelve","El desayuno es de siete a diez."],
["What does the guest ask about?","Late check-out","A swimming lesson","A train platform","Pregunta por la salida tardía."],
["Why is the train delayed?","There is a signal problem","It is snowing","The driver is ill","Hay un problema de señalización."],
["How long is the expected delay?","Twenty minutes","Two hours","Five minutes","El retraso previsto es de veinte minutos."],
["What should passengers do?","Check the departure screens","Leave the station","Buy another passport","Deben consultar las pantallas."],
["What will they do if it rains?","Visit the museum","Go kayaking","Stay on the beach","Si llueve, visitarán el museo."],
["What should they take for the walk?","Water and comfortable shoes","Formal clothes","A suitcase","Deben llevar agua y calzado cómodo."],
["When will they decide about the walk?","After checking the morning forecast","Last month","At midnight next week","Decidirán tras consultar la previsión."]
];
const reading:Item[]=[
["What should a traveller check before leaving home?","Passport, tickets and booking details","Only restaurant menus","The weather in another country","Debe comprobar pasaporte, billetes y reservas."],
["Why is it useful to save booking confirmations?","They contain important travel details","They replace a passport","They give free meals","Contienen datos importantes del viaje."],
["What is a good idea when planning a city visit?","Group nearby attractions together","Visit the same place twice","Ignore opening times","Conviene agrupar lugares cercanos."],
["What should you do if a train is cancelled?","Speak to staff about alternatives","Wait outside all day","Throw away your ticket","Consultar alternativas con el personal."],
["What is the main purpose of an itinerary?","To organise a trip","To apply for a job","To describe a recipe","Organiza el viaje."],
["How did Alex travel to York?","By coach","By ferry","By bicycle","Viajó en autocar."],
["Where did Alex stay?","In a guest house","At the airport","In a tent","Se alojó en una pensión."],
["What did Alex visit on the first day?","The old town and the museum","A football stadium only","A shopping centre","Visitó el casco antiguo y el museo."],
["Why did Alex change the second day's plan?","It was raining heavily","The hotel was closed","The train was early","Llovía mucho."],
["What did Alex do instead?","Visited an art gallery","Went swimming","Hired a boat","Visitó una galería de arte."],
["What should you do before booking accommodation?","Read the conditions and location","Ignore the price","Book the first room you see","Leer condiciones y ubicación."],
["Why should you allow extra time at an airport?","Security and queues can take time","Planes always leave early","Shops are far away","Los controles y colas llevan tiempo."],
["What information can a timetable provide?","Departure and arrival times","The hotel menu","The weather next month","Horas de salida y llegada."],
["What is a sensible way to carry important documents?","Keep them secure and accessible","Put them in checked luggage only","Leave them at home","Llevarlos protegidos y accesibles."],
["What makes an independent trip easier?","Preparation and flexible plans","Never checking information","Making no reservations","Preparación y flexibilidad."]
];
const dialogues=[
"Maya: Have you finished planning our weekend in Bath? Tom: Almost. I've booked the hotel for Friday and Saturday. Maya: Great. What time is the train? Tom: It leaves at 9:20, so let's meet outside the station at nine. Maya: Perfect. I'll download the tickets tonight.",
"Guest: Hello, I have a reservation for two nights. Receptionist: Certainly. Could I see your passport, please? Guest: Of course. Is breakfast included? Receptionist: Yes, it's served from seven until ten. Guest: Could we also have a late check-out? Receptionist: I'll check whether that's possible.",
"Passenger: Excuse me, why is the train to Bristol delayed? Staff: There is a signal problem, and we expect a twenty-minute delay. Passenger: Will I miss my connection? Staff: If you do, speak to our team and we'll find another train. Passenger: Thank you. I'll check the departure screen."
];
const passages=[
"Planning an independent trip\nAn independent trip is easier when you prepare the important details before you leave. Check that your passport is valid, save your tickets and booking confirmations, and write down the addresses of your accommodation. Make a simple itinerary, but leave some free time. Check local transport information and keep emergency contact details somewhere safe.",
"A weekend in York\nAlex travelled to York by coach on Friday afternoon and stayed in a small guest house near the centre. On Saturday, Alex visited the old town and a museum. The plan for Sunday was a long walk, but it rained heavily, so Alex visited an art gallery instead. The trip was enjoyable because the plans were organised but flexible.",
"When plans change\nTravel problems sometimes happen. A train can be delayed, a hotel booking may be incorrect, or bad weather can affect an activity. Keep your confirmation details and speak politely to staff. Ask what alternatives are available and check the departure screens regularly. If you have extra time, you can often find another way to continue your journey."
];
export const a2Unit30Exercises={
 grammar:make("grammar",grammar),
 vocabulary:make("vocabulary",vocabulary),
 listening:make("listening",listening,i=>({transcript:dialogues[Math.floor(i/5)]})),
 reading:make("reading",reading,i=>({main_text:passages[Math.floor(i/5)]}))
};
