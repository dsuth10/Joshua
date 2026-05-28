const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

const THEME = {
    navy: '112D4E',
    orange: 'F96D00',
    white: 'F9F7F7',
    blue: '3F72AF',
    grey: 'F2F2F2',
    lightOrange: 'FFF3E0',
    green: '2E7D32',
    lightGreen: 'EDF7ED',
    red: 'C62828'
};

const TEMPLATE_PATH = 'c:\\Users\\dsuth\\Documents\\Joshua\\.agent\\skills\\lesson-creator\\assets\\presentation_template.html';
const OUTPUT_DIR = path.join(__dirname, '..');

// Helper to create borders
const singleBorder = { style: BorderStyle.SINGLE, size: 6, color: THEME.navy };
const doubleBorder = { style: BorderStyle.DOUBLE, size: 12, color: THEME.navy };
const dashedBorder = { style: BorderStyle.DASHED, size: 6, color: THEME.orange };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'auto' };

const stdCellBorders = {
    top: singleBorder,
    bottom: singleBorder,
    left: singleBorder,
    right: singleBorder
};

// --- DYNAMIC SLIDES DATA ---
const SLIDES_DATA = [
    {
        title: "Time Travelers",
        subtitle: "Mastering 24-Hour Time & Timetables",
        theme: "dark",
        standardHtml: `
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 32px; color: var(--white); margin-bottom: 25px;">
                    Welcome, Time Commuters! Today we decode the secrets of 24-hour schedules.
                </p>
                <div style="display: inline-block; background: rgba(255,255,255,0.1); border: 2px dashed var(--orange); padding: 25px 40px; border-radius: 12px; max-width: 800px; text-align: left;">
                    <h3 style="color: var(--orange); font-size: 28px; margin-bottom: 12px; text-align: center;">MISSION BRIEFING</h3>
                    <p style="font-size: 22px; line-height: 1.6; color: var(--white);">
                        In the real world, planes, trains, and buses don't stop for a.m. or p.m. To navigate the networks of Saturday train services and Monday bus runs, we must master the 24-hour system. Precision is our passport!
                    </p>
                </div>
            </div>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Welcome students, set the hook, and outline the lesson.</p>
            <p><strong>Teaching Tip:</strong> Ask students if they've ever seen a 24-hour clock. Ask where they might see one (e.g., airports, military, digital watches). Explain that using 24-hour time prevents costly travel mistakes (e.g., catching an 8:00 p.m. flight instead of 8:00 a.m.!).</p>
        `
    },
    {
        title: "Why 24-Hour Time?",
        theme: "light",
        standardHtml: `
            <div style="margin-top: 10px;">
                <p class="intro-text">Timetables use 24-hour time to avoid confusing <strong>a.m.</strong> and <strong>p.m.</strong> times.</p>
                <div class="time-compare">
                    <div class="time-card time-card-12">
                        <h3>12-Hour System</h3>
                        <p style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Uses a.m. and p.m. cycles:</p>
                        <ul>
                            <li><strong>12:00 a.m.</strong> is Midnight</li>
                            <li><strong>8:00 a.m.</strong> is Morning</li>
                            <li><strong>12:00 p.m.</strong> is Noon</li>
                            <li><strong>8:00 p.m.</strong> is Night (12 hours past noon)</li>
                        </ul>
                    </div>
                    <div class="time-card time-card-24">
                        <h3>24-Hour System</h3>
                        <p style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Uses continuous 4-digit hours:</p>
                        <ul>
                            <li><strong>00:00</strong> is Midnight (start of day)</li>
                            <li><strong>08:00</strong> is Morning</li>
                            <li><strong>12:00</strong> is Noon</li>
                            <li><strong>20:00</strong> is Night (8 + 12 = 20 hours)</li>
                        </ul>
                    </div>
                </div>
                <div class="remember-box">
                    <strong>⏰ Time Travel Rule:</strong> To convert a 12-hour <strong>p.m.</strong> time to 24-hour, simply add 12 to the hours (except for 12 p.m. noon!). To convert 24-hour back, subtract 12 from hours that are 13 or larger.
                </div>
            </div>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Compare 12-hour and 24-hour notation systems side-by-side.</p>
            <p><strong>Pedagogical Strategy:</strong> Highlight the p.m. rule. Have students practice adding 12 in their heads. E.g., 2:00 p.m. becomes 2 + 12 = 14:00. Point out the exceptions: 12:00 a.m. (00:00) and 12:00 p.m. (12:00).</p>
        `
    },
    {
        title: "Practice: Equivalent Times Match",
        theme: "light",
        standardHtml: `
            <div style="margin-top: 10px;">
                <p class="intro-text" style="text-align: center;">Click a blue card, then click its orange 24-hour match!</p>
                
                <div class="match-container">
                    <div class="match-cols-grid">
                        <!-- Left Column (12-Hour) -->
                        <div class="match-col" id="matchColLeft">
                            <div class="match-card" data-match="1" data-side="left" id="card-l1">12:50 p.m. (Departure 1)</div>
                            <div class="match-card" data-match="2" data-side="left" id="card-l2">1:20 p.m. (Departure 2)</div>
                            <div class="match-card" data-match="3" data-side="left" id="card-l3">2:20 p.m. (Departure 4)</div>
                            <div class="match-card" data-match="4" data-side="left" id="card-l4">2:56 p.m. (Airport Arrival)</div>
                        </div>
                        <!-- Right Column (24-Hour) -->
                        <div class="match-col" id="matchColRight">
                            <div class="match-card" data-match="2" data-side="right" id="card-r2">13:20</div>
                            <div class="match-card" data-match="4" data-side="right" id="card-r4">14:56</div>
                            <div class="match-card" data-match="1" data-side="right" id="card-r1">12:50</div>
                            <div class="match-card" data-match="3" data-side="right" id="card-r3">14:20</div>
                        </div>
                    </div>
                    
                    <div class="hint-box" id="pairMatchHint" style="width: 100%;">
                        💡 <strong>Helpful Hint:</strong> Remember, 12:50 p.m. is noon hour, so it remains 12:50. For 1:20 p.m. and 2:20 p.m., add 12 to the hour: 1 + 12 = 13:20 and 2 + 12 = 14:20.
                    </div>
                    <div class="interactive-feedback" id="pairMatchFeedback" style="color: var(--navy);"></div>
                </div>
            </div>
            
            <script>
                (function() {
                    const slide = document.getElementById('slide-3');
                    let selectedLeft = null;
                    let selectedRight = null;
                    let matchCount = 0;
                    let attemptCount = 0;
                    
                    const cards = slide.querySelectorAll('.match-card');
                    const feedback = slide.querySelector('#pairMatchFeedback');
                    const hintBox = slide.querySelector('#pairMatchHint');
                    
                    cards.forEach(card => {
                        card.addEventListener('click', () => {
                            if (card.classList.contains('matched') || card.classList.contains('locked')) return;
                            
                            const side = card.getAttribute('data-side');
                            
                            if (side === 'left') {
                                if (selectedLeft) selectedLeft.classList.remove('selected');
                                selectedLeft = card;
                                card.classList.add('selected');
                            } else {
                                if (selectedRight) selectedRight.classList.remove('selected');
                                selectedRight = card;
                                card.classList.add('selected');
                            }
                            
                            checkMatch();
                        });
                    });
                    
                    function checkMatch() {
                        if (!selectedLeft || !selectedRight) return;
                        
                        const idLeft = selectedLeft.getAttribute('data-match');
                        const idRight = selectedRight.getAttribute('data-match');
                        
                        attemptCount++;
                        
                        if (idLeft === idRight) {
                            // Correct match
                            selectedLeft.classList.add('matched');
                            selectedRight.classList.add('matched');
                            selectedLeft.classList.remove('selected');
                            selectedRight.classList.remove('selected');
                            
                            selectedLeft = null;
                            selectedRight = null;
                            matchCount++;
                            
                            feedback.innerText = "Match found! Keep going! 🎉";
                            feedback.style.color = "var(--green-success)";
                            
                            if (matchCount === 4) {
                                feedback.innerText = "Fantastic! All times matched perfectly! 🏆";
                                feedback.style.color = "var(--green-success)";
                                hintBox.style.display = "none";
                            }
                        } else {
                            // Incorrect match - Tier 1
                            const lCard = selectedLeft;
                            const rCard = selectedRight;
                            
                            lCard.classList.add('incorrect-match');
                            rCard.classList.add('incorrect-match');
                            lCard.classList.remove('selected');
                            rCard.classList.remove('selected');
                            
                            selectedLeft = null;
                            selectedRight = null;
                            
                            feedback.innerText = "Not quite! Try another combination.";
                            feedback.style.color = "var(--red-error)";
                            
                            setTimeout(() => {
                                lCard.classList.remove('incorrect-match');
                                rCard.classList.remove('incorrect-match');
                            }, 500);
                            
                            // Tier 2 feedback after 2 mistakes
                            if (attemptCount >= 2 && matchCount < 4) {
                                hintBox.style.display = "block";
                            }
                        }
                    }
                    
                    // Show answer override event listener
                    slide.addEventListener('show-answer', () => {
                        cards.forEach(card => {
                            card.classList.remove('selected', 'incorrect-match');
                            card.classList.add('matched', 'locked');
                        });
                        selectedLeft = null;
                        selectedRight = null;
                        matchCount = 4;
                        feedback.innerText = "All correct answers revealed by teacher! 🎓";
                        feedback.style.color = "var(--green-success)";
                        hintBox.style.display = "none";
                    });
                })();
            </script>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Active matching review of 12-hour and 24-hour time scales.</p>
            <p><strong>Digital Interaction:</strong> Tap-to-select matching pairs game. Employs Tier 1 (shake error feedback) and Tier 2 (hint displays on second mistake). Teachers can override and show the solution instantly by clicking the "Show Correct Answer" button in their notes sidebar.</p>
        `
    },
    {
        title: "Saturday Train Timetable",
        theme: "light",
        standardHtml: `
            <div style="margin-top: 5px;">
                <p class="intro-text">This timetable shows services travelling from South Bank to the Domestic Airport.</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 22px;">
                    <thead>
                        <tr style="background-color: var(--navy); color: var(--white);">
                            <th style="padding: 10px; border: 2px solid var(--navy); text-align: left;">Station</th>
                            <th style="padding: 10px; border: 2px solid var(--navy); text-align: center; background-color: var(--orange);">Service 1</th>
                            <th style="padding: 10px; border: 2px solid var(--navy); text-align: center;">Service 2</th>
                            <th style="padding: 10px; border: 2px solid var(--navy); text-align: center;">Service 3</th>
                            <th style="padding: 10px; border: 2px solid var(--navy); text-align: center;">Service 4</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background-color: var(--white);">
                            <td style="padding: 10px; border: 2px solid var(--navy); font-weight: bold;">South Bank</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center; font-weight: bold; color: var(--navy);">12:50</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">13:20</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">13:50</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">14:20</td>
                        </tr>
                        <tr style="background-color: #f7f9fa;">
                            <td style="padding: 10px; border: 2px solid var(--navy); font-weight: bold;">Central</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center; font-weight: bold; color: var(--navy);">13:01</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">13:32</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">14:01</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">14:32</td>
                        </tr>
                        <tr style="background-color: var(--white);">
                            <td style="padding: 10px; border: 2px solid var(--navy); font-weight: bold;">International Airport</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center; font-weight: bold; color: var(--navy);">13:22</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">13:53</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">14:22</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">14:53</td>
                        </tr>
                        <tr style="background-color: #f7f9fa;">
                            <td style="padding: 10px; border: 2px solid var(--navy); font-weight: bold;">Domestic Airport</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center; font-weight: bold; color: var(--navy);">13:25</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">13:56</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">14:25</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center;">14:56</td>
                        </tr>
                        <tr style="background-color: #e8f0fe; color: var(--navy);">
                            <td style="padding: 10px; border: 2px solid var(--navy); font-weight: bold;">Total Travel Duration</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center; font-weight: bold; border-top: 3px solid var(--orange);">?</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center; font-weight: bold;">?</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center; font-weight: bold;">?</td>
                            <td style="padding: 10px; border: 2px solid var(--navy); text-align: center; font-weight: bold;">?</td>
                        </tr>
                    </tbody>
                </table>
                <div class="remember-box" style="margin-top: 18px; font-size: 22px; padding: 12px 20px;">
                    💡 <strong>How to read a timetable:</strong> Each **column** is a single train trip (a service). To trace the journey, read **down** the column from stop to stop. To find stop times, read **across** the rows.
                </div>
            </div>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Introduce timetable geography (columns vs. rows).</p>
            <p><strong>Interaction:</strong> Highlight the columns to show individual services. Point out Service 1 (shaded orange). Explain that the bottom row represents the total travel duration from South Bank to Domestic Airport, which we will calculate next!</p>
        `
    },
    {
        title: "I Do: Time-Jumping Method",
        theme: "light",
        standardHtml: `
            <div style="margin-top: 5px;">
                <p class="intro-text">Let's calculate the total travel duration for <strong>Service 1</strong> (12:50 to 13:25).</p>
                
                <div class="scenario-box" style="margin-bottom: 20px;">
                    <strong>Service 1 Journey:</strong> Departs South Bank at <strong>12:50</strong>. Arrives at Domestic Airport at <strong>13:25</strong>.
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 15px; background: white; border: 2px solid var(--navy); padding: 20px; border-radius: 8px; box-shadow: var(--shadow-sm);">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="background-color: var(--orange); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</span>
                        <p style="font-size: 22px; margin: 0;"><strong>Jump to the nearest hour:</strong> From <strong>12:50</strong> to <strong>13:00</strong> is <strong>10 minutes</strong>.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="background-color: var(--orange); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</span>
                        <p style="font-size: 22px; margin: 0;"><strong>Add remaining minutes:</strong> From <strong>13:00</strong> to <strong>13:25</strong> is <strong>25 minutes</strong>.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; border-top: 2px dashed #ddd; padding-top: 15px;">
                        <span style="background-color: var(--blue); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">=</span>
                        <p style="font-size: 24px; margin: 0; color: var(--navy);"><strong>Total Travel Time:</strong> 10 mins + 25 mins = <strong>35 minutes</strong>!</p>
                    </div>
                </div>
                
                <div class="remember-box" style="margin-top: 15px; font-size: 22px; padding: 12px 20px;">
                    ⚠️ <strong>Common Pitfall:</strong> Never treat time like a regular decimal subtraction ($13.25 - 12.50 = 75$ is WRONG!). Time works in base-60 (60 minutes in an hour). Always jump to the hour first!
                </div>
            </div>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Model the chronological time-jumping strategy.</p>
            <p><strong>Teaching Tip:</strong> Use the drawing toolbar to sketch a timeline on the whiteboard. Draw three marks: 12:50, 13:00, and 13:25. Draw a curve from 12:50 to 13:00 (+10) and from 13:00 to 13:25 (+25). Combine them to show 35 minutes.</p>
        `
    },
    {
        title: "We Do: Calculate Durations",
        theme: "light",
        standardHtml: `
            <div style="margin-top: 5px;">
                <p class="intro-text">Work with a partner. Calculate travel durations for Services 2, 3, and 4.</p>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 15px;">
                    <div style="border: 2px solid var(--navy); border-radius: 8px; padding: 15px; background: white; box-shadow: var(--shadow-sm); position: relative;">
                        <div class="cfu-badge" style="position: absolute; top: -12px; right: 10px; background-color: var(--orange); color: white; font-size: 11px; padding: 3px 8px; border-radius: 10px; font-weight: bold;">CFU</div>
                        <h4 style="color: var(--navy); font-size: 22px; margin-bottom: 8px; border-bottom: 2px solid var(--orange); padding-bottom: 5px;">Service 2</h4>
                        <p style="font-size: 18px; margin-bottom: 5px;"><strong>Departs South Bank:</strong> 13:20</p>
                        <p style="font-size: 18px; margin-bottom: 12px;"><strong>Arrives Domestic:</strong> 13:56</p>
                        <div id="service2Ans" style="font-size: 22px; font-weight: bold; color: var(--green-success); display: none; text-align: center; padding: 8px; background: #e8f5e9; border-radius: 4px;">36 Minutes</div>
                    </div>
                    
                    <div style="border: 2px solid var(--navy); border-radius: 8px; padding: 15px; background: white; box-shadow: var(--shadow-sm); position: relative;">
                        <div class="cfu-badge" style="position: absolute; top: -12px; right: 10px; background-color: var(--orange); color: white; font-size: 11px; padding: 3px 8px; border-radius: 10px; font-weight: bold;">CFU</div>
                        <h4 style="color: var(--navy); font-size: 22px; margin-bottom: 8px; border-bottom: 2px solid var(--orange); padding-bottom: 5px;">Service 3</h4>
                        <p style="font-size: 18px; margin-bottom: 5px;"><strong>Departs South Bank:</strong> 13:50</p>
                        <p style="font-size: 18px; margin-bottom: 12px;"><strong>Arrives Domestic:</strong> 14:25</p>
                        <div id="service3Ans" style="font-size: 22px; font-weight: bold; color: var(--green-success); display: none; text-align: center; padding: 8px; background: #e8f5e9; border-radius: 4px;">35 Minutes</div>
                    </div>
                    
                    <div style="border: 2px solid var(--navy); border-radius: 8px; padding: 15px; background: white; box-shadow: var(--shadow-sm); position: relative;">
                        <div class="cfu-badge" style="position: absolute; top: -12px; right: 10px; background-color: var(--orange); color: white; font-size: 11px; padding: 3px 8px; border-radius: 10px; font-weight: bold;">CFU</div>
                        <h4 style="color: var(--navy); font-size: 22px; margin-bottom: 8px; border-bottom: 2px solid var(--orange); padding-bottom: 5px;">Service 4</h4>
                        <p style="font-size: 18px; margin-bottom: 5px;"><strong>Departs South Bank:</strong> 14:20</p>
                        <p style="font-size: 18px; margin-bottom: 12px;"><strong>Arrives Domestic:</strong> 14:56</p>
                        <div id="service4Ans" style="font-size: 22px; font-weight: bold; color: var(--green-success); display: none; text-align: center; padding: 8px; background: #e8f5e9; border-radius: 4px;">36 Minutes</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <button class="interactive-submit-btn" id="revealDurationsBtn">Check Our Work</button>
                </div>
            </div>
            
            <script>
                (function() {
                    const slide = document.getElementById('slide-6');
                    const btn = slide.querySelector('#revealDurationsBtn');
                    const ans2 = slide.querySelector('#service2Ans');
                    const ans3 = slide.querySelector('#service3Ans');
                    const ans4 = slide.querySelector('#service4Ans');
                    
                    btn.addEventListener('click', () => {
                        const revealed = btn.classList.toggle('active');
                        ans2.style.display = revealed ? 'block' : 'none';
                        ans3.style.display = revealed ? 'block' : 'none';
                        ans4.style.display = revealed ? 'block' : 'none';
                        btn.innerText = revealed ? 'Hide Answers' : 'Check Our Work';
                    });
                    
                    slide.addEventListener('show-answer', () => {
                        btn.classList.add('active');
                        ans2.style.display = 'block';
                        ans3.style.display = 'block';
                        ans4.style.display = 'block';
                        btn.innerText = 'Hide Answers';
                    });
                })();
            </script>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Active collaborative calculation of elapsed train time.</p>
            <p><strong>Whiteboard Protocol (CFU):</strong> Direct students to calculate these 3 services on their personal mini-whiteboards. Once students hold up their boards, click the "Check Our Work" button (or dispatch the custom "show-answer" event via teacher toolbar) to reveal correct values and write them in their worksheets.</p>
        `
    },
    {
        title: "Train Timetable Challenge",
        theme: "light",
        standardHtml: `
            <div style="margin-top: 5px;">
                <p class="intro-text">Solve these challenges using the train timetable on your handout.</p>
                
                <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
                    <div style="background: white; border: 2px solid var(--navy); border-radius: 6px; padding: 12px 20px; position: relative;">
                        <div class="cfu-badge" style="position: absolute; top: 12px; right: 15px; background-color: var(--navy); color: white; font-size: 11px; padding: 3px 8px; border-radius: 10px; font-weight: bold;">CFU</div>
                        <p style="font-size: 20px; margin: 0; padding-right: 80px;"><strong>Challenge B:</strong> How long does the 12:50 train take to travel from Central to the Domestic Airport?</p>
                        <div class="t-b-ans" style="display: none; color: var(--green-success); font-weight: bold; font-size: 20px; margin-top: 8px;">
                            👉 Answer: 24 minutes (Central depart 13:01 ➔ Domestic arrive 13:25).
                        </div>
                    </div>
                    
                    <div style="background: white; border: 2px solid var(--navy); border-radius: 6px; padding: 12px 20px; position: relative;">
                        <div class="cfu-badge" style="position: absolute; top: 12px; right: 15px; background-color: var(--navy); color: white; font-size: 11px; padding: 3px 8px; border-radius: 10px; font-weight: bold;">CFU</div>
                        <p style="font-size: 20px; margin: 0; padding-right: 80px;"><strong>Challenge C:</strong> How much longer does the 13:20 train take from South Bank to Domestic Airport, than from South Bank to International Airport?</p>
                        <div class="t-c-ans" style="display: none; color: var(--green-success); font-weight: bold; font-size: 20px; margin-top: 8px;">
                            👉 Answer: 3 minutes longer (Total travel: 36 mins. To International: 13:20 ➔ 13:53 = 33 mins. Difference: 36 - 33 = 3 mins).
                        </div>
                    </div>
                    
                    <div style="background: white; border: 2px solid var(--navy); border-radius: 6px; padding: 12px 20px; position: relative;">
                        <div class="cfu-badge" style="position: absolute; top: 12px; right: 15px; background-color: var(--navy); color: white; font-size: 11px; padding: 3px 8px; border-radius: 10px; font-weight: bold;">CFU</div>
                        <p style="font-size: 20px; margin: 0; padding-right: 80px;"><strong>Challenge D:</strong> What is the latest train you could catch from South Bank to reach the International Airport before 2:00 p.m. (14:00)?</p>
                        <div class="t-d-ans" style="display: none; color: var(--green-success); font-weight: bold; font-size: 20px; margin-top: 8px;">
                            👉 Answer: The 13:20 train (arrives at International Airport at 13:53. The next train at 13:50 arrives at 14:22, which is after 2 p.m.).
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 15px;">
                    <button class="interactive-submit-btn" id="revealTimetableChallengesBtn">Reveal Journey Solutions</button>
                </div>
            </div>
            
            <script>
                (function() {
                    const slide = document.getElementById('slide-7');
                    const btn = slide.querySelector('#revealTimetableChallengesBtn');
                    const bAns = slide.querySelector('.t-b-ans');
                    const cAns = slide.querySelector('.t-c-ans');
                    const dAns = slide.querySelector('.t-d-ans');
                    
                    btn.addEventListener('click', () => {
                        const active = btn.classList.toggle('active');
                        bAns.style.display = active ? 'block' : 'none';
                        cAns.style.display = active ? 'block' : 'none';
                        dAns.style.display = active ? 'block' : 'none';
                        btn.innerText = active ? 'Hide Journey Solutions' : 'Reveal Journey Solutions';
                    });
                    
                    slide.addEventListener('show-answer', () => {
                        btn.classList.add('active');
                        bAns.style.display = 'block';
                        cAns.style.display = 'block';
                        dAns.style.display = 'block';
                        btn.innerText = 'Hide Journey Solutions';
                    });
                })();
            </script>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Solve timetable reading and difference challenges (textbook questions 1b, 1c, 1d).</p>
            <p><strong>Pedagogical Check:</strong> Point out that in question D, students must check the ARRIVAL time at the International Airport, not just departure times. Use the drawing toolbar to draw paths showing the arrival constraints.</p>
        `
    },
    {
        title: "Delays & Frequency",
        theme: "light",
        standardHtml: `
            <div style="margin-top: 5px;">
                <p class="intro-text">Let's solve the final train challenges regarding delayed schedules and service intervals.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                    <div style="border: 2px solid var(--navy); border-radius: 8px; padding: 20px; background: white; box-shadow: var(--shadow-sm); position: relative;">
                        <div class="cfu-badge" style="position: absolute; top: -12px; right: 10px; background-color: var(--orange); color: white; font-size: 11px; padding: 3px 8px; border-radius: 10px; font-weight: bold;">CFU</div>
                        <h4 style="color: var(--navy); font-size: 22px; margin-bottom: 10px; border-bottom: 2px solid var(--navy); padding-bottom: 5px;">Challenge E: Train Delay</h4>
                        <p style="font-size: 18px; line-height: 1.5; margin-bottom: 12px;">
                            The <strong>14:20 train</strong> from South Bank was delayed at Central station for <strong>12 minutes</strong>. At what time is the train likely to arrive at Domestic Airport?
                        </p>
                        <div id="delayAns" style="display: none; font-size: 20px; font-weight: bold; color: var(--green-success); background: #e8f5e9; padding: 10px; border-radius: 4px; border-left: 5px solid var(--green-success);">
                            Arrival: 15:08<br>
                            <span style="font-size: 14px; font-weight: normal; color: #555;">(Standard Arrival: 14:56 + 12 minutes = 15:08).</span>
                        </div>
                    </div>
                    
                    <div style="border: 2px solid var(--navy); border-radius: 8px; padding: 20px; background: white; box-shadow: var(--shadow-sm); position: relative;">
                        <div class="cfu-badge" style="position: absolute; top: -12px; right: 10px; background-color: var(--orange); color: white; font-size: 11px; padding: 3px 8px; border-radius: 10px; font-weight: bold;">CFU</div>
                        <h4 style="color: var(--navy); font-size: 22px; margin-bottom: 10px; border-bottom: 2px solid var(--navy); padding-bottom: 5px;">Challenge F: Service Intervals</h4>
                        <p style="font-size: 18px; line-height: 1.5; margin-bottom: 12px;">
                            Reviewing all train departure times from South Bank Station: <strong>12:50</strong>, <strong>13:20</strong>, <strong>13:50</strong>, and <strong>14:20</strong>.<br>How often does a service travel?
                        </p>
                        <div id="frequencyAns" style="display: none; font-size: 20px; font-weight: bold; color: var(--green-success); background: #e8f5e9; padding: 10px; border-radius: 4px; border-left: 5px solid var(--green-success);">
                            Frequency: Every 30 Minutes<br>
                            <span style="font-size: 14px; font-weight: normal; color: #555;">(Consistent intervals: 12:50 to 13:20 = 30m; 13:20 to 13:50 = 30m).</span>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <button class="interactive-submit-btn" id="revealDelayFreqBtn">Verify Operations</button>
                </div>
            </div>
            
            <script>
                (function() {
                    const slide = document.getElementById('slide-8');
                    const btn = slide.querySelector('#revealDelayFreqBtn');
                    const ansDelay = slide.querySelector('#delayAns');
                    const ansFreq = slide.querySelector('#frequencyAns');
                    
                    btn.addEventListener('click', () => {
                        const active = btn.classList.toggle('active');
                        ansDelay.style.display = active ? 'block' : 'none';
                        ansFreq.style.display = active ? 'block' : 'none';
                        btn.innerText = active ? 'Hide Answers' : 'Verify Operations';
                    });
                    
                    slide.addEventListener('show-answer', () => {
                        btn.classList.add('active');
                        ansDelay.style.display = 'block';
                        ansFreq.style.display = 'block';
                        btn.innerText = 'Hide Answers';
                    });
                })();
            </script>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Teach students how to add delays and evaluate timetable frequency (textbook questions 1e, 1f).</p>
            <p><strong>Pedagogical Strategy:</strong> Question E requires adding minutes across an hour boundary. Walk students through: 14:56 + 4 minutes = 15:00, plus 8 more minutes = 15:08. For Question F, guide them to notice the repeating +30 minute gap.</p>
        `
    },
    {
        title: "Monday Bus Timetable",
        theme: "light",
        standardHtml: `
            <div style="margin-top: 5px;">
                <p class="intro-text">Let's analyze Monday Bus Arrivals. This bus leaves Flinders St stop <strong>every 10 minutes</strong>.</p>
                
                <div style="display: flex; gap: 20px; align-items: start; margin-top: 10px;">
                    <!-- Timetable Table -->
                    <table style="width: 45%; border-collapse: collapse; font-size: 20px;">
                        <thead>
                            <tr style="background-color: var(--navy); color: var(--white);">
                                <th style="padding: 6px 10px; border: 2px solid var(--navy); text-align: left;">Stop</th>
                                <th style="padding: 6px 10px; border: 2px solid var(--navy); text-align: center;">Arrival</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding: 5px 10px; border: 2px solid var(--navy); font-weight: bold;">Flinders St</td><td style="padding: 5px 10px; border: 2px solid var(--navy); text-align: center;">12:52</td></tr>
                            <tr style="background-color: #f7f9fa;"><td style="padding: 5px 10px; border: 2px solid var(--navy); font-weight: bold;">Richmond</td><td style="padding: 5px 10px; border: 2px solid var(--navy); text-align: center;">12:55</td></tr>
                            <tr><td style="padding: 5px 10px; border: 2px solid var(--navy); font-weight: bold;">Burnley</td><td style="padding: 5px 10px; border: 2px solid var(--navy); text-align: center;">12:58</td></tr>
                            <tr style="background-color: #f7f9fa;"><td style="padding: 5px 10px; border: 2px solid var(--navy); font-weight: bold;">Hawthorn</td><td style="padding: 5px 10px; border: 2px solid var(--navy); text-align: center;">13:00</td></tr>
                            <tr><td style="padding: 5px 10px; border: 2px solid var(--navy); font-weight: bold;">Glenferrie</td><td style="padding: 5px 10px; border: 2px solid var(--navy); text-align: center;">13:02</td></tr>
                            <tr style="background-color: #f7f9fa;"><td style="padding: 5px 10px; border: 2px solid var(--navy); font-weight: bold;">Auburn</td><td style="padding: 5px 10px; border: 2px solid var(--navy); text-align: center;">13:04</td></tr>
                            <tr style="background-color: #fff3e0;"><td style="padding: 5px 10px; border: 2px solid var(--navy); font-weight: bold; color: var(--navy);">Camberwell</td><td style="padding: 5px 10px; border: 2px solid var(--navy); text-align: center; font-weight: bold; color: var(--navy);">13:06</td></tr>
                        </tbody>
                    </table>
                    
                    <!-- Challenges Grid -->
                    <div style="width: 55%; display: flex; flex-direction: column; gap: 10px;">
                        <div style="background: white; border: 2px solid var(--navy); border-radius: 6px; padding: 10px 15px; position: relative;">
                            <div class="cfu-badge" style="position: absolute; top: 10px; right: 10px; background-color: var(--navy); color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px;">CFU</div>
                            <p style="font-size: 18px; margin: 0; font-weight: bold;">Challenge A: Flinders St to Camberwell?</p>
                            <p style="font-size: 16px; margin: 2px 0 0 0; color: #555;">How long does this travel take?</p>
                            <div class="bus-ans-a" style="display: none; color: var(--green-success); font-weight: bold; font-size: 17px; margin-top: 5px;">
                                Answer: 14 minutes (12:52 to 13:06).
                            </div>
                        </div>
                        
                        <div style="background: white; border: 2px solid var(--navy); border-radius: 6px; padding: 10px 15px; position: relative;">
                            <div class="cfu-badge" style="position: absolute; top: 10px; right: 10px; background-color: var(--navy); color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px;">CFU</div>
                            <p style="font-size: 18px; margin: 0; font-weight: bold;">Challenge B: Levi's Arrival?</p>
                            <p style="font-size: 16px; margin: 2px 0 0 0; color: #555;">Leaves Flinders St at 12:52. When does he reach Glenferrie?</p>
                            <div class="bus-ans-b" style="display: none; color: var(--green-success); font-weight: bold; font-size: 17px; margin-top: 5px;">
                                Answer: At 13:02.
                            </div>
                        </div>
                        
                        <div style="background: white; border: 2px solid var(--navy); border-radius: 6px; padding: 10px 15px; position: relative;">
                            <div class="cfu-badge" style="position: absolute; top: 10px; right: 10px; background-color: var(--navy); color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px;">CFU</div>
                            <p style="font-size: 18px; margin: 0; font-weight: bold;">Challenge C: Missed Bus offset?</p>
                            <p style="font-size: 16px; margin: 2px 0 0 0; color: #555;">Joshua misses the 12:52 bus, takes the next. When does he reach Auburn?</p>
                            <div class="bus-ans-c" style="display: none; color: var(--green-success); font-weight: bold; font-size: 17px; margin-top: 5px;">
                                Answer: At 13:14.<br>
                                <span style="font-size: 13px; font-weight: normal; color: #555;">(Leaves 10m later at 13:02. Auburn travel time is 12m. 13:02 + 12m = 13:14).</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 15px;">
                    <button class="interactive-submit-btn" id="revealBusChallengesBtn">Verify Bus Schedule</button>
                </div>
            </div>
            
            <script>
                (function() {
                    const slide = document.getElementById('slide-9');
                    const btn = slide.querySelector('#revealBusChallengesBtn');
                    const aAns = slide.querySelector('.bus-ans-a');
                    const bAns = slide.querySelector('.bus-ans-b');
                    const cAns = slide.querySelector('.bus-ans-c');
                    
                    btn.addEventListener('click', () => {
                        const active = btn.classList.toggle('active');
                        aAns.style.display = active ? 'block' : 'none';
                        bAns.style.display = active ? 'block' : 'none';
                        cAns.style.display = active ? 'block' : 'none';
                        btn.innerText = active ? 'Hide Bus Schedule' : 'Verify Bus Schedule';
                    });
                    
                    slide.addEventListener('show-answer', () => {
                        btn.classList.add('active');
                        aAns.style.display = 'block';
                        bAns.style.display = 'block';
                        cAns.style.display = 'block';
                        btn.innerText = 'Hide Bus Schedule';
                    });
                })();
            </script>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Read the Monday Bus timetable and solve double-step offset problems (questions 2a, 2b, 2c).</p>
            <p><strong>Key Concept:</strong> Question C is tricky because students must shift the departure time by 10 minutes (to 13:02) and then add the travel duration from Flinders St to Auburn (which is 12 minutes). Direct students to write their step-by-step logic on whiteboards first.</p>
        `
    },
    {
        title: "Exit Ticket",
        theme: "dark",
        standardHtml: `
            <div style="text-align: center; margin-top: 10px;">
                <h3 style="color: var(--orange); font-size: 36px; margin-bottom: 20px;">MISSION COMPLETE: FINAL EXIT SIGNAL</h3>
                <p style="font-size: 26px; color: var(--white); margin-bottom: 30px;">
                    Solve this textbook problem on your slip of paper before leaving:
                </p>
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.1); border: 3px solid var(--orange); padding: 30px; border-radius: 12px; max-width: 800px; text-align: center; margin-bottom: 25px; box-shadow: var(--shadow-lg);">
                    <p style="font-size: 28px; font-weight: bold; margin: 0; color: var(--white);">
                        "At what time would the 13:12 bus expect to arrive at Camberwell bus stop?"
                    </p>
                </div>
                <p style="font-size: 22px; color: #aab7c8; font-style: italic;">
                    (Hint: How many minutes past the standard 12:52 departure did this bus leave? Apply that offset to the standard arrival!)
                </p>
                <div id="exitAns" style="display: none; font-size: 28px; font-weight: bold; color: var(--orange); margin-top: 15px; animation: bounceIn 0.5s ease;">
                    🔑 Solution: 13:26
                </div>
            </div>
        `,
        teacherNotes: `
            <p><strong>Slide Goal:</strong> Formative exit ticket calculation (question 2d).</p>
            <p><strong>Solution Logic:</strong> The standard bus departs Flinders St at 12:52 and arrives at Camberwell at 13:06 (taking 14 minutes). The 13:12 bus departs exactly 20 minutes after 12:52. It will arrive at Camberwell 20 minutes after 13:06, which is 13:26. Alternatively: 13:12 + 14 minutes travel duration = 13:26.</p>
        `
    }
];

