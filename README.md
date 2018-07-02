# VizWick
Project website: [VizWick](https://aaal-e.github.io/VizWick/)

to "run" the tool locally, just open the index.html page.

This project is a website, that can be used for visualising hierarchical data. It allows you to upload data in the [newick format](https://en.wikipedia.org/wiki/Newick_format), and choose between several different options to visualise this data. Currently 5 visualizations exists:
* Acacia Tree
* Diamond Tree
* Froth
* Jester Hat
* Optimized Sunburst

Multiple of these visualisations can be shown side by side, and interactions with the data will be synchronized across them. As it is very difficult to show all data at once, the visualisations will only show part of the data, and allow you to smoothly zoom in and out to reveal more. 

VizWick at it's core is a framework that can be used to easily create different dynamic visualizations. As part of our project, 5 different visualizations have been created. But anyone is free to use this system to add their own visualizations to it. 
Visualizations can both be made in 2D and 3D. Most of our visualisations are in 2d, making use of the [PixiJS library](http://www.pixijs.com/). Acacia Tree is currently the only 3D visualisation and makes use of the [three.js library](https://threejs.org/) . A nice feature of VizWick is that any 3D visualization is immediately useable in VR, making use of WebVR. As of the date of writing his, WebVR is only supported in firefox however. The framework also allows for simple physics, by allowing shapes to be stored in a spatial tree. This means that we can find shapes that are near to each other in less than O(n^2) time, which is crucial to keep performance decent. 

If you want to make your own visualization, please take a look at the files in the test directory. If you finish your visualization and want to add it onto the index.html page, your code must be compiled/transpiled using babel. For that purpose this project contains a [Compile](https://github.com/Aaal-E/VizWick/tree/master/Src/Compiler) script. CompileAll.js can be run using node.js and will compile/transpile all the source files into the files that are used on the index.html page.

This project is created for a course at the [TUe](https://www.tue.nl/) by group D20 with the following members:
* Adrian Vrămuleţ
* Alex Thieme
* Alina Vorobiova
* Denis Shehu
* Mara Miulescu
* Mehrdad Farsadyar
* Tar van Krieken

The course ran from 23-4-2018 until 22-6-2018. At this date VizWick is useable, but some planned features are missing. We will most likely not continue with VizWick ourselves however.
