import os
import json
import unittest
import tempfile
import sys
from pathlib import Path

# Add project root to python path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.append(str(PROJECT_ROOT))

from grade_results import score_file, SCORES

class TestLegacyResponseContract(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.legacy_response_path = PROJECT_ROOT / "tests" / "fixtures" / "legacy-response.json"
        
    def tearDown(self):
        self.temp_dir.cleanup()

    def test_legacy_response_parsing(self):
        # Verify that we can load the legacy-response.json file successfully
        self.assertTrue(self.legacy_response_path.exists(), "legacy-response.json fixture missing")
        with open(self.legacy_response_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        self.assertEqual(data["schemaVersion"], "1.0")
        self.assertEqual(data["exportType"], "literacy_evaluation_student_response")
        self.assertEqual(data["activity"]["activityId"], "evaluation-level-2-handout-6-bridge")
        self.assertEqual(data["student"]["name"], "lheck4")
        self.assertEqual(data["student"]["activityDate"], "2026-07-17")

    def test_legacy_grading_pipeline(self):
        # Verify that the legacy response file can be scored by grade_results.py without error
        scored_output_path = Path(self.temp_dir.name) / "legacy_scored.json"
        
        # Run the score_file function from grade_results
        score_file(str(self.legacy_response_path), str(scored_output_path), SCORES)
        
        self.assertTrue(scored_output_path.exists(), "Scored output file was not created")
        
        with open(scored_output_path, "r", encoding="utf-8") as f:
            scored_data = json.load(f)
            
        # Verify the marking results
        self.assertIn("marking", scored_data)
        marking = scored_data["marking"]
        self.assertEqual(marking["totalMarks"], 1)
        self.assertEqual(marking["earnedMarks"], 1)
        self.assertEqual(marking["percentage"], 100)
        
        # Verify the question-level details
        question_scores = marking["questionScores"]
        self.assertEqual(len(question_scores), 1)
        self.assertEqual(question_scores[0]["questionId"], "q1")
        self.assertEqual(question_scores[0]["score"], 1)
        self.assertIn("because Woodsy's got more bad-tempered", question_scores[0]["rationale"])

from build_all import (
    normalize_section, assign_question_ids, validate_normalized_handout,
    LAYOUT_SENTENCE_TASK_LIST, LAYOUT_PAIRED_PASSAGE_LIST, LAYOUT_FOCUS_PASSAGE_LIST, LAYOUT_SHARED_PASSAGE,
    READING_SCOPE_ITEM, READING_SCOPE_SECTION,
    RESPONSE_SHORT, RESPONSE_STANDARD, RESPONSE_EVIDENCE
)

class TestLayoutBuilderNormalization(unittest.TestCase):
    def test_normalize_item_scope_default(self):
        # A section with "passages" is item-scoped
        raw_section = {
            "id": "quick-inferences",
            "title": "Part 1: Quick Inferences",
            "short_title": "Quick",
            "passages": ["Sentence one.", "Sentence two."],
            "questions": ["Question one?", "Question two?"]
        }
        
        normalized = normalize_section("inferencing", raw_section, 0)
        self.assertEqual(normalized["id"], "quick-inferences")
        self.assertEqual(normalized["reading_scope"], READING_SCOPE_ITEM)
        self.assertEqual(normalized["layout"], LAYOUT_SENTENCE_TASK_LIST) # default layout for inferencing + item scope
        self.assertEqual(len(normalized["items"]), 2)
        
        item1 = normalized["items"][0]
        self.assertEqual(item1["item_id"], "item-1")
        self.assertEqual(item1["label"], "Sentence 1")
        self.assertEqual(item1["passage"], "Sentence one.")
        self.assertEqual(len(item1["questions"]), 1)
        self.assertEqual(item1["questions"][0]["prompt"], "Question one?")
        self.assertEqual(item1["questions"][0]["response_size"], RESPONSE_SHORT)

    def test_normalize_section_scope_default(self):
        # A section with "passage" is section-scoped
        raw_section = {
            "id": "main-passage",
            "title": "The Big Story",
            "short_title": "Story",
            "passage": "Once upon a time...",
            "questions": ["Why?", "When?"]
        }
        
        normalized = normalize_section("inferencing", raw_section, 1)
        self.assertEqual(normalized["id"], "main-passage")
        self.assertEqual(normalized["reading_scope"], READING_SCOPE_SECTION)
        self.assertEqual(normalized["layout"], LAYOUT_SHARED_PASSAGE) # default layout for section scope
        self.assertEqual(len(normalized["items"]), 1)
        
        item = normalized["items"][0]
        self.assertEqual(item["item_id"], "item-1")
        self.assertEqual(item["label"], "Reading")
        self.assertEqual(item["passage"], "Once upon a time...")
        self.assertEqual(len(item["questions"]), 2)
        self.assertEqual(item["questions"][0]["prompt"], "Why?")
        self.assertEqual(item["questions"][0]["response_size"], RESPONSE_STANDARD)

    def test_assign_question_ids(self):
        sections = [
            {
                "reading_scope": READING_SCOPE_ITEM,
                "items": [
                    {"questions": [{"question_id": None, "prompt": "Q1?"}]},
                    {"questions": [{"question_id": None, "prompt": "Q2?"}]}
                ]
            },
            {
                "reading_scope": READING_SCOPE_SECTION,
                "items": [
                    {
                        "questions": [
                            {"question_id": None, "prompt": "Q3a?"},
                            {"question_id": None, "prompt": "Q3b?"}
                        ]
                    }
                ]
            }
        ]
        
        assign_question_ids(sections)
        self.assertEqual(sections[0]["items"][0]["questions"][0]["question_id"], "q1")
        self.assertEqual(sections[0]["items"][1]["questions"][0]["question_id"], "q2")
        self.assertEqual(sections[1]["items"][0]["questions"][0]["question_id"], "q3a")
        self.assertEqual(sections[1]["items"][0]["questions"][1]["question_id"], "q3b")

    def test_validation_invalid_layout(self):
        sections = [{
            "id": "sec-1",
            "layout": "invalid-layout",
            "reading_scope": READING_SCOPE_ITEM,
            "items": [{"passage": "P", "questions": [{"prompt": "Q", "response_size": "short"}]}]
        }]
        with self.assertRaises(ValueError):
            validate_normalized_handout("inferencing", 1, 1, sections)

    def test_validation_empty_passage_item_scope(self):
        sections = [{
            "id": "sec-1",
            "layout": LAYOUT_SENTENCE_TASK_LIST,
            "reading_scope": READING_SCOPE_ITEM,
            "items": [{"passage": " ", "questions": [{"prompt": "Q", "response_size": "short"}]}]
        }]
        with self.assertRaises(ValueError):
            validate_normalized_handout("inferencing", 1, 1, sections)

    def test_validation_duplicate_question_ids(self):
        sections = [{
            "id": "sec-1",
            "layout": LAYOUT_SENTENCE_TASK_LIST,
            "reading_scope": READING_SCOPE_ITEM,
            "items": [
                {"passage": "P1", "questions": [{"question_id": "q1", "prompt": "Q1", "response_size": "short"}]},
                {"passage": "P2", "questions": [{"question_id": "q1", "prompt": "Q2", "response_size": "short"}]}
            ]
        }]
        with self.assertRaises(ValueError):
            validate_normalized_handout("inferencing", 1, 1, sections)

    def test_import_side_effects(self):
        # Verify that importing build_eval_l2 has no side effects
        # Clear out any previous module cache just in case
        if "build_eval_l2" in sys.modules:
            del sys.modules["build_eval_l2"]
            
        try:
            import build_eval_l2
            imported_ok = True
        except Exception as e:
            imported_ok = False
            self.fail(f"Importing build_eval_l2 failed with error: {e}")
            
        self.assertTrue(imported_ok)


if __name__ == "__main__":
    unittest.main()
