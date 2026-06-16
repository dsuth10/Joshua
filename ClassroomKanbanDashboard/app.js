/**
 * Classroom Software Studio - Kanban Dashboard Controller
 * Vanilla JS logic for scanning network directories and aggregating student Kanban states.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    let classDirHandle = null;
    let studentsMap = new Map(); // studentName -> { tasks, logs, lastUpdated, fileHandle }
    let selectedStudentName = '';
    let activeView = 'dashboard'; // 'dashboard' | 'boards'

    // DOM Elements - Navigation & Actions
    const btnLoadFolder = document.getElementById('btnLoadFolder');
    const btnSyncFolder = document.getElementById('btnSyncFolder');
    const btnLandingLoad = document.getElementById('btnLandingLoad');
    const btnViewDashboard = document.getElementById('btnViewDashboard');
    const btnViewBoards = document.getElementById('btnViewBoards');
    const studentSelect = document.getElementById('studentSelect');
    const filterRole = document.getElementById('filterRole');
    const filterPriority = document.getElementById('filterPriority');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const folderInputFallback = document.getElementById('folderInputFallback');

    const supportsDirectoryPicker = typeof window.showDirectoryPicker === 'function' && window.location.protocol !== 'file:';

    // DOM Elements - View States
    const landingState = document.getElementById('landingState');
    const workspaceState = document.getElementById('workspaceState');
    const dashboardView = document.getElementById('dashboardView');
    const boardsView = document.getElementById('boardsView');
    const inspectorPanel = document.getElementById('inspectorPanel');
    const btnHideInspector = document.getElementById('btnHideInspector');

    // DOM Elements - Class Metrics
    const metricTotalStudents = document.getElementById('metricTotalStudents');
    const metricCompletionRate = document.getElementById('metricCompletionRate');
    const metricTotalTasks = document.getElementById('metricTotalTasks');
    const metricStuckTeams = document.getElementById('metricStuckTeams');
    const comparisonGrid = document.getElementById('comparisonGrid');
    const miniBoardsContainer = document.getElementById('miniBoardsContainer');

    // DOM Elements - Student Inspector Panel
    const inspectorStudentName = document.getElementById('inspectorStudentName');
    const studentDoneTasks = document.getElementById('studentDoneTasks');
    const studentProgressBar = document.getElementById('studentProgressBar');
    const studentProgressPct = document.getElementById('studentProgressPct');
    const studentLastUpdated = document.getElementById('studentLastUpdated');
    const insLogsBox = document.getElementById('insLogsBox');

    // Inspector Columns
    const insColumns = {
        backlog: document.getElementById('ins-cards-backlog'),
        ready: document.getElementById('ins-cards-ready'),
        doing: document.getElementById('ins-cards-doing'),
        testing: document.getElementById('ins-cards-testing'),
        done: document.getElementById('ins-cards-done')
    };

    // Initialize Event Listeners
    const initEvents = () => {
        btnLoadFolder.addEventListener('click', selectClassFolder);
        btnLandingLoad.addEventListener('click', selectClassFolder);
        btnSyncFolder.addEventListener('click', syncClassFolder);
        folderInputFallback.addEventListener('change', handleFallbackFolderSelect);

        // View Toggles
        btnViewDashboard.addEventListener('click', () => switchView('dashboard'));
        btnViewBoards.addEventListener('click', () => switchView('boards'));

        // Sidebar Selectors & Filters
        studentSelect.addEventListener('change', (e) => {
            selectStudent(e.target.value);
        });

        filterRole.addEventListener('change', () => {
            if (selectedStudentName) renderStudentInspector(selectedStudentName);
        });

        filterPriority.addEventListener('change', () => {
            if (selectedStudentName) renderStudentInspector(selectedStudentName);
        });

        // Hide Inspector panel
        btnHideInspector.addEventListener('click', () => {
            inspectorPanel.classList.add('hidden');
            selectedStudentName = '';
            studentSelect.value = '';
        });
    };

    // Switch View Panel
    const switchView = (viewName) => {
        activeView = viewName;
        if (viewName === 'dashboard') {
            btnViewDashboard.classList.add('active');
            btnViewBoards.classList.remove('active');
            dashboardView.classList.remove('hidden');
            boardsView.classList.add('hidden');
        } else {
            btnViewDashboard.classList.remove('active');
            btnViewBoards.classList.add('active');
            dashboardView.classList.add('hidden');
            boardsView.classList.remove('hidden');
        }
    };

    // Open directory picker and load student folders
    async function selectClassFolder() {
        if (supportsDirectoryPicker) {
            try {
                const handle = await window.showDirectoryPicker();
                classDirHandle = handle;
                
                // Update UI State
                statusDot.className = 'status-dot active';
                statusText.textContent = `DIRECTORY: ${handle.name}`;
                btnSyncFolder.removeAttribute('disabled');
                landingState.classList.add('hidden');
                workspaceState.classList.remove('hidden');

                await syncClassFolder();
            } catch (err) {
                console.error('Directory selection failed:', err);
                alert('Failed to access folder. Please try again.');
            }
        } else {
            folderInputFallback.click();
        }
    }

    // Handle fallback folder selection
    async function handleFallbackFolderSelect(e) {
        const files = e.target.files;
        if (files.length === 0) return;

        let rootName = "Selected Folder";
        const firstPath = files[0].webkitRelativePath;
        if (firstPath) {
            rootName = firstPath.split('/')[0];
        }

        // Update UI State
        statusDot.className = 'status-dot active';
        statusText.textContent = `DIRECTORY: ${rootName}`;
        btnSyncFolder.removeAttribute('disabled');
        landingState.classList.add('hidden');
        workspaceState.classList.remove('hidden');

        await parseFilesFallback(files);
    }

    // Parse files loaded via webkitdirectory fallback
    async function parseFilesFallback(files) {
        statusText.textContent = 'SCANNING...';
        const newMap = new Map();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const parts = file.webkitRelativePath.split('/');

            if (parts.length >= 3 && parts[parts.length - 1] === 'kanban_state.json') {
                const studentName = parts[parts.length - 2];
                try {
                    const text = await file.text();
                    if (text.trim()) {
                        const parsed = JSON.parse(text);
                        newMap.set(studentName, {
                            tasks: parsed.tasks || [],
                            logs: parsed.logs || [],
                            lastUpdated: parsed.lastUpdated || file.lastModified,
                            fileRef: file
                        });
                    }
                } catch (e) {
                    console.warn(`Failed to parse file for student: ${studentName}`, e);
                }
            }
        }

        studentsMap = newMap;
        const rootName = (files[0] && files[0].webkitRelativePath.split('/')[0]) || 'Selected Folder';
        statusText.textContent = `DIRECTORY: ${rootName} (${studentsMap.size} loaded)`;

        updateStudentDropdown();
        renderDashboard();
        renderMiniBoards();

        if (selectedStudentName) {
            if (studentsMap.has(selectedStudentName)) {
                renderStudentInspector(selectedStudentName);
            } else {
                inspectorPanel.classList.add('hidden');
                selectedStudentName = '';
                studentSelect.value = '';
            }
        }
    }

    // Scan the selected folder on demand
    async function syncClassFolder() {
        if (supportsDirectoryPicker) {
            if (!classDirHandle) return;
            statusText.textContent = 'SCANNING...';
            
            try {
                const newMap = new Map();

                // Iterate subdirectories
                for await (const entry of classDirHandle.values()) {
                    if (entry.kind === 'directory') {
                        const studentName = entry.name;
                        
                        try {
                            const fileHandle = await entry.getFileHandle('kanban_state.json');
                            const file = await fileHandle.getFile();
                            const text = await file.text();
                            
                            if (text.trim()) {
                                const parsed = JSON.parse(text);
                                newMap.set(studentName, {
                                    tasks: parsed.tasks || [],
                                    logs: parsed.logs || [],
                                    lastUpdated: parsed.lastUpdated || file.lastModified,
                                    fileHandle: fileHandle
                                });
                            }
                        } catch (e) {
                            console.warn(`No valid kanban_state.json in folder: ${studentName}`, e);
                        }
                    }
                }

                studentsMap = newMap;
                statusText.textContent = `DIRECTORY: ${classDirHandle.name} (${studentsMap.size} loaded)`;
                
                updateStudentDropdown();
                renderDashboard();
                renderMiniBoards();

                if (selectedStudentName) {
                    if (studentsMap.has(selectedStudentName)) {
                        renderStudentInspector(selectedStudentName);
                    } else {
                        inspectorPanel.classList.add('hidden');
                        selectedStudentName = '';
                        studentSelect.value = '';
                    }
                }

            } catch (err) {
                console.error('Scan refresh failed:', err);
                statusText.textContent = 'SCAN_ERROR';
                alert('Error scanning student subfolders. Ensure files are readable.');
            }
        } else {
            alert("To pull fresh updates when running local HTML, please select the class folder again.");
            folderInputFallback.click();
        }
    }

    // Populate Sidebar Dropdown list
    const updateStudentDropdown = () => {
        const currentSelection = studentSelect.value;
        studentSelect.innerHTML = '<option value="">-- SELECT STUDENT --</option>';
        
        // Sort students alphabetically
        const sortedStudents = Array.from(studentsMap.keys()).sort();
        
        sortedStudents.forEach(student => {
            const opt = document.createElement('option');
            opt.value = student;
            opt.textContent = student;
            studentSelect.appendChild(opt);
        });

        // Restore selection if it still exists
        if (studentsMap.has(currentSelection)) {
            studentSelect.value = currentSelection;
        }
    };

    // Select a student to inspect
    const selectStudent = (studentName) => {
        if (!studentName || !studentsMap.has(studentName)) {
            inspectorPanel.classList.add('hidden');
            selectedStudentName = '';
            studentSelect.value = '';
            return;
        }

        selectedStudentName = studentName;
        studentSelect.value = studentName;
        inspectorPanel.classList.remove('hidden');
        
        renderStudentInspector(studentName);

        // Auto-scroll screen down to inspector panel focus on mobile
        inspectorPanel.scrollIntoView({ behavior: 'smooth' });
    };

    // Render Dashboard Overview stats and SVGs
    const renderDashboard = () => {
        const totalStudents = studentsMap.size;
        metricTotalStudents.textContent = totalStudents;

        if (totalStudents === 0) {
            metricCompletionRate.textContent = '0%';
            metricTotalTasks.textContent = '0';
            metricStuckTeams.textContent = '0';
            comparisonGrid.innerHTML = '<div class="text-muted" style="padding: 20px;">No student records found. Check folder configurations.</div>';
            return;
        }

        let totalClassTasks = 0;
        let totalClassDone = 0;
        let stuckCount = 0;

        comparisonGrid.innerHTML = '';

        // Sort students alphabetically for class view
        const studentsList = Array.from(studentsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

        studentsList.forEach(([name, data]) => {
            const tasks = data.tasks;
            const counts = { backlog: 0, ready: 0, doing: 0, testing: 0, done: 0 };
            
            tasks.forEach(t => {
                if (counts[t.status] !== undefined) {
                    counts[t.status]++;
                } else {
                    counts.backlog++; // fallback
                }
            });

            const studentTotal = tasks.length;
            totalClassTasks += studentTotal;
            totalClassDone += counts.done;

            // Stuck check: If student has 0 tasks in 'doing' and some tasks remaining in backlog/ready/testing
            const hasDoing = counts.doing > 0;
            const tasksRemaining = (counts.backlog + counts.ready + counts.testing) > 0;
            if (!hasDoing && tasksRemaining) {
                stuckCount++;
            }

            // Calculate percentages for stacked progress bar
            const backlogPct = studentTotal ? (counts.backlog / studentTotal) * 100 : 0;
            const readyPct = studentTotal ? (counts.ready / studentTotal) * 100 : 0;
            const doingPct = studentTotal ? (counts.doing / studentTotal) * 100 : 0;
            const testingPct = studentTotal ? (counts.testing / studentTotal) * 100 : 0;
            const donePct = studentTotal ? (counts.done / studentTotal) * 100 : 0;

            const completionPct = studentTotal ? Math.round((counts.done / studentTotal) * 100) : 0;

            // Generate Horizontal comparison row
            const row = document.createElement('div');
            row.className = 'comparison-row';
            row.innerHTML = `
                <div class="student-name-link" data-student="${name}">${name}</div>
                <div class="stacked-progress-bar" title="Total Tasks: ${studentTotal}">
                    <div class="progress-segment seg-backlog" style="width: ${backlogPct}%" title="Backlog: ${counts.backlog}"></div>
                    <div class="progress-segment seg-ready" style="width: ${readyPct}%" title="Selected: ${counts.ready}"></div>
                    <div class="progress-segment seg-doing" style="width: ${doingPct}%" title="Doing: ${counts.doing}"></div>
                    <div class="progress-segment seg-testing" style="width: ${testingPct}%" title="Testing: ${counts.testing}"></div>
                    <div class="progress-segment seg-done" style="width: ${donePct}%" title="Done: ${counts.done}"></div>
                </div>
                <div class="stats-text">${counts.done}/${studentTotal} (${completionPct}%)</div>
            `;

            // Click listener for student link
            row.querySelector('.student-name-link').addEventListener('click', () => {
                selectStudent(name);
            });

            comparisonGrid.appendChild(row);
        });

        // Fill Metrics counters
        metricTotalTasks.textContent = totalClassTasks;
        metricStuckTeams.textContent = stuckCount;
        
        const overallRate = totalClassTasks ? Math.round((totalClassDone / totalClassTasks) * 100) : 0;
        metricCompletionRate.textContent = `${overallRate}%`;
    };

    // Render Miniature Boards Grid
    const renderMiniBoards = () => {
        miniBoardsContainer.innerHTML = '';

        if (studentsMap.size === 0) {
            miniBoardsContainer.innerHTML = '<div class="text-muted" style="grid-column: span 12; padding: 20px;">No student records found. Check folder configurations.</div>';
            return;
        }

        const sortedEntries = Array.from(studentsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

        sortedEntries.forEach(([name, data]) => {
            const tasks = data.tasks;
            const columns = { backlog: [], ready: [], doing: [], testing: [], done: [] };

            tasks.forEach(t => {
                if (columns[t.status] !== undefined) {
                    columns[t.status].push(t);
                } else {
                    columns.backlog.push(t);
                }
            });

            const total = tasks.length;
            const done = columns.done.length;
            const progress = total ? Math.round((done / total) * 100) : 0;

            const card = document.createElement('div');
            card.className = 'mini-board-card';
            card.innerHTML = `
                <h3>${name}</h3>
                <div class="mini-board-columns-grid">
                    <div class="mini-column-indicator">
                        <span class="mini-col-title">BACK</span>
                        <div class="mini-task-dot-list" id="dots-${name}-backlog"></div>
                    </div>
                    <div class="mini-column-indicator">
                        <span class="mini-col-title">READ</span>
                        <div class="mini-task-dot-list" id="dots-${name}-ready"></div>
                    </div>
                    <div class="mini-column-indicator">
                        <span class="mini-col-title">DOING</span>
                        <div class="mini-task-dot-list" id="dots-${name}-doing"></div>
                    </div>
                    <div class="mini-column-indicator">
                        <span class="mini-col-title">TEST</span>
                        <div class="mini-task-dot-list" id="dots-${name}-testing"></div>
                    </div>
                    <div class="mini-column-indicator">
                        <span class="mini-col-title">DONE</span>
                        <div class="mini-task-dot-list" id="dots-${name}-done"></div>
                    </div>
                </div>
                <div class="mini-board-footer">
                    <span class="mini-card-stats">Done: ${done}/${total}</span>
                    <button class="brutalist-btn btn-primary btn-inspect-student" style="padding: 4px 10px; font-size: 0.65rem;">INSPECT</button>
                </div>
            `;

            // Helper to render dots representing priorities
            const renderDots = (columnName, taskList) => {
                const listEl = card.querySelector(`#dots-${name}-${columnName}`);
                taskList.forEach(task => {
                    const dot = document.createElement('div');
                    dot.className = `mini-task-dot ${task.priority || 'backlog'}`;
                    dot.title = task.title;
                    listEl.appendChild(dot);
                });
            };

            renderDots('backlog', columns.backlog);
            renderDots('ready', columns.ready);
            renderDots('doing', columns.doing);
            renderDots('testing', columns.testing);
            renderDots('done', columns.done);

            // Clicking card anywhere or the inspect button opens details
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    selectStudent(name);
                }
            });

            card.querySelector('.btn-inspect-student').addEventListener('click', () => {
                selectStudent(name);
            });

            miniBoardsContainer.appendChild(card);
        });
    };

    // Render Detailed Student Board Inspector Panel
    const renderStudentInspector = (name) => {
        const student = studentsMap.get(name);
        if (!student) return;

        inspectorStudentName.textContent = name;

        const tasks = student.tasks;
        const total = tasks.length;
        const done = tasks.filter(t => t.status === 'done').length;
        
        studentDoneTasks.textContent = `${done} / ${total}`;
        
        const progressPct = total ? Math.round((done / total) * 100) : 0;
        studentProgressBar.style.width = `${progressPct}%`;
        studentProgressPct.textContent = `${progressPct}%`;

        // Format updated timestamp using metric standard
        const lastUp = new Date(student.lastUpdated);
        studentLastUpdated.textContent = lastUp.toLocaleTimeString();

        // Clear Inspector Column card lists
        Object.keys(insColumns).forEach(col => {
            insColumns[col].innerHTML = '';
        });

        // Column Counters
        const colCounts = { backlog: 0, ready: 0, doing: 0, testing: 0, done: 0 };

        // Read active filters from elements
        const roleFilter = filterRole.value;
        const priorityFilter = filterPriority.value;

        // Render card elements
        tasks.forEach(task => {
            const roleMatch = roleFilter === 'all' || task.role === roleFilter;
            const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;

            if (roleMatch && priorityMatch) {
                const colKey = task.status;
                if (insColumns[colKey]) {
                    colCounts[colKey]++;
                    const card = createInspectorTaskCard(task);
                    insColumns[colKey].appendChild(card);
                }
            }
        });

        // Update inspector column badges
        Object.keys(colCounts).forEach(col => {
            const countEl = document.getElementById(`ins-count-${col}`);
            if (countEl) countEl.textContent = colCounts[col];
        });

        // Render Student logs
        renderStudentLogs(student.logs);
    };

    // Create single card element for inspector board
    const createInspectorTaskCard = (task) => {
        const card = document.createElement('div');
        card.className = `ins-task-card ${task.priority || 'backlog'}`;

        const roleNameMap = {
            pm: "Product Manager",
            designer: "Game Designer",
            developer: "Developer",
            artist: "Artist / UI",
            tester: "Tester / QA",
            marketing: "Marketing"
        };

        const priorityLabelMap = {
            must: "Must Have",
            should: "Should Have",
            could: "Could Have",
            wont: "Won't Have"
        };

        const titleText = task.title ? escapeHTML(task.title) : 'Untitled Task';
        const descText = task.desc ? escapeHTML(task.desc) : 'No description provided.';
        const assigneeText = task.assignee ? escapeHTML(task.assignee) : 'Unassigned';
        const roleLabel = roleNameMap[task.role] || task.role || 'General';
        const priorityLabel = priorityLabelMap[task.priority] || task.priority || 'Backlog';

        card.innerHTML = `
            <div class="ins-card-meta">
                <span class="ins-role-tag ${task.role || 'pm'}">${roleLabel}</span>
                <span class="ins-priority-badge">${priorityLabel}</span>
            </div>
            <div class="ins-card-title">${titleText}</div>
            <div class="ins-card-desc">${descText}</div>
            <div class="ins-card-assignee">Owner: <span>${assigneeText}</span></div>
        `;

        return card;
    };

    // Render Student action logs list
    const renderStudentLogs = (logs) => {
        insLogsBox.innerHTML = '';
        if (!logs || logs.length === 0) {
            insLogsBox.innerHTML = '<div class="ins-log-entry">No recent activities logs recorded.</div>';
            return;
        }

        logs.forEach(log => {
            const div = document.createElement('div');
            div.className = 'ins-log-entry';
            const logAuthor = log.author ? escapeHTML(log.author) : 'STUDIO';
            const logText = log.text ? escapeHTML(log.text) : 'Action recorded';
            const logTime = log.time ? escapeHTML(log.time) : '';

            div.innerHTML = `<span class="ins-log-timestamp">[${logTime}]</span> <span class="ins-log-author">[${logAuthor}]</span> ${logText}`;
            insLogsBox.appendChild(div);
        });
    };

    const escapeHTML = (str) => {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    };

    // Initialization trigger
    initEvents();
});