// --- DELIVERABLE 1: PRESENTATION COMPILATION ---
function buildPresentationHTML() {
    const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');

    let slidesHtml = '';
    SLIDES_DATA.forEach((slide, idx) => {
        let slideClass = `slide theme-${slide.theme || 'light'}`;
        if (idx === 0) slideClass += ' active';

        let slideMarkup = `    <!-- SLIDE ${idx + 1}: ${slide.title} -->\n`;
        slideMarkup += `    <section class="${slideClass}" id="slide-${idx + 1}">\n`;

        if (slide.theme === 'dark') {
            slideMarkup += `      <div class="fade-in-up">\n        <h1>${slide.title}</h1>\n      </div>\n`;
            if (slide.subtitle) {
                slideMarkup += `      <div class="fade-in-up delay-1">\n        <p class="subtitle" style="font-size:26px; color:var(--text-light); margin-top:20px;">${slide.subtitle}</p>\n      </div>\n`;
            }
        } else {
            slideMarkup += `      <h2 class="slide-title fade-in-up">${slide.title}</h2>\n`;
        }

        slideMarkup += `      <div class="content fade-in-up delay-1">\n`;
        slideMarkup += `        ${slide.standardHtml}\n`;
        slideMarkup += `      </div>\n`;

        if (slide.teacherNotes) {
            slideMarkup += `      <div class="teacher-notes" style="display: none;">\n        ${slide.teacherNotes}\n      </div>\n`;
        }

        slideMarkup += `    </section>\n\n`;
        slidesHtml += slideMarkup;
    });

    const placeholder = '<!-- SLIDES GO HERE DURING DYNAMIC COMPILATION -->';
    const compiledContent = templateContent.replace(placeholder, slidesHtml);
    const outputPath = path.join(OUTPUT_DIR, 'Lesson_Time_Timetables_Presentation.html');

    fs.writeFileSync(outputPath, compiledContent, 'utf8');
    console.log('✅ Standalone Presentation HTML successfully compiled.');
}

