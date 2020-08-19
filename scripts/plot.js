var plotElement = document.getElementById('plotElement');
var plotElement2 = document.getElementById('plotElement2');
var latArray = [],
    lonArray = [];

// Load 3D Graph when clicking on button in index.html
function final3DGraph(a, b) {
    var direction = b.id.split('-')[3];
    console.log(direction)
    latArray = [];
    lonArray = [];
    db.collection('analysis').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            lonArray.push(doc.data().lonArray);
            latArray.push(doc.data().latArray);
        });
    
        Plotly.newPlot('3d-graph', [{ // Data
            z: (direction == 'lon') ? lonArray : latArray,
            type: 'surface'
        }], { // Layout
            title: (direction == 'lon') ? 'Longitude 3D Graph' : 'Latitude 3D Graph'
        }).then(function() {
            document.getElementById('preloader').style.display = 'none';
            document.getElementById('3d-graph').style.display = 'block';
        });
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