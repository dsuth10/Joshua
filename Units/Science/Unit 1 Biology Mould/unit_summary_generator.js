const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BulletStyle } = require('docx');

// Data for the document
const unitTitle = "Unit 1: Biology - Mould";
const curriculumDescriptors = [
    { code: "AC9S6U01", description: "Investigate the physical conditions of an environment and how they affect the growth and survival of living things." },
    { code: "AC9S6H01", description: "Examine how scientific knowledge is used to solve problems and inform decisions." },
    { code: "AC9S6I01", description: "Pose investigable questions and make predictions based on scientific knowledge." },
    { code: "AC9S6I05", description: "Use appropriate digital technologies to represent data and identify patterns." },
    { code: "AC9S6I06", description: "Compare data with predictions and use evidence to develop scientific explanations." },
    { code: "AC9S6I08", description: "Communicate ideas, findings, and solutions to problems." }
];

const lessons = [
    {
        title: "Lesson 1-2: Field Work & Observations",
        objectives: [
            "Observe and record living things in their natural environment.",
            "Pose questions about the physical conditions of the environment.",
            "Identify patterns in sightings."
        ],
        resources: [
            "Sci_Y06_U4_SLR_SettingUpAPantrap.docx",
            "Sci_Y06_U4_SH_LocalFieldWork.docx",
            "Sci_Y3-6_Lvl3_SLR_ScienceInquirySkillsPoster.pdf",
            "Sci_Y06_U4_SH_FieldObsAnimals.docx"
        ]
    },
    {
        title: "Lesson 3-4: Environmental Factors & Simulations",
        objectives: [
            "Use simulations to investigate environmental factors.",
            "Identify how temperature, moisture, and light affect growth.",
            "Graph and interpret data from investigations."
        ],
        resources: [
            "Sci_Y06_U4_SLR_EnvironFactors.docx",
            "Graph_Maker_2 (Interactive)",
            "Sci_Y06_U4_SH_SimulationInv.docx"
        ]
    },
    {
        title: "Lesson 5: Aboriginal and Torres Strait Islander Perspectives",
        objectives: [
            "Examine how First Nations Australians use scientific knowledge to manage land.",
            "Understand the impact of environmental change on community and culture."
        ],
        resources: [
            "Sci_Y06_U4_SLR_MalakMalakLand.docx",
            "Merrepen 2005 Collecting (Interactive)",
            "Sci_Y06_U4_SH_BillNeidjieText.docx"
        ]
    },
    {
        title: "Lesson 6: Researching Animal Habitats",
        objectives: [
            "Research specific animals and their habitat requirements.",
            "Explain how physical conditions affect survival."
        ],
        resources: [
            "Sci_Y06_U4_SLR_ResearchAnimals.docx",
            "Sci_Y06_U4_SH_SumatranTiger.docx",
            "Sci_Y06_U4_SH_AsianElephant.docx"
        ]
    },
    {
        title: "Lesson 7-9: Plant Growth Investigations",
        objectives: [
            "Plan and conduct an investigation into plant growth (salinity or light).",
            "Control variables to ensure a fair test.",
            "Record and represent data using tables and graphs."
        ],
        resources: [
            "Sci_Y06_U4_SH_SalinityInv.docx",
            "Sci_Y06_U4_SH_LightInvestigation.docx",
            "Sci_Y06_U4_SLR_InvPlantGrowth.docx"
        ]
    },
    {
        title: "Lesson 10-11: Introduction to Mould",
        objectives: [
            "Identify mould as a living thing.",
            "Explain how mould grows and spreads in different environments.",
            "Identify 'good' and 'bad' moulds (e.g., penicillin vs. bread mould)."
        ],
        resources: [
            "Sci_Y06_U4_ILM_NotAllMoldIsBadPenicillin.mp4",
            "Mould_Exposure.mp4",
            "Mould Detective (Interactive)",
            "Sci_Y06_U4_SH_MouldyEnvironments.docx",
            "Sci_Y06_U4_SH_MouldGoodorBad.docx"
        ]
    },
    {
        title: "Lesson 12-15: Progress Check & Summative Assessment",
        objectives: [
            "Perform a progress check on mould growth and accurately record results.",
            "Distinguish between scientific observation and evaluation.",
            "Evaluate mould growth and make scientific claims about environmental impact.",
            "Write a formal scientific report based on the mould investigation."
        ],
        resources: [
            "Sci_Y06_U4_SLR_MaterialsEquipmentList.docx",
            "Sci_Y06_U4_AT_SH_InvestMouldyBd.docx"
        ]
    },
    {
        title: "Lesson 16: Human Impact - Introduced Species",
        objectives: [
            "Understand that humans can influence a habitat or environment.",
            "Define and identify introduced species in Australia.",
            "Explain the impact of introduced species on native environments."
        ],
        resources: [
            "Sci_Y06_U4_SH_IntroducedSpecies.docx",
            "Sci_Y06_U4_SLR_KostersCurse.docx",
            "Alien_fish_-_with_Dr_Dave.mp4",
            "Sci_Y06_U4_SLR_IntroducedSpecies.docx"
        ]
    },
    {
        title: "Lesson 17: Reversing Environmental Change",
        objectives: [
            "Identify human-led initiatives to reverse negative environmental changes.",
            "Understand the role of science in habitat restoration."
        ],
        resources: [
            "Sci_Y06_U4_SH_WildBackyards.docx",
            "Sci_Y06_U4_SH_WildBackyardsTranscripts.docx",
            "Sci_Y06_U4_SLR_HumanImpact_.docx"
        ]
    },
    {
        title: "Lesson 18: Detecting Environmental Change",
        objectives: [
            "Understand how data is used to detect and monitor environmental changes.",
            "Use data sets to identify trends in environmental health."
        ],
        resources: [
            "Sci_Y06_U4_SH_PhysicalChangesEnv.docx"
        ]
    },
    {
        title: "Lesson 19-20: Extreme Environments & Extremophiles",
        objectives: [
            "Define 'extreme environments' and identify examples.",
            "Understand what 'extremophiles' are and how they survive.",
            "Connect extremophile adaptations to environmental conditions."
        ],
        resources: [
            "Sci_Y06_U4_SH_EmperorPenguin.docx",
            "Sci_Y06_U4_SH_AntarcticIcefish.docx",
            "Sci_Y06_U4_SH_Tardigrade.docx",
            "Sci_Y06_U4_SLR_Extremophiles.docx",
            "Sci_Y06_U4_SS_ExtremeLiving.pptx"
        ]
    }
];

// Document Generation
const doc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({
                text: unitTitle,
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }), // Spacer
            
            new Paragraph({
                text: "Curriculum Content Descriptors",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({ text: "" }),

            ...curriculumDescriptors.flatMap(descriptor => [
                new Paragraph({
                    children: [
                        new TextRun({ text: descriptor.code, bold: true }),
                        new TextRun({ text: `: ${descriptor.description}` }),
                    ],
                }),
            ]),

            new Paragraph({ text: "" }),
            new Paragraph({
                text: "Lessons and Resources",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({ text: "" }),

            ...lessons.flatMap(lesson => [
                new Paragraph({
                    text: lesson.title,
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({ text: "Objectives:", bold: true }),
                ...lesson.objectives.map(obj => new Paragraph({
                    text: obj,
                    bullet: { level: 0 }
                })),
                new Paragraph({ text: "Resources:", bold: true }),
                ...lesson.resources.map(res => new Paragraph({
                    text: res,
                    bullet: { level: 0 }
                })),
                new Paragraph({ text: "" }),
            ])
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("Unit_1_Biology_Mould_Summary.docx", buffer);
    console.log("Document created successfully: Unit_1_Biology_Mould_Summary.docx");
});
