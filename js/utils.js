function getUser() {	
	try {
		user = JSON.parse(localStorage.user);
		
		if (typeof (user.username) == "undefined" || typeof (user.password) == "undefined") {
			return undefined;
		} 
		
		return user;
	} catch (err) {
		return undefined;
	}
}

function saveUser(user) {
	localStorage.user = JSON.stringify(user);
}

var variableForHoldingBrowserNyahNyah = undefined;

function setBrowser(browser) {
	variableForHoldingBrowserNyahNyah = browser;
}

function getBrowser() {
	return variableForHoldingBrowserNyahNyah;
}