# 360° VIDEO ANALYSIS

#### Using Firebase functionalities

## Introduction

The goal of the project is to create a web platform where users can sign up and watch 360° videos.
Videos information are then acquired and stored in a database, so users can access them after the
video visualization and download them in order to perform some analysis.

The final user of the platform is not the consumer that just wants to watch 360° videos; the platform
is instead finalized to collecting useful information, so it is addressed to researchers and people who
work in the 360° videos environment for test and analysis purposes.

## Tools

HTML and JavaScript are used to create the platform; in addition, various tools will be used:

### Firestore

Cloud Firestore is a flexible, scalable database for mobile, web and server development from Firebase
and Google Cloud Platform. It is used for the back-end side of the platform.

### Three.js

Three.js is a cross-browser JavaScript library and application programming interface (API) used to
create and display animated 3D computer graphics in a web browser. Three.js uses WebGL. The source
code is hosted in a repository on GitHub. It is used to generate the 360° Video object.

### Plotly.js

Plotly.js is a high-level, declarative charting library. plotly.js ships with over 40 chart types, including
3D charts, statistical graphs, and SVG maps. It will be used to generate some graphs regarding the data
collected with video watching.


## Database structure

Firestore database has two main collections: analysis and users. Users collection contains all the
information about a registered user. Analysis collection contains analysis documents; every document
contains:

- user: the name of the user who watched the 360° video, taken from the Users collection.
- userID: the ID of the user who watched the 360° video, taken from the Users collection.
- timePassed: reference to the time passed watching the video.
- date: timestamp of the moment of the saving process.
- lonArray: array containing the longitude data.
- latArray: array containing the latitude data.

Firestore Auth utility is used to signup new users and manage login and logout features.


## Front-end structure

The platform consists in two html files: index.html, used to show users the data acquired and the
analysis graphs, and video.html, used to let the user see the video and collect information.

### index.html

The head portion of the file consists in three links to different stylesheets, some meta tags and the
title of the page.

In the body portion there are:

- Navbar element containing the platform logo and some buttons to login or logout.
- Four modals – login, signup, user info and video choosing.
- Collapsible elements presenting the various information acquired by watching the video.
- Buttons to switch html file or see graphs.
- Some scripts for Firestore, authentication, graphs.

### video.html

The video.html file consists in loading and reproducing the 360° video. A box is shown on the left top
of the screen to show the user the actual coordinates; latitude can be set in the interval [0, 170], while
longitude can be set in the interval [ 0 , 360 ].

At the end of the video, a modal is opened and, in 5 seconds, the user will be redirected to the home
page.

### JavaScript files

Five JavaScript files are used to make the platform work: auth.js, plot.js, setup.js, three.js and video_settings.js

#### auth.js

This file contains the fundamental functions to manage the user login, logout and signup. All the
functions refer to the corresponding form and use some built-in Firebase Authentication functions.

#### plot.js

This file is used to create graphs; it consists in two functions: final3DGraph() and loadGraphs().

final3DGraph() takes two parameters as input and all the information from the “analysis” collection in
Firestore and creates two main arrays, using them to plot a complete 3D graph showing latitude or
longitude data.

loadGraph() takes three parameters as input and is called when a collapsible element is opened. The
function plots two 2D graphs inside the collapsible content, showing the evolution of latitude and
longitude during time.

#### setup.js

This file contains the setup functions for the UI and the Materialize components used in the platform.
It also contains the exportCSV() function, that creates a CSV of the data collected in a single analysis
document. It is activated when the button “Export in CSV” inside a collapsible element is pressed.

#### three.js

The three.js file is entirely taken from the Three.js framework documentation. It is used to load the
framework functionalities.

#### video_settings.js

This file is taken from the Three.js documentation regarding 360° videos, with some modifies. [^5 ]

A positive and negative mod is added to correctly display and store the latitude and longitude
information. 
A control on the logged user is used to start reproducing the video.
An interval is set to upload longitude and latitude information every second:
Some other corrections are made inside the onMouseMove Three.js functions to correctly show
latitude and longitude information.

### CSS file

A simple style.css file is used to correctly render the info box in the video.html file. All the other style
characteristics are made using Materialize framework.

### Assets

The Assets folder contains the platform logo and the 360° video files.


## Using the platform

Using the platform is quite simple. The user can register using the Sign-Up button or login – if already
registered – using the Login button.

When the user is logged in, he can see all the analysis made by him and other users, ordered by date.


He can select an analysis and look at the data collected, with two helpful graphs. He can also export
the information in a CSV file.

At the end of the page, he can choose to watch the video collecting new information or to see a
complete 3D graph, showing how all users watch the video and what coordinates are the most visited.


## Security rules

Some security rules are applied with to avoid issues in the platform. Using the tools provided by
Firestore, a user can see other user documents, but he cannot upload or delete them.


    rules_version = '2';

    service cloud.firestore {
        match /databases/{database}/documents {
            // Any logged user can see others, but only the creator can update or delete himself
            match /users/{userId} {
                allow read, create: if request.auth.uid != null;
               allow update, delete: if request.auth.uid ==    userId;
            }
            // Any logged user can add an analysis, but only the creator can update or delete his doc
            match /analysis/{analysisId} {
                allow create, read: if request.auth.uid != null;
                allow update, delete: if resource.data.userID == request.auth.uid;
            }
        }
    }


## Future steps

Some modifies can be applied to make the platform completer and more reliable:

- A selection of 360° videos instead of only one. In this case, it is necessary to provide both a
    .webm and a .mp4 file of the 360° video, as the example. Firebase Storage component can be
    used in order to store videos.
- The possibility to filter the analysis in the user dashboard.
- The possibility to create more graphs, client-side, export them or upload to Firestore.

These modifies rely on the specific use case of the platform, based on the domain in which the
platform will be deployed.