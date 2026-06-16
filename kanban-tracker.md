# Classroom Kanban Dashboard

## Goal
Build a premium, Brutalist-themed dashboard application to aggregate, scan, and monitor student Kanban states locally via the File System Access API.

## Tasks
- [x] Task 1: Create the directory `ClassroomKanbanDashboard` and set up the foundation file structure → Verify: Folder exists and is loaded with `index.html`, `style.css`, and `app.js`.
- [x] Task 2: Implement styling system in `style.css` using the Space Grotesk + IBM Plex Mono fonts and Brutalist palette → Verify: Styles load successfully with high contrast black, grey, signal orange, and acid green.
- [x] Task 3: Build the File System Access API folder-scanning logic in `app.js` → Verify: Selecting a directory scans all subdirectories for `kanban_state.json` files and parses tasks.
- [x] Task 4: Create the Dashboard Overview state containing metric cards, custom SVG progress rings, and stacked progress bars → Verify: Class-wide analytics are correctly aggregated and drawn.
- [x] Task 5: Build the Toggleable Mini-Board Grid view → Verify: Board grid renders a miniature 5-column layout for each loaded student showing condensed cards.
- [x] Task 6: Implement the Detailed Inspector panel showing a student's full board and activity logs → Verify: Clicking on a student card or stacked progress bar highlights that student and shows their detailed cards and log logs.
- [x] Task 7: Build the refresh/sync logic to update data without re-prompting for directories → Verify: Clicking the sync button reads changes on disk and renders them.
- [x] Task 8: Generate a test suite / mockup data folder structure for verification → Verify: A sample network folder structure with 3 sample students and JSON states exists under `Data/SampleStudents`.

## Done When
- [x] Folder scanner loads student JSON files successfully.
- [x] Both Dashboard/Analytics and Mini-Board views are toggleable.
- [x] Individual student inspector renders tasks and logs in full detail.
- [x] Local sync allows picking up updates from disk on demand.

## Notes
- Dual-width grids and Flex layouts will be configured to prevent layout shifts.
- Accessible fallbacks (like select dropdowns) will be included for keyboard navigation.
