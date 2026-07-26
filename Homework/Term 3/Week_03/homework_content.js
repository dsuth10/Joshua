const texts = {
  Red: {
    title: "From Power Stations to Parallel Circuits",
    paragraphs: [
      "Electricity is an energy carrier rather than a fuel that we dig from the ground. It must be produced by transforming energy from another source. In coal- and gas-fired power stations, chemical energy in fuel becomes heat. The heat produces moving steam or hot gases that spin a turbine. The turbine turns a generator, where moving magnets and coils produce an electric current. Nuclear power stations also use heat to make steam, but the heat comes from splitting atoms instead of burning fuel.",
      "Renewable sources can generate electricity without using a fuel that will run out. Wind turbines use the kinetic energy of moving air. Hydroelectric stations use falling or flowing water to turn turbines. Solar photovoltaic panels work differently: their cells transform light energy directly into electrical energy. Batteries are another source for small circuits. Chemical reactions inside a battery create a potential difference that pushes charges through a complete path. No source is perfect. The choice is not simple. Engineers compare reliability, cost, stored energy, land use and environmental effects when planning an electricity supply.",
      "A useful circuit needs an energy source, conducting wires, a load and often a switch. The load may be a lamp, buzzer or motor that transforms electrical energy into light, sound or movement. Current flows only when the circuit forms a closed loop from one battery terminal, through the components and back to the other terminal. An open switch breaks the loop, so the current stops.",
      "In a series circuit, every component is placed along one continuous route. The same current passes through each component. When extra lamps are added in series to one battery, the available energy is shared and the lamps usually become dimmer. If one lamp is removed or fails, the only route is broken and every lamp goes out. Series circuits are simple, but one fault can stop the entire circuit.",
      "A parallel circuit contains branches, so current has more than one route. Each branch is connected across the source and receives the source's potential difference. If one lamp fails, current can still travel through the other branches. Homes use parallel circuits so appliances can be switched on and off independently. Whether electricity begins with sunlight, wind, moving water, fuel or a battery, a complete circuit controls where the energy is transferred and what transformation occurs."
    ]
  },
  Blue: {
    title: "How Electricity Sources Power Circuits",
    paragraphs: [
      "Electricity must be made by changing energy from another source. In coal and gas power stations, fuel is burned to make heat. The heat creates moving steam or gas that spins a turbine. The turbine turns a generator, which produces electric current. Wind turbines and hydroelectric stations also turn generators. Wind uses moving air, while hydroelectricity uses flowing or falling water. Solar panels are different because their cells change light energy directly into electrical energy.",
      "Batteries supply electricity to small circuits. Chemical reactions inside a battery push charges around a complete path. A working circuit needs a source, wires and a load such as a lamp, buzzer or motor. A switch can open or close the path. Current flows through a closed loop. When the switch is open, the loop is broken and the current stops.",
      "A series circuit has only one path. All its parts sit along the same route. If one lamp is removed or fails, the path breaks and every lamp goes out. Adding more lamps to one battery usually makes each lamp dimmer because the available energy is shared.",
      "A parallel circuit has two or more branches. Current can travel along different paths. If a lamp on one branch fails, the other branches can still work. Homes use parallel circuits so one appliance can be switched off without turning everything else off. Electricity can begin with many sources, but it must move through a complete circuit to transfer energy to a useful device."
    ]
  },
  Green: {
    title: "Electricity and Two Kinds of Circuits",
    paragraphs: [
      "Electricity comes from other kinds of energy. A power station can burn fuel to make heat. The heat helps spin a machine called a generator. Wind and moving water can also spin generators. Solar panels use light from the Sun to make electricity.",
      "A battery can power a small circuit. A circuit needs a battery, wires and a part such as a lamp. The wires must make a full loop. A closed loop lets current flow. An open switch breaks the loop, so the lamp turns off.",
      "A series circuit has one path. Every lamp is on the same path. If one lamp is taken out, the path is broken. All the lamps go out. More lamps may also look dimmer.",
      "A parallel circuit has two or more paths called branches. Each lamp can be on its own branch. If one lamp breaks, the other lamps can stay on. Homes use parallel circuits so each light or appliance can work on its own."
    ]
  }
};