// --- DELIVERABLE 2: PRINTABLE HANDOUT (DOCX) ---
async function buildHandoutDOCX() {
    console.log('Compiling Student Handout DOCX...');

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: "Arial", size: 22, color: "333333" } // 11pt default
                }
            },
            paragraphStyles: [
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 32, bold: true, color: THEME.navy, font: "Arial" }, // 16pt
                    paragraph: { spacing: { before: 240, after: 120 } }
                },
                {
                    id: "Heading2",
                    name: "Heading 2",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 26, bold: true, color: THEME.orange, font: "Arial" }, // 13pt
                    paragraph: { spacing: { before: 180, after: 80 } }
                }
            ]
        },
        sections: [{
            properties: {
                page: {
                    size: { width: 11906, height: 16838 }, // A4 Page
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 2.54cm margins
                }
            },
            children: [
                // Header block
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Year 5 Maths Handout: 24-Hour Time & Timetables", bold: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                    children: [new TextRun({ text: "Reading Queensland Saturday Trains & Victorian Monday Bus Timetables", italics: true, size: 24, color: "555555" })]
                }),

                // Metadata block
                new Table({
                    columnWidths: [1500, 7520],
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Student Name:", bold: true })] })] }),
                                new TableCell({ width: { size: 7520, type: WidthType.DXA }, shading: { fill: THEME.grey }, children: [new Paragraph({ children: [] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Date / Class:", bold: true })] })] }),
                                new TableCell({ width: { size: 7520, type: WidthType.DXA }, shading: { fill: THEME.grey }, children: [new Paragraph({ children: [] })] })
                            ]
                        })
                    ]
                }),

                new Paragraph({ spacing: { before: 200 } }),

                // Learning Objectives
                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("My Learning Intention & Criteria")] }),
                new Paragraph({ children: [new TextRun("•  Learning Intention: "), new TextRun({ text: "We are learning to interpret 24-hour timetables and solve duration problems.", italics: true })] }),
                new Paragraph({ children: [new TextRun("•  Success Criteria 1: "), new TextRun({ text: "I can convert back and forth between 12-hour and 24-hour notations.", italics: true })] }),
                new Paragraph({ children: [new TextRun("•  Success Criteria 2: "), new TextRun({ text: "I can read stops and times in a train/bus table.", italics: true })] }),
                new Paragraph({ children: [new TextRun("•  Success Criteria 3: "), new TextRun({ text: "I can count hours and minutes forward using the time-jumping timeline.", italics: true })] }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("⏰ Remember: The Time-Jumping Blueprint")] }),
                new Table({
                    columnWidths: [9020],
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: THEME.lightOrange },
                                    borders: { top: dashedBorder, bottom: dashedBorder, left: dashedBorder, right: dashedBorder },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "Never subtract time like normal decimal numbers! Timelines work in blocks of 60 minutes.", bold: true, color: THEME.orange })] }),
                                        new Paragraph({ children: [new TextRun("1. Jump from the start time to the next nearest hour (e.g., 12:50 ➔ 13:00 is 10 mins).")] }),
                                        new Paragraph({ children: [new TextRun("2. Count full hour blocks to the final hour.")] }),
                                        new Paragraph({ children: [new TextRun("3. Add the remaining minutes (e.g., 13:00 ➔ 13:25 is 25 mins).")] }),
                                        new Paragraph({ children: [new TextRun({ text: "4. Add all jumps together: 10 + 25 = 35 minutes total travel time.", bold: true })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),

                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Part 1: Saturday Train Timetable")] }),
                new Paragraph({ children: [new TextRun("This train timetable shows departure times from South Bank to the Domestic Airport. Complete the blank duration row at the bottom.")], spacing: { after: 120 } }),

                // Saturday train timetable
                new Table({
                    columnWidths: [2620, 1600, 1600, 1600, 1600],
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: THEME.navy }, borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Station Stops", bold: true, color: "FFFFFF" })] })] }),
                                new TableCell({ shading: { fill: THEME.navy }, borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Service 1", bold: true, color: "FFFFFF" })] })] }),
                                new TableCell({ shading: { fill: THEME.navy }, borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Service 2", bold: true, color: "FFFFFF" })] })] }),
                                new TableCell({ shading: { fill: THEME.navy }, borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Service 3", bold: true, color: "FFFFFF" })] })] }),
                                new TableCell({ shading: { fill: THEME.navy }, borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Service 4", bold: true, color: "FFFFFF" })] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun({ text: "South Bank", bold: true })] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("12:50")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:20")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:50")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("14:20")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun("Central")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:01")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:32")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("14:01")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("14:32")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun("International Airport")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:22")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:53")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("14:22")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("14:53")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Domestic Airport", bold: true })] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:25")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:56")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("14:25")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("14:56")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: THEME.lightOrange }, borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Duration time for train", bold: true, color: THEME.navy })] })] }),
                                new TableCell({ shading: { fill: THEME.lightOrange }, borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "35 mins", bold: true })] })] }),
                                new TableCell({ shading: { fill: THEME.lightOrange }, borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Write duration)", color: "888888" })] })] }),
                                new TableCell({ shading: { fill: THEME.lightOrange }, borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Write duration)", color: "888888" })] })] }),
                                new TableCell({ shading: { fill: THEME.lightOrange }, borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Write duration)", color: "888888" })] })] })
                            ]
                        })
                    ]
                }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Part 1 Journey Calculations")] }),

                // Question 1a
                new Paragraph({ children: [new TextRun({ text: "a) Calculate the total travel duration of each service from South Bank to Domestic Airport.", bold: true })] }),
                new Paragraph({ children: [new TextRun("•  Service 1: 12:50 to 13:25 = 35 minutes.")], spacing: { after: 60 } }),
                new Paragraph({ children: [new TextRun("•  Service 2: 13:20 to 13:56 = __________________________________")] }),
                new Paragraph({ children: [new TextRun("•  Service 3: 13:50 to 14:25 = __________________________________")] }),
                new Paragraph({ children: [new TextRun("•  Service 4: 14:20 to 14:56 = __________________________________")], spacing: { after: 120 } }),

                // Question 1b
                new Paragraph({ children: [new TextRun({ text: "b) How long does the 12:50 train take to travel from Central to the Domestic Airport?", bold: true })] }),
                new Paragraph({ text: "My Jumps: Central departure time (_________ ) ➔ Domestic arrival time (________ )" }),
                new Paragraph({ text: "Working Out: ___________________________________________________________________" }),
                new Paragraph({ children: [new TextRun({ text: "My Answer: _______________________", bold: true, color: THEME.orange })], spacing: { after: 120 } }),

                // Question 1c
                new Paragraph({ children: [new TextRun({ text: "c) How much longer does the 13:20 train take to travel from South Bank to the Domestic Airport, than from South Bank to the International Airport?", bold: true })] }),
                new Paragraph({ text: "Working Out: Duration to Domestic = ________ mins. Duration to International = ________ mins." }),
                new Paragraph({ text: "Difference: ________ mins - ________ mins = ________ mins." }),
                new Paragraph({ children: [new TextRun({ text: "My Answer: _______________________", bold: true, color: THEME.orange })], spacing: { after: 120 } }),

                // Question 1d
                new Paragraph({ children: [new TextRun({ text: "d) When is the latest train you could catch from South Bank to get to the International Airport before 2 p.m. (14:00)?", bold: true })] }),
                new Paragraph({ text: "Working Out (Check arrival times at International Airport for each service):" }),
                new Paragraph({ text: "•  Service 2 arrives: ________   •  Service 3 arrives: ________" }),
                new Paragraph({ children: [new TextRun({ text: "My Answer (Departure Time): _______________________", bold: true, color: THEME.orange })], spacing: { after: 120 } }),

                // Question 1e
                new Paragraph({ children: [new TextRun({ text: "e) The 14:20 train from South Bank was delayed at Central for 12 minutes. At what time is the train likely to arrive at Domestic Airport?", bold: true })] }),
                new Paragraph({ text: "Working Out: Standard arrival time (_________ ) + Delay (________ mins) = ___________" }),
                new Paragraph({ children: [new TextRun({ text: "My Answer: _______________________", bold: true, color: THEME.orange })], spacing: { after: 120 } }),

                // Question 1f
                new Paragraph({ children: [new TextRun({ text: "f) How often does a train travel from South Bank to Domestic Airport?", bold: true })] }),
                new Paragraph({ text: "Working Out (Compare departure gaps): 12:50 ➔ 13:20 ➔ 13:50 ➔ 14:20" }),
                new Paragraph({ children: [new TextRun({ text: "My Answer (Interval Frequency): _______________________", bold: true, color: THEME.orange })], spacing: { after: 200 } }),


                new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Part 2: Monday Bus Timetable")] }),
                new Paragraph({ children: [new TextRun("This bus timetable shows arrival times at bus stops from Flinders St to Camberwell. A bus leaves Flinders St stop every 10 minutes.")], spacing: { after: 120 } }),

                // Bus Timetable
                new Table({
                    columnWidths: [4510, 4510],
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: THEME.navy }, borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Bus Stop Locations", bold: true, color: "FFFFFF" })] })] }),
                                new TableCell({ shading: { fill: THEME.navy }, borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Monday Arrival Times", bold: true, color: "FFFFFF" })] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun("Flinders St (Departure)")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("12:52")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun("Richmond")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("12:55")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun("Burnley")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("12:58")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun("Hawthorn")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:00")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun("Glenferrie")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:02")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun("Auburn")] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("13:04")] })] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Camberwell (Terminal)", bold: true })] })] }),
                                new TableCell({ borders: stdCellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "13:06", bold: true })] })] })
                            ]
                        })
                    ]
                }),

                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Part 2 Journey Calculations")] }),

                // Question 2a
                new Paragraph({ children: [new TextRun({ text: "a) How long does it take to travel on this route from Flinders St to Camberwell?", bold: true })] }),
                new Paragraph({ text: "Working Out: 12:52 to 13:06 = __________________________________________________" }),
                new Paragraph({ children: [new TextRun({ text: "My Answer: _______________________", bold: true, color: THEME.orange })], spacing: { after: 120 } }),

                // Question 2b
                new Paragraph({ children: [new TextRun({ text: "b) Levi catches the bus from Flinders St at 12:52. At what time would he reach Glenferrie?", bold: true })] }),
                new Paragraph({ children: [new TextRun({ text: "My Answer (Check arrival column): _______________________", bold: true, color: THEME.orange })], spacing: { after: 120 } }),

                // Question 2c
                new Paragraph({ children: [new TextRun({ text: "c) Joshua misses the 12:52 bus from Flinders St and takes the next bus instead. At what time would he expect to arrive at Auburn bus stop?", bold: true })] }),
                new Paragraph({ text: "Working Out: Next bus departure (12:52 + 10m) = _________." }),
                new Paragraph({ text: "Travel duration from Flinders St to Auburn: 12:52 ➔ 13:04 = ________ mins." }),
                new Paragraph({ text: "Compounded Arrival: New departure (_________ ) + Travel duration (________ mins) = _________." }),
                new Paragraph({ children: [new TextRun({ text: "My Answer: _______________________", bold: true, color: THEME.orange })], spacing: { after: 120 } }),

                // Question 2d - Exit Ticket
                new Paragraph({ children: [new TextRun({ text: "d) At what time would the 13:12 bus expect to arrive at Camberwell bus stop?", bold: true })] }),
                new Paragraph({ text: "Working Out: Departure offset from standard: 13:12 - 12:52 = ________ mins later." }),
                new Paragraph({ text: "Apply offset to arrival: Standard Camberwell arrival (13:06) + Offset (________ mins) = _________" }),
                new Paragraph({ children: [new TextRun({ text: "My Answer: _______________________", bold: true, color: THEME.orange })], spacing: { after: 200 } }),


                // Extension Challenge (Lucas Pathway)
                new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "🚀 Extension: The Multi-Leg Commuter Challenge", bold: true, color: THEME.navy })] }),
                new Table({
                    columnWidths: [9020],
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: THEME.lightGreen },
                                    borders: { top: singleBorder, bottom: singleBorder, left: singleBorder, right: singleBorder },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "Queensland Commuter Mission Blueprint:", bold: true, color: THEME.green })] }),
                                        new Paragraph({ children: [new TextRun("A commuter plans to catch a Monday bus from Flinders St stop to connect with Service 2 train (13:20 departure) at South Bank station. The transfer walking buffer between the bus stop and the train platform requires exactly 8 minutes.")], spacing: { before: 60 } }),
                                        new Paragraph({ children: [new TextRun("If the bus travel duration from Flinders St to South Bank station is 14 minutes, and buses depart Flinders St every 10 minutes (starting from 12:52), which bus MUST they catch to make their connection? Let's check:")] }),
                                        new Paragraph({ children: [new TextRun("1. Latest arrival at South Bank platform needed: 13:20 train departure minus 8m walking buffer = _________.")], spacing: { before: 40 } }),
                                        new Paragraph({ children: [new TextRun("2. Bus travel takes 14m, so the latest bus departure from Flinders St is: Latest bus arrival (_________ ) minus 14m = _________.")] }),
                                        new Paragraph({ children: [new TextRun("3. Bus departure times are: 12:52, 13:02, 13:12, 13:22... Which is the latest bus they can board before their limit? _________.")] }),
                                        new Paragraph({ children: [new TextRun({ text: "Commuter Departure Decision: ________________________________________________", bold: true })] })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(OUTPUT_DIR, 'Lesson_Time_Timetables_Handout.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log('✅ Handout DOCX successfully compiled.');
}

