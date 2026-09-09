window.FestivalSynthesis = {
  missions: [{
    id: "m06", title: "The Committee Hearing", film: 6, type: "core", extension: false,
    brief: "The festival committee needs a final plan. Choose the strongest ideas from your dossier and explain why they suit both places.",
    sourceNote: "This is a fictional festival committee. The figures and proposals below are made for this activity.",
    reading: {
      main: "The committee has only enough money to make three improvements. The options are: a bigger shaded waiting area, a battery store for solar power, a longer accessible path, or more advertising signs. A family group says shade matters because people may wait in hot weather. A wheelchair user says the path must be wide and smooth. The power team says batteries can store solar electricity made in daylight. The advertising team says signs may bring more visitors, but they do not make the grounds safer or easier to use. The committee wants a plan that uses evidence, cares for people and can work in more than one place.",
      support: "The committee can pay for three improvements. Choices include shade, a battery for solar power, an accessible path and more signs. Shade helps people waiting outside. A smooth, wide path helps people move around. A battery can save solar electricity made in daylight. Signs may bring visitors, but they do not make the grounds safer. Choose three and explain why."
    },
    sources: [{ label: "Committee note", text: "Choose improvements that help people, use evidence and work in different places." }],
    questions: [
      { id: "q1", kind: "choice", prompt: "Which choice is least connected to safety or access?", options: ["A wider path", "More advertising signs", "A shaded waiting area"], answer: "More advertising signs", feedback: "Signs may be useful, but the note gives no safety or access reason for them." },
      { id: "q2", kind: "text", prompt: "Name one piece of evidence from the reading that could support your final plan.", placeholder: "For example: The reading says..." },
      { id: "q3", kind: "text", prompt: "What objection might someone make to your plan? How could you answer it?", placeholder: "Someone might say... I would answer..." }
    ],
    writing: { prompt: "Write a final recommendation to the committee. Choose three improvements. Use at least two pieces of evidence from this mission or earlier work. Explain one trade-off or answer one objection.", stems: ["I recommend...", "This matters because...", "Some people may think... However...", "This plan will work because..."] },
    criteria: ["I chose three clear improvements.", "I used evidence to explain my choices.", "I explained a trade-off or answered an objection."]
  }]
};
