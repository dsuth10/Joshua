For what you are describing, there are three realistic approaches.

1. Embed existing maths tools

This is the fastest route.

GeoGebra

GeoGebra is probably the closest match to what you mean. It supports interactive geometry, graphs, measurement, sliders, constructions, points, angles, shapes, transformations and more. GeoGebra provides app embedding and JavaScript integration for websites.

Good for:

Cartesian planes
Geometry constructions
Angles and protractors
Dynamic diagrams
Dragging points and shapes
Teacher-created interactive tasks

Possible issue: it can feel like “GeoGebra inside your app” rather than a completely custom native part of your app.

Desmos API

Desmos provides an embeddable graphing calculator API. Their documentation describes an embeddable GraphingCalculator element that displays axes, grid lines, equations and points.

Good for:

Cartesian planes
Graphing equations
Plotting points
Sliders
Function exploration

Less ideal for:

Rulers
Protractors
Clocks
Primary-school-style manipulatives
Polypad / Mathigon

Polypad is a virtual manipulatives environment. The Mathigon documentation says its JavaScript API allows interactive Polypad canvases to be added to websites. Polypad has also moved into the Amplify/Desmos Classroom ecosystem.

Good for:

Tiles
Number lines
Geometry pieces
Fractions
Pattern blocks
Virtual manipulatives

Possible issue: you would need to check current licensing, embedding terms and whether it fits your login/data model.

2. Use a maths/geometry JavaScript library and build your own components

This is probably the best long-term approach if you want the app to feel like your product.

JSXGraph

JSXGraph is a JavaScript library for interactive geometry, function plotting, charting and data visualisation in the browser. It works across browsers and supports SVG/canvas rendering.

Good for:

Cartesian planes
Points students can drag
Lines, polygons, angles
Geometry tasks
Coordinate questions
Graph-based answer checking

This would suit a custom maths-question web app very well.

Konva

Konva is a 2D canvas framework for shapes, layers, animation, event handling and drag-and-drop. It supports desktop and mobile interactions.

Good for:

Drag-and-drop rulers
Rotatable protractors
Clocks with draggable hands
Interactive fraction bars
Manipulating objects
Custom-looking student interfaces

This is not maths-specific, but it gives you the building blocks to make high-quality manipulatives.

Fabric.js

Fabric.js gives an interactive object model on top of HTML5 canvas, including object manipulation and SVG/canvas support.

Good for:

Custom draggable tools
Shape manipulation
Rulers, protractors, clocks
Drawing-style interfaces

Konva and Fabric.js are similar choices. I would lean Konva if building a modern React-style student app.

3. Combine custom tools with maths input/checking

For students answering maths questions, you may also need proper maths input, not just visual widgets.

MathLive

MathLive provides a web component for maths input and is aimed at interactive maths quizzes, exercises and problem-solving tools.

Good for:

Fractions
Equations
Powers
Square roots
Algebraic answers
On-screen maths keyboard
More reliable answer entry than plain text boxes

This pairs nicely with a visual component library.

My practical recommendation

For your kind of app, I would not look for one giant “maths widget library” that does everything. I would think in layers:

Need	Best fit
Quick embedded graphing	Desmos
Rich geometry applets	GeoGebra
Virtual manipulatives	Polypad
Custom clocks, rulers, protractors	Konva or Fabric.js
Custom Cartesian planes and geometry	JSXGraph
Student maths input	MathLive


