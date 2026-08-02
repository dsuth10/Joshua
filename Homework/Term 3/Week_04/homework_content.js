const texts = {
  Red: {
    title: "Many Ways to Generate Electricity",
    paragraphs: [
      "Electricity is not a raw fuel that can be dug from the ground. It carries energy that has changed from another form. We use it to power lights, tools and machines. Most large power stations use a generator. Inside a generator, coils of wire and magnets move past one another. This movement produces an electric current. This effect is called induction. The generator does not create energy; it changes movement energy into electrical energy.",
      "Thermal power stations begin with heat. Coal, natural gas or biomass may be burned, while nuclear stations release heat by splitting atoms. Geothermal stations use heat from beneath Earth's surface. In many of these stations, heat turns water into high-pressure steam. The steam spins a turbine, and the turbine drives a generator. Coal and gas can generate electricity when it is needed, but burning them releases greenhouse gases. Nuclear generation releases very little carbon dioxide while operating, yet radioactive waste must be managed safely. Geothermal power is reliable, but suitable hot-rock locations are limited.",
      "Other systems use movement without first making steam. Wind pushes turbine blades, while flowing water spins turbines in hydroelectric stations. Tidal generators use the regular movement of ocean water. Wind does not need fuel, but its output changes with the weather. Hydroelectric stations can respond quickly when demand rises, although dams may change river habitats. Tides are predictable, but tidal equipment is costly and can operate only in suitable coastal places.",
      "Solar photovoltaic panels are different because they have no turbine or generator. Their semiconductor cells transfer energy from sunlight directly to moving electric charges. Panels can be placed on roofs or grouped in large solar farms. Solar electricity produces no exhaust while operating, but generation falls at night and during heavy cloud.",
      "A reliable grid usually combines several methods. Steady or controllable sources help when wind and sunlight are low, while renewable sources reduce the need to burn fossil fuels. Batteries and pumped hydro can store energy for later use. Engineers compare cost, reliability, location, building effects, waste and greenhouse gases. There is no perfect source, so communities choose an electricity mix that balances benefits and drawbacks. The best mix can change from place to place."
    ]
  },
  Blue: {
    title: "How We Generate Electricity",
    paragraphs: [
      "Electricity is made when one kind of energy changes into another. This can be done in many ways. Many power stations use a machine called a generator. Inside it, magnets and coils of wire move past each other. This makes electric current. A turbine often turns the machine. The generator changes movement energy into electrical energy.",
      "Some stations use heat to make steam. Coal, gas or plant matter can be burned for heat. Nuclear stations get heat by splitting atoms. Geothermal stations use heat from underground. The steam spins a turbine, which turns the generator. Coal and gas can make power when it is needed, but they release greenhouse gases. Nuclear stations release little carbon dioxide while running, but their waste needs safe storage. Each method has a cost.",
      "Wind, flowing water and tides can spin turbines without making steam first. Wind turbines work only when there is enough wind. No wind means less power. Hydroelectric stations use water held by a dam or moving through a river. The water can be saved until it is needed. These stations can react fast when people need more power, but dams can change river homes. Tides are easy to plan for, but tidal systems need the right coastline.",
      "Solar panels work in another way. Their cells use sunlight to make electricity, so they do not need a turbine. Rooftops and solar farms can both hold panels. There is no smoke from the panels. Solar power makes less electricity at night or under thick cloud.",
      "Power grids often use a mix of sources. Batteries and pumped hydro can store energy for times when the Sun is not shining or the wind is weak. Engineers compare cost, how well a source works, where it can be built and how it affects nature. Each way has good points and limits. A good mix helps keep the lights on."
    ]
  },
  Green: {
    title: "Ways to Make Electricity",
    paragraphs: [
      "Electricity is made from other kinds of energy. Many power stations use a generator. Magnets and wire move inside it. This movement makes electric current. A turbine can turn the generator.",
      "Some stations use heat to make steam. Coal and gas can be burned for heat. Nuclear stations also make heat. The steam spins a turbine. Coal and gas make gases that warm Earth.",
      "Wind and moving water can spin turbines too. A dam can hold water for a hydroelectric station. Wind power changes when the wind changes. Dams may change river homes for plants and animals.",
      "Solar panels use light from the Sun. They make electricity without a turbine. They work best in bright sunlight. Batteries can store energy for later. Most places use a mix of sources because every source has good points and limits. A good mix helps keep lights on when one source makes less power. This is useful."
    ]
  }
};

