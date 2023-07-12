var Webflow = Webflow || [];
var lottie;


var currentuserid;
var interactData;
var activePlayer;
var hasClosed = 0;

Webflow.push(function() {
	lottie = window.Webflow.require("lottie").lottie;
	$(window).trigger('aviload');

	window.addEventListener('resize', function() {
	    window.Webflow.require("lottie").lottie.resize();
	});

	var urlParam = window.location.hash.substr(1);
	if (urlParam) {
		if ($("#" + urlParam).length) {
			$([document.documentElement, document.body]).animate({
		        scrollTop: $("#" + urlParam).offset().top
		    }, 1200);
			$("#" + urlParam).click();
		}
	}

	$(window).ready(() => {
		window.$memberstackDom.getCurrentMember().then(({ data : member }) => {
	     if(member) {
	      currentuserid = member.id;
	      var memberData;
	      window.$memberstackDom.getMemberJSON().then(({ data : json }) => {
	      	interactData = json;
	      	if (Object.keys(interactData).length < 1) {
	      		interactData = {};
	      	}
	      	$(window).trigger('aviinteract');
	      });
		 }
		});

		if ($(".q-btn").length) {
			$(".q-btn").each((k, v) => {
				if ($(v).attr("id")) {
					var thisId = $(v).attr("id");
					$(window).on("aviinteract", () => {
						if (currentuserid) {
							if (thisId in interactData) {
								if (interactData[thisId] > 0) {
									$("#" + thisId).find(".qseen1").addClass("active");
								}
								if (interactData[thisId] > 1) {
									$("#" + thisId).find(".qseen2").addClass("active");
								}
								if (interactData[thisId] > 2) {
									$("#" + thisId).find(".qseen3").addClass("active");
								}
							}
						}
					});
				}
			});
			$(".q-btn").click((e) => {
				var thisId = $(e.currentTarget).attr("id");
				setTimeout(() => {
					if (thisId in interactData) {
						if (interactData[thisId] == 1) {
							interactData[thisId] = 2;
						} else if (interactData[thisId] == 2) {
							interactData[thisId] = 3;
						}
					} else {
						interactData[thisId] = 1;
					}
					$("#int_body").val(JSON.stringify(interactData));
					$("#user_id").val(currentuserid);
					$("#int_target").val(thisId);
					$("#cms_id").val(currentuserid + "_" + thisId);
					$(window).trigger('aviinteract');
					setTimeout(() => {
						$("#user-x-form").submit();
					}, 20);
				}, 1000)
			});
		}
	});

	$("a").click((e) => {
		if ($(e.currentTarget).attr("destelm")) {
			e.preventDefault();
			if ($(e.currentTarget).attr("target") == "_blank") {
				window.open($(e.currentTarget).attr("href") + "#" + $(e.currentTarget).attr("destelm"), "_blank");
			} else {
				window.location.href = $(e.currentTarget).attr("href") + "#" + $(e.currentTarget).attr("destelm");
			}
		}
	});

	if ($("#aviglobalcontrols").length) {
		var gControls = $("#aviglobalcontrols");

		// $(window).on('scroll', function() {
		// 	if (activePlayer && !hasClosed) {
		// 		var mainaudio = $(".aviaudio[anim='" + activePlayer + "']");
		// 		var controls = mainaudio.parent().parent();
		// 		if (!isInViewport($(controls))) { //controls not in view
		// 			if (gControls.hasClass("hidden-default")) {
		// 				gControls.removeClass("hidden-default");
		// 			}
		// 		} else {
		// 			if (!gControls.hasClass("hidden-default")) {
		// 				gControls.addClass("hidden-default");
		// 			}
		// 		}
		// 	}
		// });

		// $(document).click(() => {
		// 	setTimeout(() => {
		// 		if (activePlayer && !hasClosed) {
		// 			var mainaudio = $(".aviaudio[anim='" + activePlayer + "']");
		// 			var controls = mainaudio.parent().parent();
		// 			if (!isInViewport($(controls))) { //controls not in view
		// 				if (gControls.hasClass("hidden-default")) {
		// 					gControls.removeClass("hidden-default");
		// 				}
		// 			} else {
		// 				if (!gControls.hasClass("hidden-default")) {
		// 					gControls.addClass("hidden-default");
		// 				}
		// 			}
		// 		}
		// 	}, 100);
		// });
	}
});

function isInViewport(elm) {
	var elementTop = $(elm).offset().top;
	var elementBottom = elementTop + $(elm).outerHeight();
	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();
	return elementBottom > viewportTop && elementTop < viewportBottom;
};

