// DOM elements
const analysisList = (document.querySelector('.analysis')) ? document.querySelector('.analysis') : '';
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupUI = (user) => {
	if (user) {
		// Account info
		db.collection('users').doc(user.uid).get().then(doc => {
			const html = `
				<div>Hi ${doc.data().name}</div>
				<div>Logged in as ${user.email}</div>
			`;
			(accountDetails) ? accountDetails.innerHTML = html: '';
		});
		// Toggle user UI elements
		loggedInLinks.forEach(item => item.style.display = 'block');
		loggedOutLinks.forEach(item => item.style.display = 'none');
	} else {
		// Clear account info
		accountDetails.innerHTML = '';
		// Toggle user elements
		loggedInLinks.forEach(item => item.style.display = 'none');
		loggedOutLinks.forEach(item => item.style.display = 'block');
	}
};

// Setup analysis
const setupAnalysis = (data) => {

	let html = '';
	if (data.length) {
		data.forEach(doc => {
			const analysis = doc.data();

			// Get date in correct format
			var analysisDate = doc.data().date.toDate();
			analysisDate = analysisDate.getDate() + '/' + String(Number(analysisDate.getMonth()) + 1) + '/' + analysisDate.getFullYear();

			// Get infos about latitude and longitude


			// Create li element
			const li = `
				<li>
					<div class="collapsible-header grey lighten-4" onclick="loadGraphs('${doc.id}', [${analysis.latArray}], [${analysis.lonArray}])">Analysis created on ${analysisDate} by ${analysis.user}</div>
					<div class="collapsible-body white">
						<div class="row">
							<div class="col s12">
								<div>Longitude array: ${analysis.lonArray}</div>
							</div>
							<div class="col s12">
								<div>Latitude array: ${analysis.latArray}</div>
							</div>
						</div>
						<div class="row">
							<div class="col s6">
								<div id="plotElement${doc.id}"></div>
							</div>
							<div class="col s6">
								<div id="plotElement2${doc.id}"></div>
							</div>	
						</div>
						<div class="row">						
							<a class="waves-effect waves-light btn download-csv" title="${doc.id}" style="margin-top: 10px">Export in CSV</a>
						</div>
					</div>
				</li>
			`;
			html += li;
		});
	} else {
		document.getElementById('analysis-title-h5').innerHTML = 'No data analysis available';
	};

	html += `<a class="waves-effect waves-light btn right" id="play-video-button" href="video.html#${userUid}" target="_blank" style="margin-top: 10px"><i class="material-icons left">video_library</i>Play video</a>`;
	(userUid) ? analysisList.innerHTML = html : '';
	exportCSV();

};

// Setup Materialize components
document.addEventListener('DOMContentLoaded', function () {

	var modals = document.querySelectorAll('.modal');
	M.Modal.init(modals);

	var items = document.querySelectorAll('.collapsible');
	M.Collapsible.init(items);

});

function exportCSV() {
	document.querySelectorAll('.download-csv').forEach(function(elem) {
		elem.addEventListener('click', function() {
			var document = elem.getAttribute('title');
			db.collection('analysis').doc(document).get().then(function(doc) {
				if (doc.exists) {
					const rows = [doc.data().lonArray, doc.data().latArray];
					let csvContent = rows.map(e => e.join(",")).join("\n");
					var link = window.document.createElement("a");
					link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent));
					link.setAttribute("download", "360_video_data.csv");
					link.click();
				} else {
					// doc.data() will be undefined in this case
					console.log("No such document!");
				}
			}).catch(function(error) {
				console.log("Error getting document:", error);
			});
		});
	});
}