const comp = {
  Red: [
    { q: "Why is electricity described as an energy carrier?", a: "It is mined as a finished fuel.", b: "It carries energy that has been transformed from another source.", c: "It can be produced only by magnets.", d: "It stores all energy permanently.", ans: "B" },
    { q: "What energy change occurs in most large generators?", a: "Mechanical energy becomes electrical energy.", b: "Electrical energy becomes nuclear energy.", c: "Heat energy becomes stored coal.", d: "Light energy becomes moving water.", ans: "A" },
    { q: "What produces current inside the generator described?", a: "Steam touching the wires", b: "Fuel flowing through the turbine", c: "Magnets and coils moving past one another", d: "Sunlight heating a dam", ans: "C" },
    { q: "What common step links coal, nuclear and geothermal stations in the text?", a: "They all burn fossil fuels.", b: "They all use heat to help spin a turbine.", c: "They all depend on windy weather.", d: "They all use coastal tides.", ans: "B" },
    { q: "Which trade-off is stated for nuclear generation?", a: "It creates greenhouse gases but no waste.", b: "It works only during daylight.", c: "It releases little carbon dioxide while operating, but its waste needs safe management.", d: "It is cheap but cannot produce heat.", ans: "C" },
    { q: "Why can geothermal power not be built equally well everywhere?", a: "Suitable underground heat locations are limited.", b: "Geothermal stations need ocean tides.", c: "Their turbines cannot turn generators.", d: "They require thick cloud.", ans: "A" },
    { q: "How do wind and hydroelectric systems differ from many thermal stations?", a: "They use movement to spin turbines without first making steam.", b: "They produce electricity without movement.", c: "They always burn biomass.", d: "They use semiconductor cells.", ans: "A" },
    { q: "What advantage of hydroelectric generation is mentioned?", a: "It can work on every coastline.", b: "It can respond quickly when demand rises.", c: "It never changes habitats.", d: "It needs no flowing water.", ans: "B" },
    { q: "Why might tidal generation be easier to plan than wind generation?", a: "Tides are predictable.", b: "Tides release greenhouse gases.", c: "Tidal equipment works on rooftops.", d: "Tides are available in every location.", ans: "A" },
    { q: "What makes solar photovoltaic generation different from the other methods described?", a: "It uses steam made from sunlight.", b: "It transforms sunlight directly without a turbine or generator.", c: "It stores radioactive waste.", d: "It depends on flowing rivers.", ans: "B" },
    { q: "What limitation affects solar generation?", a: "It cannot be installed on roofs.", b: "It always produces greenhouse gases.", c: "Its output falls at night and during heavy cloud.", d: "It requires a dam.", ans: "C" },
    { q: "Why does the text support using a mixture of electricity sources?", a: "Every source has identical strengths.", b: "One source can cover the limits of another.", c: "A grid can operate only one generator.", d: "Stored energy cannot be used later.", ans: "B" },
    { q: "What role can batteries and pumped hydro play?", a: "They create fossil fuels.", b: "They store energy for later use.", c: "They make tides more predictable.", d: "They replace all transmission lines.", ans: "B" },
    { q: "Which factor is NOT listed for engineers to compare?", a: "Reliability", b: "Waste", c: "Greenhouse emissions", d: "The colour of turbine blades", ans: "D" },
    { q: "What is the main conclusion of the text?", a: "Coal is the only reliable source.", b: "Every community should use the same source.", c: "An electricity mix balances the benefits and drawbacks of different methods.", d: "Solar panels work best at night.", ans: "C" }
  ],
  Blue: [
    { q: "How is electricity made, according to the text?", a: "By changing another form of energy", b: "By digging up electric current", c: "By storing sunlight in coal", d: "By stopping all movement", ans: "A" },
    { q: "What moves inside a generator to produce current?", a: "Rivers and dams", b: "Magnets and coils of wire", c: "Coal and gas", d: "Clouds and sunlight", ans: "B" },
    { q: "What often provides the movement for a generator?", a: "A battery", b: "A coastline", c: "A turbine", d: "A rooftop", ans: "C" },
    { q: "What do thermal stations use steam to do?", a: "Store nuclear waste", b: "Spin a turbine", c: "Block sunlight", d: "Cool a solar panel", ans: "B" },
    { q: "Which source uses heat from underground?", a: "Geothermal", b: "Wind", c: "Tidal", d: "Solar", ans: "A" },
    { q: "What problem is linked to burning coal and gas?", a: "They stop turbines.", b: "They release greenhouse gases.", c: "They require sunlight.", d: "They change ocean tides.", ans: "B" },
    { q: "What must happen to waste from nuclear stations?", a: "It must be stored carefully.", b: "It must be burned as coal.", c: "It must be placed on rooftops.", d: "It must spin a turbine.", ans: "A" },
    { q: "Which sources can spin turbines without first making steam?", a: "Coal, gas and biomass", b: "Wind, flowing water and tides", c: "Solar panels and batteries", d: "Nuclear fuel and cloud", ans: "B" },
    { q: "When does a wind turbine produce less electricity?", a: "When the wind is weak", b: "When a river is flowing", c: "When demand rises", d: "When a battery is charged", ans: "A" },
    { q: "What is one drawback of hydroelectric dams?", a: "They cannot use water.", b: "They may change river habitats.", c: "They create radioactive waste.", d: "They work only on roofs.", ans: "B" },
    { q: "What is an advantage of tides?", a: "They are easy to predict.", b: "They work in every inland town.", c: "They never move.", d: "They store sunlight.", ans: "A" },
    { q: "Why do solar panels not need a turbine?", a: "Their cells change sunlight directly into electrical energy.", b: "They burn gas inside each cell.", c: "They use a dam to move water.", d: "They split atoms.", ans: "A" },
    { q: "When does solar generation usually fall?", a: "At night or under thick cloud", b: "When tides move", c: "When a generator turns", d: "When a battery stores energy", ans: "A" },
    { q: "What can store energy for use later?", a: "Coal smoke and cloud", b: "Batteries and pumped hydro", c: "Turbine blades and roofs", d: "Nuclear waste and magnets", ans: "B" },
    { q: "Why do electricity grids use a mixture of sources?", a: "Every source has advantages and limits.", b: "Only one source can make current.", c: "All sources work in exactly the same way.", d: "Engineers do not compare environmental effects.", ans: "A" }
  ],
  Green: [
    { q: "What is electricity made from?", a: "Other kinds of energy", b: "Only rocks", c: "Only water", d: "Only wire", ans: "A" },
    { q: "What do many power stations use?", a: "A spoon", b: "A generator", c: "A book", d: "A tree", ans: "B" },
    { q: "What moves inside a generator?", a: "Magnets and wire", b: "Plants and soil", c: "Coal and gas", d: "Clouds and rain", ans: "A" },
    { q: "What can turn a generator?", a: "A battery", b: "A turbine", c: "A roof", d: "A river home", ans: "B" },
    { q: "What do some stations use heat to make?", a: "Steam", b: "Wind", c: "Sunlight", d: "Wire", ans: "A" },
    { q: "Which two fuels can be burned for heat?", a: "Coal and gas", b: "Water and wind", c: "Sun and tides", d: "Wire and magnets", ans: "A" },
    { q: "What does steam spin?", a: "A solar panel", b: "A turbine", c: "A battery", d: "A cloud", ans: "B" },
    { q: "What can coal and gas make?", a: "Gases that warm Earth", b: "Bright sunlight", c: "River homes", d: "Stored water", ans: "A" },
    { q: "What two things can spin turbines?", a: "Wind and moving water", b: "Coal and wire", c: "Sunlight and batteries", d: "Plants and animals", ans: "A" },
    { q: "What can a dam hold?", a: "Wind", b: "Water", c: "Sunlight", d: "Magnets", ans: "B" },
    { q: "What happens to wind power when the wind changes?", a: "It changes too.", b: "It becomes coal.", c: "It stores water.", d: "It makes sunlight.", ans: "A" },
    { q: "What may dams change?", a: "River homes for plants and animals", b: "The magnets in a generator", c: "The light from the Sun", d: "The size of a battery", ans: "A" },
    { q: "What do solar panels use?", a: "Light from the Sun", b: "Burning coal", c: "Moving tides", d: "Nuclear waste", ans: "A" },
    { q: "What can store energy for later?", a: "A turbine", b: "A battery", c: "A cloud", d: "A dam wall", ans: "B" },
    { q: "Why do most places use a mix of sources?", a: "Every source has good points and limits.", b: "Only solar panels make electricity.", c: "All sources need coal.", d: "Wind never changes.", ans: "A" }
  ]
};

