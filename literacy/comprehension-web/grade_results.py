"""
comprehension_grader.py
Reads all student JSON files from Results/ and writes scored JSON to scored-results/
Run from: literacy/comprehension-web/
"""

import json
import os
import re
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
        "lmcdo381_2026-07-16": {
            "q1": (1, "Correct — 'during the hot summer months' is an accepted summer inference."),
            "q2": (1, "Correct — 'night time' correctly infers it was getting dark."),
            "q3": (1, "Correct — 'morning' correctly identifies the time."),
            "q4a": (1, "Correct — 'the baby crying'."),
            "q4b": (1, "Correct — 'because the baby bottle fell on the floor' correctly identifies the cause."),
            "q5a": (1, "Correct — 'he was waiting at the bus stop'."),
            "q5b": (1, "Correct — 'because he had to run inside to grab his homework' correctly identifies the causal link."),
            "q6a": (1, "Correct — identifies the bus driver's refusal and Wade's desire to show his grandad."),
            "q6b": (1, "Correct — 'wades grandfather'."),
            "q6c": (1, "Correct — 'yes' and notes following instructions to keep it healthy."),
            "q6d": (1, "Correct — 'so the two people at the front did not hear the piglet' (typo 'back' for 'bag')."),
            "q6e": (1, "Correct — 'because the piglet was in wades bag'."),
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
        "dmcdo222_2026-07-17": {
            "q1": (1, "Correct — 'at the train station'."),
            "q2": (1, "Correct — 'at the air force or the airport'."),
            "q3": (1, "Correct — 'in a cage'."),
            "q4a": (0, "Incorrect — 'bin lady' is a collector, not a cleaner/janitor."),
            "q4b": (1, "Correct — 'early in the morning'."),
            "q5a": (1, "Correct — 'late afternoon'."),
            "q5b": (0, "Incorrect — 'bike' — they walked as indicated by sore feet/boots."),
            "q6a": (0, "Incorrect — 'no' with no evidence is rejected."),
            "q6b": (0, "Incorrect — 'light or fire arrows outside' — incorrect window purpose."),
            "q6c": (1, "Correct — 'yes' and references tapestry wall hangings to keep warmth in."),
            "q6d": (1, "Correct — references grease soaking up which refers back to straw. Awarded on benefit of doubt."),
            "q6e": (1, "Correct — 'no' and references grease."),
        },
        "lmcdo381_2026-07-17": {
            "q1": (1, "Correct — 'at the train station'."),
            "q2": (0, "Incorrect — 'Airforce plane place' is too vague/incorrect for commercial passenger airport."),
            "q3": (1, "Correct — 'in the zoo'."),
            "q4a": (0, "Incorrect — 'working in a bin truck'."),
            "q4b": (1, "Correct — 'early in the morning'."),
            "q5a": (1, "Correct — 'sunset'."),
            "q5b": (0, "Incorrect — 'they took a car/truck' — they walked."),
            "q6a": (0, "Incorrect — wrong reason for no glass windows."),
            "q6b": (0, "Incorrect — windows/slits were not designed to keep warmth in."),
            "q6c": (0, "Incorrect — no 'yes' and incorrect/unsupported evidence."),
            "q6d": (0, "Incorrect — food scraps did not directly cause the fires (straw/grease did)."),
            "q6e": (1, "Correct — 'no' and references food scraps on the floor."),
        },
        "smorg220_2026-07-17": {
            "q1": (1, "Correct — 'at the train stop'."),
            "q2": (1, "Correct — 'at the airport'."),
            "q3": (1, "Correct — 'in a cage'."),
            "q4a": (1, "Correct — 'a maid'."),
            "q4b": (1, "Correct — 'very early in the morning'."),
            "q5a": (1, "Correct — 'in the afternoon'."),
            "q5b": (1, "Correct — 'they walked'."),
            "q6a": (1, "Correct — 'no' and references the open slits in stone walls."),
            "q6b": (1, "Correct — references shutters covering slits in bad weather."),
            "q6c": (1, "Correct — 'yes' and references open slits in thick walls."),
            "q6d": (0, "Incorrect — 'carpet' — text says there were no carpets."),
            "q6e": (1, "Correct — 'no' and references bones and scraps on the floor."),
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
        "epryo13_2026-07-17": {
            "q1": (1, "Correct — 'a garden or farm'."),
            "q2": (1, "Correct — 'the park'."),
            "q3": (1, "Correct — 'on the clothesline'."),
            "q4a": (0, "Incorrect — poor reasoning, does not note getting closer."),
            "q5": (1, "Correct — 'no' and notes the third road was safest because it had lights."),
            "q6a": (1, "Correct — 'nighttime'."),
            "q6b": (0, "Incorrect — 'no' with no evidence."),
            "q6c": (1, "Correct — 'yes' and references 'when i was littile'."),
            "q6d": (0, "Incorrect — 'wrong draw' — it was in the usual drawer."),
            "q6e": (1, "Correct — 'so she can read a note'."),
        },
        "fpick8_2026-07-17": {
            "q1": (0, "Incorrect — 'At the house' is too vague."),
            "q2": (1, "Correct — 'Outside at the playground'."),
            "q3": (0, "Not attempted."),
            "q4a": (0, "Incorrect — answers yes instead of no, and wrong reasoning."),
            "q5": (1, "Correct — 'No' and references crossings and lights on third road."),
            "q6a": (1, "Correct — 'Night'."),
            "q6b": (1, "Correct — 'Yes' and notes surprise at no one home."),
            "q6c": (0, "Incorrect — poor reasoning, no reference to layout/childhood memory."),
            "q6d": (0, "Incorrect — 'hall way'."),
            "q6e": (0, "Incorrect — 'to see if anything was there' is too vague."),
        },
        "fwend2_2026-07-17": {
            "q1": (1, "Correct — 'in the garden'."),
            "q2": (1, "Correct — 'park'."),
            "q3": (1, "Correct — 'clothes line'."),
            "q4a": (0, "Incorrect — answered yes instead of no."),
            "q5": (1, "Correct — 'no' and notes last is the only one with light and crossing."),
            "q6a": (1, "Correct — 'night time'."),
            "q6b": (0, "Incorrect — 'yes' but wrong evidence (normally home)."),
            "q6c": (0, "Incorrect — answered no instead of yes."),
            "q6d": (1, "Correct — 'the torch was in the draw'."),
            "q6e": (1, "Correct — identifies note on the table."),
        },
        "jbinn27_2026-07-17": {
            "q1": (1, "Correct — 'in the garden'."),
            "q2": (1, "Correct — 'playground'."),
            "q3": (1, "Correct — 'outside on the clothes line'."),
            "q4a": (1, "Correct — 'No' and notes getting closer to realise."),
            "q5": (1, "Correct — 'No' and notes third road was safest."),
            "q6a": (1, "Correct — 'Nighttime'."),
            "q6b": (0, "Incorrect — answered no instead of yes."),
            "q6c": (1, "Correct — 'Yes' and references nightly water runs."),
            "q6d": (1, "Correct — identifies the second drawer opened."),
            "q6e": (1, "Correct — 'he saw the note'."),
        },
        "jfull212_2026-07-17": {
            "q1": (0, "Incorrect — 'farm'."),
            "q2": (1, "Correct — 'play ground'."),
            "q3": (1, "Correct — 'clothes line'."),
            "q4a": (0, "Incorrect — answered yes instead of no."),
            "q5": (1, "Correct — 'no' and notes others were dangerous/didn't have crossings."),
            "q6a": (1, "Correct — 'night'."),
            "q6b": (0, "Incorrect — answered no instead of yes."),
            "q6c": (0, "Incorrect — no 'yes' and wrong/insufficient evidence."),
            "q6d": (0, "Incorrect — 'usual spot' is too vague."),
            "q6e": (1, "Correct — 'to look for the note'."),
        },
        "lmcdo381_2026-07-26": {
            "q1": (1, "Correct — 'in the garden'."),
            "q2": (1, "Correct — 'playground'."),
            "q3": (1, "Correct — 'on the clothes line'."),
            "q4a": (1, "Correct — 'no' and notes needing to get nearer to see."),
            "q5": (1, "Correct — 'no' and notes third road had crossing and lights."),
            "q6a": (1, "Correct — 'night time'."),
            "q6b": (1, "Correct — 'yes' and notes he called out."),
            "q6c": (1, "Correct — 'yes' and notes remembering off the top of his head."),
            "q6d": (1, "Correct — 'in the draw'."),
            "q6e": (1, "Correct — 'to read the note that his family left'."),
        },
        "smorg220_2026-07-17": {
            "q1": (1, "Correct — 'garden'."),
            "q2": (1, "Correct — 'playground'."),
            "q3": (1, "Correct — 'on a line'."),
            "q4a": (0, "Incorrect — answered yes instead of no."),
            "q5": (1, "Correct — 'no' and notes third road was safest."),
            "q6a": (1, "Correct — 'night time'."),
            "q6b": (0, "Incorrect — 'yes' but wrong evidence."),
            "q6c": (1, "Correct — 'yes' and references nightly water drink."),
            "q6d": (1, "Correct — 'in the kitchen'."),
            "q6e": (1, "Correct — identifies the note on the table."),
        },
        "wnich33_2026-07-17": {
            "q1": (1, "Correct — 'in a garden'."),
            "q2": (1, "Correct — 'at a park'."),
            "q3": (1, "Correct — 'on a clothesline'."),
            "q4a": (0, "Incorrect — answered yes instead of no."),
            "q5": (1, "Correct — 'no' and notes third road had crossing and lights."),
            "q6a": (1, "Correct — 'night'."),
            "q6b": (0, "Incorrect — 'yes' but wrong/incorrect evidence."),
            "q6c": (1, "Correct — 'yes' and quotes 'Ever since he had been very little'."),
            "q6d": (1, "Correct — 'in a drawer'."),
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
        "fpick8_2026-07-17": {
            "q1": (1, "Correct — 'at the start of the week'."),
            "q2": (1, "Correct — 'in the morning'."),
            "q3": (0, "Incorrect — 'the bell rang for class' describes starting action, not school location."),
            "q4a": (0, "Incorrect — 'broke something' is too vague."),
            "q4b": (1, "Correct — 'yes' and references 'this time you're going to pay'."),
            "q5a": (1, "Correct — 'a doll house'."),
            "q6a": (0, "Incorrect — 'baby scorpions'."),
            "q6b": (0, "Incorrect — answered yes instead of no."),
            "q6c": (0, "Incorrect — 'nope' overstates the 'not often' nuance."),
            "q6d": (0, "Not attempted."),
            "q6e": (0, "Not attempted."),
        },
        "fwend2_2026-07-17": {
            "q1": (1, "Correct — 'before good friday'."),
            "q2": (1, "Correct — '8 am to 11:30 am'."),
            "q3": (1, "Correct — 'at school'."),
            "q4a": (1, "Correct — 'he broke a window'."),
            "q4b": (1, "Correct — 'yes' and references 'this time you will pay'."),
            "q5a": (1, "Correct — 'a doll house'."),
            "q6a": (1, "Correct — 'spiders'."),
            "q6b": (0, "Incorrect — answered yes instead of no."),
            "q6c": (0, "Incorrect — answered no instead of rarely."),
            "q6d": (1, "Correct — 'living off their mums back'."),
            "q6e": (1, "Correct — 'to hot in the day'."),
        },
        "jfull212_2026-07-17": {
            "q1": (0, "Incorrect — 'Friday'."),
            "q2": (1, "Correct — 'cooler'."),
            "q3": (1, "Correct — 'at a school'."),
            "q4a": (1, "Correct — 'broke the class' (accepted for glass)."),
            "q4b": (0, "Incorrect — answered no instead of yes."),
            "q5a": (0, "Incorrect — does not identify dollhouse."),
            "q6a": (1, "Correct — 'spider'."),
            "q6b": (0, "Incorrect — answered yes instead of no."),
            "q6c": (0, "Incorrect — answered no instead of rarely."),
            "q6d": (1, "Correct — 'on there mother back'."),
            "q6e": (1, "Correct — 'to hot they like to hunt in the night'."),
        },
        "Jtayl1104_2026-07-17": {
            "q1": (1, "Correct — 'a week before good friday'."),
            "q2": (1, "Correct — 'morning or evening'."),
            "q3": (0, "Incorrect — does not identify school setting."),
            "q4a": (1, "Correct — 'he had broken the window'."),
            "q4b": (0, "Incorrect — answered no instead of yes."),
            "q5a": (1, "Correct — 'doll house'."),
            "q6a": (1, "Correct — 'spiders'."),
            "q6b": (0, "Incorrect — does not answer with a clear 'no'."),
            "q6c": (0, "Incorrect — answered 'can't be killed' instead of rarely."),
            "q6d": (1, "Correct — 'baby scorpians spend some days it its mothers back'."),
            "q6e": (1, "Correct — 'tempreture are very high'."),
        },
        "kfiel89_2026-07-17": {
            "q1": (1, "Correct — 'before good Friday'."),
            "q2": (1, "Correct — 'morning'."),
            "q3": (1, "Correct — 'school'."),
            "q4a": (1, "Correct — 'broke the glass'."),
            "q4b": (1, "Correct — 'yes, because you have to pay this time'."),
            "q5a": (1, "Correct — 'doll house'."),
            "q6a": (1, "Correct — 'spiders'."),
            "q6b": (1, "Correct — 'no' and references 'manly' (mainly)."),
            "q6c": (0, "Incorrect — answered no instead of rarely."),
            "q6d": (1, "Correct — 'on their mothers back'."),
            "q6e": (1, "Correct — 'it is hot hot for them'."),
        },
        "smorg220_2026-07-17": {
            "q1": (0, "Incorrect — 'good Friday'."),
            "q2": (1, "Correct — 'in the morning'."),
            "q3": (1, "Correct — 'at school'."),
            "q4a": (1, "Correct — 'kicked a ball into something glass'."),
            "q4b": (1, "Correct — 'yes' and references 'this time'."),
            "q5a": (0, "Incorrect — 'a house' is too general."),
            "q6a": (1, "Correct — 'spiders'."),
            "q6b": (0, "Incorrect — incorrect evidence."),
            "q6c": (1, "Correct — 'yes' and quotes 'does not often kill'."),
            "q6d": (1, "Correct — 'on their mothers back'."),
            "q6e": (1, "Correct — references high daytime temperature."),
        },
        "wnich33_2026-07-17": {
            "q1": (0, "Incorrect — 'Friday'."),
            "q2": (1, "Correct — 'morning'."),
            "q3": (1, "Correct — 'in a school'."),
            "q4a": (0, "Incorrect — 'broke something' is too vague."),
            "q4b": (1, "Correct — 'yes' and references 'pay for it this time'."),
            "q5a": (1, "Correct — 'dollhouse'."),
            "q6a": (1, "Correct — 'spiders'."),
            "q6b": (1, "Correct — 'No' and notes hunting prey vs defending."),
            "q6c": (0, "Incorrect — answered no instead of rarely."),
            "q6d": (1, "Correct — 'on its mother's back'."),
            "q6e": (0, "Incorrect — 'nocturnal predators' is too vague/unsupported."),
        },
    },
    "inferencing-level-1-handout-5": {
        "cpono2_2026-07-17": {
            "q1": (1, "Correct — 'no because it says he hardly does it' — references 'hardly ever'."),
            "q2": (0, "Incorrect — says 'until meaning he/she was waiting' but does not say 'yes' and the reasoning about 'until' is unclear; does not identify the water going cold."),
            "q3": (1, "Correct — 'no because he is usually a quiet dog'."),
            "q4a": (1, "Correct — 'a pirate hat' — accepted as pirate costume/outfit equivalent."),
            "q5a": (0, "Incorrect — 'wishing tree' — should be a Christmas tree (gifts)."),
            "q6a": (1, "Correct — 'she was upset because she banged her head on the steering wheel' — misread 'hands' as 'head' but identifies upset + steering wheel evidence."),
            "q6b": (1, "Correct — 'because there was no fuel'."),
            "q6c": (1, "Correct — 'because it was getting dark there was a cold wind'."),
            "q6d": (1, "Correct — 'because nothing was in sight' — implies darkness/couldn't see. Awarded on benefit of doubt."),
            "q6e": (1, "Correct — 'it was an truck' — identifies truck."),
        },
        "jfull212_2026-07-17": {
            "q1": (0, "Incorrect — 'no he does not brush his teeth often' — correct answer but no evidence from text (no reference to 'hardly ever')."),
            "q2": (0, "Incorrect — 'yes she is the bath for a long time' — no evidence from text."),
            "q3": (0, "Incorrect — 'no he did not he would not bark as often' — no clear evidence from text."),
            "q4a": (0, "Incorrect — 'yes she did' — does not identify what was made (a pirate costume)."),
            "q5a": (0, "Incorrect — 'it is just a tree' — should be a Christmas tree."),
            "q6a": (0, "Incorrect — 'yes she was upset' — no evidence from text."),
            "q6b": (1, "Correct — 'no fill in the car' — identifies running out of fuel (despite poor grammar)."),
            "q6c": (0, "Incorrect — 'so they can sleep' — should be because of the cold wind."),
            "q6d": (1, "Correct — 'because it was dark'."),
            "q6e": (1, "Correct — 'it was a truck'."),
        },
        "jtayl1104_2026-07-17": {
            "q1": (1, "Correct — 'no because it says he hardly ever brushes his teeth'."),
            "q2": (1, "Correct — 'yes because from when the bath is to when it is cold is a long time'."),
            "q3": (1, "Correct — 'no because he only barked acasanly cause it says ralph was uaslly quiet' — identifies 'usually quiet' despite spelling."),
            "q4a": (1, "Correct — 'a pirate costume'."),
            "q5a": (0, "Incorrect — 'giving tree' — should be a Christmas tree."),
            "q6a": (1, "Correct — 'yes because it says she banged her hands on the steering wheel'."),
            "q6b": (1, "Correct — 'it ran out of gas'."),
            "q6c": (1, "Correct — 'because it was cold'."),
            "q6d": (1, "Correct — 'because there wasnt much around' — implies couldn't see in the dark. Awarded on benefit of doubt."),
            "q6e": (1, "Correct — 'a tow truck'."),
        },
        "shart259_2026-07-17": {
            "q1": (1, "Correct — 'no he doesn't because it say he hardly brushes his teeth'."),
            "q2": (1, "Correct — 'she was because it take time for the water to be cold'."),
            "q3": (1, "Correct — 'no because it say he was quiet'."),
            "q4a": (1, "Correct — 'a pirate outfit'."),
            "q5a": (0, "Incorrect — 'a wishing tree' — should be a Christmas tree."),
            "q6a": (1, "Correct — 'she banged her hand on the wheel' — identifies the evidence even without explicit 'yes'."),
            "q6b": (1, "Correct — 'she didn't fill up'."),
            "q6c": (1, "Correct — 'so they could wait and it was cold and no car to be seen'."),
            "q6d": (1, "Correct — 'it was dark'."),
            "q6e": (1, "Correct — 'tow truck and a police' — identifies tow truck. Awarded despite extra mention of police."),
        },
    },
    "inferencing-level-1-handout-6": {
        "cpono2_2026-07-17": {
            "q1": (1, "Correct — 'windy day'."),
            "q2": (0, "Incorrect — 'listening' — should be cooking."),
            "q3": (1, "Correct — 'chopping down trees'."),
            "q4a": (1, "Correct — 'scraped his knee' — identifies falling/injury. Awarded on benefit of doubt."),
            "q4b": (0, "Incorrect — quotes text but doesn't answer yes/no about whether he was badly hurt."),
            "q5a": (1, "Correct — 'he was reading' — identifies reading his book."),
            "q5b": (1, "Correct — 'he didnt turn on the switch'."),
            "q6a": (0, "Incorrect — 'it was gonna rain' — the reason was the wind, not rain."),
            "q6b": (1, "Correct — 'so, she could be on time for delivery a drain was coming' — identifies storm/rain approaching despite typo."),
            "q6c": (1, "Correct — 'Riverside Street'."),
            "q6d": (0, "Incorrect — 'windy and rainy' — should identify it as a hill/steep street."),
            "q6e": (0, "Incorrect — 'to grab her hat' — the question asks WHY it sailed over the bridge, not what she tried to do."),
        },
        "jtayl1104_2026-07-17": {
            "q1": (1, "Correct — 'windy'."),
            "q2": (1, "Correct — 'cooking'."),
            "q3": (1, "Correct — 'cutting down trees'."),
            "q4a": (1, "Correct — 'he fell'."),
            "q4b": (1, "Correct — 'no because it said he only got a graze'."),
            "q5a": (1, "Correct — 'because he was reading'."),
            "q5b": (0, "Not attempted."),
            "q6a": (0, "Incorrect — 'so in wouldnt get wet and ruin the news papers' — that's why she hurried, not why she pulled her hat down."),
            "q6b": (1, "Correct — 'to get away from the rain' — identifies approaching storm."),
            "q6c": (1, "Correct — 'riverside street'."),
            "q6d": (0, "Incorrect — 'frewheel' — doesn't identify it as a hill."),
            "q6e": (0, "Incorrect — 'because she dropped it' — should be the wind blew it away."),
        },
        "kfiel89_2026-07-17": {
            "q1": (1, "Correct — 'windy'."),
            "q2": (1, "Correct — 'cooking'."),
            "q3": (1, "Correct — 'cutting down the tree'."),
            "q4a": (1, "Correct — 'he fell'."),
            "q4b": (1, "Correct — 'no his mother was laughing' — identifies evidence (mother laughed)."),
            "q5a": (1, "Correct — 'he was reading'."),
            "q5b": (1, "Correct — 'it was not on, on the wall'."),
            "q6a": (1, "Correct — 'it was about to rain' — the wind was blowing. Awarded on benefit of doubt as wind precedes rain."),
            "q6b": (1, "Correct — 'she had to fines because it was raining' — identifies hurrying due to weather despite spelling."),
            "q6c": (1, "Correct — 'riverside street'."),
            "q6d": (1, "Correct — 'a hill' — correctly identifies Riverside Street as a hill (rides up, freewheels down)."),
            "q6e": (1, "Correct — 'it was windy'."),
        },
        "shart259_2026-07-17": {
            "q1": (1, "Correct — 'windy day'."),
            "q2": (1, "Correct — 'cooking bacon'."),
            "q3": (1, "Correct — 'cutting trees'."),
            "q4a": (1, "Correct — 'fell'."),
            "q4b": (1, "Correct — 'graze on a knee is not that bad' — identifies no + evidence."),
            "q5a": (1, "Correct — 'he was reading his book'."),
            "q5b": (1, "Correct — 'the switch on the wall was not on'."),
            "q6a": (1, "Correct — 'the wind'."),
            "q6b": (1, "Correct — 'so the rain didn't wet her' — identifies weather."),
            "q6c": (1, "Correct — 'riverside street'."),
            "q6d": (1, "Correct — 'up hill' — correctly identifies Riverside Street as uphill."),
            "q6e": (1, "Correct — 'the wind'."),
        },
    },
    "inferencing-level-1-handout-7": {
        "cpono2_2026-07-17": {
            "q1": (1, "Correct — 'washing up' — accepted as bathing/washing."),
            "q2": (1, "Correct — 'snow'."),
            "q3": (1, "Correct — 'a happy birthday' — identifies birthday card content."),
            "q4a": (1, "Correct — 'with her bike' — identifies cycling."),
            "q4b": (1, "Correct — 'she was not on time since all the shops were close'."),
            "q5a": (1, "Correct — 'no because he was shouting for the dog to come back'."),
            "q5b": (1, "Correct — 'no because of the text lines The man's shouting and whistling made no difference'."),
            "q6a": (1, "Correct — 'The boys were always playing rough games' — quotes text."),
            "q6b": (1, "Correct — 'Mrs Low quickly got up to answer it, she spilled the contents of the button container'."),
            "q6c": (1, "Correct — identifies Hannah crawling over, going quiet, coughing and face turning red."),
            "q6d": (1, "Correct — 'no becasue they just watched tv'."),
        },
        "jtayl1104_2026-07-17": {
            "q1": (1, "Correct — 'bathing or swimming'."),
            "q2": (0, "Incorrect — 'paint' — should be snow."),
            "q3": (1, "Correct — 'a birthday card'."),
            "q4a": (1, "Correct — 'by a bike'."),
            "q4b": (1, "Correct — 'no because it said when she got there it was closed'."),
            "q5a": (1, "Correct — 'no because the man was shouting and whistling'."),
            "q5b": (1, "Correct — 'no because it said it made no difference'."),
            "q6a": (1, "Correct — 'because they play rough'."),
            "q6b": (1, "Correct — 'Mrs low spilled them when she went to answer the phone'."),
            "q6c": (1, "Correct — 'because she was coghing and her face was red'."),
            "q6d": (1, "Correct — 'no because it said they were laughing'."),
        },
        "kfiel89_2026-07-17": {
            "q1": (1, "Correct — 'swimming'."),
            "q2": (0, "Incorrect — 'hail' — should be snow (ground was white, not icy)."),
            "q3": (1, "Correct — 'a birthday card'."),
            "q4a": (1, "Correct — 'bike'."),
            "q4b": (1, "Correct — 'no the store was closed'."),
            "q5a": (1, "Correct — 'no he was whistling to get him back'."),
            "q5b": (1, "Correct — 'no it said it made no different'."),
            "q6a": (1, "Correct — 'they played rough'."),
            "q6b": (0, "Incorrect — 'they fell off the table' — Mrs Low spilled them from the button container when she got up, not fell off a table."),
            "q6c": (1, "Correct — 'she was coughing and red'."),
            "q6d": (1, "Correct — 'no they just watch tv'."),
        },
        "shart259_2026-07-17": {
            "q1": (0, "Incorrect — 'outside in the rain' — should be bathing/swimming (dripping with water + towel)."),
            "q2": (1, "Correct — 'snow'."),
            "q3": (1, "Correct — 'birthday card'."),
            "q4a": (1, "Correct — 'her bike'."),
            "q4b": (1, "Correct — 'no because the store was closed'."),
            "q5a": (0, "Incorrect — 'the dog rushed outside' — restates what happened but doesn't answer yes/no about whether the man wanted it."),
            "q5b": (1, "Correct — 'no because the man whistling and no dog seen' — identifies whistling made no difference."),
            "q6a": (1, "Correct — 'they were playing rough games'."),
            "q6b": (0, "Incorrect — 'baby hannah' — Hannah didn't spill them; Mrs Low spilled the container when she got up."),
            "q6c": (1, "Correct — 'hannah began to cough'."),
            "q6d": (1, "Correct — 'no they were not because they were just watching tv'."),
        },
    },
    "inferencing-level-1-handout-8": {
        "cpono2_2026-07-17": {
            "q1": (0, "Incorrect — 'at home in the dark' — should be at a pedestrian crossing/traffic lights."),
            "q2": (1, "Correct — 'feeding him'."),
            "q3": (1, "Correct — 'reading'."),
            "q4a": (1, "Correct — 'The old bus bounced over the rickety bridge' — identifies bouncing on the bridge."),
            "q4b": (0, "Incorrect — 'the railing or side walk' — it went into the river/water below the bridge, not onto the sidewalk."),
            "q5a": (0, "Incorrect — quotes the falling passage but doesn't identify fishing."),
            "q5b": (1, "Correct — 'the line jerked' — identifies the fish on the line."),
            "q6a": (0, "Incorrect — 'they lay them on the underside' — restates what happens but doesn't explain WHY not on top (to protect from wind and sun)."),
            "q6b": (1, "Correct — 'eat their egg shells'."),
            "q6c": (1, "Correct — 'skin does not stretch to fit the new body'."),
            "q6d": (0, "Incorrect — 'from light to dark green' — the question asks for the STARTING colour, which is light green, not the range."),
            "q6e": (1, "Correct — 'when it gains strength'."),
        },
        "shart259_2026-07-17": {
            "q1": (1, "Correct — 'she was at a crossing'."),
            "q2": (1, "Correct — 'feeding him'."),
            "q3": (1, "Correct — 'reading'."),
            "q4a": (0, "Incorrect — 'there was a clatter' — describes the sound, not WHY it flew off (the bouncing/rickety bridge)."),
            "q4b": (0, "Incorrect — 'the bridge' — too vague; should identify water/river BELOW the bridge."),
            "q5a": (0, "Incorrect — 'waiting' — should identify fishing."),
            "q5b": (1, "Correct — 'the line jerked'."),
            "q6a": (1, "Correct — 'so they can grow save' — identifies protection (safe from wind/sun) despite spelling."),
            "q6b": (1, "Correct — 'eggs shells'."),
            "q6c": (1, "Correct — 'the skin will not strech'."),
            "q6d": (0, "Incorrect — 'dark green' — the starting colour is LIGHT green."),
            "q6e": (1, "Correct — 'when it gains streath' — identifies gaining strength despite spelling."),
        },
    },
    "evaluation-level-2-handout-1": {
        "lheck4_2026-07-17": {
            "q1": (0, "Incorrect — student copied the entire passage verbatim instead of answering the question. No inference or evaluation demonstrated."),
        },
    },
    "evaluation-level-2-handout-2": {
        "lheck4_2026-07-17": {
            "q1": (1, "Correct — 'Sara'."),
        },
    },
    "evaluation-level-2-handout-3": {
        "lheck4_2026-07-17": {
            "q1": (1, "Correct — 'because growing new teeth after twenty doesn't normally happen' — identifies the age factor."),
        },
    },
    "evaluation-level-2-handout-4": {
        "lheck4_2026-07-17": {
            "q1": (0, "Incorrect — 'because louis the king and he knows best' — does not demonstrate evaluative thinking about why the positions worked or why they haven't needed changing."),
        },
    },
    "evaluation-level-2-handout-6-bridge": {
        "lheck4_2026-07-17": {
            "q1": (1, "Correct — 'because Woodsy's got more bad-tempered than ever with jane there it might help' — identifies that Jane can manage Woodsy."),
        },
    },
    "evaluation-level-2-handout-7-bridge": {
        "lheck4_2026-07-17": {
            "q1a": (1, "Correct — 'it was in dads pocket' — identifies the remote was in Dad's pocket when he went into the water."),
            "q1b": (0, "Incorrect — answered 'yes' — the Scotts did NOT go to the beach; they told the family about it and Mr Scott 'returned' later with the spare remote."),
        },
    },
    "evaluation-level-3-handout-5": {
        "lheck4_2026-07-17": {
            "q1": (0, "Incorrect — 'nervous' — the body language (folded arms, pressed lips) indicates anger/annoyance/frustration at Shaun, not nervousness. No evidence provided."),
        },
    },
}

TOTALS = {
    "inferencing-level-1-handout-1": 12,
    "inferencing-level-1-handout-2": 12,
    "inferencing-level-1-handout-3": 10,
    "inferencing-level-1-handout-4": 11,
    "inferencing-level-1-handout-5": 10,
    "inferencing-level-1-handout-6": 12,
    "inferencing-level-1-handout-7": 11,
    "inferencing-level-1-handout-8": 12,
    "evaluation-level-2-handout-1": 1,
    "evaluation-level-2-handout-2": 1,
    "evaluation-level-2-handout-3": 1,
    "evaluation-level-2-handout-4": 1,
    "evaluation-level-2-handout-6-bridge": 1,
    "evaluation-level-2-handout-7-bridge": 2,
    "evaluation-level-3-handout-5": 1,
}

GRADED_AT = "2026-07-19T10:00:00.000Z"


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


def parse_filename(filename):
    # Format: activityId_student_date[ (number)].json
    # e.g. inferencing-level-1-handout-2_dmcdo222_2026-07-17 (1).json
    match = re.match(r"^(.+?)_([a-zA-Z0-9]+)_(\d{4}-\d{2}-\d{2})(?:\s*\((\d+)\))?\.json$", filename)
    if not match:
        return None
    activity_id, student, date_str, dup_num = match.groups()
    dup_num = int(dup_num) if dup_num else 0
    return {
        "activity_id": activity_id,
        "student": student,
        "date": date_str,
        "dup_num": dup_num
    }


def main():
    base = Path(__file__).parent
    results_dir = base / "Results"
    output_dir = base / "scored-results"
    guide_dir = base / "marking-guides"

    total_files = 0
    scored_files = 0
    skipped_duplicates = 0
    missing_guides = 0

    # We process each subfolder (level folder) separately
    for subfolder in sorted(results_dir.iterdir()):
        if not subfolder.is_dir():
            continue
        
        # Find all JSON files in this subfolder
        all_json_files = []
        for json_file in subfolder.glob("*.json"):
            parsed = parse_filename(json_file.name)
            if parsed:
                parsed["path"] = json_file
                all_json_files.append(parsed)
            else:
                print(f"  WARN: Skipping unparseable filename {json_file.name}")

        # Group by student and activity_id to find duplicates
        grouped = {}
        for item in all_json_files:
            key = (item["student"], item["activity_id"])
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(item)

        # For each group, determine the latest file
        latest_files = []
        for key, files in grouped.items():
            # Sort by date ascending, then dup_num ascending. The last one is the latest.
            files_sorted = sorted(files, key=lambda x: (x["date"], x["dup_num"]))
            latest_files.append(files_sorted[-1])
            
            # The rest are ignored duplicates
            skipped_duplicates += len(files_sorted) - 1
            for old in files_sorted[:-1]:
                print(f"  SKIP (older duplicate): {old['path'].name}")

        # Sort the latest files by name to ensure consistent order
        latest_files_sorted = sorted(latest_files, key=lambda x: x["path"].name)

        for item in latest_files_sorted:
            json_file = item["path"]
            total_files += 1
            out_subfolder = output_dir / subfolder.name
            out_file = out_subfolder / (json_file.name + ".scored.json")

            if out_file.exists():
                print(f"  SKIP (already scored): {json_file.name}")
                continue

            # Check if marking guide exists
            activity_id = item["activity_id"]
            guide_file = guide_dir / f"{activity_id}.json"
            if not guide_file.exists():
                print(f"  WARN: No marking guide for {activity_id} ({json_file.name})")
                missing_guides += 1
                continue

            print(f"Processing: {json_file.name}")
            score_file(json_file, out_file, SCORES)
            scored_files += 1

    print(f"\nDone. {scored_files} files scored, {skipped_duplicates} duplicates skipped, {missing_guides} files missing marking guides.")


if __name__ == "__main__":
    main()
