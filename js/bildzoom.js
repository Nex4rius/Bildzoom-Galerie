// Bildzoom Galerie Plugin von Nexarius
// Benötigt JQuery; Font Awesome
// Version 1.2.4
"use strict";
var bildzoom = [];

function bildzoom_init(element, bilderliste) {
	bildzoom["element"] = element;
	bildzoom["liste"] = bilderliste;
	$(document).ready(function() {
		$("body").append(`
		<div id="bildzoom_container">
			<div id="bildzoom_links"><i class="fa fa-angle-left"></i></div>
			<div id="bildzoom_rechts"><i class="fa fa-angle-right"></i></div>
			<img src="#" id="bildzoom" />
			<img src="#" id="bildzoom_2" />
			<div id="bildzoom_abdunkeln"></div>
		</div>
		<style>
		#bildzoom_container {
			z-index: 999999999999999999999;
			width:100vw;
			height:100vh;
		}
		#bildzoom_links,
		#bildzoom_rechts,
		#bildzoom_abdunkeln,
		#bildzoom,
		#bildzoom_2 {
			display:none;
		}
		#bildzoom_abdunkeln,
		#bildzoom,
		#bildzoom_2 {
			position:fixed;
			top:0;
			left:0;
			width:100vw;
			height:100vh;
		}
		#bildzoom,
		#bildzoom_2 {
			cursor: zoom-out;
			box-sizing: border-box;
			padding:5vh 7vw;
			object-fit: contain;
			z-index:5;
		}
		#bildzoom_2 {
			z-index:6;
		}
		#bildzoom_abdunkeln {
			cursor: zoom-out;
			background:black;
			opacity:0.5;
			z-index:0;
		}
		#bildzoom_links,
		#bildzoom_rechts {
			z-index:10;
			position:fixed;
			top:40vh;
			height:22vh;
			width:10vh;
			font-size:15vh;
			color:white;
			text-align:center;
			transition:0.2s ease;
		}
		#bildzoom_links:hover,
		#bildzoom_rechts:hover {
			transform:scale(1.1);
			color:#8888ff;
		}
		#bildzoom_links {
			cursor: pointer;
			left:2.5vh;
		}
		#bildzoom_rechts {
			cursor: pointer;
			right:2.5vh;
		}
		</style>`);
	
		$(document).on("click", "#bildzoom_links", function () { // Bildergaleriezoom links
			bildzoom["nummer"] = (bildzoom["nummer"] === 0 ? bildzoom["liste"].length : bildzoom["nummer"]) - 1;
			bildzoom_auswahl(bildzoom["nummer"]);
		});
	
		$(document).on("click", "#bildzoom_rechts", function () { // Bildergaleriezoom rechts
			bildzoom["nummer"] = bildzoom["nummer"] >= bildzoom["liste"].length - 1 ? 0 : bildzoom["nummer"] + 1;
			bildzoom_auswahl(bildzoom["nummer"]);
		});
	
		$(document).on("click", bildzoom["element"], bildzoom_klick);

		setTimeout(function() {
			bildzoom["vorladen"] = [];
			for (var i = 0, len = bildzoom["liste"].length; i < len; i++) {
				bildzoom["vorladen"][i] = new Image();
				bildzoom["vorladen"][i].src = bildzoom["liste"][i].url;
			}
		}, 5000); // Warten um nicht das Laden der anfangs sichtbaren Teile der Website zu verlangsamen
	});
}

function bildzoom_klick() {
	$(document).off("click", bildzoom["element"], bildzoom_klick);
	if (bildzoom["liste"].length <= 1) {
		$("#bildzoom_links").remove();
		$("#bildzoom_rechts").remove();
	}
	var link = $(this).attr("src");
	var breite = $(this).width();
	var hoch = $(this).height();
	var oben = $(this).offset().top - $(document).scrollTop();
	var links = $(this).offset().left;
	for (var i = 0; i < bildzoom["liste"].length; i++) {
		if (bildzoom["liste"][i].url === link) {
			bildzoom_auswahl(i);
			var bildergaleriezoom = ["#bildzoom_links", "#bildzoom_rechts", "#bildzoom_abdunkeln", "#bildzoom_container i"];
			for (var j = 0; j < bildergaleriezoom.length; j++) $(bildergaleriezoom[j]).fadeIn();
			$("#bildzoom").css({"height" : hoch, "width" : breite, "top" : oben, "left" : links, "padding" : 0, "cursor" : "default"}).show();
			setTimeout(function() {
				$("#bildzoom").css("transition", "1s ease");
				setTimeout(function() {
					$("#bildzoom").css({"height" : "100vh", "width" : "100vw", "top" : 0, "left" : 0, "padding" : "5vh 7vw"});
					setTimeout(function() {
						$("#bildzoom").css({"transition" : "unset", "cursor" : "zoom-out"});
						$(document).on("click", "#bildzoom_abdunkeln", bildzoom_aus);
						$(document).on("click", "#bildzoom", bildzoom_aus);
					}, 1000);
				}, 10);
			}, 10);
			break;
		}
	}
}

function bildzoom_auswahl(i) {
	bildzoom["nummer"] = i;
	$("#bildzoom_2").attr("src", bildzoom["liste"][bildzoom["nummer"]].url).stop().fadeIn();
	$("#bildzoom").stop().fadeOut(function() {
		$("#bildzoom").attr("src", $("#bildzoom_2").attr("src")).stop().show();
		$("#bildzoom_2").hide();
	});
}

function bildzoom_aus() { // Bildergaleriezoom Zurück
	$(document).off("click", "#bildzoom_abdunkeln", bildzoom_aus);
	$(document).off("click", "#bildzoom", bildzoom_aus);
	var a = $(bildzoom["element"]+'[src="'+$("#bildzoom").attr("src")+'"]');
	if (a.length > 0) {
		var breite = a.width();
		var hoch = a.height();
		var oben = a.offset().top - $(document).scrollTop();
		var links = a.offset().left;
		$("#bildzoom_container *:not(#bildzoom)").fadeOut();
		$("#bildzoom").css({"height" : "100vh", "width" : "100vw", "top" : 0, "left" : 0, "padding" : "5vh 7vw"}).animate({"height" : hoch, "width" : breite, "top" : oben, "left" : links, "padding" : 0}, "slow").fadeOut(10, function() {
			$(document).on("click", bildzoom["element"], bildzoom_klick);
		});
	} else {
		$("#bildzoom_container *").fadeOut();
		$(document).on("click", bildzoom["element"], bildzoom_klick);
	}
}