const comp = {
  Red: [
    { q: "Why does the text describe electricity as an energy carrier?", a: "It is stored only inside metal wires.", b: "It must be produced by transforming energy from another source.", c: "It is a fuel mined from beneath the ground.", d: "It can be used only while a turbine is spinning.", ans: "B" },
    { q: "What sequence occurs in a coal- or gas-fired power station?", a: "Light turns a generator, which freezes steam.", b: "Fuel makes current, which then heats a turbine.", c: "Fuel makes heat, moving steam or gas spins a turbine, and the turbine turns a generator.", d: "A battery spins magnets, which burn fuel.", ans: "C" },
    { q: "How do solar photovoltaic panels differ from wind and hydroelectric systems?", a: "They transform light directly rather than using a turbine to turn a generator.", b: "They require chemical reactions inside a battery.", c: "They burn a renewable fuel to make steam.", d: "They can generate electricity only inside homes.", ans: "A" },
    { q: "What creates the potential difference in a battery?", a: "Falling water outside the battery", b: "Chemical reactions inside the battery", c: "A turbine connected to each terminal", d: "Light passing through the wires", ans: "B" },
    { q: "Which set lists the main parts of the useful circuit described in the text?", a: "Fuel, turbine, steam and solar cell", b: "Magnet, atom, branch and appliance", c: "Energy source, conducting wires, load and often a switch", d: "Generator, power station, house and land", ans: "C" },
    { q: "Why does opening a switch stop the current?", a: "It uses up all the battery's chemicals.", b: "It changes the wires into insulators.", c: "It removes the load from the circuit.", d: "It breaks the closed loop needed for current to flow.", ans: "D" },
    { q: "What is the defining feature of a series circuit?", a: "Every component is placed along one continuous route.", b: "Every component has its own battery.", c: "The circuit has several independent branches.", d: "The current avoids the load.", ans: "A" },
    { q: "Why do all lamps go out when one lamp fails in a series circuit?", a: "The failed lamp increases the battery's voltage.", b: "The only route for current has been broken.", c: "The remaining lamps become renewable sources.", d: "The switch automatically opens every branch.", ans: "B" },
    { q: "What usually happens when extra lamps are added in series to one battery?", a: "Each lamp becomes brighter because current is created.", b: "Only the first lamp works.", c: "The lamps become dimmer because the available energy is shared.", d: "A new parallel branch forms.", ans: "C" },
    { q: "How does a parallel circuit provide more than one route for current?", a: "It places every device in a single line.", b: "It uses branches connected across the source.", c: "It removes the conducting wires.", d: "It keeps the switch permanently open.", ans: "B" },
    { q: "What happens to the other branches if one lamp fails in a parallel circuit?", a: "They can continue to carry current.", b: "They become series circuits.", c: "They all lose their connection to the source.", d: "They must share the failed lamp's branch.", ans: "A" },
    { q: "Why are home appliances connected in parallel?", a: "They all need to fail at the same time.", b: "They can be controlled independently.", c: "They use only one continuous route.", d: "They do not need an energy source.", ans: "B" },
    { q: "Which energy transformation is given for a motor used as a load?", a: "Electrical energy into movement", b: "Light energy into chemical energy", c: "Heat energy into stored fuel", d: "Sound energy into electricity", ans: "A" },
    { q: "Which factor is NOT listed as something engineers compare when planning an electricity supply?", a: "Reliability", b: "Environmental effects", c: "Land use", d: "The colour of conducting wires", ans: "D" },
    { q: "Which statement best summarises the final paragraph?", a: "Only batteries can provide safe electricity.", b: "The original energy source matters, while a complete circuit controls the transfer and transformation of energy.", c: "Parallel circuits always use less energy than series circuits.", d: "All electricity sources use turbines.", ans: "B" }
  ],
  Blue: [
    { q: "Why must electricity be made from another source?", a: "Electricity is produced by changing another form of energy.", b: "Electricity can only be found in batteries.", c: "Wires create fuel when they get hot.", d: "Every circuit needs a solar panel.", ans: "A" },
    { q: "What spins the turbine in a coal or gas power station?", a: "Cold water stored in a battery", b: "Moving steam or gas made by heat", c: "Light from the Sun", d: "Current returning through a wire", ans: "B" },
    { q: "Which two sources turn generators without burning coal or gas?", a: "Wind and flowing water", b: "Batteries and switches", c: "Lamps and motors", d: "Solar cells and fuel", ans: "A" },
    { q: "How do solar cells produce electricity?", a: "They burn light as a fuel.", b: "They use light to spin a turbine.", c: "They change light energy directly into electrical energy.", d: "They store moving water.", ans: "C" },
    { q: "What inside a battery helps push charges around a circuit?", a: "Chemical reactions", b: "A wind turbine", c: "A solar cell", d: "A broken switch", ans: "A" },
    { q: "Which item can be a load in a circuit?", a: "A coal mine", b: "A lamp", c: "A river", d: "A power station", ans: "B" },
    { q: "When does current flow in the circuit described?", a: "When the loop is closed", b: "When every wire is removed", c: "When the switch breaks the path", d: "When the battery is outside the circuit", ans: "A" },
    { q: "What does an open switch do?", a: "Adds a new branch", b: "Makes the lamp brighter", c: "Breaks the path and stops current", d: "Turns the load into a source", ans: "C" },
    { q: "How many paths does a series circuit have?", a: "No paths", b: "One path", c: "Two paths only", d: "A different path for every lamp", ans: "B" },
    { q: "What happens if one lamp is removed from a series circuit?", a: "Every lamp goes out.", b: "The other lamps form new branches.", c: "Only the battery stops working.", d: "The remaining lamps stay on at full brightness.", ans: "A" },
    { q: "Why may lamps become dimmer when more are added in series?", a: "The wires stop conducting.", b: "The available energy is shared.", c: "The lamps change into switches.", d: "The battery becomes a solar panel.", ans: "B" },
    { q: "What is a branch in a parallel circuit?", a: "One of the different paths current can follow", b: "A fuel burned in a power station", c: "The chemical inside a battery", d: "The magnet inside a generator", ans: "A" },
    { q: "What can happen if one lamp fails in a parallel circuit?", a: "All branches must stop.", b: "The other branches can keep working.", c: "The circuit becomes open at the battery.", d: "The generator spins backwards.", ans: "B" },
    { q: "Why do homes use parallel circuits?", a: "Each appliance can be switched independently.", b: "Every appliance must share one path.", c: "No appliance needs a complete circuit.", d: "Homes use only wind power.", ans: "A" },
    { q: "What do all useful circuits need to transfer energy to a device?", a: "A complete path", b: "A coal-fired station", c: "Two broken switches", d: "A hydroelectric turbine", ans: "A" }
  ],
  Green: [
    { q: "What can a power station burn to make heat?", a: "Fuel", b: "Wires", c: "Lamps", d: "Switches", ans: "A" },
    { q: "What machine can wind and moving water spin?", a: "A lamp", b: "A generator", c: "A battery", d: "A switch", ans: "B" },
    { q: "What do solar panels use to make electricity?", a: "Sound", b: "Soil", c: "Light from the Sun", d: "Cold air", ans: "C" },
    { q: "What can power a small circuit?", a: "A battery", b: "A ruler", c: "A cup", d: "A book", ans: "A" },
    { q: "Which part may light up in a circuit?", a: "A wire", b: "A lamp", c: "A branch", d: "A path", ans: "B" },
    { q: "What shape must the wires make for current to flow?", a: "A broken line", b: "A full loop", c: "A pile", d: "A straight road", ans: "B" },
    { q: "What does an open switch do?", a: "Breaks the loop", b: "Adds a battery", c: "Spins a generator", d: "Makes sunlight", ans: "A" },
    { q: "How many paths are in a series circuit?", a: "One", b: "Two", c: "Three", d: "Four", ans: "A" },
    { q: "Where are the lamps in a series circuit?", a: "On different batteries", b: "On the same path", c: "Outside the loop", d: "Inside the switch", ans: "B" },
    { q: "What happens if one lamp is taken out of a series circuit?", a: "All lamps go out.", b: "All lamps get brighter.", c: "A new branch appears.", d: "The battery becomes a generator.", ans: "A" },
    { q: "What may happen when more lamps are added in series?", a: "They may look dimmer.", b: "They make fuel.", c: "They turn into wires.", d: "They make the path wider.", ans: "A" },
    { q: "What are the different paths in a parallel circuit called?", a: "Loads", b: "Branches", c: "Panels", d: "Stations", ans: "B" },
    { q: "What can happen when one lamp breaks in a parallel circuit?", a: "Other lamps can stay on.", b: "The Sun stops shining.", c: "Every wire is removed.", d: "All batteries break.", ans: "A" },
    { q: "Why do homes use parallel circuits?", a: "Each light or appliance can work on its own.", b: "All lights must turn off together.", c: "Homes do not need switches.", d: "Each room needs a power station.", ans: "A" },
    { q: "Which sentence is true?", a: "A series circuit has many branches.", b: "A parallel circuit has two or more paths.", c: "An open loop lets current flow.", d: "Solar panels burn coal.", ans: "B" }
  ]
};

