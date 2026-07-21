import os
import json
import re
from pathlib import Path

# Grading database mapping: basename -> {questionId: (score, rationale)}
GRADING_DATA = {
    # 1. cpono2 L2 Handout 1
    "inferencing-level-2-handout-01_cpono2_2026-07-20.json": {
        "q1": (1, "Correctly identifies November."),
        "q2": (0, "Incorrect — 'afternoon or morning' is too vague and incorrect for sunset/evening."),
        "q3": (1, "Correctly identifies late afternoon / night."),
        "q4a": (1, "Correctly infers that they are wolves."),
        "q4b": (1, "Correctly infers they would fight for leadership."),
        "q5a": (0, "Incorrect — the glint was a fish, not the sun."),
        "q6a": (1, "Correctly identifies the comparison to a witch."),
        "q6b": (1, "Correctly explains that the heavy coins caused the hole."),
        "q6c": (0, "Incorrect — the student answered 'yes' but the writer dreaded the question."),
        "q6d": (1, "Correctly infers she was not angry because she smiled.")
    },
    # 2. cpono2 L2 Handout 2
    "inferencing-level-2-handout-02_cpono2_2026-07-21.json": {
        "q1": (1, "Correctly identifies spring based on the buds."),
        "q2": (1, "Correctly identifies winter based on needing a warmer coat."),
        "q3": (1, "Correctly infers that the next boat is tomorrow."),
        "q4a": (1, "Correctly explains they danced due to a long-awaited rain."),
        "q5a": (1, "Correctly infers a rock broke the window."),
        "q6a": (0, "Incorrect — Joe saying 'you are late' does not prove she was late in the past."),
        "q6b": (0, "Incorrect — Joe normally drives her, but got irritated because she was late."),
        "q6c": (1, "Correctly identifies the weather was cold/rainy."),
        "q6d": (1, "Correctly infers Jemma was relieved when she clambered in."),
        "q6e": (1, "Correctly identifies she grabbed the wrong coat.")
    },
    # 3. cpono2 L2 Handout 3
    "inferencing-level-2-handout-03_cpono2_2026-07-21.json": {
        "q1": (1, "Correctly identifies the library."),
        "q2": (1, "Correctly identifies the beach or coast."),
        "q3": (1, "Correctly identifies they were near a road or city."),
        "q4a": (1, "Correctly infers he fell."),
        "q5a": (1, "Correctly identifies the dog."),
        "q5b": (1, "Correctly infers the dog was hit by a car."),
        "q6a": (1, "Correctly infers he is near the beach/coast."),
        "q6b": (0, "Incorrect — the flashing light is a lighthouse, not the moon."),
        "q6c": (1, "Correctly infers he liked fishing as it was his favorite place on the rocks."),
        "q6d": (1, "Correctly infers it is an isolated place."),
        "q6e": (0, "Incorrect — the text states he lived there happily, so he was not lonely.")
    },
    # 4. cpono2 L2 Handout 4
    "inferencing-level-2-handout-04_cpono2_2026-07-21.json": {
        "q1": (1, "Correctly identifies the forest."),
        "q2": (1, "Correctly identifies Amsterdam."),
        "q3": (1, "Correctly identifies the top of a mountain."),
        "q4a": (0, "Incorrect — the boy did not notice because he was deaf, not because it was crowded."),
        "q4b": (1, "Correctly explains his friends pointed it out to him."),
        "q5a": (1, "Correctly identifies she ran."),
        "q5b": (1, "Correctly identifies it was a customer calling."),
        "q5c": (1, "Correctly infers it happened before."),
        "q6a": (0, "Incorrect — they assumed they were allowed because the gates were open, not because of the war."),
        "q6b": (0, "Incorrect — they were built during the war for military use, not just for an activity."),
        "q6c": (1, "Correctly infers he wanted to test the length of the runway."),
        "q6d": (1, "Correctly infers they were not treated politely."),
        "q6e": (1, "Correctly identifies he realized the danger when he saw the baby.")
    },
    # 5. cpono2 L2 Handout 5
    "inferencing-level-2-handout-05_cpono2_2026-07-21.json": {
        "q1": (0, "Incorrect — 'feathers' just repeats the text, it should identify a bird."),
        "q2": (1, "Correctly infers she was in a plane crash."),
        "q3": (1, "Correctly infers she was dirty."),
        "q4a": (1, "Correctly identifies the ocean."),
        "q4b": (1, "Correctly identifies a wave."),
        "q5a": (1, "Correctly infers it was getting dark."),
        "q5b": (1, "Correctly infers she was tired/late."),
        "q6a": (1, "Correctly explains CJ paid her because he landed on her square."),
        "q6b": (0, "Incorrect — 'a card' is incomplete, it should mention the card instructions."),
        "q6c": (0, "Incorrect — CJ hoped to reach the starting point for more money."),
        "q6d": (1, "Correctly identifies her comment."),
        "q6e": (1, "Correctly infers she was very serious/upset about the game.")
    },
    # 6. epryo13 L1 Handout 1
    "inferencing-level-1-handout-1_epryo13_2026-07-16 (3).json": {
        "q1": (1, "Correctly identifies summer/hot weather."),
        "q2": (0, "Incorrect — 'morning or night' is too vague and contradictory."),
        "q3": (1, "Correctly infers morning before school starts."),
        "q4a": (1, "Correctly identifies the baby crying."),
        "q4b": (1, "Correctly infers the baby dropped the bottle."),
        "q5a": (1, "Correctly identifies the bus stop."),
        "q5b": (1, "Correctly identifies returning for forgotten homework."),
        "q6a": (0, "Incorrect — answer is from a completely different story (Wade and the piglet)."),
        "q6b": (0, "Incorrect — answer is from a completely different story (Wade and the piglet)."),
        "q6c": (0, "Incorrect — answer is from a completely different story (Wade and the piglet)."),
        "q6d": (0, "Incorrect — answer is from a completely different story (Wade and the piglet)."),
        "q6e": (0, "Incorrect — answer is from a completely different story (Wade and the piglet).")
    },
    # 7. epryo13 L1 Handout 4
    "inferencing-level-1-handout-4_epryo13_2026-07-17.json": {
        "q1": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q2": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q3": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q4a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q5a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6b": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6c": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6d": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6e": (0, "Incorrect — response belongs to a completely different lesson/handout.")
    },
    # 8. epryo13 L1 Handout 5
    "inferencing-level-1-handout-5_epryo13_2026-07-17.json": {
        "q1": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q2": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q3": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q4a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q5a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6b": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6c": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6d": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6e": (0, "Incorrect — response belongs to a completely different lesson/handout.")
    },
    # 9. epryo13 L1 Handout 6
    "inferencing-level-1-handout-6_epryo13_2026-07-17.json": {
        "q1": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q2": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q3": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q4a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q4b": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q5a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q5b": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6b": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6c": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6d": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6e": (0, "Incorrect — response belongs to a completely different lesson/handout.")
    },
    # 10. epryo13 L1 Handout 7
    "inferencing-level-1-handout-7_epryo13_2026-07-17.json": {
        "q1": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q2": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q3": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q4a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q4b": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q5a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q5b": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6b": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6c": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6d": (0, "Incorrect — response belongs to a completely different lesson/handout.")
    },
    # 11. epryo13 L1 Handout 8
    "inferencing-level-1-handout-08_epryo13_2026-07-21.json": {
        "q1": (1, "Correctly infers the girl was playing in the rain."),
        "q2": (1, "Correctly identifies snow."),
        "q3": (1, "Correctly infers a birthday card or letter."),
        "q4a": (1, "Correctly infers Jason fell."),
        "q4b": (1, "Correctly explains Jason was not badly hurt."),
        "q5a": (0, "Incorrect — 'he was' is incomplete and does not answer why he didn't notice."),
        "q5b": (1, "Correctly identifies the wall switch was off.")
    },
    # 12. fwend2 L1 Handout 4
    "inferencing-level-1-handout-04_fwend2_2026-07-20.json": {
        "q1": (1, "Correctly identifies the garden."),
        "q2": (1, "Correctly identifies the park."),
        "q3": (1, "Correctly identifies the clothesline."),
        "q4a": (1, "Correctly identifies the costume."),
        "q5a": (0, "Incorrect — the tree was a Christmas tree, not a dollhouse."),
        "q6a": (1, "Correctly explains pulling the hat down due to wind/rain."),
        "q6b": (1, "Correctly explains she needed to finish her paper run before the rain."),
        "q6c": (1, "Correctly identifies Riverside Street."),
        "q6d": (1, "Correctly infers Riverside Street has a hill/bridge."),
        "q6e": (1, "Correctly explains the wind blew it.")
    },
    # 13. fwend2 L1 Handout 5
    "inferencing-level-1-handout-05_fwend2_2026-07-20.json": {
        "q1": (1, "Correctly identifies the train station."),
        "q2": (1, "Correctly identifies the airport."),
        "q3": (1, "Correctly identifies the zoo."),
        "q4a": (0, "Incorrect — she did not know it was wool at first."),
        "q5a": (0, "Incorrect — shifted response / nonsense."),
        "q6a": (1, "Correctly identifies late afternoon / sunset."),
        "q6b": (1, "Correctly infers she expected them to be home because the house was unusually quiet."),
        "q6c": (0, "Incorrect — the passage states Kim had done this since he was very little, indicating he lived there a long time."),
        "q6d": (1, "Correctly identifies the drawer."),
        "q6e": (0, "Incorrect — shifted answer.")
    },
    # 14. fwend2 L1 Handout 6
    "inferencing-level-1-handout-06_fwend2_2026-07-20.json": {
        "q1": (1, "Correctly identifies the pedestrian crossing."),
        "q2": (1, "Correctly identifies feeding the baby."),
        "q3": (0, "Incorrect — the page turning indicates reading a book."),
        "q4a": (0, "Incorrect — vacuuming indicates she is a cleaner/housekeeper."),
        "q4b": (1, "Correctly explains she works early in the morning before breakfast."),
        "q5a": (1, "Correctly identifies sunset."),
        "q5b": (0, "Incorrect — taking off boots and rubbing sore feet indicates they walked."),
        "q6a": (1, "Correctly explains protection from sun and wind."),
        "q6b": (0, "Incorrect — they eat their egg shells first."),
        "q6c": (0, "Incorrect — their skin does not stretch, so they would outgrow/burst it."),
        "q6d": (0, "Incorrect — the initial color is light green."),
        "q6e": (1, "Correctly identifies the butterfly gains strength before flying.")
    },
    # 15. hherz0 L1 Handout 1
    "inferencing-level-1-handout-01_hherz0_2026-07-21 (1).json": {
        "q1": (1, "Correctly identifies summer."),
        "q2": (1, "Correctly identifies nighttime."),
        "q3": (1, "Correctly identifies morning."),
        "q4a": (1, "Correctly identifies the baby crying."),
        "q4b": (1, "Correctly explains the baby dropped its bottle."),
        "q5a": (1, "Correctly identifies the bus stop."),
        "q5b": (1, "Correctly identifies he returned for his homework."),
        "q6a": (1, "Correctly identifies rough games."),
        "q6b": (1, "Correctly explains Mrs Low spilled them."),
        "q6c": (1, "Correctly explains Hannah was coughing and turning red."),
        "q6d": (0, "Incorrect — explanation lacks evidence from the text.")
    },
    # 16. hherz0 L1 Handout 2
    "inferencing-level-1-handout-02_hherz0_2026-07-21.json": {
        "q1": (1, "Correctly explains that he hardly ever brushes his teeth."),
        "q2": (1, "Correctly explains Mandy stayed until the water was cold."),
        "q3": (1, "Correctly explains Ralph was usually a quiet dog."),
        "q4a": (1, "Correctly identifies he broke a window."),
        "q4b": (1, "Correctly explains the father said he has to pay this time."),
        "q5a": (1, "Correctly identifies a doll house."),
        "q6a": (1, "Correctly explains the bus wouldn't let him on."),
        "q6b": (1, "Correctly identifies the grandad."),
        "q6c": (1, "Correctly explains he took care of it successfully."),
        "q6d": (1, "Correctly explains he went to the back so the driver wouldn't see the piglet."),
        "q6e": (1, "Correctly explains he did not want to hurt or drop the piglet.")
    },
    # 17. jbinn27 L1 Handout 4
    "inferencing-level-1-handout-04_jbinn27_2026-07-17.json": {
        "q1": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q2": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q3": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q4a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q5a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6a": (1, "Correctly explains pulling the hat down due to shock/awareness of dark clouds."),
        "q6b": (1, "Correctly explains she pedalled to keep the papers from getting wet."),
        "q6c": (1, "Correctly identifies Riverside Street."),
        "q6d": (0, "Incorrect — Riverside Street is steep/long, not windy."),
        "q6e": (1, "Correctly explains the wind blew it off.")
    },
    # 18. jfull212 L1 Handout 5
    "inferencing-level-1-handout-5_jfull212_2026-07-17.json": {
        "q1": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q2": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q3": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q4a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q5a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6a": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6b": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6c": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6d": (0, "Incorrect — response belongs to a completely different lesson/handout."),
        "q6e": (0, "Incorrect — response belongs to a completely different lesson/handout.")
    },
    # 19. jfull212 L1 Handout 6
    "inferencing-level-1-handout-06_jfull212_2026-07-17.json": {
        "q1": (0, "Incorrect — Debbie was at a street crossing, not home."),
        "q2": (1, "Correctly identifies feeding the baby."),
        "q3": (0, "Incorrect — Tom was reading, not sleeping."),
        "q4a": (1, "Correctly identifies Jill is cleaning a house."),
        "q4b": (1, "Correctly explains she works in the morning."),
        "q5a": (1, "Correctly identifies late afternoon / sunset."),
        "q5b": (0, "Incorrect — they walked, not in a car."),
        "q6a": (0, "Incorrect — eggs are protected under the leaves from sun/wind."),
        "q6b": (0, "Incorrect — they eat their egg shells first."),
        "q6c": (1, "Correctly explains the skin would not fit their body."),
        "q6d": (1, "Correctly identifies the color starts as light green."),
        "q6e": (0, "Incorrect — the butterfly flies away after gaining strength.")
    },
    # 20. jfull212 L1 Handout 7
    "inferencing-level-1-handout-07_jfull212_2026-07-21.json": {
        "q1": (0, "Incorrect — it was a windy/breezy day, not morning."),
        "q2": (1, "Correctly identifies cooking bacon."),
        "q3": (1, "Correctly identifies cutting down a tree."),
        "q4a": (0, "Incorrect — cover flew off because the bus bounced/bumpy bridge."),
        "q4b": (0, "Incorrect — it fell into the river/water below, not the bridge itself."),
        "q5a": (0, "Incorrect — Roy was fishing, not waiting for the pool."),
        "q5b": (0, "Incorrect — he got excited because a fish bit / line jerked."),
        "q6a": (1, "Correctly identifies spiders."),
        "q6b": (0, "Incorrect — stings are mainly for defence but claws are for prey."),
        "q6c": (1, "Correctly explains they can die but not often."),
        "q6d": (1, "Correctly identifies young scorpions spend time on their mother's back."),
        "q6e": (1, "Correctly explains daytime temperature is too high.")
    },
    # 21. lheck4 L1 Handout 3
    "inferencing-level-1-handout-3_lheck4_2026-07-20.json": {
        "q1": (0, "Incorrect — shifted response / nonsense."),
        "q2": (0, "Incorrect — shifted response / nonsense."),
        "q3": (0, "Incorrect — shifted response / nonsense."),
        "q4a": (0, "Incorrect — shifted response / nonsense."),
        "q5": (0, "Incorrect — shifted response / nonsense."),
        "q6a": (0, "Incorrect — shifted response / nonsense."),
        "q6b": (0, "Incorrect — shifted response / nonsense."),
        "q6c": (0, "Not attempted."),
        "q6d": (0, "Not attempted."),
        "q6e": (0, "Not attempted.")
    },
    # 22. shart259 L2 Handout 1
    "inferencing-level-2-handout-01_shart259_2026-07-21.json": {
        "q1": (1, "Correctly identifies November."),
        "q2": (1, "Correctly identifies the end of the day."),
        "q3": (1, "Correctly identifies night time."),
        "q4a": (1, "Correctly identifies a wolf."),
        "q4b": (1, "Correctly explains they would fight."),
        "q5a": (1, "Correctly identifies the fish."),
        "q6a": (1, "Correctly identifies a witch."),
        "q6b": (1, "Correctly explains there were too many coins."),
        "q6c": (0, "Incorrect — the writer dreaded seeing her."),
        "q6d": (1, "Correctly explains she smiled.")
    },
    # 23. smorg220 L1 Handout 2
    "inferencing-level-1-handout-2_smorg220_2026-07-17 (1).json": {
        "q1": (0, "Incorrect — shifted response."),
        "q2": (0, "Incorrect — shifted response."),
        "q3": (0, "Incorrect — shifted response."),
        "q4a": (0, "Incorrect — shifted response."),
        "q4b": (0, "Incorrect — shifted response."),
        "q5a": (0, "Incorrect — shifted response."),
        "q5b": (0, "Incorrect — shifted response."),
        "q6a": (0, "Incorrect — shifted response."),
        "q6b": (0, "Incorrect — shifted response."),
        "q6c": (0, "Incorrect — shifted response."),
        "q6d": (0, "Incorrect — shifted response."),
        "q6e": (0, "Incorrect — shifted response.")
    },
    # 24. smorg220 L1 Handout 5
    "inferencing-level-1-handout-5_smorg220_2026-07-17.json": {
        "q1": (0, "Incorrect — shifted response."),
        "q2": (0, "Incorrect — shifted response.")
    },
    # 25. smorg220 L1 Handout 6
    "inferencing-level-1-handout-6_smorg220_2026-07-20.json": {
        "q1": (0, "Incorrect — shifted response."),
        "q2": (0, "Incorrect — shifted response."),
        "q3": (0, "Incorrect — shifted response."),
        "q4a": (0, "Incorrect — shifted response."),
        "q4b": (0, "Incorrect — shifted response."),
        "q5a": (0, "Incorrect — shifted response."),
        "q5b": (0, "Incorrect — shifted response."),
        "q6a": (1, "Correctly explains protection from wind and sun."),
        "q6b": (0, "Incorrect — shifted response."),
        "q6c": (0, "Incorrect — shifted response."),
        "q6d": (0, "Incorrect — shifted response."),
        "q6e": (0, "Incorrect — shifted response.")
    },
    # 26. smorg220 L1 Handout 7
    "inferencing-level-1-handout-07_smorg220_2026-07-20.json": {
        "q1": (0, "Incorrect — it was a windy/breezy day, not middle of the day."),
        "q2": (1, "Correctly identifies cooking bacon."),
        "q3": (1, "Correctly identifies cutting trees."),
        "q4a": (1, "Correctly identifies the bridge was bumpy."),
        "q4b": (0, "Incorrect — it fell into the water below, not the railing."),
        "q5a": (1, "Correctly identifies waiting/fishing."),
        "q5b": (1, "Correctly explains the line jerked."),
        "q6a": (1, "Correctly identifies spiders."),
        "q6b": (1, "Correctly explains they have limbs to catch prey."),
        "q6c": (1, "Correctly explains they does not often kill humans."),
        "q6d": (1, "Correctly identifies their mother's back."),
        "q6e": (0, "Incorrect — daytime temperature is too high.")
    }
}

