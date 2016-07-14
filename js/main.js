'use strict';

var videoElement = document.querySelector('video');
var dataElement = document.querySelector('#data');

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