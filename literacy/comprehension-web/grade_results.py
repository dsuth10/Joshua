"""
comprehension_grader.py
Reads all student JSON files from Results/ and writes scored JSON to scored-results/
Run from: literacy/comprehension-web/
"""

import json
import os
from datetime import datetime
from pathlib import Path

# ─── MARKING DATA ──────────────────────────────────────────────────────────────
# Pre-scored data based on AI assessment of each student response
# Format: { activityId: { student_date_key: { questionId: (score, rationale) } } }

SCORES = {
    "inferencing-level-1-handout-1": {
        "dmcdo222_2026-07-16": {
            "q1": (1, "Correct — 'in summer' is an accepted seasonal inference."),
            "q2": (1, "Correct — 'night' correctly infers it was getting dark."),
            "q3": (1, "Correct — 'morning' correctly identifies the time."),
            "q4a": (1, "Correct — 'the baby crying' is the expected inference."),
            "q4b": (1, "Acceptable — 'the full bottle fell on the ground' correctly identifies the cause."),
            "q5a": (1, "Correct — 'at the bus stop'."),
            "q5b": (1, "Partially correct — 'to go get his homework' captures the cause but lacks 'went back home' context. Awarded on benefit of doubt."),
            "q6a": (0, "Insufficient — 'because he cares for the piglet' is true but does not identify the specific cause: being refused permission to bring the piglet on the bus."),
            "q6b": (1, "Correct — 'his grandfather'."),
            "q6c": (1, "Correct — 'yes, because he wants to show his grandfather' — has yes plus valid evidence."),
            "q6d": (1, "Correct — 'so no one can see or hear the piglet'."),
            "q6e": (1, "Acceptable — 'because of piglet' — minimal but identifies the piglet as the reason. Awarded on benefit of doubt."),
        },
        "epryo13_2026-07-16": {
            "q1": (1, "Correct — mentions summer and heat."),
            "q2": (0, "Incorrect — 'morning or night' is uncertain/two answers; the correct inference is evening/getting dark. Awarding 0 as student did not commit to the correct answer."),
            "q3": (1, "Correct — 'likely before 9 o'clock because that's when school starts' — valid morning inference."),
            "q4a": (1, "Correct — 'the baby crying'."),
            "q4b": (1, "Correct — 'the baby dropped its bottle, and it was on the floor where the baby couldn't reach it'."),
            "q5a": (1, "Correct — 'he was waiting for the bus at the bus stop'."),
            "q5b": (1, "Correct — 'because he realised that he forgot his homework and had to go get it'."),
            "q6a": (0, "Incorrect — 'because he wanted to show the piglet to his grandpa' is the general motivation but not the specific trigger for tears (being refused access to bus)."),
            "q6b": (1, "Correct — 'Wade's grandpa owed it' (typo 'owed' for 'owned') — clearly identifies grandfather."),
            "q6c": (0, "Incorrect — 'yes because he didn't snort' — not a valid textual reference to pride."),
            "q6d": (1, "Correct — 'so no one would see or hear the piglet'."),
            "q6e": (1, "Correct — 'so the pig would stay asleep'."),
        },
        "fwend2_2026-07-16": {
            "q1": (1, "Correct — 'during summer'."),
            "q2": (1, "Correct — 'night time'."),
            "q3": (1, "Correct — 'morning'."),
            "q4a": (1, "Correct — 'the baby crying'."),
            "q4b": (0, "Incorrect — 'the baby was crying and a full bottle of milk was laying on the ground dripping' — restates facts but does not explain WHY it was happening (bottle dropped/fell). Rejected as a causal explanation."),
            "q5a": (1, "Correct — 'at the bus stop'."),
            "q5b": (1, "Correct — 'because he went back home to get his homework'."),
            "q6a": (1, "Correct — 'because he wasn't allowed to bring the pig on the bus'."),
            "q6b": (1, "Correct — 'grandpa'."),
            "q6c": (1, "Correct — 'yes, because he had followed the instructions that grandpa gave him' — yes plus valid evidence."),
            "q6d": (1, "Correct — 'so nobody heard the pink pig' (spelling error 'herd', 'pink' not in text but core meaning is correct)."),
            "q6e": (1, "Correct — 'because the pig is in it'."),
        },
        "hpatr18_2026-07-16": {
            "q1": (1, "Correct — 'summer'."),
            "q2": (1, "Correct — 'night'."),
            "q3": (0, "Incorrect — 'day time' is too vague and not morning-specific; the correct inference is morning (breakfast/school bus)."),
            "q4a": (1, "Correct — 'the baby crying'."),
            "q4b": (1, "Acceptable — 'the bottle fell' correctly identifies the cause; the partial quote from text is accepted."),
            "q5a": (0, "Incorrect — 'at his home' — the student was waiting at the bus stop, not at home."),
            "q5b": (1, "Correct — 'he had forgotten to put his homework in to his bag By the time he got back the bus was gone' — correct causal chain."),
            "q6a": (0, "Not attempted."),
            "q6b": (0, "Not attempted."),
            "q6c": (0, "Not attempted."),
            "q6d": (0, "Not attempted."),
            "q6e": (0, "Not attempted."),
        },
        "jbart350_2026-07-16": {
            "q1": (1, "Correct — 'the warm Sommer months' (spelling error) — valid summer inference."),
            "q2": (1, "Correct — 'nighttime'."),
            "q3": (1, "Correct — 'morning'."),
            "q4a": (1, "Correct — 'the baby crying'."),
            "q4b": (1, "Correct — 'the baby is crying because the bottle is on the floor'."),
            "q5a": (1, "Correct — 'at the bus stop'."),
            "q5b": (1, "Correct — 'because he went back to get his homework'."),
            "q6a": (1, "Correct — 'because he couldn't show his grandad the piglet' — identifies the emotional cause correctly."),
            "q6b": (1, "Correct — 'the grandfather'."),
            "q6c": (0, "Insufficient — 'because he wanted to show the piglet to his grandad' — does not include 'yes' and reads as answering a different question. No explicit affirmation of pride."),
            "q6d": (1, "Correct — 'so that anyone wouldn't hear or see the pig'."),
            "q6e": (1, "Correct — 'because the pig was in there'."),
        },
        "jbinn27_2026-07-16": {
            "q1": (1, "Correct — 'in summer'."),
            "q2": (0, "Incorrect — 'Morning' — the question is about turning lights on (getting dark), not morning."),
            "q3": (1, "Correct — 'Morning'."),
            "q4a": (1, "Correct — 'baby crying'."),
            "q4b": (1, "Correct — 'because the bottle dropped then slipped'."),
            "q5a": (1, "Correct — 'At the bus stop'."),
            "q5b": (1, "Correct — 'because he ran back home to grab his homework'."),
            "q6a": (1, "Correct — 'because he wanted to show his grandpa his piglet' — identifies the emotional cause."),
            "q6b": (1, "Correct — 'grandpa'."),
            "q6c": (1, "Correct — 'yes, he was because he wanted to show the piglet to his grandpa'."),
            "q6d": (1, "Correct — 'so, no one would here the piglet' (spelling 'here' for 'hear')."),
            "q6e": (1, "Correct — 'because the piglet was inside it'."),
        },
        "jfull212_2026-07-16": {
            "q1": (1, "Correct — 'in summer'."),
            "q2": (0, "Incorrect — 'in the morning or night' — two answers, neither exclusively the correct one (evening/getting dark). Awarding 0 for ambiguity."),
            "q3": (1, "Correct — 'in the morning'."),
            "q4a": (1, "Correct — 'a baby crying'."),
            "q4b": (1, "Acceptable — 'the bottle had fell' — short but identifies the bottle falling as the cause."),
            "q5a": (1, "Acceptable — 'he was waiting at the school bus' — close enough; the school bus context implies bus stop."),
            "q5b": (0, "Insufficient — 'he forgot to put his homework in his bag' — states what he forgot but not that he went back to get it (which is the reason he missed the bus)."),
            "q6a": (1, "Correct — 'because he could not bring the piglet on the bus'."),
            "q6b": (1, "Correct — 'he grampa' (typo) — clearly the grandfather."),
            "q6c": (0, "Incorrect — 'he was proud of the piglet because he was quiet on the bus to his grampa' — misunderstands; piglet being quiet is not evidence of Wade's pride."),
            "q6d": (1, "Acceptable — 'because he had a piglet so just in case the piglet wakes up' — implies hiding, awarded on benefit of doubt."),
            "q6e": (1, "Correct — 'because the piglet was inside the bag'."),
        },
        "jtayl1104_2026-07-16": {
            "q1": (1, "Correct — 'summer'."),
            "q2": (1, "Correct — 'night'."),
            "q3": (1, "Correct — 'morning'."),
            "q4a": (0, "Insufficient — 'the baby' — does not identify the noise as crying."),
            "q4b": (1, "Correct — 'the bottle fell on the floor'."),
            "q5a": (1, "Correct — 'the bus stop'."),
            "q5b": (1, "Correct — 'to go get the homework he had forgotten'."),
            "q6a": (1, "Correct — 'cause he cant bring his piglet to his grandadas'."),
            "q6b": (1, "Correct — 'the grandad'."),
            "q6c": (1, "Correct — 'because he wanted to show his grandad' — implies yes and gives evidence."),
            "q6d": (1, "Correct — 'because he didn't want anyone to see or hear the pig'."),
            "q6e": (1, "Correct — 'because he didn't want the pig to wake up'."),
        },
        "kfiel89_2026-07-16": {
            "q1": (1, "Correct — 'summer and spring' — accepted; both are warm alternatives to winter."),
            "q2": (1, "Correct — 'night time'."),
            "q3": (1, "Correct — 'morning'."),
            "q4a": (1, "Correct — 'the baby crying'."),
            "q4b": (1, "Acceptable — 'the bottle fell' — short but correct cause."),
            "q5a": (1, "Acceptable — 'the bus station' — accepted as equivalent to bus stop."),
            "q5b": (1, "Correct — 'he went home to get his homework'."),
            "q6a": (0, "Incorrect — 'he could not see his grandpa' — wrong cause; he could not take the piglet on the bus, not that he couldn't see his grandfather."),
            "q6b": (1, "Correct — 'his grappa'."),
            "q6c": (1, "Correct — 'he was proud because he wants to show he's grappa'."),
            "q6d": (0, "Incorrect — 'to go to his grandpa' — misunderstands; he went to the back to hide the piglet, not to go to his grandfather."),
            "q6e": (1, "Correct — 'it had the pig inside of his bag'."),
        },
        "lheck4_2026-07-16": {
            "q1": (1, "Correct — 'in warmer months'."),
            "q2": (1, "Correct — 'nighttime or early in the morning' — nighttime is the primary correct inference; accepted."),
            "q3": (1, "Correct — 'morning'."),
            "q4a": (1, "Acceptable — 'the baby yelling' — crying/yelling are equivalent for a distressed baby."),
            "q4b": (0, "Incorrect — 'a bottle fell down on the baby' — inverts the scene; the bottle fell TO THE FLOOR, not on the baby. This misreads the passage."),
            "q5a": (1, "Correct — 'the bus stop'."),
            "q5b": (1, "Correct — 'because he went back to the house to get his homework'."),
            "q6a": (1, "Correct — 'because the bus driver said he can't take the piglet on the bus'."),
            "q6b": (1, "Correct — 'the grandad'."),
            "q6c": (1, "Correct — 'yes because it is a healthy piglet' — valid evidence from the text."),
            "q6d": (0, "Insufficient — 'to stay away from the people at the front of the bus' — does not mention the piglet or hiding it; the reason must reference the piglet."),
            "q6e": (1, "Correct — 'because the piglet was inside the bag'."),
        },
        "mreed71_2026-07-16": {
            "q1": (1, "Correct — 'the spring' is an accepted non-winter season."),
            "q2": (1, "Correct — 'when you can't see' — implies darkness/evening; awarded on benefit of doubt."),
            "q3": (1, "Correct — 'morning'."),
            "q4a": (0, "Incorrect — 'the thing screaming' — too vague; does not identify it as a baby crying."),
            "q4b": (1, "Correct — 'the bottle fell'."),
            "q5a": (1, "Correct — 'the bus stop'."),
            "q5b": (1, "Correct — 'he needed to go back home to get homework'."),
            "q6a": (0, "Insufficient — 'couldn't get on the bus' — not specific enough; does not mention the piglet."),
            "q6b": (1, "Correct — 'grandad'."),
            "q6c": (1, "Correct — 'yes he want show people him pig' (poor grammar) — implies wanting to show the pig as evidence of pride. Awarded on benefit of doubt."),
            "q6d": (1, "Correct — 'so no one would know of the pig'."),
            "q6e": (1, "Acceptable — 'because he did not want everyone to know that he had a pig' — relates to hiding the pig. Accepted."),
        },
        "shart259_2026-07-16": {
            "q1": (1, "Correct — 'summer'."),
            "q2": (1, "Correct — 'night'."),
            "q3": (0, "Incorrect — '3:00 home time' — afternoon departure from school, not the morning context of breakfast/bus."),
            "q4a": (1, "Correct — 'the baby crying'."),
            "q4b": (1, "Correct — 'the bottle dropped on the ground'."),
            "q5a": (1, "Correct — 'the bus stop'."),
            "q5b": (1, "Correct — 'they went back into their house to get the homework'."),
            "q6a": (1, "Correct — 'because he wasn't allowed to bring the pig on the bus'."),
            "q6b": (1, "Correct — 'grandpa'."),
            "q6c": (0, "Insufficient — 'because he wanted to show his grandpa' — no explicit 'yes'; reads as answering without affirming pride."),
            "q6d": (1, "Correct — 'so they can't hear the pig'."),
            "q6e": (1, "Correct — 'because the pig was in there'."),
        },
        "smorg220_2026-07-16": {
            "q1": (1, "Correct — 'summer'."),
            "q2": (1, "Correct — 'night time'."),
            "q3": (1, "Correct — 'the morning'."),
            "q4a": (1, "Correct — 'the baby crying'."),
            "q4b": (1, "Correct — 'the bottle fell onto the ground'."),
            "q5a": (1, "Correct — 'at the bus stop'."),
            "q5b": (1, "Correct — 'he went to go get his homework'."),
            "q6a": (1, "Correct — 'the bus driver said he isn't allowed to bring the piglet onto the bus'."),
            "q6b": (1, "Correct — 'the grandfather'."),
            "q6c": (0, "Incorrect — 'yes, because he was going to give the piglet to the grandfather' — misreads; he was going to SHOW it, not give it. The evidence is incorrect."),
            "q6d": (1, "Correct — 'so, no one could hear the piglet'."),
            "q6e": (1, "Correct — 'because the piglet was sleeping in the bag'."),
        },
        "wnich33_2026-07-16": {
            "q1": (1, "Correct — 'summer'."),
            "q2": (1, "Correct — 'night time'."),
            "q3": (1, "Correct — 'morning'."),
            "q4a": (1, "Correct — 'baby crying'."),
            "q4b": (1, "Correct — 'the bottle dropped on the floor'."),
            "q5a": (1, "Correct — 'bus stop'."),
            "q5b": (1, "Correct — 'he had to go back home to get his homework'."),
            "q6a": (1, "Correct — 'he wasn't allowed on the bus with the piglet'."),
            "q6b": (1, "Correct — 'grandad'."),
            "q6c": (1, "Correct — 'yes, because he wanted to show his grandad the piglet'."),
            "q6d": (1, "Correct — 'so, no one saw or heard the piglet'."),
            "q6e": (1, "Correct — 'because there was the piglet inside of the bag'."),
        },
    },
    "inferencing-level-1-handout-2": {
        "cpono2_2026-07-16": {
            "q1": (1, "Correct — 'train station'."),
            "q2": (1, "Correct — 'airport'."),
            "q3": (1, "Correct — 'in a cage/zoo'."),
            "q4a": (1, "Acceptable — 'a job/cleaning' — identifies cleaning."),
            "q4b": (1, "Correct — 'morning'."),
            "q5a": (0, "Incorrect — 'noon/nearly night' — sun going DOWN means evening/dusk, not noon."),
            "q5b": (1, "Correct — 'by foot'."),
            "q6a": (1, "Correct — 'no because it was just slits in the thick stone walls'."),
            "q6b": (0, "Incorrect — 'shutters could be put over the slits in bad weather' — this is what shutters do, not what the windows themselves were designed to do (allow ventilation/some light normally)."),
            "q6c": (0, "Incorrect — 'no because the tapestry...' — student says 'no' but they WERE cold; the tapestry was used to keep warmth IN, indicating it was cold."),
            "q6d": (1, "Correct — 'Straw was occasionally scattered about'."),
            "q6e": (1, "Correct — 'no because it was the food scraps would often be eaten by dogs, or mice that lived in the flea-ridden straw'."),
        },
        "epryo13_2026-07-16": {
            "q1": (1, "Correct — 'at the train station'."),
            "q2": (0, "Incorrect — 'space' — not a valid inference from passenger jets."),
            "q3": (1, "Correct — 'in jail at the zoo' — accepted; bars imply captivity."),
            "q4a": (0, "Incorrect — 'bin lady' — could be a bin collector (not a cleaner/vacuumer); the vacuuming clue makes this a cleaner not a bin collector."),
            "q4b": (1, "Correct — 'early in the morning'."),
            "q5a": (1, "Correct — 'late afternoon'."),
            "q5b": (1, "Correct — 'walking'."),
            "q6a": (1, "Correct — 'no they had open slits'."),
            "q6b": (0, "Incorrect — 'keep the warmth inside' — the windows (slits) were not designed to keep warmth in; that was the tapestries. The slits were designed to allow ventilation. The shutters covered them in bad weather."),
            "q6c": (0, "Insufficient — bare 'yes' with no evidence."),
            "q6d": (0, "Incorrect — bare 'yes' does not answer why the floors caught fire."),
            "q6e": (0, "Incorrect — 'it would' — incorrect; the floor would NOT be clean."),
        },
        "fpick8_2026-07-16": {
            "q1": (1, "Correct — 'At the train station'."),
            "q2": (0, "Incorrect — 'She was at the zoo' — Emma saw passenger jets; she was at an airport, not a zoo."),
            "q3": (1, "Correct — 'At the zoo'."),
            "q4a": (1, "Correct — 'Being a mum and a cleaner' — cleaner is correct."),
            "q4b": (1, "Correct — 'In the morning'."),
            "q5a": (1, "Correct — 'Sunset'."),
            "q5b": (1, "Correct — 'They walked'."),
            "q6a": (0, "Incorrect — 'Yes, because they said Shutters which means there is glass windows' — shutters do not imply glass; the windows were open slits. Incorrect reasoning."),
            "q6b": (0, "Incorrect — 'Look outside of the castle' — not the designed purpose (protecting from bad weather)."),
            "q6c": (0, "Incorrect — 'Yes, because on winter it can be cold' — generic reasoning not from the text; rejected."),
            "q6d": (1, "Acceptable — 'Because they would soak up grease' — the grease in the straw was flammable; accepted."),
            "q6e": (0, "Not attempted."),
        },
        "fwend2_2026-07-16": {
            "q1": (1, "Correct — 'the train station'."),
            "q2": (1, "Correct — 'airport'."),
            "q3": (1, "Correct — 'the zoo'."),
            "q4a": (0, "Incorrect — 'garbage woman' — the bins + vacuuming indicate a cleaner, not a garbage collector."),
            "q4b": (1, "Correct — 'early in the morning'."),
            "q5a": (1, "Correct — 'sunset'."),
            "q5b": (0, "Incorrect — 'drive' — the sore feet and boot-removal indicate walking, not driving."),
            "q6a": (0, "Incorrect — 'yes, but they said slits' — answers YES when the answer is NO (no glass windows)."),
            "q6b": (1, "Acceptable — references shutters covering slits in bad weather; identifies weather protection purpose."),
            "q6c": (1, "Correct — 'yes because it says they put tapestry on the walls'."),
            "q6d": (1, "Acceptable — 'because of the hay' — straw/hay is the cause."),
            "q6e": (1, "Correct — 'no because they'd eat their fingers and throw the bones on the ground'."),
        },
        "jbart350_2026-07-16": {
            "q1": (1, "Correct — 'at the train station'."),
            "q2": (0, "Incorrect — 'an airline' — vague; should be airport."),
            "q3": (1, "Correct — 'in a cage'."),
            "q4a": (1, "Correct — 'a cleaning lady'."),
            "q4b": (0, "Incorrect — 'night' — she finishes before kids are up for breakfast, meaning she works very early morning, not at night."),
            "q5a": (1, "Correct — 'sunset'."),
            "q5b": (0, "Incorrect — 'they drove' — sore feet indicate walking."),
            "q6a": (1, "Correct — 'no, they were just slits in the stone wall'."),
            "q6b": (0, "Incorrect — 'to let air and some light in' — not stated in the text; the text focuses on shutters for bad weather protection."),
            "q6c": (1, "Acceptable — 'yes, because the tapestry wall didn't work well' — implies cold enough to need tapestries."),
            "q6d": (0, "Incorrect — 'because of the tapestry wall hangings' — the tapestries were on walls, not floors. Straw on the floor caused the fires."),
            "q6e": (1, "Correct — 'no because there was no cleaning and it would get disgusting very quick' — inferred correctly."),
        },
        "jbinn27_2026-07-16": {
            "q1": (1, "Correct — 'train station'."),
            "q2": (1, "Correct — 'airport'."),
            "q3": (1, "Correct — 'in a cage'."),
            "q4a": (1, "Correct — 'janitor'."),
            "q4b": (1, "Correct — 'early in the morning'."),
            "q5a": (1, "Correct — 'afternoon' — sun going down = late afternoon/dusk; accepted."),
            "q5b": (0, "Incorrect — 'they drove or went on a bus' — sore feet indicate walking."),
            "q6a": (0, "Incorrect — 'Yes because the text mentions slits' — answers YES; the answer is NO."),
            "q6b": (1, "Correct — references shutters covering slits in bad weather."),
            "q6c": (1, "Correct — 'yes, because the text said that tapestry wall hanging was used in an attempt to keep in any warmth'."),
            "q6d": (0, "Incorrect — 'because of the grease' — grease alone didn't start fires; it was the flammable straw soaking up the grease near open fires."),
            "q6e": (1, "Correct — 'No because people threw the bones and leftovers on the floor'."),
        },
        "jfull212_2026-07-16": {
            "q1": (1, "Correct — 'at the train stop' — accepted."),
            "q2": (0, "Incorrect — 'she was on a plane' — she could SEE jets; she was at the airport, not on a plane."),
            "q3": (1, "Correct — 'the tiger was in a cage'."),
            "q4a": (1, "Correct — 'to clean the house'."),
            "q4b": (1, "Correct — 'the time of day morning'."),
            "q5a": (1, "Correct — 'it was afternoon'."),
            "q5b": (0, "Incorrect — 'they got to that village in a car' — sore feet indicate walking."),
            "q6a": (1, "Correct — 'no they do not have windows... they were open slips'."),
            "q6b": (0, "Incorrect — 'the windows are made the room stuffy and dark' — misidentifies what the windows were designed to do."),
            "q6c": (1, "Acceptable — 'they were cold place because the windows aren't real windows' — valid inference."),
            "q6d": (1, "Correct — 'the floor catch fire because of the grease'."),
            "q6e": (0, "Incorrect — 'no the poor people sleep on the floor even when it is cold' — the reason it's not clean is the food scraps/mice/fleas, not just that poor people slept there."),
        },
        "jtayl1104_2026-07-16": {
            "q1": (1, "Correct — 'the train station'."),
            "q2": (1, "Correct — 'airport'."),
            "q3": (1, "Correct — 'zoo'."),
            "q4a": (1, "Correct — 'janitor/maid'."),
            "q4b": (1, "Correct — 'early in the morning or very late at night'."),
            "q5a": (1, "Correct — 'evening/night' (spelling 'eavining')."),
            "q5b": (0, "Incorrect — 'horse/car' — sore feet indicate walking."),
            "q6a": (0, "Incorrect — 'yes cause the mentioned shutters' — shutters don't imply glass; answer is NO."),
            "q6b": (1, "Correct — 'to be put over stilts in bad weather' (typo 'stilts' for 'slits')."),
            "q6c": (1, "Correct — 'yes cause they are trying to get warmth from open fires'."),
            "q6d": (1, "Correct — 'cause of the straw soaking up the grease'."),
            "q6e": (1, "Correct — 'no because mice and dogs live in the straw and there is a lot of grease on the ground'."),
        },
        "kfiel89_2026-07-16": {
            "q1": (1, "Correct — 'at the train station'."),
            "q2": (1, "Correct — 'the airport'."),
            "q3": (1, "Correct — 'the zoo'."),
            "q4a": (1, "Correct — 'house cleaner'."),
            "q4b": (1, "Correct — 'morning'."),
            "q5a": (1, "Correct — 'afternoon'."),
            "q5b": (0, "Incorrect — 'a car' — sore feet indicate walking."),
            "q6a": (1, "Correct — 'no, it was just open slits'."),
            "q6b": (1, "Correct — 'keep warmth in'."),
            "q6c": (1, "Correct — 'yes, they had to light fires to keep warm'."),
            "q6d": (1, "Correct — 'the straw would catch on fire'."),
            "q6e": (1, "Correct — 'no, it had mice and bone on the floor'."),
        },
        "lmcdo381_2026-07-16": {
            "q1": (1, "Correct — 'the train was at the train station'."),
            "q2": (0, "Incorrect — 'at an Airforce plane place' — vague; airforce is not the inference. Should be commercial airport."),
            "q3": (1, "Correct — 'in the zoo'."),
            "q4a": (0, "Incorrect — 'working in a bin truck' — she has bins to empty AND vacuuming to do; she is an office/building cleaner, not a bin truck operator."),
            "q4b": (1, "Correct — 'early in the morning'."),
            "q5a": (1, "Correct — 'it was sunset'."),
            "q5b": (0, "Incorrect — 'they took a car/truck' — sore feet indicate walking."),
            "q6a": (0, "Incorrect — 'no because there was not enough space to put a window' — wrong reason; the passage says the windows were slits."),
            "q6b": (1, "Correct — 'keep the warmth in'."),
            "q6c": (0, "Not attempted."),
            "q6d": (0, "Not attempted."),
            "q6e": (0, "Not attempted."),
        },
        "shart259_2026-07-16": {
            "q1": (0, "Incorrect — 'at their stop' — too vague; needs to say train station."),
            "q2": (1, "Correct — 'airport'."),
            "q3": (1, "Correct — 'the zoo'."),
            "q4a": (0, "Incorrect — 'garbage man' — she vacuums; she is a cleaner not a garbage collector."),
            "q4b": (1, "Correct — 'early in the morning'."),
            "q5a": (1, "Correct — 'sunset'."),
            "q5b": (0, "Incorrect — 'car' — sore feet indicate walking."),
            "q6a": (1, "Correct — 'not really because it says in the text that the windows were just open slits in the wall'."),
            "q6b": (0, "Incorrect — 'were used to keep in any warmth' — this describes tapestries, not windows."),
            "q6c": (1, "Acceptable — 'because they want to keep in the heat' — implies yes, they were cold."),
            "q6d": (1, "Correct — 'they threw bones on the floor and the grease soaked up'."),
            "q6e": (1, "Correct — 'they were not clean because fleas were on the floor and poor people sleep there'."),
        },
        "wnich33_2026-07-16": {
            "q1": (0, "Incorrect — 'on a train track' — trains are always on tracks; doesn't identify a station."),
            "q2": (0, "Incorrect — 'on a jet' — she could SEE jets; she was at the airport, not on a jet."),
            "q3": (1, "Correct — 'in a cage at the zoo'."),
            "q4a": (1, "Correct — 'cleaning'."),
            "q4b": (1, "Correct — 'morning'."),
            "q5a": (1, "Correct — 'afternoon'."),
            "q5b": (0, "Incorrect — 'in a car' — sore feet indicate walking."),
            "q6a": (1, "Correct — 'no because it says in the text that the windows were just open slits in the thick stone walls'."),
            "q6b": (1, "Correct — 'could be put over the slits in bad weather'."),
            "q6c": (0, "Incorrect — 'yes, because the rooms stuffy and dark bad weather' — dark and stuffy are caused by the slits/shutters, not evidence of cold. Incorrect evidence."),
            "q6d": (0, "Incorrect — 'helped soak up the grease' — this describes the straw's function, but doesn't explain why the floor caught fire (the straw was flammable)."),
            "q6e": (1, "Correct — 'no because the floors were also beds for the poorest people' — identifies an unclean condition."),
        },
    },
    "inferencing-level-1-handout-3": {
        "cpono2_2026-07-16": {
            "q1": (0, "Incorrect — 'in the field' — context is a garden (Dad, weed to pull out). 'Field' is too general."),
            "q2": (1, "Correct — 'playground'."),
            "q3": (1, "Correct — 'in the clothes line'."),
            "q4a": (1, "Correct — 'no because she needed to be closer to the barbed wire'."),
            "q5": (1, "Correct — 'no they did not have a crossing or crossing light because it is mentioned that the THIRD road had those 2 so it was the safest'."),
            "q6a": (1, "Correct — 'night'."),
            "q6b": (1, "Correct — 'yes because he called out for them'."),
            "q6c": (0, "Insufficient — 'he lived there for a decent amount because it his home' — does not reference the since-little evidence."),
            "q6d": (0, "Incorrect — 'in its usual place' — needs to identify kitchen; 'usual place' alone is insufficient."),
            "q6e": (0, "Incorrect — 'to see if his parents left anything' — vague; needs to say he was looking for a note/message."),
        },
        "fpick8_2026-07-16": {
            "q1": (0, "Incorrect — 'At the house' — not specific enough; should be 'in the garden'."),
            "q2": (1, "Correct — 'Outside at the playground'."),
            "q3": (0, "Not attempted."),
            "q4a": (0, "Incorrect — 'Because she could see dirty wool on the fence' — answers YES (she did know) but the correct answer is NO (she had to get closer first). Misreads the inference."),
            "q5": (1, "Correct — 'No because they said that the third one was the safest because it has a crossing and a traffic light'."),
            "q6a": (1, "Correct — 'Night'."),
            "q6b": (1, "Correct — 'Yes, she was because she was surprised to find out that no one was home' (uses 'she' for Kim but inference is correct)."),
            "q6c": (0, "Not attempted."),
            "q6d": (0, "Not attempted."),
            "q6e": (0, "Not attempted."),
        },
        "jtayl1104_2026-07-16": {
            "q1": (1, "Correct — 'in the garden'."),
            "q2": (1, "Correct — 'the playground'."),
            "q3": (1, "Correct — 'the washing line'."),
            "q4a": (1, "Correct — 'no because it says that she saw that it was only a piece of wool which implies that she didn't know'."),
            "q5": (1, "Correct — 'no because he said it was the safest one because it had lights'."),
            "q6a": (0, "Incorrect — 'morning or afternoon' — clues (no lights, no TV, darkness) clearly indicate night."),
            "q6b": (0, "Incorrect — 'no because he said there was an unusual silence' — the answer is YES he was expecting them; he was surprised they were NOT there."),
            "q6c": (1, "Correct — 'because he said ever since he was little he would come down these stairs and get water'."),
            "q6d": (0, "Incorrect — 'the usual spot in the garage' — the torch was in the kitchen (drawer), not the garage."),
            "q6e": (0, "Incorrect — 'in the wrong cupboard' — misreads; this is what he did first, not WHY he shone the torch on the table."),
        },
        "kfiel89_2026-07-16": {
            "q1": (1, "Correct — 'the back yard'."),
            "q2": (1, "Correct — 'the park'."),
            "q3": (1, "Correct — 'on the line'."),
            "q4a": (1, "Correct — 'no, because she came to see what it was' — implies she had to get closer first."),
            "q5": (0, "Incorrect — 'no because they would have said 1, 2 and 3' — incorrect reasoning; doesn't reference the third-road safety evidence."),
            "q6a": (1, "Correct — 'night'."),
            "q6b": (1, "Correct — 'yes because he was looking for them'."),
            "q6c": (1, "Correct — 'yes, because he knew how to get a glass of water in the dark'."),
            "q6d": (1, "Correct — 'in the drawer'."),
            "q6e": (1, "Correct — 'on the note his mum left'."),
        },
        "shart259_2026-07-16": {
            "q1": (1, "Correct — 'in the garden'."),
            "q2": (1, "Correct — 'the playground'."),
            "q3": (1, "Correct — 'on the close line' (spelling 'close' for 'clothes')."),
            "q4a": (0, "Incorrect — 'it was dirty and she was near the wire' — does not answer whether she knew it was wool; misses the 'not knowing' inference."),
            "q5": (1, "Correct — 'they did not because they said the last one has lights and the safest one'."),
            "q6a": (1, "Correct — 'night'."),
            "q6b": (0, "Insufficient — 'because he called out to see if they were there' — the word 'yes' is missing; however inference is present. Awarded benefit of doubt partially — the evidence is there, no 'yes'. Awarding 0 as the question asks 'was Kim expecting...' requiring yes/no + evidence."),
            "q6c": (1, "Correct — 'it says when he was little so that tells me he has lived there since he was little'."),
            "q6d": (0, "Incorrect — 'kitchen table' — the torch was in the kitchen DRAWER, not on the kitchen table."),
            "q6e": (1, "Correct — 'to read the note'."),
        },
    },
    "inferencing-level-1-handout-4": {
        "cpono2_2026-07-16": {
            "q1": (0, "Incorrect — 'Good Friday' — by Good Friday they are sold out; she needs to buy BEFORE Good Friday."),
            "q2": (0, "Incorrect — 'in the cool noon' — midday IS noon and is described as too hot; 'cool noon' contradicts the passage."),
            "q3": (1, "Correct — 'outside the children are running back inside the classroom' — identifies school setting."),
            "q4a": (1, "Correct — 'broke the glass with the ball'."),
            "q4b": (1, "Correct — 'the father said THIS TIME implying that he didn't need to pay for the last times'."),
            "q5a": (0, "Incorrect — 'building a building' — should be a dollhouse/doll's house."),
            "q6a": (1, "Correct — 'spiders'."),
            "q6b": (0, "Incorrect — 'to protect themselves' — does not address 'ONLY for defence' or the 'mainly' qualifier."),
            "q6c": (0, "Incorrect — 'no but it will cause a painful sensation' — correct sentiment but doesn't address the 'not often' nuance."),
            "q6d": (1, "Correct — 'Until it is a few days old, a baby scorpion's home is its mother's back'."),
            "q6e": (0, "Incorrect — 'because there are predators' — not supported by text; the text implies heat is the reason."),
        },
        "shart259_2026-07-16": {
            "q1": (0, "Incorrect — 'by Good Friday' — same as cpono2; needs to be BEFORE Good Friday."),
            "q2": (1, "Correct — 'after midday' — identifies cooler time."),
            "q3": (1, "Correct — 'school starts' — identifies school setting."),
            "q4a": (1, "Correct — 'smashed the window with a ball'."),
            "q4b": (1, "Correct — 'because the dad said you have to pay for it THIS TIME'."),
            "q5a": (1, "Correct — 'Barbie house' — accepted equivalent of dollhouse."),
            "q6a": (1, "Correct — 'spiders'."),
            "q6b": (1, "Correct — 'because it says mainly use for its defence' — identifies 'mainly' qualifier correctly."),
            "q6c": (0, "Incorrect — 'no but it will be burning you' — correct answer is 'not often' (rarely it can kill); student says 'no' which overstates."),
            "q6d": (1, "Correct — 'on their mums back'."),
            "q6e": (1, "Correct — 'its too hot'."),
        },
    },
}

