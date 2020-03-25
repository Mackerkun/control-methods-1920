var userUid,
	userName;

// listen for auth status changes
auth.onAuthStateChanged(user => {
	if (user) {
		userUid = user.uid;
		db.collection('analysis').orderBy('date').onSnapshot(snapshot => {
			setupAnalysis(snapshot.docs);
			setupUI(user);
		}, err => console.log(err.message));
	} else {
		userUid = '';
		setupUI();
		setupAnalysis([]);
	}
});

// signup
const signupForm = document.querySelector('#signup-form');
if (signupForm) {
	signupForm.addEventListener('submit', (e) => {
		e.preventDefault();
	
		// get user info
		const email = signupForm['signup-email'].value;
		const password = signupForm['signup-password'].value;

		// sign up the user & add firestore data
		auth.createUserWithEmailAndPassword(email, password).then(cred => {
			return db.collection('users').doc(cred.user.uid).set({
				name: signupForm['signup-name'].value
			});
		}).then(() => {
			userName = signupForm['signup-name'].value;
			// close the signup modal & reset form
			const modal = document.querySelector('#modal-signup');
			M.Modal.getInstance(modal).close();
			signupForm.reset();
		});
	});
};

// logout
const logout = document.querySelector('#logout');
if (logout) {
	logout.addEventListener('click', (e) => {
		e.preventDefault();
		auth.signOut();
	});
};

// login
const loginForm = document.querySelector('#login-form');
if (loginForm) {
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
	
		// get user info
		const email = loginForm['login-email'].value;
		const password = loginForm['login-password'].value;
	
		// log the user in
		auth.signInWithEmailAndPassword(email, password).then((cred) => {
			// close the signup modal & reset form
			const modal = document.querySelector('#modal-login');
			M.Modal.getInstance(modal).close();
			loginForm.reset();
			location.reload();
		}, err => alert(err.message));
	
	});
};