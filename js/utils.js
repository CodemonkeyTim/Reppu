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

function fileDownload(fileUrl, fileName) {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function () {
		fileSystem.root.getFile("dummy.html", {create: true, exclusive: false}, function () {
			var sPath = fileEntry.fullPath.replace("dummy.html","");
			var fileTransfer = new FileTransfer();
			fileEntry.remove();

			fileTransfer.download(fileUrl, sPath + fileName, 
				function(theFile) {
					console.log("download complete: " + theFile.toURI());
				},
				function(error) {
					console.log("download error source " + error.source);
					console.log("download error target " + error.target);
					console.log("upload error code: " + error.code);
				}
			);
		});
	});
}