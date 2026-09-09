/* Fictional science cases for the Great Neighbourhood Film Festival. */
window.FestivalScience = {
  missions: [
    {
      id: "m04",
      title: "Power the Premiere",
      film: 4,
      type: "core",
      brief: "The Bayview screening tent is ready, but its low-voltage model lighting circuit has stopped working. Read the technician's notes, use the circuit evidence and advise the festival team. This is a paper-and-screen investigation only: never connect, change or repair a real electrical circuit.",
      reading: {
        main: {
          title: "Technician's case file: The dark tent",
          paragraphs: [
            "Bayview is planning an evening screening. To test the look of the tent, the team made a small model circuit. It uses two 1.5 V cells in a battery holder, three miniature lamps, insulated leads and a switch. The model is low voltage and is only handled by an adult during the event. It is separate from all building power.",
            "At 3:10 pm, all three lamps shone when the switch was closed. At 3:15 pm, the lamps were dark. The switch was still closed. Technician Mina checked the model without touching bare wire. She found that one lead had slipped out of the battery holder. She also noticed that a small piece of cardboard had been pushed between the two metal parts of the switch.",
            "The lamps are connected in series. This means there is one path for electric current to travel from the cells, through each lamp, and back to the cells. If there is a gap anywhere on that path, current cannot complete the journey. All of the lamps will be dark. A closed switch makes a complete path. An open switch makes a gap.",
            "Mina's safe plan is to ask the supervising adult to turn the switch off, reconnect the loose lead firmly in the holder and remove the cardboard from the switch. The adult will then close the switch and observe the lamps. Mina has also labelled the model: 'Low-voltage demonstration only. Do not use wall sockets or mains electricity.'",
            "The festival director asks for a short explanation for volunteers. It must say what caused the dark lamps, why one break affects every lamp in this series circuit, and what people should do if a circuit does not work. The director wants careful science words, but also clear safety advice."
          ]
        },
        support: [
          {
            title: "Evidence card: Mina's observations",
            text: "Switch position: closed. Battery holder: one lead was loose. Lamps: all three were dark. Circuit arrangement: series. Safety rule: only the supervising adult changes the model circuit."
          },
          {
            title: "Word bank",
            text: "cell: a source of electrical energy in a small circuit; current: electricity moving around a complete path; series circuit: one path through all components; closed switch: a switch that completes the path; open switch: a switch that leaves a gap."
          }
        ]
      },
      sources: [
        { label: "Festival model-circuit inventory", detail: "Fictional classroom evidence card, Bayview Festival Team." },
        { label: "Technician's case file", detail: "Fictional classroom scenario written for this activity." }
      ],
      questions: [
        {
          id: "m04-q1",
          type: "choice",
          prompt: "Which observation is the strongest evidence that the circuit had a gap?",
          options: ["The tent was ready for a screening.", "One lead had slipped out of the battery holder.", "The lamps were miniature lamps.", "Mina checked at 3:15 pm."],
          answer: 1,
          feedback: { correct: "Yes. A loose lead can break the path for current.", incorrect: "Look for an observation that stops current travelling in a complete path." }
        },
        {
          id: "m04-q2",
          type: "choice",
          prompt: "Why were all three lamps dark when one lead was loose?",
          options: ["The lamps were in a series circuit with one path.", "Each lamp made its own separate path.", "The cardboard made the lamps brighter.", "The cells had become larger."],
          answer: 0,
          feedback: { correct: "Correct. A series circuit has one path, so one break stops current everywhere in that path.", incorrect: "Re-read the paragraph that explains a series circuit." }
        },
        {
          id: "m04-q3",
          type: "short",
          prompt: "Put Mina's safe plan in the right order. Explain why the adult should turn the switch off before reconnecting the lead.",
          answer: ["turn the switch off", "reconnect the loose lead", "remove the cardboard", "close the switch", "observe the lamps"],
          feedback: { correct: "Check that your order begins with making the model safe and ends with observing the result.", incorrect: "Use the steps in Mina's safe plan. Do not suggest using wall sockets or repairing real electrical equipment." }
        }
      ],
      writing: {
        prompt: "Write a clear 8–10 sentence volunteer note called 'Why the model lights went out'. Explain the cause, use the words series circuit and complete path correctly, and give two safe actions volunteers should take. Use at least two details from the case file.",
        stems: ["The most likely cause was...", "Because the lamps were connected in series...", "A complete path means...", "For safety, volunteers should...", "The case file shows this because..."]
      },
      criteria: [
        "Explains that a loose lead or open switch creates a gap in the circuit.",
        "Uses evidence from the case file and explains why all series lamps went dark.",
        "Gives sensible low-voltage safety advice and does not suggest using mains electricity."
      ],
      extension: "A fourth lamp is added in series and then all four lamps look dim. Write a prediction about why this may happen. Then design a fair adult-led test using only the model: state what to change, what to keep the same and what to observe.",
      sourceNote: "All people, places, measurements and documents in this mission are fictional. The circuit ideas are age-appropriate general science concepts; local school electrical-safety rules always apply."
    },
    {
      id: "e02",
      title: "The Generation Choice",
      film: 8,
      type: "extension",
      brief: "The festival committee needs to explain how electricity can be generated for its daytime and evening events. Compare three fictional options and recommend a sensible mix. Your job is to use the supplied evidence, not to search for a single 'perfect' answer.",
      reading: {
        main: {
          title: "Committee dossier: Keeping the screens running",
          paragraphs: [
            "Electricity is not a fuel that appears by itself. It can be generated when another form of energy is changed into electrical energy. Different places have different useful energy sources. The committee is comparing three possible sources for the fictional Bayview festival: solar panels, a wind turbine and a diesel generator. The real festival would use qualified adults and approved equipment; students are only analysing the plan.",
            "Option A is solar panels on the sunny school hall roof. During a clear day, the panels can generate electricity from sunlight. They make no smoke while operating. However, their output falls in shade and they do not make electricity from sunlight after dark. The team could use batteries charged earlier in the day, but batteries store energy; they do not generate it.",
            "Option B is a small wind turbine at the open sports field. Moving air turns blades. The turning motion is used by a generator to make electricity. On windy afternoons, this option may help. On still days, it may make very little. The committee also needs to consider where it can be placed safely and whether its sound would disturb a quiet film scene.",
            "Option C is a diesel generator. Fuel is burned to make the engine turn, and the turning engine drives a generator. It can provide electricity when the sun is down or the air is still. It also uses fuel, makes exhaust gases and can be noisy. The committee says it should be a back-up, used only if trained adults decide it is needed.",
            "The festival needs some electricity at 12:00 pm for ticket scanning and more at 7:00 pm for the projector and lights. The weather note says the afternoon is likely to be sunny with light wind. The committee wants a plan that is reliable, reduces pollution where practical and explains what will happen if the weather changes."
          ]
        },
        support: [
          {
            title: "Evidence table: Bayview forecast and needs",
            text: "12:00 pm: sunny, light wind, low electricity need. 4:00 pm: sunny, light wind, batteries can be charged if there is spare solar electricity. 7:00 pm: dark, light wind, high electricity need for projector and lights."
          },
          {
            title: "Energy pathway reminder",
            text: "Solar: sunlight → electrical energy. Wind: moving air → turning blades → electrical energy. Diesel: chemical energy in fuel → movement in an engine → electrical energy. Battery: stored energy → electrical energy; it stores energy made earlier."
          }
        ]
      },
      sources: [
        { label: "Bayview energy options dossier", detail: "Fictional comparison prepared for this classroom activity." },
        { label: "Festival weather and demand note", detail: "Fictional classroom evidence table." }
      ],
      questions: [
        {
          id: "e02-q1",
          type: "choice",
          prompt: "Which statement best describes a battery in this plan?",
          options: ["It makes sunlight.", "It stores energy that can be used later.", "It creates wind.", "It burns fuel to make electricity."],
          answer: 1,
          feedback: { correct: "Correct. A battery can store energy from an earlier time for later use.", incorrect: "Use the energy pathway reminder: a battery is a store, not a sunlight or wind source." }
        },
        {
          id: "e02-q2",
          type: "choice",
          prompt: "At 7:00 pm, why would solar panels alone be an unreliable choice?",
          options: ["It is dark, so there is no sunlight for the panels.", "The panels make the wind stop.", "The festival does not need much electricity then.", "Solar panels only work in the morning."],
          answer: 0,
          feedback: { correct: "Yes. The evidence says the high-demand screening is after dark.", incorrect: "Check the time, weather and electricity need in the evidence table." }
        },
        {
          id: "e02-q3",
          type: "short",
          prompt: "Name one benefit and one limit of wind power in this festival case. Support each point with a detail from the dossier.",
          answer: ["benefit: can generate electricity when wind turns the blades", "limit: little electricity in still or light wind; possible sound or safe placement issue"],
          feedback: { correct: "Your answer should include both a helpful feature and a limitation linked to the supplied case.", incorrect: "Avoid a general internet answer. Use the sports-field and light-wind details from this dossier." }
        }
      ],
      writing: {
        prompt: "Write a 10–12 sentence recommendation to the committee. Choose an electricity plan for 12:00 pm and 7:00 pm. Explain the energy changes in two sources, give one environmental reason for your choice, and include a back-up plan if the weather changes. Refer to at least three pieces of dossier evidence.",
        stems: ["At 12:00 pm, the best starting source is... because...", "This source changes ... energy into electrical energy.", "At 7:00 pm, solar panels alone would not...", "A benefit for the environment is...", "If the weather changes, the committee could...", "The dossier supports this plan because..."]
      },
      criteria: [
        "Recommends a plan that responds to the different daytime and evening needs.",
        "Accurately describes at least two energy changes, including the difference between generating and storing energy.",
        "Uses dossier evidence to weigh reliability, pollution and a sensible back-up."
      ],
      extension: "New information arrives: thick cloud is expected from 2:00 pm and the wind may become strong by 6:00 pm. Revise your recommendation in a short update. State one part you would keep, one part you would change and why. Explain one safety or noise question adults would need to check before using the wind option.",
      sourceNote: "All locations, equipment choices, weather details and committee documents are fictional. This is a scientific comparison task, not advice for installing or operating electrical generation equipment."
    }
  ]
};
