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
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFileSystem, alertFail);
	
	function gotFileSystem(fileSystem) {
		fileSystem.root.getFile("dummy.html", {create: true, exclusive: false}, gotFileEntry, alertFail);
	}

	function gotFileEntry(fileEntry) {
		var sPath = fileEntry.nativeURL.replace("dummy.html", fileName);
		fileEntry.remove();
		 
		var fileTransfer = new FileTransfer();
		 
		fileTransfer.download(
			fileUrl,
			"file:///storage/extSdCard/Android/data/com.vaintee1.reppu/files/" + fileName,
			function (entry) {
				window.entree = entry;
				window.plugins.fileOpener.open(entry.toURL());
			},
			function (error) {
				alert("Download error source: " + error.source);
				alert("Download error target: " + error.target);
				alert("Upload error code: " + error.code);
				alert("Http status code: " + error.http_status);
			}
		)
	}

	function alertFail(event) {
		alert("Failed getting something: " + event);
	}
}