TOTALS = {
    "inferencing-level-1-handout-1": 12,
    "inferencing-level-1-handout-2": 12,
    "inferencing-level-1-handout-3": 10,
    "inferencing-level-1-handout-4": 11,
}

GRADED_AT = "2026-07-16T11:25:00.000Z"


def score_file(input_path, output_path, scores_lookup):
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    activity_id = data["activity"]["activityId"]
    student_name = data["student"]["name"]
    activity_date = data["student"]["activityDate"]
    key = f"{student_name}_{activity_date}"

    if activity_id not in scores_lookup or key not in scores_lookup[activity_id]:
        print(f"  WARN: No scores for {activity_id} / {key}")
        return

    q_scores = scores_lookup[activity_id][key]
    total_marks = TOTALS[activity_id]

    question_scores = []
    earned = 0
    for section in data["sections"]:
        for resp in section["responses"]:
            qid = resp["questionId"]
            if not resp["answered"]:
                question_scores.append({
                    "questionId": qid,
                    "score": 0,
                    "maxMarks": 1,
                    "rationale": "Not attempted."
                })
            elif qid in q_scores:
                score, rationale = q_scores[qid]
                earned += score
                question_scores.append({
                    "questionId": qid,
                    "score": score,
                    "maxMarks": 1,
                    "rationale": rationale
                })
            else:
                question_scores.append({
                    "questionId": qid,
                    "score": 0,
                    "maxMarks": 1,
                    "rationale": "No marking data available for this question."
                })

    percentage = round(earned / total_marks * 100) if total_marks > 0 else 0

    data["marking"] = {
        "gradedAt": GRADED_AT,
        "gradedBy": "comprehension-marker-skill v1.0",
        "totalMarks": total_marks,
        "earnedMarks": earned,
        "percentage": percentage,
        "questionScores": question_scores
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"  SCORED: {student_name} ({activity_id}) -> {earned}/{total_marks} ({percentage}%)")


def main():
    base = Path(__file__).parent
    results_dir = base / "Results"
    output_dir = base / "scored-results"

    total_files = 0
    scored_files = 0

    for subfolder in results_dir.iterdir():
        if not subfolder.is_dir():
            continue
        for json_file in sorted(subfolder.glob("*.json")):
            total_files += 1
            out_subfolder = output_dir / subfolder.name
            out_file = out_subfolder / (json_file.name + ".scored.json")

            if out_file.exists():
                print(f"  SKIP (already scored): {json_file.name}")
                continue

            print(f"Processing: {json_file.name}")
            score_file(json_file, out_file, SCORES)
            scored_files += 1

    print(f"\nDone. {scored_files} files scored, {total_files - scored_files} skipped.")


if __name__ == "__main__":
    main()
