var plotElement = document.getElementById('plotElement');
var plotElement2 = document.getElementById('plotElement2');
var latArray = [],
    lonArray = [];

db.collection('analysis').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        lonArray = lonArray.concat(doc.data().lonArray);
        latArray = latArray.concat(doc.data().latArray);
    });


});

function loadGraphs(id, latArray, lonArray) {
    Plotly.plot( 'plotElement' + id, [{
        x: [1,2,3,4,5,6,7],
        y: latArray }], { 
        margin: { t: 0 } }, {showSendToCloud:true} );

    Plotly.plot( 'plotElement2' + id, [{
        x: [1,2,3,4,5,6,7],
        y: lonArray }], { 
        margin: { t: 0 } }, {showSendToCloud:true} );
}