// --- DELIVERABLE 3: MS FORMS ASSESSMENT (DOCX) ---
async function buildAssessmentDOCX() {
    console.log('Compiling Assessment DOCX for MS Forms Import...');

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: "Arial", size: 24, color: "262626" } // 12pt
                }
            },
            paragraphStyles: [
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 36, bold: true, color: THEME.navy, font: "Arial" },
                    paragraph: { spacing: { before: 240, after: 120 } }
                }
            ]
        },
        sections: [{
            properties: {
                page: {
                    size: { width: 11906, height: 16838 },
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
                }
            },
            children: [
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Assessment: 24-Hour Time & Timetables", bold: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                    children: [new TextRun({ text: "Formative Multiple Choice Assessment (Queensland Curriculum v9 ICP)", italics: true, size: 22, color: "555555" })]
                }),
                new Paragraph({
                    spacing: { after: 240 },
                    children: [new TextRun({ text: "Instructions to students: ", bold: true }), new TextRun("Solve each question below and choose the single correct option. Mark your answers on your sheets or submit digitally via Microsoft Forms.")]
                }),

                // Question 1
                new Paragraph({ spacing: { before: 180 }, children: [new TextRun({ text: "1. Convert the afternoon time 1:20 p.m. into 24-hour notation.", bold: true })] }),
                new Paragraph({ children: [new TextRun("A) 01:20")] }),
                new Paragraph({ children: [new TextRun("B) 13:20")] }),
                new Paragraph({ children: [new TextRun("C) 12:20")] }),
                new Paragraph({ children: [new TextRun("D) 15:20")] }),
                new Paragraph({ children: [new TextRun({ text: "ANS: B", bold: true })] }),
                new Paragraph({ children: [new TextRun({ text: "PTS: 1", color: "888888" })] }),

                // Question 2
                new Paragraph({ spacing: { before: 180 }, children: [new TextRun({ text: "2. The Saturday train timetable shows departure from South Bank at 13:50 and arrival at Domestic Airport at 14:25. What is the total travel duration?", bold: true })] }),
                new Paragraph({ children: [new TextRun("A) 25 minutes")] }),
                new Paragraph({ children: [new TextRun("B) 30 minutes")] }),
                new Paragraph({ children: [new TextRun("C) 35 minutes")] }),
                new Paragraph({ children: [new TextRun("D) 40 minutes")] }),
                new Paragraph({ children: [new TextRun({ text: "ANS: C", bold: true })] }),
                new Paragraph({ children: [new TextRun({ text: "PTS: 1", color: "888888" })] }),

                // Question 3
                new Paragraph({ spacing: { before: 180 }, children: [new TextRun({ text: "3. How long does the 12:50 train service take to travel from Central (depart 13:01) to the Domestic Airport (arrive 13:25)?", bold: true })] }),
                new Paragraph({ children: [new TextRun("A) 24 minutes")] }),
                new Paragraph({ children: [new TextRun("B) 25 minutes")] }),
                new Paragraph({ children: [new TextRun("C) 35 minutes")] }),
                new Paragraph({ children: [new TextRun("D) 14 minutes")] }),
                new Paragraph({ children: [new TextRun({ text: "ANS: A", bold: true })] }),
                new Paragraph({ children: [new TextRun({ text: "PTS: 1", color: "888888" })] }),

                // Question 4
                new Paragraph({ spacing: { before: 180 }, children: [new TextRun({ text: "4. A bus departs Flinders St at 12:52 and takes 14 minutes to travel to Camberwell stop. If the next bus departs exactly 10 minutes later (13:02), at what time will the next bus arrive at Camberwell?", bold: true })] }),
                new Paragraph({ children: [new TextRun("A) 13:06")] }),
                new Paragraph({ children: [new TextRun("B) 13:12")] }),
                new Paragraph({ children: [new TextRun("C) 13:16")] }),
                new Paragraph({ children: [new TextRun("D) 13:26")] }),
                new Paragraph({ children: [new TextRun({ text: "ANS: C", bold: true })] }), // Wait, 13:02 + 14 = 13:16. That is correct! Let's check textbook: 13:12 bus arrives at Camberwell 13:26. Yes, 13:02 bus arrives Camberwell at 13:16!
                new Paragraph({ children: [new TextRun({ text: "PTS: 1", color: "888888" })] }),

                // Question 5
                new Paragraph({ spacing: { before: 180 }, children: [new TextRun({ text: "5. The 14:20 Saturday train from South Bank suffers a 12-minute delay at Central station. If its standard arrival time at Domestic Airport is 14:56, what is its new arrival time?", bold: true })] }),
                new Paragraph({ children: [new TextRun("A) 15:00")] }),
                new Paragraph({ children: [new TextRun("B) 15:08")] }),
                new Paragraph({ children: [new TextRun("C) 14:08")] }),
                new Paragraph({ children: [new TextRun("D) 15:12")] }),
                new Paragraph({ children: [new TextRun({ text: "ANS: B", bold: true })] }),
                new Paragraph({ children: [new TextRun({ text: "PTS: 1", color: "888888" })] })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(OUTPUT_DIR, 'Lesson_Time_Timetables_Assessment.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log('✅ Assessment DOCX successfully compiled.');
}

// --- COMPILE ALL RESOURCES ---
async function compileAll() {
    try {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        buildPresentationHTML();
        await buildHandoutDOCX();
        await buildAssessmentDOCX();
        console.log('🎉 SUCCESS: All Lesson Pack resources compiled successfully!');
    } catch (err) {
        console.error('❌ Compilation failed:', err);
    }
}

compileAll();
