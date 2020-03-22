// Positive and negative mod
Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

var camera, scene, renderer;

var isUserInteracting = false,
    lon = 0,
    lat = 0,
    phi = 0,
    theta = 0,
    distance = 50,
    onPointerDownPointerX = 0,
    onPointerDownPointerY = 0,
    onPointerDownLon = 0,
    onPointerDownLat = 0,
    // Set two arrays for storing latitude and longitude infos
    lonArray = [],
    latArray = [],
    analysisID,
    userUid,
    userName = '',
    seconds_passed,
    videoElement = document.getElementById('video');

    userUid = window.location.href.split('#')[1];
    // If logged user exists, the video starts
    db.collection('users').doc(userUid).get().then(function (doc) {
        if (doc.exists) {
            userName = doc.data().name;

            // Start with 360 video
            init();
            animate();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

    // Upload lon and lat infos to Firestore every second
    var uploadLonAndLat = setInterval(showLonAndLat, 1000);

function init() {

    var container, mesh;

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    var video = document.getElementById('video');
    video.play();

    var texture = new THREE.VideoTexture(video);
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('wheel', onDocumentMouseWheel, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseDown(event) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

}

function onDocumentMouseMove(event) {

    if (isUserInteracting === true) {

        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

        (lat < -85) ? lat = -85 : '';
        (lat > 85) ? lat = 85 : '';
        
        // Show lat and lon
        document.getElementById('latSection').innerHTML = (lat+85).toFixed(2);
        document.getElementById('lonSection').innerHTML = lon.mod(360).toFixed(2);

    }

}

function onDocumentMouseUp() {

    isUserInteracting = false;

}

function onDocumentMouseWheel(event) {

    distance += event.deltaY * 0.05;

    distance = THREE.MathUtils.clamp(distance, 1, 50);

}

function animate() {

    requestAnimationFrame(animate);
    update();

}

function update() {

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
    camera.position.y = distance * Math.cos(phi);
    camera.position.z = distance * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);

    renderer.render(scene, camera);

}

function showLonAndLat() {

    // Update arrays
    lonArray.push(lon.mod(360).toFixed(2));
    latArray.push((lat+85).toFixed(2));

}

// When video ends, upload data to Firestore
videoElement.onended = function() {

    // Stop array pushing
    clearInterval(uploadLonAndLat);

    // Add arrays to Firestore  
    db.collection('analysis').add({
            user: userName,
            userID: userUid,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            timePassed: videoElement.currentTime,
            lonArray: lonArray,
            latArray: latArray
        })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });


}

// Update seconds_passed variable every second
videoElement.ontimeupdate = function() {
    seconds_passed = parseInt(videoElement.currentTime % 60);
}