const mathY5 = [
  { q: "A technician joins a 2 m 35 cm cable to a 1 m 80 cm cable. What is the total length?", a: "3 m 15 cm", b: "4 m 15 cm", c: "4 m 5 cm", d: "415 m", ans: "B" },
  { q: "A 5 m wire is cut into 650 mm pieces. How many complete pieces are made, and how much wire remains?", a: "7 pieces, 450 mm", b: "7 pieces, 550 mm", c: "8 pieces, 200 mm", d: "6 pieces, 1,100 mm", ans: "A" },
  { q: "Three cables measure 1.2 m, 85 cm and 640 mm. What is their total length in millimetres?", a: "1,690 mm", b: "2,050 mm", c: "2,690 mm", d: "3,040 mm", ans: "C" },
  { q: "A box has a mass of 2 kg 750 g. Another box has a mass of 1 kg 680 g. What is their combined mass?", a: "3 kg 430 g", b: "4 kg 330 g", c: "4 kg 430 g", d: "4 kg 530 g", ans: "C" },
  { q: "An 8 kg bag of soil has 2,750 g removed. How much soil remains?", a: "5 kg 250 g", b: "5 kg 750 g", c: "6 kg 250 g", d: "7 kg 725 g", ans: "A" },
  { q: "Twelve packets each have a mass of 375 g. What is their total mass?", a: "3 kg 500 g", b: "4 kg 250 g", c: "4 kg 500 g", d: "45 kg", ans: "C" },
  { q: "A 6 L tank contains 2 L 450 mL. Then 1,850 mL is added. How much more is needed to fill the tank?", a: "1 L 300 mL", b: "1 L 700 mL", c: "2 L 300 mL", d: "3 L 700 mL", ans: "B" },
  { q: "Eight drink bottles each hold 750 mL. What is their total capacity?", a: "5 L", b: "5 L 750 mL", c: "6 L", d: "6 L 750 mL", ans: "C" },
  { q: "A 10 L container is used to fill four jugs with 1.65 L each. How much remains?", a: "3 L 40 mL", b: "3 L 400 mL", c: "4 L 400 mL", d: "6 L 600 mL", ans: "B" },
  { q: "An 18 m ribbon is shared equally among 12 students. How much does each student receive?", a: "15 cm", b: "120 cm", c: "150 cm", d: "180 cm", ans: "C" },
  { q: "A project uses three 125 cm shelves and four 240 mm braces. What is the total length of material in millimetres?", a: "3,990 mm", b: "4,110 mm", c: "4,710 mm", d: "5,100 mm", ans: "C" },
  { q: "Which order lists the lengths from shortest to longest?", a: "1.95 m, 198 cm, 2,005 mm", b: "198 cm, 1.95 m, 2,005 mm", c: "2,005 mm, 198 cm, 1.95 m", d: "1.95 m, 2,005 mm, 198 cm", ans: "A" },
  { q: "A parcel limit is 5 kg. Items weigh 1.85 kg, 950 g and 1.2 kg, and the packaging weighs 425 g. How far below the limit is the parcel?", a: "425 g", b: "500 g", c: "575 g", d: "1 kg 575 g", ans: "C" },
  { q: "A recipe needs 2.5 L of stock. How many 250 mL cups are needed?", a: "8", b: "10", c: "12", d: "100", ans: "B" },
  { q: "A runner completes four laps of a 750 m course. What total distance does the runner travel?", a: "1,500 m", b: "2,250 m", c: "3,000 m", d: "30,000 m", ans: "C" }
];

