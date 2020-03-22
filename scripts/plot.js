var plotElement = document.getElementById('plotElement');
var plotElement2 = document.getElementById('plotElement2');
var latArray = [],
    lonArray = [];

// Load 3D Graph when clicking on button in index.html
function final3DGraph() {
    db.collection('analysis').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            lonArray.push(doc.data().lonArray);
            latArray.push(doc.data().latArray);
        });
    
        var final = lonArray;
        final.push(latArray);
        // Create 3D graph
        /* 
        Plotly.plot('3d-graph', [{
            z: final,
            type: 'surface'
        }]) 
        */ 
    });    
}

// Load graphs when opening a collapsible in index.html
function loadGraphs(id, latArray, lonArray) {

    var latDocID = 'plotElement' + id;
    var lonDocID = 'plotElement2' + id;
    var latData = [{
        x: [...Array(9).keys()].slice(1),
        y: latArray 
    }];
    var lonData = [{
        x: [...Array(9).keys()].slice(1),
        y: lonArray 
    }];
    var latLayout = {
        title: 'Latitude',
        xaxis: {
          title: 'Seconds',
          showgrid: false,
          zeroline: false
        },
        yaxis: {
          showline: false
        }
    };
    var lonLayout = {
        title: 'Longitude',
        xaxis: {
          title: 'Seconds',
          showgrid: false,
          zeroline: false
        },
        yaxis: {
          showline: false
        }
    };

    Plotly.react(latDocID, latData, latLayout);
    Plotly.react(lonDocID, lonData, lonLayout);
}