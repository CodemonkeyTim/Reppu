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
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function () {
		alert("Into success function of requestFileSystem");
		
		fileSystem.root.getFile("dummy.html", {create: true, exclusive: false}, function () {
			alert("Into getFile.");
			
			var sPath = fileEntry.fullPath.replace("dummy.html","");
			var fileTransfer = new FileTransfer();
			fileEntry.remove();

			alert("fileEntry remover, fileTransfer created.");
			
			fileTransfer.download(fileUrl, sPath + fileName, function(theFile) {
				alert("Downloaded succssfully. Trying to open...");
				window.plugins.fileOpener.open(theFile.toURI());
				alert("Should have opened the file...");
			},
			function(error) {
				alert("Error in download.");
				
				console.log("download error source " + error.source);
				console.log("download error target " + error.target);
				console.log("upload error code: " + error.code);
			},
			fileDownloadFail
			);
		}, 
		fileDownloadFail
		);
	});
}

function fileDownload(event) {
	alert("File download error: " + evt.target.error.code);
}