const mathY5 = [
  { q: "Which fraction is equivalent to 3/5?", a: "6/15", b: "9/20", c: "12/20", d: "15/30", ans: "C" },
  { q: "Simplify 14/21 to its lowest terms.", a: "2/3", b: "7/10", c: "4/7", d: "12/18", ans: "A" },
  { q: "Complete the equivalent fraction: 5/8 = ?/24.", a: "10/24", b: "13/24", c: "15/24", d: "20/24", ans: "C" },
  { q: "Which fraction is 9/12 written in simplest form?", a: "2/3", b: "3/4", c: "4/5", d: "6/8", ans: "B" },
  { q: "Complete the equivalent fraction: 7/10 = ?/100.", a: "7/100", b: "17/100", c: "70/100", d: "700/100", ans: "C" },
  { q: "Which fraction is NOT equivalent to 4/6?", a: "2/3", b: "8/12", c: "12/18", d: "16/20", ans: "D" },
  { q: "A recipe uses 6/8 of a cup of oats. What is this amount in simplest form?", a: "2/3 cup", b: "3/4 cup", c: "4/5 cup", d: "5/6 cup", ans: "B" },
  { q: "What is 3/10 + 4/10?", a: "7/10", b: "7/20", c: "1/10", d: "12/10", ans: "A" },
  { q: "Calculate 11/12 - 5/12 and simplify the answer.", a: "5/12", b: "6/12", c: "1/2", d: "6/24", ans: "C" },
  { q: "A class reads 2/7 of a book on Monday, 3/7 on Tuesday and 1/7 on Wednesday. How much is read altogether?", a: "5/7", b: "6/7", c: "6/21", d: "1 whole", ans: "B" },
  { q: "A tank is 9/10 full. Then 3/10 of the tank is used. What fraction remains, in simplest form?", a: "3/10", b: "6/10", c: "3/5", d: "7/10", ans: "C" },
  { q: "Mia walks 5/8 of a trail in the morning and 2/8 in the afternoon. How much of the trail does she walk?", a: "7/8", b: "7/16", c: "3/8", d: "1 whole", ans: "A" },
  { q: "A ribbon is 13/15 m long. If 4/15 m is cut off, how much remains in simplest form?", a: "9/15 m", b: "3/5 m", c: "9/30 m", d: "17/15 m", ans: "B" },
  { q: "A garden uses 4/12 of its area for flowers and 5/12 for vegetables. What fraction is used altogether, in simplest form?", a: "9/12", b: "3/4", c: "9/24", d: "1/12", ans: "B" },
  { q: "A baker has 17/20 of a tray of slices and sells 9/20. What fraction remains, in simplest form?", a: "8/20", b: "2/5", c: "8/40", d: "13/20", ans: "B" }
];

