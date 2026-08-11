---
name: curriculum-master
description: Query and analyse the project’s Australian Curriculum v9 content-descriptor dataset. Use when Codex needs verified content descriptors for a year level or band, learning area, strand, or code, or needs to map a unit or lesson to those descriptors.
---

# Curriculum Master

This skill provides tools and references for working with the project's Australian Curriculum v9 **content-descriptor** dataset. It does not by itself establish achievement-standard, elaboration, capability, priority, policy, or current-web coverage; research those separately when the unit requires them.

## Core Data Sources

- [**ac_v9_complete.json**](../../../ac_v9_complete.json): The project's content-descriptor dataset.
- [**ac_v9_mapping_spec.md**](../../../docs/ac_v9_mapping_spec.md): Its extraction and mapping rules.

## Workflow: Querying the Curriculum

To find specific content descriptors without facing terminal truncation or complex JSON parsing issues, use the provided Python script.

### Using the Query Script

```bash
python .agent/skills/curriculum-master/scripts/query_curriculum.py [options]
```

**Common Options:**
- `--learning_area <id>`: e.g., `the_arts`, `science`, `english`, `hass`, `mathematics`.
- `--year_level <level>`: e.g., `5`, `6`, `Foundation`. **Note:** This handles band-matching automatically (e.g., querying `5` will return `5-6` descriptors).
- `--strand <id>`: e.g., `music`, `biology`, `language`.
- `--format text`: Prints a human-readable list instead of raw JSON.

**Example: List Year 5 Music Descriptors**
```bash
python .agent/skills/curriculum-master/scripts/query_curriculum.py --learning_area the_arts --year_level 5 --strand music --format text
```

Run the regression checks after changing the query script:

```bash
python .agent/skills/curriculum-master/scripts/test_query_curriculum.py
```

## References

- [**Schema Reference**](references/complete_v9_schema.md): Detailed breakdown of the JSON structure.

## Best Practices

1. **Always use the script**: Avoid reading the 10,000+ line JSON file directly if you only need a subset.
2. **Handle Bands**: Remember that AC v9 often groups years (e.g., 5-6). The query script handles this logic for you.
3. **Verify Codes**: Content descriptors are uniquely identified by their `code`; the query output is sorted and deduplicated by that code.
