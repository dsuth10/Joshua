/* Fictional case material for the Festival Day learning experience. */
(function () {
  'use strict';

  window.FestivalEnglishHass = {
    missions: [
      {
        id: 'm01',
        title: 'Two Places, One Festival',
        film: 1,
        type: 'english-hass',
        extension: false,
        sourceNote: 'The festival, people, numbers and proposals in this mission are fictional classroom scenario material. The factual background statements are broad, age-appropriate claims about Australia and Indonesia and should be read alongside the supplied sources rather than searched online.',
        brief: 'You are on the planning team for the Bright Screens Festival. Two partner communities want to hold the same small film-and-science festival: Bayview in Australia and Suka Jaya in Indonesia. The festival must work for local families while still sharing ideas between the two places. Read the evidence before recommending one feature that both festivals should include and one feature that should be adapted for each place.',
        reading: {
          main: {
            heading: 'Planning notes from the two communities',
            text: 'Bayview is a fictional coastal town in Australia. Its festival committee plans an outdoor screen at the community oval in late autumn. Families have asked for a quiet reading tent, reusable water bottles and a short walk from the bus stop. The oval is wide and flat, but the afternoon can become cool and windy.\n\nSuka Jaya is a fictional town in Indonesia. Its committee plans to use a covered community courtyard in the dry season. Families have asked for shaded seating, a place to refill drinking water and a display where children can share stories from home. The courtyard is smaller than Bayview Oval, but it is close to shops and many people walk there.\n\nAustralia and Indonesia are neighbours in the same region of the world, but they have different histories, languages, climates and populations. Both countries have many communities, many ways of living and strong cultural traditions. A respectful comparison looks for useful similarities and differences without pretending that every Australian or every Indonesian person has the same experience.'
          },
          support: {
            heading: 'Festival organiser interview',
            text: 'Ms Lestari, a fictional organiser from Suka Jaya, says: “We do not need the two events to look identical. We want children to recognise their own community in the festival, then learn something about the partner community.” Mr Cole from Bayview agrees: “A shared name and shared learning activities could connect us. The spaces, timetable and welcome might need to suit each place.”'
          }
        },
        sources: [
          { label: 'Source A: Bayview planning notes', kind: 'scenario brief', claim: 'Wide, windy oval; families requested a reading tent, refill station and access from the bus stop.' },
          { label: 'Source B: Suka Jaya planning notes', kind: 'scenario brief', claim: 'Smaller covered courtyard; families requested shaded seating, refill water and a home-story display.' },
          { label: 'Source C: Organiser interview', kind: 'fictional interview', claim: 'The events should connect, but do not need to look identical.' }
        ],
        questions: [
          {
            id: 'm01-q1', type: 'choice', prompt: 'Which statement is best supported by both planning notes?',
            options: ['Both communities want exactly the same festival layout.', 'Both communities want a way for families to access drinking water.', 'Only Bayview wants children to share stories.', 'Only Suka Jaya needs a space for people to sit.'],
            answer: 1, feedback: 'Both Source A and Source B ask for water to drink or refill. The other choices add details that are not in both notes.'
          },
          {
            id: 'm01-q2', type: 'response', prompt: 'Explain one similarity and one difference between the two proposed festivals. Use a detail from the reading for each idea.', minWords: 45,
            answerGuide: 'A strong response names a real similarity, such as water access or family learning, and a real difference, such as the oval/courtyard or wind/covered shade, with evidence from the text.', feedback: 'Check that you have included one similarity, one difference and two details from the supplied sources.'
          },
          {
            id: 'm01-q3', type: 'response', prompt: 'Why is it respectful to adapt a shared festival for each community instead of making both events identical?', minWords: 55,
            answerGuide: 'A strong response explains that communities have different spaces, needs and traditions, and that a partnership can share ideas while respecting local choices.', feedback: 'Use the organiser interview and avoid broad claims about every person in either country.'
          }
        ],
        writing: {
          prompt: 'Write a recommendation to the Bright Screens Festival team. Name one shared feature and one adapted feature for each community. Explain how your plan is fair and respectful.',
          minWords: 120,
          stems: ['I recommend that both festivals include … because …', 'At Bayview, the feature should be … because the evidence says …', 'At Suka Jaya, the feature should be … because …', 'This is respectful because …']
        },
        criteria: ['Uses accurate details from at least two supplied sources.', 'Explains a similarity and a difference clearly.', 'Uses respectful language about communities and avoids sweeping claims.']
      },
      {
        id: 'm02',
        title: 'The Evidence Editing Room',
        film: 2,
        type: 'english-hass',
        extension: false,
        sourceNote: 'The campaign materials and names in this mission are fictional. They are designed to practise evaluating persuasive language, evidence and fairness.',
        brief: 'The festival committee has received three posters and a short report. Some statements are useful evidence. Others are opinions dressed up as facts. Your job is to decide which proposal gives the clearest reasons, then write a more trustworthy paragraph for the festival newsletter.',
        reading: {
          main: {
            heading: 'Three campaign messages',
            text: 'Poster 1: “The Solar Screen is the only sensible choice! Every family will love it. Vote yes today!”\n\nPoster 2: “Choose the Community Power Plan. The plan uses a small solar display during daylight activities and electricity from the existing building for the evening screen. The organiser’s map shows the building has a safe power point near the courtyard.”\n\nPoster 3: “A huge generator will make our festival the best in the world. Anyone who disagrees does not care about children.”\n\nPlanning report: The fictional Suka Jaya courtyard has one tested power point near the stage wall. A solar display can power a small fan and information lights during sunny daytime sessions, but it cannot be assumed to run the evening screen. The committee still needs to check safety, cost and local advice before choosing equipment.'
          },
          support: {
            heading: 'How to check a persuasive claim',
            text: 'A claim tells what someone wants you to believe. Evidence gives a reason, example, observation or reliable information that could support the claim. Strong persuasive writing uses evidence and explains how it supports the idea. It does not need to insult people who disagree.'
          }
        },
        sources: [
          { label: 'Source A: Solar Screen poster', kind: 'campaign poster', claim: 'Uses strong opinion words but gives no evidence.' },
          { label: 'Source B: Community Power poster', kind: 'campaign poster', claim: 'Makes a plan and refers to the organiser map.' },
          { label: 'Source C: Planning report', kind: 'fictional report', claim: 'States limits of the solar display and the known power point.' }
        ],
        questions: [
          {
            id: 'm02-q1', type: 'choice', prompt: 'Which sentence is evidence rather than only an opinion?',
            options: ['The Solar Screen is the only sensible choice!', 'Every family will love it.', 'The organiser’s map shows the building has a safe power point near the courtyard.', 'A huge generator will make our festival the best in the world.'],
            answer: 2, feedback: 'This sentence points to a checkable detail from the map. The other choices are opinions or predictions.'
          },
          {
            id: 'm02-q2', type: 'response', prompt: 'Choose one weak claim from Poster 1 or Poster 3. Explain why it is weak, then state what evidence would make it stronger.', minWords: 55,
            answerGuide: 'A strong answer identifies exaggeration, an unsupported prediction or an insult, then suggests relevant evidence such as power needs, safety advice, cost, a map or feedback data.', feedback: 'Name the exact claim you are evaluating before you explain it.'
          },
          {
            id: 'm02-q3', type: 'choice', prompt: 'Why does the planning report say the committee still needs to check safety, cost and local advice?',
            options: ['Because evidence is never useful.', 'Because one power-point detail does not answer every planning question.', 'Because posters are always true.', 'Because the committee has already chosen the generator.'],
            answer: 1, feedback: 'One useful fact does not settle every decision. Responsible planners check several kinds of evidence.'
          }
        ],
        writing: {
          prompt: 'Write a trustworthy newsletter paragraph recommending a power plan. Use two pieces of evidence from the report. Include one sentence that fairly recognises a limit or question still to be checked.',
          minWords: 130,
          stems: ['The committee should consider …', 'The planning report states …', 'This evidence matters because …', 'However, the committee should still check …']
        },
        criteria: ['Makes a clear recommendation.', 'Uses two accurate pieces of supplied evidence.', 'Uses persuasive language without exaggeration, insults or unsupported promises.']
      },
      {
        id: 'e01',
        title: 'Extension: The Missing Voice',
        film: 7,
        type: 'english-hass',
        extension: true,
        sourceNote: 'All survey results and people in this extension are fictional. The task asks students to notice whose views are included and whose are missing.',
        brief: 'A draft festival survey has been shared with 18 adults who use the Bayview oval. The committee wants to call the result “the community decision”. Read the survey notes and decide whether that description is fair.',
        reading: {
          main: { heading: 'Survey summary', text: 'Twelve people chose a Saturday afternoon festival. Four chose Saturday evening. Two had no preference. All 18 survey participants were adults who regularly use the oval for sport. No survey response was collected from children, people who use mobility equipment, families who travel by bus, or residents who live near the oval but do not play sport. One participant wrote, “The best time is whenever sport is finished.”' },
          support: { heading: 'A useful question', text: 'A survey can give helpful information, but it can only represent the people who took part. Before using a result, ask: Who answered? Who was not asked? Could the missing voices have different needs?' }
        },
        sources: [{ label: 'Source A: Draft survey', kind: 'fictional survey', claim: '18 adult sport users responded; several affected groups were not included.' }],
        questions: [
          { id: 'e01-q1', type: 'numeric', prompt: 'How many survey participants chose Saturday afternoon?', answer: 12, feedback: 'The summary states that twelve people chose Saturday afternoon.' },
          { id: 'e01-q2', type: 'response', prompt: 'Name two groups whose views are missing from the survey and explain why one of those groups might have a different need.', minWords: 50, answerGuide: 'Names two listed groups and gives a sensible, evidence-based reason.', feedback: 'Use groups actually named in the survey summary.' },
          { id: 'e01-q3', type: 'choice', prompt: 'Which conclusion is fairest?', options: ['Every Bayview resident wants Saturday afternoon.', 'The survey gives one useful view, but more people should be asked before a community decision is made.', 'Sport users should never be asked for an opinion.', 'The festival must be cancelled.'], answer: 1, feedback: 'The survey is useful, but its participants do not represent every affected group.' }
        ],
        writing: { prompt: 'Write a short plan for a fairer second survey. Explain who should be invited, how their views could be collected and how the committee should use both surveys.', minWords: 115, stems: ['The second survey should include …', 'This group matters because …', 'The committee could collect views by …', 'Afterwards, the committee should …'] },
        criteria: ['Identifies limits in the first survey accurately.', 'Suggests practical ways to include missing voices.', 'Explains why fair decisions need more than one viewpoint.']
      },
      {
        id: 'e06',
        title: 'Extension: The Partnership Promise',
        film: 12,
        type: 'english-hass',
        extension: true,
        sourceNote: 'The partnership agreement is fictional. It draws on the idea that respectful partnerships involve listening, accurate information and shared decision-making.',
        brief: 'Bayview and Suka Jaya want to publish a partnership promise before next year’s festival. The first draft sounds friendly, but it leaves important decisions unclear. Improve it using the meeting notes.',
        reading: {
          main: { heading: 'Draft promise and meeting notes', text: 'Draft promise: “Bayview will help Suka Jaya run a festival just like ours. We will share our best ideas and show everyone how it should be done.”\n\nMeeting notes: Bayview students asked to exchange book and film recommendations. Suka Jaya students asked for the partnership to include local stories chosen by their own community. Both groups asked for clear credit when an idea, picture or story comes from the partner community. The organisers agreed that each community should decide what is suitable for its own event.' },
          support: { heading: 'Partnership language', text: 'Respectful partnership language uses words such as “work with”, “listen”, “share”, “ask permission”, “credit” and “decide together”. It avoids language that assumes one group knows best.' }
        },
        sources: [{ label: 'Source A: Draft promise', kind: 'fictional draft', claim: 'Suggests one community should lead the other.' }, { label: 'Source B: Student meeting notes', kind: 'fictional meeting notes', claim: 'Both communities want exchange, local choice and clear credit.' }],
        questions: [
          { id: 'e06-q1', type: 'choice', prompt: 'Which phrase in the draft promise is least respectful?', options: ['share our best ideas', 'run a festival just like ours', 'publish a partnership promise', 'next year’s festival'], answer: 1, feedback: 'This phrase assumes the second community should copy the first rather than make local choices.' },
          { id: 'e06-q2', type: 'response', prompt: 'Explain why giving credit for a partner community’s story or picture matters.', minWords: 45, answerGuide: 'Explains acknowledgement, respect, ownership or accurate representation.', feedback: 'Connect your explanation to the meeting notes.' },
          { id: 'e06-q3', type: 'response', prompt: 'State one detail that should stay shared and one decision that should remain local.', minWords: 45, answerGuide: 'A shared detail could be exchanging recommendations or crediting sources; a local decision could be which stories are suitable or event design.', feedback: 'Use a clear “shared” and “local” example.' }
        ],
        writing: { prompt: 'Rewrite the partnership promise as one strong paragraph. Include a shared activity, local decision-making, permission or credit, and language that shows both communities are equal partners.', minWords: 125, stems: ['Bayview and Suka Jaya will work together by …', 'Each community will decide …', 'Before using a partner’s story or image, we will …', 'This promise shows respect because …'] },
        criteria: ['Replaces one-sided language with equal-partnership language.', 'Includes accurate ideas from the meeting notes.', 'Explains how permission, credit and local choice build respect.']
      }
    ]
  };
}());
