  
    $(window).ready(() => {
        aWH = $(".art-wrap").outerHeight();
        aWW = $(".art-wrap").outerWidth();
        
        if (!isMobile) {
          initLightbox();
        } else {
          initMobile();
        }
      
        function closeLightbox() {
          setTimeout(() => {
            $(".lightbox-fade").removeClass("hidden");
            $(".lightbox-wrapper").css("z-index", 900);
            setTimeout(() => {
              if ($(".page-wrapper").length) {
                $(".page-wrapper").removeClass("scrolldis");
              }
              if ($('.embedly-embed').length) {
                $('.embedly-embed').attr('src', function ( i, val ) { return val; });
              }
              $(".lightbox-wrapper").removeClass("active");
              setTimeout(() => {
                $(".lightbox-wrapper").removeAttr("style");
              }, fadeSpeed);
            }, fadeSpeed + (fadeWaitTime / 2));
          }, 100);
        }
        
        $(".close-btn.main").click((e) => {
          if (isMobile) {
            closeInquiry();
          }
          closeLightbox();
        });
        $(".close-btn.inq").click((e) => {
          closeInquiry();
        });
        $(document).keyup(function(e) {
          if (e.key === "Escape") {
            if ($(".inquiry-wrap").hasClass("active")) {
              closeInquiry();
              if (isMobile) {
                closeLightbox(); 
              }
            } else {
              closeLightbox();
            }
          }
          if(e.keyCode == 37 && $(".lightbox-wrapper").hasClass("active")) { // left
            $("#lightbox-prev").click();
          } else if(e.keyCode == 39 && $(".lightbox-wrapper").hasClass("active")) { // right
            $("#lightbox-next").click();
          }
        });
        
        var isTran;
        var aCurs = $(".arrow-cursor");
        $("#lightbox-prev").click(() => {
          var newSlug;
          $.each(Object.keys(lhtImages), (k, v) => {
            if (v == curSlug) {
              if (k == 0) {
                  newSlug = Object.keys(lhtImages)[Object.keys(lhtImages).length - 1];
                } else {
                  newSlug = Object.keys(lhtImages)[(k - 1)];   
                }
            }
          });
          openImage(newSlug);
          aCurs.addClass("transformanim");
          aCurs.addClass("clickanim");
          clearTimeout(mouseTimer);
          mouseTimer = setTimeout(() => {
            curs.removeClass("clickanim");
            mouseTimer = setTimeout(() => {
              aCurs.removeClass("transformanim");
            }, fadeSpeed);
          }, fadeSpeed);

        });
       $("#lightbox-next").click(() => {
          var newSlug;
          $.each(Object.keys(lhtImages), (k, v) => {
            if (v == curSlug) {
              if (k == (Object.keys(lhtImages).length - 1)) {
                  newSlug = Object.keys(lhtImages)[0];
                } else {
                  newSlug = Object.keys(lhtImages)[(k + 1)];   
                }
            }
          });
          openImage(newSlug);
          aCurs.addClass("transformanim");
          aCurs.addClass("clickanim");
          clearTimeout(mouseTimer);
          mouseTimer = setTimeout(() => {
            curs.removeClass("clickanim");
            mouseTimer = setTimeout(() => {
              aCurs.removeClass("transformanim");
            }, fadeSpeed);
          }, fadeSpeed);
        });

        var mouseTimerD;
        var curs = aCurs;
        if (navArrowType == "halfscreen") {
          $(window).mousemove(e => {
            var mouseX = e.clientX;
            var mouseY = e.clientY;
            var cursorWidth = curs.width();
            var cursorHeight = curs.height();
            curs.css("top", (mouseY - (cursorHeight/2)));
            curs.css("left", (mouseX - (cursorWidth/2)));
          });
          $(".halfscreen").mousemove(e => {
            if ($(e.currentTarget).hasClass("right")) {
              if (!curs.hasClass("right")) {
                curs.addClass("right");
                curs.removeClass("left");
                $("body").css("cursor", "none");
              }
              clearTimeout(mouseTimerD);
              mouseTimerD = setTimeout(() => {
                if (!curs.hasClass("right")) {
                  curs.addClass("right");
                  curs.removeClass("left");
                  $("body").css("cursor", "none");
                }
              }, 10);
            } else {
              if (!curs.hasClass("left")) {
                curs.addClass("left");
                curs.removeClass("right");
                $("body").css("cursor", "none");
              }
              clearTimeout(mouseTimerD);
              mouseTimerD = setTimeout(() => {
                if (!curs.hasClass("left")) {
                  curs.addClass("left");
                  curs.removeClass("right");
                  $("body").css("cursor", "none");
                }
              }, 10);
            }
            if (!curs.hasClass("active")) {
              curs.addClass("active");
            }
          });
          $(".halfscreen").mouseout(() => {
            clearTimeout(mouseTimer);
            curs.addClass("fadeout");
            curs.removeClass("active");
            mouseTimer = setTimeout(() => {
              curs.removeClass("left");
              curs.removeClass("right");
              curs.removeClass("fadeout");
              $("body").css("cursor", "auto");
            }, fadeSpeed);
          });
        }
    });
  
    function openInquiry(slug, detail) {
      var waitTime = 0;
      if (!$(".lightbox-wrapper").hasClass("active")) {
        if ($(".lightbox-fade").hasClass("hidden")) {
          $(".lightbox-fade").removeClass("hidden");
        }
        $(".lightbox-wrapper").addClass("active");
        waitTime = fadeSpeed;
        setTimeout(() => {
          $(".lightbox-fade").addClass("hidden");
        }, fadeSpeed);
      }
      setTimeout(() => {
        $(".inquiry-wrap").addClass("active");
        var inqData;
        setTimeout(() => {
          if (detail) {
            var thisKey;
            $.each(lhtImages[slug].detailImages, (k, v) => {
              if (v.slug == detail) {
                thisKey = k;
              }
            });
            inqData = lhtImages[slug].detailImages[thisKey];
          } else {
            inqData = lhtImages[slug]; 
          }
          $("#inquiry-name").text(inqData.name);
          $(".inq-hidden").val(inqData.name);
          $(".contact-block").addClass("active");
        }, 100);
      }, waitTime);
    }

    function closeInquiry() {
      $(".contact-block").removeClass("active");
      setTimeout(() => {
        $(".inquiry-wrap").removeClass("active");
      }, 200);
    }
    
    function initMobile() {
      $.each(lhtImages, (k, v) => {
        var thisSlug = k;
        var thisCont = $(".img-slug[img-slug='" + thisSlug + "']").parent().parent();
        var thisDiv = thisCont.find(".works-image-wrap");

        thisCont.find(".contact-btn").click(e => {
          openInquiry(thisSlug);
        });
        if ($(v.detailImages).length > 0) {
          thisDiv.find(".swipe-ind").addClass("active");
          var detLoad = 0;
          var maxH = 0;
          $.each(v.detailImages, (x, y) => {
            var detSlug = y.slug;
            var thImg = $('<img />');
            var thWr = $('<div />');
            thImg.addClass("lightbox-thumb");
            thWr.addClass("thumb-image");
            thImg.appendTo(thWr);
            thWr.appendTo(thisDiv);
            thImg.on('load', function() {
              if (this.complete && this.naturalWidth > 0) {
                detLoad++;
                if (detLoad == v.detailImages.length) {
                  thisDiv.slick({
                    infinite: false,
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    slide: '.thumb-image'
                  });
                  if ($(y).height() > maxH) {
                    maxH = $(y).height();
                  }
                  thisDiv.find(".thumb-image").height(maxH);
                }
              }
            });

            thImg.attr('src', y.url);
          });
        }
      });
    }
  
    function initLightbox() {
      if (navArrowType == "halfscreen") {
        $(".nav-arrow").addClass("halfscreen"); 
      }
      $.each(lhtImages, (k, v) => {
        var thisSlug = k;
        var thisVidCont = $(".img-slug[img-slug='" + thisSlug + "']").parent().parent().parent().find(".video-container");
        var isVid = false;
        if (!thisVidCont.find(".w-video").hasClass("w-dyn-bind-empty")) {
          isVid = true;
        }
        if (!isVid) {
          var imgElm = mkImg(v.url, aWW, aWH, thisSlug);
          $(imgElm).addClass("art-elm");
          $(imgElm).attr("img-slug", thisSlug);
          imgElm.insertBefore($(".art-wrap").find(".detail-stack"));
        } else {
          var vidElm = thisVidCont.find("iframe");
          var artElm = $('<div />');
          artElm.addClass("art-elm");
          artElm.addClass("isvideo");
          artElm.addClass("didload");
          artElm.attr("img-slug", thisSlug);
          artElm.attr("is-video", "true");
          vidElm.appendTo(artElm);
          artElm.insertBefore($(".art-wrap").find(".detail-stack"));
        }
        var navDot = $('<div />');
        navDot.addClass("nav-dot");
        navDot.attr("img-slug", thisSlug);
        navDot.attr("onclick", "openImage('" + thisSlug + "')");
        navDot.appendTo($(".nav-dots"));
        if ($(v.detailImages).length > 0) {
          $.each(v.detailImages, (x, y) => {
            var detSlug = y.slug;
            var detElm = mkImg(y.url, aWW, aWH);
            $(detElm).addClass("art-elm");
            $(detElm).attr("img-slug", detSlug);
            $(detElm).attr("img-parent", thisSlug);
            detElm.insertBefore($(".art-wrap").find(".detail-stack"));
          });
        }
      });
      
      $(".works-link-block").click((e) => {
        var thisSlug = $(e.currentTarget).find(".img-slug").val();
        openImage(thisSlug);
      });
    }
    
    function openImage(slug, detail, retDet) {
      if ($(".art-elm[img-slug='" + slug + "']").hasClass("didload")) {
        if (!isTran) {
          isTran = true;
          var imgData;
          var parentSlug;
          if (typeof detail !== "undefined" && detail !== false) {
            parentSlug = $("#" + slug + "-parent").attr("img-parent");
            parentData = lhtImages[parentSlug];
            imgData = parentData.detailImages[detail];
            curSlug = parentSlug;
            detSlug = slug;
          } else {
            imgData = lhtImages[slug]; 
            curSlug = slug;
            detSlug = false;
          }

          var stackPos = imgData.detailStackPos;
          var navDots;
          if (parentSlug) {
            navDots = parentData.hideDots;
          } else {
            navDots = imgData.hideDots;
          }

          clearTimeout(resTimeIn);
          clearTimeout(resTimeOut);
          isResizing = 0;
          
          var transitionDuration = 0;
          
          if (!$(".lightbox-wrapper").hasClass("active")) {
            if ($(".page-wrapper").length) {
                $(".page-wrapper").addClass("scrolldis");
              }
            transitionDuration = (fadeSpeed * 2) + fadeWaitTime;
            if ($(".lightbox-fade").hasClass("hidden")) {
              $(".lightbox-fade").removeClass("hidden");
            }
            $(".lightbox-wrapper").addClass("active");
          } else {
            transitionDuration = (fadeSpeed * 2);
            $(".detail-stack").addClass("hidden");
            $(".art-wrap").find(".active").addClass("ishidden");
            setTimeout(() => {
              $(".detail-wrap").removeClass("active");
            }, fadeSpeed);
            if ((typeof detail === "undefined" || detail === false) && !retDet) {
              $(".detail-wrap").addClass("ishidden");
                setTimeout(() => {
                  $(".detail-wrap").removeClass("active");
                }, fadeSpeed);
            }
          }

          if (navDots == "true") {
            $(".nav-dots").addClass("ishidden");
          }

          $(".nav-dot").removeClass("active");
          $(".nav-dot[img-slug='" + curSlug + "'").addClass("active");
          
          if ((typeof detail === "undefined" || detail === false) && !retDet) {} else {
            $(".detail-stack").addClass("hidden");
            $(".art-wrap").find(".active").addClass("ishidden");
            $(".detail-wrap").find(".active").removeClass("active");
            if (retDet) {
              $(".detail-wrap").find(".detail-thumb[action='main']").addClass("active");
            }
            if (typeof detail !== "undefined") {
              $("#" + slug).addClass("active");
            }
          }
          
          setTimeout(() => {
              if ($('.embedly-embed').length) {
                $('.embedly-embed').attr('src', function ( i, val ) { return val; });
              }
              if (navDots == "true") {
                $(".nav-dots").removeClass("active");
              } else {
                $(".nav-dots").addClass("active");
                setTimeout(() => {
                  $(".nav-dots").removeClass("ishidden");
                }, 25);
              }
              var detDiv = $("#main-stack").find(".detail-div");
              if (stackPos != "disabled") {
                detDiv.attr("class", "detail-div");
                $("#footer-stack").find(".detail-div").removeClass("active");
                $("#footer-stack-small").find(".detail-div").removeClass("active");
                if (stackPos == "right-top") {
                  detDiv.addClass("top");
                }
                if (stackPos == "right-center") {
                  detDiv.addClass("center");
                }
                if (stackPos == "right-bottom") {
                  detDiv.addClass("bottom");
                }
                if (stackPos == "footer-large") {
                  $("#footer-stack").find(".footer").addClass("active");
                }
                if (stackPos == "footer-small") {
                  $("#footer-stack-small").find(".footer-small").addClass("active");
                }
                $(".detail-fullname").text(imgData.artist.firstName + " " + imgData.artist.lastName);
                $(".detail-name").text(imgData.name);
                $(".detail-date").text(imgData.date);
                $(".detail-medium").text(imgData.medium);
                $(".detail-size").text(imgData.size);
                if (detSlug) {
                  $(".contact-btn").attr("onclick", "openInquiry('" + curSlug + "', '" + detSlug + "')");
                } else {
                  $(".contact-btn").attr("onclick", "openInquiry('" + curSlug + "', false)");
                }
              } else {
                detDiv.attr("class", "detail-div");
                $("#footer-stack").find(".detail-div").removeClass("active");
                $("#footer-stack-small").find(".detail-div").removeClass("active");
              }

            $(".art-wrap").find(".active").removeClass("active");
            $(".art-wrap").find(".art-elm.active").removeAttr("style");
            $(".detail-wrap").addClass("active");
            setTimeout(() => {
              $(".detail-wrap").removeClass("ishidden");
            }, fadeSpeed);
            if ((typeof detail === "undefined" || detail === false) && !retDet) {
              $(".detail-wrap").removeClass("active");
              $(".detail-child").html("");
              if ($(imgData.detailImages).length > 0) {
                $(".detail-wrap").addClass("active");
                $('<div>', {
                  "action": "main",
                  class: "detail-thumb active",
                  style: "background-image:url(" + imgData.url + ")",
                  onclick: "openImage('" + slug + "', false, true, true)",
                }).appendTo(".detail-child");
                $.each(imgData.detailImages, (k, v) => {
                  $('<div>', {
                    id: v.slug,
                    class: "detail-thumb",
                    style: "background-image:url(" + v.url + ")",
                    onclick: "openImage('" + v.slug + "', " + k + ", false, true)",
                  }).appendTo(".detail-child");
                });
              }
            }
            setTimeout(() => {
              var imgElm = $(".art-wrap").find(".art-elm[img-slug='" + slug + "']");
              aWH = $(".art-wrap").outerHeight();
              aWW = $(".art-wrap").outerWidth();
              imgElm.addClass("ishidden");
              setTimeout(() => {
                imgElm.addClass("active");
                setTimeout(() => {
                  resizeImage(imgElm, () => {
                    doResize(true);
                    setTimeout(() => {
                      $(".lightbox-fade").addClass("hidden");
                    }, fadeWaitTime);
                    setTimeout(() => {
                      $(".detail-stack").removeClass("hidden"); 
                      setTimeout(() => {
                        $(".art-wrap").find(".ishidden").removeClass("ishidden");
                        setTimeout(() => {
                          isTran = false;
                        }, fadeSpeed);
                      }, 30);
                    }, 30);
                  });
                }, fadeSpeed);
              }, 25);
            }, 30);
          }, fadeSpeed);
        }
      }
    }
  
    //mkImg
    $(window).ready(function() {
      $(".art-wrap").removeClass("ishidden");
    });
  
    var isResizing = 0;
    var resTimeIn;
    var resTimeOut;
  
    $(window).on("resize", () => {
      doResize(false);
    });
  
  function doResize(noanim) {
    if (!isResizing) {
        isResizing = 1;
        if (!noanim) {
            $(".art-wrap").addClass("ishidden");
        }
        var $image = $('.art-wrap').find(".art-elm");
        var animDur = 400;
        if (noanim) {
          animDur = 0;
        }
        resTimeIn = setTimeout(() => {
          $image.find("iframe").removeAttr("style");
          $image.removeAttr("style");
          $image.removeClass("active");
          setTimeout(() => {
            aWH = $(".art-wrap").outerHeight();
            aWW = $(".art-wrap").outerWidth();
            resTimeOut = setTimeout(() => {
              $image.addClass("active");
              $image.each((k, v) => {
                resizeImage($(v), () => {
                  if ((k + 1) == $image.length) {
                    $image.removeClass("active");
                    var activeSlug = curSlug;
                    if (detSlug) {
                      activeSlug = detSlug;
                    }
                    $(".art-elm[img-slug='" + activeSlug + "'").addClass("active");
                    reposDS(false);
                    if (!noanim) {
                      $(".art-wrap").removeClass("ishidden");
                    }
                    setTimeout(() => {
                      if ($(".art-elm[img-slug='" + activeSlug + "'").attr("is-video") == "true") {
                        $(".art-elm[img-slug='" + activeSlug + "'").find("iframe").css({
                          'width': $(".art-elm[img-slug='" + activeSlug + "'").width(),
                          'height': $(".art-elm[img-slug='" + activeSlug + "'").height()
                        });
                      }
                    }, 50);
                    setTimeout(() => {
                      isResizing = 0;
                    }, 400);
                  }
                });
              });
            });
          }, 25);
        }, animDur);
      }
  }
  function resizeImage($img, cllback) {
    var $parent = $img.parent(),
        pnW = aWW,
        pnH = aWH,
        detStackW = 0,
        $dS = $parent.find('.detail-stack');
    var detailPos;
    if ($dS.find(".detail-div").hasClass("top")) {
      detailPos = "top";
    }
    if ($dS.find(".detail-div").hasClass("center")) {
      detailPos = "center";
    }
    if ($dS.find(".detail-div").hasClass("bottom")) {
      detailPos = "bottom";
    }

    if ($dS.find(".detail-div").css("display") != "none") {
      detStackW = $dS.outerWidth(true);
    }

    var imgW = $img.width(),
        imgH = $img.height(),
        imgRatio = imgW / imgH,
        parentRatio = pnW / pnH;

    if ($img.hasClass("isvideo")) {
      imgW = $img.find(".embedly-embed").width();
      imgH = $img.find(".embedly-embed").height();
      imgRatio = imgW / imgH;
    }

    if (imgRatio > parentRatio) {
      $img.width(pnW - detStackW);
      $img.height((pnW - detStackW) / imgRatio);
      var marginTop = (pnH - $img.height()) / 2;
      reposDS($dS, marginTop, detailPos);
      $img.css({
        'margin-top': marginTop + 'px',
        'margin-left': 'auto'
      });
    } else {
      $img.height(pnH);
      $img.width(pnH * imgRatio);

      var marginTop = 0;
      var marginLeft = 0;
      if ($dS.find(".detail-div").css("display") != "none") {
        var marginLeft = ((pnW - detStackW - $img.width()) / 2) + (detStackW / 2);
        var detStackS = (pnW - (marginLeft + $img.width()));
        if (detStackS < detStackW) {
          marginLeft = ((pnW - detStackW) - $img.width());
          if ((pnW - detStackW) < $img.width()) {
            $img.width(pnW - detStackW);
            $img.height(($img.width() * imgH) / imgW);
            marginLeft = 0;
            marginTop = ((pnH / 2) - ($img.height() / 2));
            reposDS($dS, marginTop, detailPos);
          } else {
            reposDS($dS); 
          }
        } else {
          reposDS($dS); 
        }
      } else {
        reposDS($dS);
        marginLeft = ((pnW / 2) - ($img.width() / 2));
      }
      $img.css({
        'margin-top': marginTop + 'px',
        'margin-left': marginLeft + 'px'
      });
    }
    cllback();
  }


  
  function reposDS(elm, margin, pos) {
    var elmDiv = $(elm).find(".detail-div");
    if (pos == "top") {
      elmDiv.css("margin-top", margin + "px"); 
    }
    if (pos == "bottom") {
      elmDiv.css("margin-bottom", margin + "px"); 
    }
    if (elm && !margin) {
      elmDiv.css("margin-top", "0px");
      elmDiv.css("margin-bottom", "0px");
    }

    if (!elm) {
      var thisElm = $(".art-elm.active");
      var detStack = $("#main-stack").find(".detail-div");
      var thisMargin = 0;
      var thisTop = thisElm.css("margin-top");
      var thisBot = thisElm.css("margin-bottom");
      if (thisTop && thisTop != "0px") { thisMargin = thisTop; }
      if (thisBot && thisBot != "0px") { thisMargin = thisBot; }
      if (detStack.hasClass("top")) {
        detStack.css("margin-top", thisMargin);
      } else if (detStack.hasClass("bottom")) {
        detStack.css("margin-bottom", thisMargin);
      }
    }
  }
  
  function mkImg(url, tarW, tarH, slug) {
    var $img = $('<img />');

    $img.on('load', function() {
      if (this.complete && this.naturalWidth > 0) {
        $(this).addClass("didload");
        var imgW = this.naturalWidth,
            imgH = this.naturalHeight,
            imgR = imgW / imgH,
            tarR= tarW / tarH;

        if (imgR > tarR) {
          $(this).css({
            'width': tarW,
            'height': 'auto'
          });
        } else {
          $(this).css({
            'width': 'auto',
            'height': tarH
          });
        }
      }
    });

    $img.attr('src', url);
    return $img;
  }