const mathY34 = [
  { q: "Which fraction is equivalent to 1/2?", a: "1/4", b: "2/4", c: "2/3", d: "3/4", ans: "B" },
  { q: "Complete the equivalent fraction: 1/3 = ?/6.", a: "1/6", b: "2/6", c: "3/6", d: "4/6", ans: "B" },
  { q: "Which fraction is equivalent to 2/5?", a: "3/10", b: "4/10", c: "5/10", d: "6/10", ans: "B" },
  { q: "Complete the equivalent fraction: 3/4 = ?/8.", a: "4/8", b: "5/8", c: "6/8", d: "7/8", ans: "C" },
  { q: "Simplify 5/10.", a: "1/2", b: "1/5", c: "2/5", d: "5/5", ans: "A" },
  { q: "Simplify 2/4.", a: "1/4", b: "1/2", c: "2/3", d: "3/4", ans: "B" },
  { q: "Which fraction is equal to one whole?", a: "1/4", b: "2/4", c: "3/4", d: "4/4", ans: "D" },
  { q: "What is 1/4 + 2/4?", a: "3/4", b: "3/8", c: "1/2", d: "2/4", ans: "A" },
  { q: "What is 3/5 - 1/5?", a: "1/5", b: "2/5", c: "2/10", d: "4/5", ans: "B" },
  { q: "What is 2/10 + 5/10?", a: "7/10", b: "7/20", c: "3/10", d: "1 whole", ans: "A" },
  { q: "What is 4/4 - 1/4?", a: "1/4", b: "2/4", c: "3/4", d: "4/4", ans: "C" },
  { q: "What is 1/3 + 1/3?", a: "1/3", b: "2/3", c: "2/6", d: "3/3", ans: "B" },
  { q: "What is 5/5 - 2/5?", a: "2/5", b: "3/5", c: "3/10", d: "7/5", ans: "B" },
  { q: "What is 2/6 + 3/6?", a: "5/6", b: "5/12", c: "1/6", d: "6/6", ans: "A" },
  { q: "What is 7/8 - 2/8?", a: "5/8", b: "5/16", c: "9/8", d: "2/8", ans: "A" }
];

module.exports = { texts, comp, mathY5, mathY34 };