GRADED_AT = "2026-07-19T10:00:00.000Z"

def get_skill_folder_name(activity_id):
    match = re.match(r"^([a-zA-Z]+)-level-(\d+)", activity_id)
    if match:
        skill, level = match.groups()
        return f"{skill.capitalize()} level {level}"
    return "Unknown"

def main():
    base_dir = Path(__file__).parent
    results_dir = base_dir / "Results"
    scored_dir = base_dir / "scored-results"
    guides_dir = base_dir / "marking-guides"
    
    # We will load the resolution_report.json to see the to_grade list
    with open(base_dir / "resolution_report.json", "r", encoding="utf-8") as f:
        resolution_data = json.load(f)
    
    to_grade = resolution_data["to_grade"]
    print(f"Loaded {len(to_grade)} files to grade from resolution_report.json")
    
    scored_count = 0
    warnings = 0
    
    for item in to_grade:
        full_path = base_dir / item["full_path"]
        folder = item["folder"]
        
        # Load the raw student JSON file
        with open(full_path, "r", encoding="utf-8") as f:
            student_data = json.load(f)
            
        activity_id = student_data["activity"]["activityId"]
        norm_activity_id = item["norm_activity_id"]
        basename = full_path.name
        
        # Determine the scored output path
        output_path = scored_dir / folder / f"{basename}.scored.json"
        
        # Load the marking guide to sum the total marks dynamically
        marking_guide_path = guides_dir / f"{norm_activity_id}.json"
        if not marking_guide_path.exists():
            print(f"  WARN: Missing marking guide for {norm_activity_id}")
            warnings += 1
            continue
            
        with open(marking_guide_path, "r", encoding="utf-8") as f:
            marking_guide = json.load(f)
            
        total_marks = sum(q["maxMarks"] for q in marking_guide["questions"])
        
        # Check if we have grading data for this specific basename
        if basename not in GRADING_DATA:
            print(f"  WARN: No grading data found in script for {basename}")
            warnings += 1
            continue
            
        file_grades = GRADING_DATA[basename]
        
        # Score each response
        question_scores = []
        earned = 0
        
        for section in student_data["sections"]:
            for resp in section["responses"]:
                qid = resp["questionId"]
                # Default maxMarks is 1
                max_marks = 1
                
                # Check answered status
                if not resp.get("answered", False) or not resp.get("response", "").strip():
                    question_scores.append({
                        "questionId": qid,
                        "score": 0,
                        "maxMarks": max_marks,
                        "rationale": "Not attempted."
                    })
                elif qid in file_grades:
                    score, rationale = file_grades[qid]
                    earned += score
                    question_scores.append({
                        "questionId": qid,
                        "score": score,
                        "maxMarks": max_marks,
                        "rationale": rationale
                    })
                else:
                    # Not found in grading database but was answered
                    question_scores.append({
                        "questionId": qid,
                        "score": 0,
                        "maxMarks": max_marks,
                        "rationale": "No marking data available for this question."
                    })
                    
        percentage = round((earned / total_marks) * 100) if total_marks > 0 else 0
        
        student_data["marking"] = {
            "gradedAt": GRADED_AT,
            "gradedBy": "comprehension-marker-skill v1.0",
            "totalMarks": total_marks,
            "earnedMarks": earned,
            "percentage": percentage,
            "questionScores": question_scores
        }
        
        # Write output file
        os.makedirs(output_path.parent, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(student_data, f, indent=2, ensure_ascii=False)
            
        print(f"  SCORED: {item['student']} ({norm_activity_id}) -> {earned}/{total_marks} ({percentage}%)")
        scored_count += 1
        
    print(f"\nGrading complete. Graded: {scored_count}, Warnings/Errors: {warnings}")

if __name__ == "__main__":
    main()
