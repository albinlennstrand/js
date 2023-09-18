var lastfmUser = "kmsparkman";
var lastFmApi = "ff537f8a3cfa35e0352a3e042f37d459";

var currentProg = 0;
var currentSong;
var currentArtist;
var currentDuration;
var songTick;
var checkInterval;
var isPaused = 0;

$(document).ready(function() {
	if ($(".play-button-circle")) {
		$(".play-button-circle").click(() => {
			window.open('https://open.spotify.com/user/kaitlin.mcpheeters?si=0ef0fffe53be419f'); 
		});
		$(".play-button-circle").mouseenter(() => {
			$(".play-button-circle").children().first().addClass("playhover");
		});
		$(".play-button-circle").mouseleave(() => {
			$(".play-button-circle").children().first().removeClass("playhover");
		});
	}
	if ($("#playerbar")) {
		checkInterval = setInterval(() => {
			fetchData();
		}, 10000);
		fetchData();
	}

	if ($(".main") && !$(".aboutmain").length) {
		$('.main').fullpage({
			scrollingSpeed: 800,
			controlArrows: true,
			verticalCentered: false,
			responsiveWidth: 972,
			onLeave: function(origin, destination, direction) {
				var slidesContainer = $("#slideSection").find(".fp-slidesContainer");
				if (slidesContainer.length) {
					if (destination == 4) {
						if (!slidesContainer.children().last().hasClass("active")) {
							$(".fp-next").click();
							return false;
						}
					}
					if (destination == 2) {
						if (!slidesContainer.children().first().hasClass("active")) {
							$(".fp-prev").click();
							return false;
						}
					}
				}
			}
		});
		if ($(".fp-next")) {
			$(".fp-next").css("display", "none");
		}
		if ($(".fp-prev")) {
			$(".fp-prev").css("display", "none");
		}
	}
	if ($(".aboutmain")) {
		$(".aboutmain").fullpage({
			scrollingSpeed: 800,
			controlArrows: true,
			verticalCentered: false,
			responsiveWidth: 972,
		});
	}
});

function fetchData() {
    var lastfm_request_url = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + lastfmUser + '&api_key=' + lastFmApi + '&limit=1&format=json';

    var request = new XMLHttpRequest();
    request.open('GET', lastfm_request_url, true);

    request.onload = function() {
        var data = JSON.parse(request.responseText);
        var tracks = data.recenttracks.track;

        if (tracks[0]) {
        	var nowplaying;
        	if ("@attr" in tracks[0]) {
        		nowplaying = tracks[0]['@attr'].nowplaying;
        	}
        	if (nowplaying) {
	        	if (!currentSong || (tracks[0].name != currentSong || isPaused)) {
		        	var songName = tracks[0].name;
		        	var songArtist = tracks[0].artist['#text'];
		        	var songDuration;
		        	$.ajax({
				        url: encodeURI('https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=' + lastFmApi + '&track=' + songName + '&artist=' + songArtist + '&format=json'),
				        beforeSend: function(xhr) {
				             xhr.setRequestHeader("Accept", "application/json");
				             xhr.setRequestHeader("Content-Type", "application/json");
				        }, success: function(data){
				            if (data.track) {
				            	if (data.track.duration > 0) {
				            		songDuration = data.track.duration;
				            	}
				            	if ((currentSong && tracks[0].name != currentSong)) {
									loadPlayer(songArtist, songName, songDuration, 1);
								} else {
									loadPlayer(songArtist, songName, songDuration);
								}
				            } else {
				            	loadPlayer(songArtist, songName, songDuration);
				            }
				        }
					});
				}
				isPaused = 0;
			} else {
				if (!isPaused) {
					var barElm = $("#playerbar");
					var timeLabel = $("#timelabel");
					var songLabel = $("#songtitle");
					isPaused = 1;
					$.ajax({
				        url: encodeURI('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&api_key=' + lastFmApi + '&user=' + lastfmUser + '&limit=10&format=json'),
				        beforeSend: function(xhr) {
				             xhr.setRequestHeader("Accept", "application/json");
				             xhr.setRequestHeader("Content-Type", "application/json");
				        }, success: function(data){
				            if (data.recenttracks.track) {
				            	var songName = data.recenttracks.track[0].name;
					        	var songArtist = data.recenttracks.track[0].artist['#text'];
					        	var songDuration;
					        	$.ajax({
							        url: encodeURI('https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=' + lastFmApi + '&track=' + songName + '&artist=' + songArtist + '&format=json'),
							        beforeSend: function(xhr) {
							             xhr.setRequestHeader("Accept", "application/json");
							             xhr.setRequestHeader("Content-Type", "application/json");
							        }, success: function(data){
							            if (data.track) {
							            	if (data.track.duration > 0) {
							            		songDuration = data.track.duration;
							            	}
							            }
							            loadPlayer(songArtist, songName, songDuration, 0, 1);
							        }
								});
				            }
				        }
					});

					clearInterval(songTick);
				}
			}
        }
    };

    request.onerror = function() {
        throw 'connection error';
    };

    request.send();
}

function loadPlayer(artist, songName, duration, flip, pause) {
	if (!duration || !pause) {
		duration = 190932;
	}

	if (pause && !currentProg || !pause && !currentProg) {
		if (flip) {
			currentProg = duration * (Math.floor(Math.random() * 3) / 100);
		} else {
			currentProg = duration * (Math.floor(Math.random() * 31) / 100);
		}
	}

	if (!pause || !currentSong) {
		currentSong = songName;
		currentArtist = artist;
		currentDuration = duration;
	}

	var timeLeft = currentDuration - currentProg;
	var barPos = (currentProg / currentDuration) * 100;

	var barElm = $("#playerbar");
	var timeLabel = $("#timelabel");
	var songLabel = $("#songtitle");

	var date = new Date(timeLeft);

	var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
	var seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

	barElm.css("width", barPos + "%");
	timeLabel.text("-" + minutes + ":" + seconds);
	songLabel.text(currentArtist + " - " + currentSong);
	
	if (!pause) {
		clearInterval(songTick);
		songTick = setInterval(() => {
			currentProg = currentProg + 1000;
			var timeLeft = duration - currentProg;
			var barPos = (currentProg / duration) * 100;

			var date = new Date(timeLeft);

			var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
			var seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

			barElm.css("width", barPos + "%");
			timeLabel.text("-" + minutes + ":" + seconds);

			if (currentProg > duration) {
				timeLabel.text("-00:00");
				songLabel.text("No song playing");
				setTimeout(() => {
					fetchData();
				}, 1000);
				clearInterval(songTick);
			}
		}, 1000);
	}
}
