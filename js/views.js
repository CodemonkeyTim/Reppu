function CourseListView (params) {
	var self = this;
	
	this.dataSourceUrl = "http://reppu.lamk.fi";
	this.courses = [];
	
	if (typeof (params) != "undefined") {
		if (typeof(params.prev) != "undefined") {
			this.prevView = prev;
		}
	}
	
	this.init = function () {
		$("#app-container").html("");
		$("#reppu-data-container").html("");
		
		$.get(self.dataSourceUrl, function (data) {
			$("#reppu-data-container").html($.parseHTML(data));
			
			$("#app-container").load("templates/courselist.html", function () {
				
				$("#reppu-data-container").find(".block_course_list li a").each(function (index, item) {
					$("#course-list").append("<button class='btn btn-lg btn-block btn-info course-item' data-href='" + $(item).attr("href") + "'>" + $(item).text()  + "</button>")
				});
				
				$(".course-item").on("click", function () {
					var href = $(this).attr("data-href");
			
					var courseId = href.substr(href.indexOf("id") + 3);
					
					getBrowser().browseTo("course", {courseId: courseId});
				});
				
				$("#loader-container").hide();
			});
		});
	}
}

function CourseView (params) {
	var self = this;
	this.courseId = undefined;
	this.dataSourceUrl = "http://reppu.lamk.fi/course/view.php?id=";
	
	if (typeof (params) != "undefined") {
		if (typeof(params.prev) != "undefined") {
			this.prevView = prev;
		}
		
		if (typeof(params.courseId) != "undefined") {
			this.courseId = params.courseId;
		}
	}
	
	this.init = function (){
		$("#app-container").html("");
		$("#reppu-data-container").html("");
		
		if (self.courseId == undefined || isNaN(self.courseId)) {
			$("#app-container").html("<h1>Error - No valid course id set.</h1>");
			return;
		}
		
		$.get(self.dataSourceUrl + self.courseId, function (data) {
			var reppuHtml = $.parseHTML(data);
			
			$("#reppu-data-container").html(reppuHtml);
			$("#reppu-data-container").find("link").remove(); //Not importing css from reppu. Yuck!
			$("#reppu-data-container").find("script").remove(); //Nor scripts.
			
			$("#app-container").load("templates/course.html", function () {
				$("#course-header").html($("#reppu-data-container").find("h1.coursetitle").text());
				//var html = $("#reppu-data-container").find(".course-content").html();
				var html = "";
				
				$("#reppu-data-container [id^=section-]").each(function (index, item) {
					if ($(item).hasClass("section-summary")) {
						//html += "<button class='btn btn-block btn-lg btn-warning' data-href='" + $(item).find(".section-title a").attr("href") + "'>" + $(item).find(".section-title a").text() + "</button>";
					} else {
						var header = "<h2 class='text-center'>" + $(item).find(".sectionname").text() + "</h2>";
						var summary = "<div class='summary-container'>" + $(item).find(".summary").html() + "</div>";
						var section = "<div class='section-container'>";

						$(item).find("li.activity").each(function (index, activity) {
							if ($(activity).hasClass("label")) {
								section += $(activity).html();
							} else {
								var btnText = $(activity).find(".instancename").clone().children().remove().end().text(); //Looks complicated but it's just to get the text of an element and not the text of its child elements
								var linkHref = $(activity).find("a").attr("href");
								var imgSrc = $(activity).find("img").attr("src");
								var type = $(activity).find(".accesshide").first().text().trim();
								
								section += "<button class='btn btn-info btn-block btn-lg' data-type='" + type + "' data-href='" + linkHref	+ "'><img src='" + imgSrc + "' /><span>" + btnText + "</span></button>";
							}
						});
						
						section += "</div>";
						
						html += header + summary + section;
					}
				});
				
				$("#course-content-container").html(html);
				$("#loader-container").hide();
				
				$(".btn").each(function (index, item) {
					var type = $(item).data("type");
					
					if (type == "Tiedosto" || type == "File") {
						window.open("www.google.com", "_blank", "location=no");
						
						/*
						$.get($(item).data("href"), function (response) {
							console.log(index);
							
							var html = $.parseHTML(response);
							
							$("body").append("<div class='file-response' id='file-data-" + index + "' style='display: none;'></div>");
							
							var dataElement = $(".file-response#file-data-" + index);
							
							dataElement.html(html);
							
							dataElement.find("link").remove();
							dataElement.find("script").remove();
							var fileUrl = dataElement.find(".resourceworkaround a").attr("href");
							var fileName = fileUrl.substr(fileUrl.lastIndexOf("/") + 1, fileUrl.length);
							
							$(item).on('click', function () {
								fileDownload(fileUrl, fileName)
							});
						});
						*/
					}
				});
			});
		});
		
		
	}
}

function LoginView (params) {
	var self = this;
	
	if (typeof (params) != "undefined") {
		if (typeof(params.prev) != "undefined") {
			this.prevView = prev;
		}
	}
	
	this.init = function () {
		$("#app-container").html("");
		$("#reppu-data-container").html("");
		
		$("#app-container").load("templates/login.html", function () {
			$("#loader-container").hide();
			
			$("#login-btn").click(function () {
				var user = {};
				
				user.username = $("#username-field").val();
				user.password = $("#password-field").val();
				
				var fd = new FormData();
				fd.append('username', user.username);
				fd.append('password', user.password);

				$.ajax({
					url: 'https://reppu.lamk.fi/login/index.php',
					data: fd,
					processData: false,
					contentType: false,
					type: 'POST',
					success: function(data) {
						saveUser(user);
						
						getBrowser().browseTo("courselist");
					}, 
					error: function () {
						$("#invalid-credentials").fadeIn();
					}
				});
			});
		});
	}
}

//************** GENERAL VIEW OBJECTS *************//

function ViewBrowser() {
	var self = this;
	
	this.activeView = undefined;
	
	this.browseTo = function(viewName, params) {
		$("#loader-container").show();
		
		var view = viewFactory(viewName, params);
		
		if (viewName == "login") {
			$("#nav-user-btn").attr("disabled", "true");
			view.prev = undefined;
			view.init();
			return;
		}
		
		if (self.activeView != undefined) {
			view.prev = self.activeView;
		}
		
		$("#nav-prev-btn").removeAttr("disabled");
		$("#nav-user-btn").removeAttr("disabled");
		
		self.activeView = view;
		view.init();
	}
	
	this.browseToPrevious = function () {
		$("#loader-container").show();
		
		if (self.activeView != undefined && self.activeView.prev != undefined) {
			self.activeView = self.activeView.prev;
			self.activeView.init();
			
			if (self.activeView.prev == undefined) {
				$("#nav-prev-btn").attr("disabled", "true");
			}
		} else {
			
		}
	}
}

function viewFactory(viewName, params) {
	var returnable = undefined;
	
	switch(viewName) {
		case ("login"): returnable = new LoginView(params); break;
		case ("courselist"): returnable = new CourseListView(params); break;
		case ("course"): returnable = new CourseView(params); break;
	}
	
	return returnable;
}