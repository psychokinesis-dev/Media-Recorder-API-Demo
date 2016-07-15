'use strict';

var videoElement = document.querySelector('video');
var dataElement = document.querySelector('#data');

if (getBrowser() !== "Chrome") {
	alert('此页面目前仅支持 Chrome 浏览器访问。');
}

videoElement.controls = false;

var requestInterval = 10000;
var nodes = [{"host": "115.28.162.82", "dhtPort": 8181, "proxyPort": 18181}];


var requestNode = null;

if (nodes.length > 0) {
	requestNode = nodes[Math.floor(Math.random() * nodes.length)];

	var query = location.search.split('domain=');
	if (query.length > 1) {
		var domain = query[1];
		var domainElement = document.querySelector('#domain');
		domainElement.value = domain;

		play(genMetaURL(domain));
	} else {
		log('Psychokinesis is ready.');
	}
} else {
	log('Psychokinesis entry nodelist is empty!');
}


function onBtnStartClicked() {
	var domainElement = document.querySelector('#domain');
	var domain = domainElement.value;

	if (domain && domain.length > 0) {
		play(genMetaURL(domain));
	} else {
		log('Domain is empty!');
	}
}


var requestIntervalRef = null;
var playRef = null;
var videoBlob = null;


function play(metaURL) {
	if (requestIntervalRef) clearInterval(requestIntervalRef);
	if (playRef) {
		videoElement.pause();
		clearTimeout(playRef);
	}

	videoBlob = null;
	var requestFun = function () {
		var blob = null;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', metaURL);
		xhr.responseType = "blob";
		xhr.onload = function () {
			var status = xhr.status;
			if (status == 200) {
				var url = window.URL || window.webkitURL;
				videoBlob = url.createObjectURL(xhr.response);
			} else {
				log('request video failed:' + status);
			}
		}
		xhr.send();
	};

	requestIntervalRef = setInterval(requestFun, requestInterval);

	var tryPlayFun = function () {
		if (videoBlob) {
			videoElement.src = videoBlob;
			videoElement.play();

			videoElement.onended = function (e) {
				videoElement.src = videoBlob;
				videoElement.play();
			};
		} else {
			log('request video failed. Wait a moment ...');

			playRef = setTimeout(tryPlayFun, requestInterval);
		}
	};

	playRef = setTimeout(tryPlayFun, requestInterval / 2);

	requestFun();
}


function log(message) {
	dataElement.innerHTML = dataElement.innerHTML + '<br>' + message;
}


function genMetaURL(domain) {
	return 'http://' + requestNode.host + ':' + requestNode.dhtPort + '/' + domain + '/live';
}


//browser ID
function getBrowser(){
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
		   (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}


	return browserName;
}