var aviLinkPromise = 0;

function createAviLink(player, trigger) {
	var audio = $(".aviaudio[anim='" + player + "']");
	var audioSel = document.querySelectorAll('[anim="' + player + '"]')[0];
	var controls = audio.parent().parent();

	$("#" + trigger).click(() => {
		hasClosed = 1;
		$(window).trigger('aviglobalreset');
		audioSel.play();
		setTimeout(() => {
			$("html, body").animate({ scrollTop: 0 }, 500);
			setTimeout(() => {
				aviLinkPromise = 1;
				controls.find(".main").click();
			}, 1300);
		}, 10);
	});

	$(window).on("aviinteract", () => {
		if (currentuserid) {
			if (player in interactData) {
				if (interactData[player] > 0) {
					$("#" + trigger).find(".firstplay").addClass("active");
				}
				if (interactData[player] > 1) {
					$("#" + trigger).find(".sndplay").addClass("active");
				}
				if (interactData[player] > 2) {
					$("#" + trigger).find(".trdplay").addClass("active");
				}
			}
		}
	});
}

function initAviPlayer(id, autoplay, fixed, metadata) {
	if ($("#" + id).length) {
		var audio = $(".aviaudio[anim='" + id + "']");
		var audioSel = document.querySelectorAll('[anim="' + id + '"]')[0];
		if (audio.length) {
			var controls = audio.parent().parent();
			if (controls.length) {
				var isPlaying = 0;

				var thisMainBtn = controls.find(".main");
				var thisBackBtn = controls.find("._15back");
				var thisForthBtn = controls.find("._30forth");
				var thisReBtn = controls.parent().find(".restart");
				var thisCloseBtn = controls.parent().find(".avifloaterclose");

				var metaArtist;
				var metaTitle;
				var metaImg;

				if (metadata) {
					metaArtist = metadata.artist;
					metaTitle = metadata.title;
					metaImg = metadata.image;
				}

				var gMainBtn;

				function awaitPlay(audioElm, vidElm, doVar) {
					var playMax = 0;
					var playInt = setInterval(() => {
						if (audioElm.duration > 0 && !audioElm.paused && audioElm.readyState > 2) {
							vidElm.play();
							if (doVar) {
								isPlaying = 1;
							}
							clearInterval(playInt);
							thisMainBtn.removeClass("loading");
							thisMainBtn.addClass("playing");
							// if (fixed) {
							// 	gMainBtn.removeClass("loading");
							// 	gMainBtn.addClass("playing");
							// }
						} else {
						}
						playMax++;
						if (playMax > 1000000) {
							clearInterval(playInt);
						}
					}, 10);
					$(window).on("aviwaitreset", () => {
						clearInterval(playInt);
					});
				}

				// var gControls;

				// if (fixed) {
				// 	gControls = $("#aviglobalcontrols");

				// 	gMainBtn = gControls.find(".main");
				// 	var gBackBtn = gControls.find("._15back");
				// 	var gForthBtn = gControls.find("._30forth");
				// 	var gReBtn = gControls.parent().find(".restart");
				// 	var gCloseBtn = gControls.parent().find(".avifloaterclose");
				
				// 	gMainBtn.click(() => {
				// 		if (activePlayer == id) {
				// 			thisMainBtn.click();
				// 		}
				// 	});
				// 	gBackBtn.click(() => {
				// 		if (activePlayer == id) {
				// 			thisBackBtn.click();
				// 		}
				// 	});
				// 	gForthBtn.click(() => {
				// 		if (activePlayer == id) {
				// 			thisForthBtn.click();
				// 		}
				// 	});
				// 	gReBtn.click(() => {
				// 		if (activePlayer == id) {
				// 			thisReBtn.click();
				// 		}
				// 	});
				// 	gCloseBtn.click(() => {
				// 		if (activePlayer == id) {
				// 			thisCloseBtn.click();
				// 		}
				// 	});
				// }

				audioSel.onended = () => {
					if (thisMainBtn.hasClass("playing")) {
						// if (fixed) {
						// 	if (gMainBtn.hasClass("playing")) {
						// 		gMainBtn.removeClass("playing");
						// 	}
						// }
						thisMainBtn.removeClass("playing");
						thisMainBtn.addClass("ended");
						isPlaying = 0;
						if (id in interactData) {
							if (interactData[id] == 1) {
								interactData[id] = 2;
							} else if (interactData[id] == 2) {
								interactData[id] = 3;
							}
						} else {
							interactData[id] = 1;
						}
						$("#int_body").val(JSON.stringify(interactData));
						$("#user_id").val(currentuserid);
						$("#int_target").val(id);
						$("#cms_id").val(currentuserid + "_" + id);
						$(window).trigger('aviinteract');
						setTimeout(() => {
							$("#user-x-form").submit();
						}, 20);
					}
					var lottieAnims = lottie.getRegisteredAnimations();

					$(lottieAnims).each((k, v) => {
						if ($(v)[0].wrapper.id == id) {
							$(v)[0].pause();
						}
					});
				};

				audioSel.onwaiting = () => {
					if (thisMainBtn.hasClass("playing")) {
						var lottieAnims = lottie.getRegisteredAnimations();

						$(lottieAnims).each((k, v) => {
							if ($(v)[0].wrapper.id == id) {
								thisMainBtn.removeClass("playing");
								thisMainBtn.addClass("loading");
								// if (fixed) {
								// 	gMainBtn.removeClass("playing");
								// 	gMainBtn.addClass("loading");
								// }
								$(v)[0].pause();
								awaitPlay(audioSel, $(v)[0]);
							}
						});
					}
				};

				audioSel.ontimeupdate = () => {
					if (thisMainBtn.hasClass("playing")) {
						var lottieAnims = lottie.getRegisteredAnimations();

						$(lottieAnims).each((k, v) => {
							if ($(v)[0].wrapper.id == id) {
								$(v)[0].goToAndPlay((audioSel.currentTime) * 1000, false);
							}
						});
					}
				};


				if (autoplay) {
					$(document).click(() => {
						$(document).unbind('click');
						if (!isPlaying) {
							$(window).trigger('aviglobalreset');
							activePlayer = id;
							isPlaying = 1;
							audioSel.play();
							var lottieAnims = lottie.getRegisteredAnimations();
							var thisLottie;

							$(lottieAnims).each((k, v) => {
								if ($(v)[0].wrapper.id == id) {
									awaitPlay(audioSel, $(v)[0]);
								}
							});
						}
					});
				}

				thisBackBtn.click(() => {
					if (!thisMainBtn.hasClass("loading")) {
						if (thisMainBtn.hasClass("ended")) {
							thisMainBtn.removeClass("ended");
						}
						var lottieAnims = lottie.getRegisteredAnimations();

						$(lottieAnims).each((k, v) => {
							if ($(v)[0].wrapper.id == id) {
								if (audioSel.currentTime - 15 > 0) {
									audioSel.pause();
									audioSel.currentTime = audioSel.currentTime - 15;
									if (thisMainBtn.hasClass("playing")) {
										$(v)[0].goToAndStop((audioSel.currentTime) * 1000, false);
										audioSel.play();
										awaitPlay(audioSel, $(v)[0]);
									} else {
										$(v)[0].goToAndStop((audioSel.currentTime) * 1000, false);
									}
								} else {
									audioSel.currentTime = 0;
									if (thisMainBtn.hasClass("playing")) {
										$(v)[0].goToAndStop(0, false);
										awaitPlay(audioSel, $(v)[0]);
									} else {
										$(v)[0].goToAndStop(0, false);
									}
								}
							}
						});
					}
				});

				thisForthBtn.click(() => {
					if (!thisMainBtn.hasClass("loading")) {
						var lottieAnims = lottie.getRegisteredAnimations();

						$(lottieAnims).each((k, v) => {
							if ($(v)[0].wrapper.id == id) {
								if (audioSel.currentTime + 30 < audioSel.duration) {
									audioSel.pause();
									audioSel.currentTime = audioSel.currentTime + 30;
									if (thisMainBtn.hasClass("playing")) {
										$(v)[0].goToAndStop((audioSel.currentTime) * 1000, false);
										audioSel.play();
										awaitPlay(audioSel, $(v)[0]);
									} else {
										$(v)[0].goToAndStop((audioSel.currentTime) * 1000, false);
									}
								} else {
									if (thisMainBtn.hasClass("playing")) {
										isPlaying = 0;
										thisMainBtn.removeClass("playing");
										// if (fixed) {
										// 	if (gMainBtn.hasClass("playing")) {
										// 		gMainBtn.removeClass("playing");
										// 	}
										// }
										thisMainBtn.addClass("ended")
										$(v)[0].goToAndStop(audioSel.duration * 1000, false);
										if (id in interactData) {
											if (interactData[id] == 1) {
												interactData[id] = 2;
											} else if (interactData[id] == 2) {
												interactData[id] = 3;
											}
										} else {
											interactData[id] = 1;
										}
										$("#int_body").val(JSON.stringify(interactData));
										$("#user_id").val(currentuserid);
										$("#int_target").val(id);
										$("#cms_id").val(currentuserid + "_" + id);
										$(window).trigger('aviinteract');
										setTimeout(() => {
											$("#user-x-form").submit();
										}, 20);
									} else {
										thisMainBtn.addClass("ended")
										$(v)[0].goToAndStop(audioSel.duration * 1000, false);
									}
									audioSel.currentTime = audioSel.duration;
								}
							}
						});
					}
				});

				thisMainBtn.click(function() {
					$(window).trigger('aviwaitreset');
					var lottieAnims = lottie.getRegisteredAnimations();

					$(lottieAnims).each((k, v) => {
						if ($(v)[0].wrapper.id == id) {
							if (isPlaying) {
								audioSel.pause();
								$(v)[0].pause();
								isPlaying = 0;
								thisMainBtn.removeClass("playing");
								// if (fixed) {
								// 	if (gMainBtn.hasClass("playing")) {
								// 		gMainBtn.removeClass("playing");
								// 	}
								// }
							} else {
								if (thisMainBtn.hasClass("ended")) {
									$(v)[0].goToAndStop(0, 1);
									thisMainBtn.removeClass("ended");
								}
								if (hasClosed) {
									hasClosed = 0;
								}
								if (fixed) {
									//activePlayer = id;
								} else {
									hasClosed = 1;
									if ($("#aviglobalcontrols").length) {
										$("#aviglobalcontrols").addClass("hidden-default");
									}
								}
								$(window).trigger('aviglobalreset');
								if (!aviLinkPromise) {
									audioSel.play();
								} else {
									aviLinkPromise = 0;
								}
								awaitPlay(audioSel, $(v)[0], true);
								// if (fixed) {
								// 	if (!gMainBtn.hasClass("loading")) {
								// 		gMainBtn.addClass("loading");
								// 	}
								// }
								thisMainBtn.addClass("loading");

								if (metadata) {
									if ('mediaSession' in navigator) {
									  navigator.mediaSession.metadata = new MediaMetadata({
									    title: metaTitle,
									    artist: metaArtist,
									    artwork: [
									      { src: metaImg,   sizes: '512x512',   type: 'image/png' },
									    ]
									  });
									}
								}

							}
						}
					});
				});

				thisReBtn.click(function() {
					var lottieAnims = lottie.getRegisteredAnimations();

					$(lottieAnims).each((k, v) => {
						if ($(v)[0].wrapper.id == id) {
							if (thisMainBtn.hasClass("ended")) {
								thisMainBtn.removeClass("ended");
							}
							audioSel.currentTime = 0;
							if (isPlaying) {
								$(window).trigger('aviglobalreset');
								activePlayer = id;
								audioSel.play();
								isPlaying = 1;
								thisMainBtn.addClass("playing");
								$(v)[0].goToAndStop(0, 1);
								awaitPlay(audioSel, $(v)[0]);
							} else {
								$(v)[0].goToAndStop(0, 1);
							}
						}
					});
				});

				thisCloseBtn.click(function() {
					var lottieAnims = lottie.getRegisteredAnimations();

					$(lottieAnims).each((k, v) => {
						if ($(v)[0].wrapper.id == id) {
							if (thisMainBtn.hasClass("ended")) {
								thisMainBtn.removeClass("ended");
							}
							audioSel.currentTime = 0;
							if (isPlaying) {
								audioSel.pause();
								isPlaying = 0;
								thisMainBtn.removeClass("playing");
								// if (fixed) {
								// 	if (gMainBtn.hasClass("playing")) {
								// 		gMainBtn.removeClass("playing");
								// 	}
								// }
							}
							$(v)[0].goToAndStop(0, 1);
							audioSel.currentTime = 0;
							hasClosed = 1;
							gControls.addClass("hidden-default");
						}
					});
				});

				$(window).on("aviglobalreset", () => {
					if (isPlaying == 1) {
						isPlaying = 0;
						audioSel.pause();
						audioSel.currentTime = 0;
						var lottieAnims = lottie.getRegisteredAnimations();

						$(lottieAnims).each((k, v) => {
							if ($(v)[0].wrapper.id == id) {
								$(v)[0].goToAndStop(0, 1);
							}
						});
						if (thisMainBtn.hasClass("playing")) {
							thisMainBtn.removeClass("playing");
						}
					}
				});
			} else {
				alert("AviPlayer: Cannot find controls for id: " + id + ".");
			}
		} else {
			alert("AviPlayer: Cannot find audio element for id: " + id + ".");
		}
	} else {
		alert("AviPlayer: Cannot find Lottie animation with id: " + id + ".");
	}
}
