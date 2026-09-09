/* Fictional science case files for the Great Neighbourhood Film Festival. */
window.FestivalScience = {
  missions: [
    {
      id: "m04",
      title: "Power the Premiere",
      film: 4,
      type: "core",
      brief: "A low-voltage model lighting circuit has failed just before the Bayview premiere. Work like a technician: use the observations, identify the most likely fault and revise your advice when an adult-led test is reported.",
      caseOpening: {
        title: "Incident report: 3:15 pm",
        text: "The Bayview team is testing a small model of the screening tent. Its three miniature lamps were glowing at 3:10 pm. Five minutes later, every lamp was dark. The model uses two 1.5 V cells in a holder, insulated leads, a switch and three lamps in series. It is a classroom model only. Students never touch, repair or connect electrical equipment; an adult handles the model. The director needs an explanation for volunteers before the evening screening."
      },
      evidence: [
        {
          id: "m04-e1",
          label: "Technician Mina's observation log",
          kind: "observation log",
          text: "Mina looked at the model without moving any parts. The switch looked closed. One red lead was no longer held firmly in the battery holder. A folded piece of cardboard was also caught between the two metal contacts of the switch. The lamps had not been changed since 3:10 pm. Mina wrote: 'There may be more than one gap. Do not guess which one has caused the problem.'"
        },
        {
          id: "m04-e2",
          label: "Circuit diagram note",
          kind: "science note",
          text: "The three lamps are connected in series. A series circuit has one continuous path for current: from the cells, through each lamp and back to the cells. A loose lead can make a gap. A switch with something between its contacts can also make a gap, even when its handle looks closed. If there is a gap anywhere in this one path, current cannot travel through any of the lamps."
        },
        {
          id: "m04-e3",
          label: "Volunteer suggestion card",
          kind: "proposal",
          text: "A volunteer suggests replacing all three lamps straight away because they are dark. Another volunteer suggests plugging the model into a wall socket so the lamps will be brighter. Mina crosses out both ideas. She says the first idea does not use the evidence, and the second is unsafe and changes the model's design. She asks the supervising adult to test one possible cause at a time."
        }
      ],
      support: {
        title: "Reading support: useful science words",
        text: "A complete path lets current travel from the cells and back again. A gap stops it. In a series circuit there is one path, so one gap can make every lamp go dark. The observation log gives clues; it does not prove which gap caused the failure until an adult tests it."
      },
      questions: [
        {
          id: "m04-q1",
          phase: "notice",
          kind: "choice",
          prompt: "Which detail is direct evidence that the circuit may have had a gap?",
          options: ["The test happened at 3:15 pm.", "One lead was no longer held firmly in the battery holder.", "The model had three lamps.", "The director wanted an explanation."],
          answer: 1,
          feedback: { correct: "Yes. A loose lead can break the continuous path.", incorrect: "Choose an observation that could stop current travelling around the circuit." },
          evidenceIds: ["m04-e1"]
        },
        {
          id: "m04-q2",
          phase: "connect",
          kind: "text",
          prompt: "Use Mina's log and the circuit diagram note. Explain why a gap at either the loose lead or the switch could make all three lamps dark, even though only one part is faulty.",
          feedback: { correct: "Link the two possible gaps to the one path in a series circuit.", incorrect: "Use both sources. Explain the effect of one break in one continuous path." },
          evidenceIds: ["m04-e1", "m04-e2"]
        },
        {
          id: "m04-q3",
          phase: "decide",
          kind: "text",
          prompt: "Which volunteer suggestion should Mina reject first, and why? Give one safety reason and one evidence reason.",
          feedback: { correct: "Your answer should use the safety boundary and explain why evidence matters before replacing parts.", incorrect: "Read the volunteer card closely. One proposal is unsafe; the other jumps to a conclusion without testing." },
          evidenceIds: ["m04-e1", "m04-e3"]
        },
        {
          id: "m04-q4",
          phase: "update",
          kind: "text",
          prompt: "After the adult test, what does the result show about the cardboard? Explain what it rules in or rules out, and name one question that still needs checking.",
          feedback: { correct: "Use the test result to distinguish evidence from a final diagnosis.", incorrect: "A test can make one explanation more likely without proving that every other part is working." },
          evidenceIds: ["m04-e4"]
        }
      ],
      firstDecision: {
        prompt: "Write Mina's first technician note (one well-developed paragraph). Identify the most likely cause or causes, explain how the series circuit helps you reason, and give the adult-led test order you recommend. Use at least two pieces of evidence.",
        stems: ["The observations suggest...", "In a series circuit...", "Before changing anything, the supervising adult should...", "This test would help because..."],
        criteria: ["Identifies evidence-based possible causes without claiming certainty too early.", "Explains one-path series-circuit reasoning accurately.", "Keeps the investigation adult-led and safe."]
      },
      update: {
        title: "Update from the supervising adult: 3:24 pm",
        text: "With the switch turned off, the supervising adult removed the cardboard and then closed the switch. The lamps were still dark. The adult turned the switch off again, secured the loose red lead in the holder, and closed the switch. All three lamps glowed. Mina notes that the cardboard was a possible gap, but it was not the gap that stopped the lamps in this test. The team has not tested how firmly the switch contacts close over a longer time.",
        prompt: "Revise the volunteer explanation in a second paragraph. State what the adult test now shows, correct or confirm your first diagnosis, and give one sensible next check. Explain why this is stronger than simply guessing from the first observation.",
        stems: ["The adult test shows...", "I would revise my first note because...", "The next sensible check is...", "This conclusion is stronger because..."],
        criteria: ["Uses the test result accurately.", "Revises the diagnosis rather than repeating the first claim.", "Explains the value of testing evidence safely."]
      },
      finalCriteria: [
        "Uses observations and the adult test to distinguish a possible cause from the confirmed cause.",
        "Explains why one gap makes every lamp in this series circuit go dark.",
        "Gives clear, safe advice that keeps all work on the low-voltage model with a supervising adult."
      ],
      sourceNote: "All people, places, equipment and documents in this mission are fictional. The task is a paper-and-screen investigation; local school safety rules always apply."
    },
    {
      id: "e02",
      title: "The Generation Choice",
      film: 8,
      type: "extension",
      brief: "Bayview needs electricity for a quiet daytime workshop and an evening premiere. Compare generation and storage options, make a reasoned plan, then revise it when the forecast and demand change.",
      caseOpening: {
        title: "Committee meeting: two very different sessions",
        text: "The festival committee is planning electricity for a fictional event. At 12:00 pm, ticket scanners and a small display need a little electricity. At 7:00 pm, a projector and model lights need much more. The committee can ask qualified adults to arrange approved equipment, but students are only analysing the choices. They want a plan that is reliable, considers pollution and noise, and does not pretend one source is perfect in every condition."
      },
      evidence: [
        {
          id: "e02-e1",
          label: "Energy options dossier",
          kind: "comparison note",
          text: "Solar panels change sunlight into electrical energy. They make no exhaust while operating, but their output falls in shade and they cannot generate from sunlight after dark. A battery stores energy made earlier and can release electrical energy later; it is not a generator. A small wind turbine changes moving air into turning blades, then electrical energy. It may help on a windy day but produces little in light wind. A diesel generator changes chemical energy in fuel into movement, then electrical energy. It can be reliable but uses fuel, makes exhaust and can be noisy."
        },
        {
          id: "e02-e2",
          label: "First forecast and demand table",
          kind: "data table",
          text: "12:00 pm: sunny, light wind, low demand. 4:00 pm: sunny, light wind, low demand; spare solar electricity could charge a battery. 7:00 pm: dark, light wind, high demand for projector and lights. The quiet documentary begins at 7:05 pm, so the committee wants to avoid a noisy option close to the tent if another stored or generated source can meet the need."
        },
        {
          id: "e02-e3",
          label: "Two committee messages",
          kind: "perspectives",
          text: "Kai writes, 'Use solar for everything. It is clean, so it must be the best choice.' Rina writes, 'Use the diesel generator for everything. It will always work.' The chair says both messages notice one real benefit but leave out important conditions. The committee must explain when a source can generate, when stored energy may help, and what back-up would be reasonable."
        }
      ],
      support: {
        title: "Reading support: generation and storage",
        text: "Generating means changing another energy source into electrical energy. Storing means keeping energy made earlier for later use. Match each time in the forecast table to the conditions: sunlight, moving air, or darkness. Then ask whether the event needs a small or large amount of electricity."
      },
      questions: [
        {
          id: "e02-q1",
          phase: "notice",
          kind: "choice",
          prompt: "Which statement correctly describes the battery in this case?",
          options: ["It creates sunlight for the solar panels.", "It stores energy made earlier so it can be used later.", "It makes wind turn the turbine.", "It burns fuel to generate electricity."],
          answer: 1,
          feedback: { correct: "Correct. A battery stores energy; it does not generate sunlight or wind power.", incorrect: "Look for the difference between generating energy and storing energy." },
          evidenceIds: ["e02-e1"]
        },
        {
          id: "e02-q2",
          phase: "connect",
          kind: "text",
          prompt: "Use the dossier and the first forecast table. Explain why solar panels could be useful at 12:00 pm and 4:00 pm but cannot be the only source of electricity at 7:00 pm.",
          feedback: { correct: "Connect the time, sunlight and changing demand to the solar information.", incorrect: "Use details from both the energy dossier and the timetable." },
          evidenceIds: ["e02-e1", "e02-e2"]
        },
        {
          id: "e02-q3",
          phase: "decide",
          kind: "text",
          prompt: "What important condition does Kai leave out, and what important condition does Rina leave out? Explain why these missing conditions make their messages too simple.",
          feedback: { correct: "Name a condition that matters for each claim, then explain its effect on the plan.", incorrect: "Both writers have noticed a benefit. Look for the evidence they have ignored." },
          evidenceIds: ["e02-e1", "e02-e2", "e02-e3"]
        },
        {
          id: "e02-q4",
          phase: "update",
          kind: "text",
          prompt: "Which part of your first plan is no longer reliable after the update? Describe one change that responds to both the cloudy afternoon and the later, higher demand.",
          feedback: { correct: "Use the changed weather and the changed amount of electricity needed.", incorrect: "A good revision responds to the new conditions rather than repeating the first forecast." },
          evidenceIds: ["e02-e4"]
        }
      ],
      firstDecision: {
        prompt: "Write a recommendation to the committee (one well-developed paragraph). Propose a plan for 12:00 pm, 4:00 pm and 7:00 pm. Explain two energy changes, distinguish generation from storage, and weigh reliability against pollution or noise. Use at least three pieces of evidence.",
        stems: ["At 12:00 pm, I would begin with...", "This changes ... energy into electrical energy.", "At 4:00 pm...", "At 7:00 pm, the plan needs...", "A trade-off is..."],
        criteria: ["Responds to the different times and levels of demand.", "Uses accurate energy-change vocabulary and distinguishes storage from generation.", "Weighs reliability with environmental or noise effects using evidence."]
      },
      update: {
        title: "Update: forecast shift and a larger crowd",
        text: "At 1:30 pm, thick cloud is forecast from 2:00 pm until sunset. The wind may become strong around 6:00 pm, but the safety coordinator says adults would need to check the turbine site and sound before using it. A neighbouring school has also asked to join the evening premiere. The projector-and-light demand at 7:00 pm is now estimated to be one-and-a-half times the original amount. The committee can still use electricity already stored in a charged battery, but it cannot assume enough solar charging will happen after 2:00 pm.",
        prompt: "Write a revised recommendation in a second paragraph. State what you would keep, what you would change, and why. Include one question qualified adults must answer before relying on wind power or the diesel back-up.",
        stems: ["I would keep... because...", "I would change... because the update says...", "The larger demand means...", "Before adults rely on ..., they need to check..."],
        criteria: ["Revises the first plan in response to the changed conditions.", "Uses the new forecast and higher demand as evidence.", "Recognises that qualified adults must check safety, location or noise before operating equipment."]
      },
      finalCriteria: [
        "Uses evidence to make and revise a realistic energy plan rather than choosing one source as perfect.",
        "Accurately explains energy changes and the difference between generating and storing energy.",
        "Weighs reliability, pollution, noise and adult safety checks when conditions change."
      ],
      sourceNote: "All locations, weather, equipment and committee documents are fictional. This is a scientific comparison task, not advice for installing or operating electrical generation equipment."
    }
  ]
};
