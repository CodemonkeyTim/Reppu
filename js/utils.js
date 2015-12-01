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

function destroyUser() {
	localStorage.user = "";
}

var variableForHoldingBrowserNyahNyah = undefined;

function setBrowser(browser) {
	variableForHoldingBrowserNyahNyah = browser;
}

function getBrowser() {
	return variableForHoldingBrowserNyahNyah;
}

function fileDownloadAndShow(fileUrl, fileName) {
	alert("Into download: " + fileUrl + " - " + fileName);
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFileSystem, alertFail);
}

function gotFileSystem(fileSystem) {
	alert("Got filesystem!");
	
	fileSystem.root.getFile("dummy.html", {create: true, exclusive: false}, gotFileEntry, alertFail);
}

function gotFileEntry(fileEntry) {
	alert("Got file entry!");
	 
	var sPath = fileEntry.fullPath.replace("dummy.html","");
    fileEntry.remove();
	 
	var fileTransfer = new FileTransfer();
	 
	alert("Beginning download...");
	 
	fileTransfer.download(
		fileUrl,
		sPath,
		function (entry) {
			alert("Opening file!");
			window.plugins.fileOpener.open(entry.fullPath);
		},
		function (error) {
			alert("File download failed");
		}
	)
}

function alertFail(event) {
	alert("Failed getting something: " + event);
}