const mathY34 = [
  { q: "A rope is 2 m long. How many centimetres long is it?", a: "20 cm", b: "200 cm", c: "2,000 cm", d: "102 cm", ans: "B" },
  { q: "A garden path is 3 m 40 cm long. What is its length in centimetres?", a: "43 cm", b: "304 cm", c: "340 cm", d: "3,400 cm", ans: "C" },
  { q: "A pencil case is 65 cm long. What is this length in millimetres?", a: "6.5 mm", b: "65 mm", c: "650 mm", d: "6,500 mm", ans: "C" },
  { q: "A strip of card is 900 mm long. How many centimetres is this?", a: "9 cm", b: "90 cm", c: "900 cm", d: "9,000 cm", ans: "B" },
  { q: "A shelf is 1 m 5 cm long. What is its length in centimetres?", a: "15 cm", b: "100 cm", c: "105 cm", d: "150 cm", ans: "C" },
  { q: "A bag of rice has a mass of 2 kg. What is its mass in grams?", a: "20 g", b: "200 g", c: "2,000 g", d: "20,000 g", ans: "C" },
  { q: "A parcel has a mass of 3 kg 250 g. What is its mass in grams?", a: "325 g", b: "3,025 g", c: "3,250 g", d: "32,500 g", ans: "C" },
  { q: "One bag has a mass of 1 kg 200 g. Another has a mass of 800 g. What is their total mass?", a: "1 kg", b: "1 kg 800 g", c: "2 kg", d: "2 kg 800 g", ans: "C" },
  { q: "A pumpkin has a mass of 2,500 g. Which mixed measurement is equal to this?", a: "2 kg 50 g", b: "2 kg 500 g", c: "25 kg", d: "250 kg", ans: "B" },
  { q: "A water container holds 4 L. How many millilitres is this?", a: "40 mL", b: "400 mL", c: "4,000 mL", d: "40,000 mL", ans: "C" },
  { q: "A jug holds 2 L 350 mL. How many millilitres is this?", a: "235 mL", b: "2,035 mL", c: "2,350 mL", d: "23,500 mL", ans: "C" },
  { q: "Five cups each hold 200 mL. How much do they hold altogether?", a: "500 mL", b: "1 L", c: "2 L", d: "10 L", ans: "B" },
  { q: "A 3 L bottle has 750 mL poured out. How much remains?", a: "1 L 250 mL", b: "2 L 250 mL", c: "2 L 750 mL", d: "3 L 750 mL", ans: "B" },
  { q: "A blue ribbon is 1 m 20 cm long. A red ribbon is 125 cm long. How much longer is the red ribbon?", a: "5 cm", b: "20 cm", c: "25 cm", d: "105 cm", ans: "A" },
  { q: "A 300 cm rope is cut into four 50 cm pieces. How much rope remains?", a: "50 cm", b: "1 m", c: "2 m", d: "250 cm", ans: "B" }
];

module.exports = { texts, comp, mathY5, mathY34 };
