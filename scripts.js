var gridWallWidth;
var gridWallHeight; 

var gridWallStartingOffsetLeft;
var gridWallStartingOffsetTop;

var extraRows;
var rowsToRender;

var gridLoaded = 0;
var gridHeight = 430; //Controls height of images in grid landscape.
var gridPadding = 45; //Size of padding in px (total padding is this value * 2).

var mobileHeight = 340; //Height of images on mobile.
var mobilePadding = 30; //Padding size on mobile.

var clickDisabled = 0;
var clickNext = 0;
var targetTiles = [-1, 0, 1, 2];

var cursorTrans = 600;
var is_mobile = false;

function disableScroll() {
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  
      window.onscroll = function() {
          window.scrollTo(scrollLeft, scrollTop);
      };
}
  
function enableScroll() {
    window.onscroll = function() {};
}

var lastMousePosX = 0;
var lastMousePosY = 0;

function mouseHover() {
  $("#cursor").find(".border").addClass("hover");
  var failsafe = 0;
    var thisInterval = setInterval(() => {
      $("#cursor").css({
          top: lastMousePosY - $("#cursor").height() / 2,
          left: lastMousePosX - $("#cursor").width() / 2
      });
      failsafe = failsafe + 10;
      if (failsafe > cursorTrans) {
        clearInterval(thisInterval);
      }
    }, 10);
}

function mouseLeave() {
  $("#cursor").find(".border").removeClass("hover");
  var failsafe = 0;
  var thisInterval = setInterval(() => {
    $("#cursor").css({
        top: lastMousePosY - $("#cursor").height() / 2,
        left: lastMousePosX - $("#cursor").width() / 2
    });
    failsafe = failsafe + 10;
    if (failsafe > cursorTrans) {
      clearInterval(thisInterval);
    }
  }, 10);
}

$(document).ready(function() {
  if($('#mobilediv').css('display') == 'none') {
      is_mobile = true;
      gridHeight = mobileHeight;
      gridPadding = mobilePadding; 
  }
  $("#cursor").css("pointer-events", "none");
  if (!is_mobile) {
    $(window).mousemove(function(e) {
      lastMousePosX = e.clientX;
      lastMousePosY = e.clientY;
        if ((e.clientY > 0 + 10 && e.clientY < $(window).height() - 10) && (e.clientX > 0 + 10 && e.clientX < $(window).width() - 10)) {
          if ($("#cursor").find(".border").hasClass("offscreen")) {
             $("#cursor").find(".border").removeClass("offscreen");
          }
        } else {
          if (!$("#cursor").find(".border").hasClass("offscreen")) {
             $("#cursor").find(".border").addClass("offscreen");
          }
        }
        $("#cursor").css({
            top: e.clientY - $("#cursor").height() / 2,
            left: e.clientX - $("#cursor").width() / 2
        });
    });
    $(document).mousedown(() => {
      $("#cursor").find(".border").addClass("pressed");
      var failsafe = 0;
      var thisInterval = setInterval(() => {
        $("#cursor").css({
            top: lastMousePosY - $("#cursor").height() / 2,
            left: lastMousePosX - $("#cursor").width() / 2
        });
        failsafe = failsafe + 10;
        if (failsafe > cursorTrans) {
          clearInterval(thisInterval);
        }
      }, 10);
    });
    $(document).mouseup(() => {
      $("#cursor").find(".border").removeClass("pressed");
      var failsafe = 0;
      var thisInterval = setInterval(() => {
        $("#cursor").css({
            top: lastMousePosY - $("#cursor").height() / 2,
            left: lastMousePosX - $("#cursor").width() / 2
        });
        failsafe = failsafe + 10;
        if (failsafe > cursorTrans) {
          clearInterval(thisInterval);
        }
      }, 10);
    });
  }

  $(".close-button, .nav-button, .grid-item, .logo-h, a").mouseenter(() => {
    mouseHover();
  });

  $(".close-button, .nav-button, .grid-item, .logo-h, a").mouseleave(() => {
    mouseLeave();
  });

  $(".nav-button").click(() => {
    anime({
      targets: ".nav-button",
      opacity: 0,
      easing: 'easeOutQuad',
      duration: 300,
      complete: () => {
        $(".nav-button").css("display", "none");
      }
    });
    $(".about-page").addClass("visible");
    setTimeout(() => {
      anime({
        targets: ".about-anim1",
        opacity: 1,
        easing: 'easeOutQuad',
        duration: 400,
        complete: () => {
        }
      });
      anime({
        targets: ".about-anim2",
        opacity: 1,
        easing: 'easeOutQuad',
        duration: 400,
        delay: 150,
        complete: () => {
        }
      });
      anime({
        targets: ".about-anim3",
        opacity: 1,
        easing: 'easeOutQuad',
        duration: 400,
        delay: 300,
        complete: () => {
        }
      });
      anime({
        targets: ".about-anim4",
        opacity: 1,
        easing: 'easeOutQuad',
        duration: 300,
        delay: 450,
        complete: () => {

        }
      });
      setTimeout(() => {
        $(".close-button").css("display", "flex");
        $(".close-button").addClass("about-close");
      }, 1000);
      anime({
        targets: ".close-button",
        opacity: 1,
        easing: 'easeOutQuad',
        duration: 300,
        complete: () => {
          $(".close-button, .logo-h").click(() => {
            anime({
              targets: ".about-anim1",
              opacity: 0,
              easing: 'easeOutQuad',
              duration: 400,
              delay: 450,
              complete: () => {
                $(".about-page").removeClass("visible");
                anime({
                  targets: ".close-button",
                  opacity: 0,
                  easing: 'easeOutQuad',
                  duration: 300,
                  complete: () => {
                    $(".close-button").removeClass("about-close");
                    $(".close-button").css("display", "none");
                    $(".nav-button").css("display", "block");
                    setTimeout(() => {
                      anime({
                        targets: ".nav-button",
                        opacity: 1,
                        easing: 'easeOutQuad',
                        duration: 300,
                        complete: () => {
                        }
                      });
                    }, 500);
                  }
                });
              }
            });
            anime({
              targets: ".about-anim2",
              opacity: 0,
              easing: 'easeOutQuad',
              duration: 400,
              delay: 300,
              complete: () => {
              }
            });
            anime({
              targets: ".about-anim3",
              opacity: 0,
              easing: 'easeOutQuad',
              duration: 400,
              delay: 150,
              complete: () => {
              }
            });
            anime({
              targets: ".about-anim4",
              opacity: 0,
              easing: 'easeOutQuad',
              duration: 400,
              delay: 0,
              complete: () => {
              }
            });
          });
        }
      });
    }, 1000);
  });

  var lastScrollTop = 0;
  var sinkElms = $(".sinkable");

  $(window).scroll(function(event){
     var st = $(this).scrollTop();
     if (st > lastScrollTop){
       sinkElms.each((k,v) => {
        if (!$(v).hasClass("sunk")) {
          $(v).addClass("sunk");
        }
       });
     } else {
        sinkElms.each((k,v) => {
        if ($(v).hasClass("sunk")) {
          $(v).removeClass("sunk");
        }
       });
     }
     lastScrollTop = st;
  });

    var segMin = 3;
    var segMax = 5;
    var secMin = 6;
    var secMax = 7;
    
    var loadSegments = Math.floor(Math.random() * (segMax - segMin + 1)) + segMin;
    var loadDur = (Math.random() * (secMax - secMin + 1)) + secMin;

    var segmentRange = 100 / loadSegments;
    var loadPoints = [];
    var loadKeyframesLeft = [];
    var loadKeyframesRight = [];

    for (var i = 0; i < loadSegments; i++) {
      var thisRangeLow = segmentRange * i;
      var thisRangeHi = segmentRange * (i + 1);
      loadPoints[i + 1] = Math.floor(Math.random() * (thisRangeHi - thisRangeLow + 1)) + thisRangeLow;
      var thisDeg = (loadPoints[i + 1] / 100) * 360;
      if (loadPoints[i + 1] > 50) {
        loadKeyframesRight.push({rotate: (thisDeg - 180)});
      } else {
        loadKeyframesLeft.push({rotate: thisDeg});
      }
    }

    loadKeyframesLeft.push({rotate: 180});
    loadKeyframesRight.push({rotate: 180});

    setTimeout(() => {
      $(".loading-circle").css("opacity", "1");
      anime({
        targets: "#bar-prog-left",
        keyframes: loadKeyframesLeft,
        easing: 'easeOutQuad',
        duration: ((loadDur * 1000) / 2), 
        update: function(anim) {
          var thisProg = Math.round(anim.progress / 2);
          $("#status-p").text(thisProg + "% LOADED");
        },
        complete: () => {
          anime({
            targets: "#bar-prog-right",
            keyframes: loadKeyframesRight,
            easing: 'easeOutQuad',
            duration: ((loadDur * 1000) / 2),
            update: function(anim) {
              var thisProg = Math.round(anim.progress / 2) + 50;
              $("#status-p").text(thisProg + "% LOADED");
            },
            complete: () => {
              setTimeout(() => {
                anime({
                  targets: ".loading-circle, .status-p",
                  opacity: 0,
                  duration: 1200,
                  easing: 'easeOutQuad',
                  complete: () => {
                    anime({
                      targets: "#loading-span-second",
                      opacity: 0,
                      duration: 500,
                      easing: 'easeOutQuad',
                      complete: () => {
                        anime({
                          targets: ".loading-screen",
                          opacity: 0,
                          duration: 1200,
                          easing: 'easeOutQuad',
                          complete: () => {
                            $(".loading-screen").css("display", "none");
                            $(".intro-anim").css("display", "none");
                            $(".loading-screen").addClass("didload");
                            $(".body-home").addClass("didload");
                            $(".logo-wrap").css("z-index", "1010");
                            $("#nav-wrap").css("z-index", "1010");
                            $(".loading-screen").css("pointer-events", "auto");
                          }
                        });
                      }
                    });
                  }
                });
              }, 500);
            }
          });
        }
      });

      setTimeout(() => {
        anime({
          targets: ".logo-wrapper",
          opacity: 0,
          duration: 700,
          easing: 'easeOutQuad',
          complete: () => {
            anime({
              targets: "#loading-span-first",
              opacity: 1,
              duration: 700,
              easing: 'easeOutQuad',
              complete: () => {
                setTimeout(() => {
                  anime({
                    targets: "#loading-span-first",
                    opacity: 0,
                    duration: 700,
                    easing: 'easeOutQuad',
                    complete: () => {
                      anime({
                        targets: "#loading-span-second",
                        opacity: 1,
                        duration: 700,
                        easing: 'easeOutQuad',
                        complete: () => {
                          
                        }
                      });
                    }
                  });
                }, 2500);
              }
            });
          }
        });
      }, 1000);
  }, 2200);



    //0 - 180 deg



    var edgeDistance = 0;
    
    var gridWall = $("#gridwall");
    gridWallWidth = $(window).width();
    gridWallHeight = $(window).height();  
    
    var gridItems = $("#griditems").find(".grid-item"); 
    var gridLength = $(gridItems).length;
    var gridLinks = [];
    var darkPages = [];

    $(gridItems).each((e, v) => {
      var pageUrl = $(v).find(".grid-link").attr("href");
      gridLinks[e] = pageUrl;
      if ($(v).find(".dark-bool").hasClass("w-condition-invisible")) {
        darkPages[e] = 0;
      } else {
        darkPages[e] = 1;
      }
    });
    
    var gridRowElm = $(".grid-row"); 
    var gridTileElm = $(".grid-tile");

    var imgWidths = [];

    var lastSpawnedRowBottom = 0;
    var lastSpawnedRowTop = 0;
    var lastSpawnedColLeft = [];
    var lastSpawnedColRight = [];

    $(gridItems).each(function(e) {
      const img = new Image();
      img.onload = function() {
        imgWidths[e] = ((this.width / this.height) * gridHeight);
        if (imgWidths.length == gridLength && !imgWidths.includes(undefined)) {
          initWall();
        }
      }
      img.src = $(gridItems[e]).find(".imagevector").attr("src");
    });
    
    var rowSplit = 3;
    var gridIndexes = [];

    for (var i = 0; i < gridLength; i++) {
      gridIndexes.push(i);
    }

    var rowGrps = splitToChunks(gridIndexes, 3);
    
    function initWall() {
      extraRows = Math.ceil(((gridWallHeight - (gridHeight + (gridPadding * 2))) / 2) / (gridHeight + (gridPadding * 2)));
      rowsToRender = 2 + (extraRows * 2);
    
      for (var i = 0; i < rowsToRender; i++) {

        var thisIndex = i - (extraRows + 1);
        var thisRowIndex = indexToNumber(thisIndex, rowSplit);
        var thisRow = $(gridRowElm).clone();

        if (thisRowIndex == 1) {
          $(thisRow).css("left", "-100px");
        } else if (thisRowIndex == (rowSplit - 1)) {
          $(thisRow).css("left", "+100px");
        }

        if (thisIndex > -1) {
          if (thisIndex > lastSpawnedRowBottom) {
            lastSpawnedRowBottom = thisIndex;
          }
        } else {
          if (Math.abs(thisIndex) > lastSpawnedRowTop) {
            lastSpawnedRowTop = Math.abs(thisIndex);
          }
        }

        $(thisRow).attr("row", thisIndex); 
        $(thisRow).css("top", ((gridHeight + (gridPadding * 2)) * thisIndex));
        $(thisRow).css("height", (gridHeight + (gridPadding * 2) + "px"));
        $(gridWall).append($(thisRow));


        if (thisIndex < 0) {
            thisRowIndex = rowSplit - indexToNumber(thisIndex, rowSplit);
            if (thisRowIndex == rowSplit) {
              thisRowIndex = 0;
            }
        }

        var thisRowGrp = rowGrps[thisRowIndex];

        var spaceToFill = ((gridWallWidth - (imgWidths[thisRowGrp[0]] + (gridPadding * 2))) / 2);

        var extraColsLeft;
        var extraColsRight;
        var totalOffsetLeft = 0;
        var totalOffsetRight = 0;
        var colCountLeft = 0;
        var colCountRight = 0;

        while (spaceToFill > totalOffsetLeft) {
          var reversed = thisRowGrp.length - indexToNumber(colCountLeft, thisRowGrp.length);
          var reversedNext = thisRowGrp.length - indexToNumber((colCountLeft + 1), thisRowGrp.length);
          if (reversed == thisRowGrp.length) {
            reversed = 0;
          }
          if (reversedNext == thisRowGrp.length) {
            reversedNext = 0;
          }
          totalOffsetLeft = totalOffsetLeft + imgWidths[thisRowGrp[reversed]];
          colCountLeft++;
          if ((totalOffsetLeft + imgWidths[thisRowGrp[reversedNext]]) > spaceToFill) {
            extraColsLeft = colCountLeft;
          }
        }
        while (spaceToFill > totalOffsetRight) {
          totalOffsetRight = totalOffsetRight + imgWidths[thisRowGrp[indexToNumber((colCountRight + 1), thisRowGrp.length)]];
          colCountRight++;
          if ((totalOffsetRight + imgWidths[thisRowGrp[indexToNumber((colCountRight + 1), thisRowGrp.length)]]) > spaceToFill) {
            extraColsRight = colCountRight + 1;
          }
        }

        var totalColsToRender = (extraColsLeft + extraColsRight) + 1;

        for (var x = 0; x < (extraColsRight + 1); x++) {
          createTile(thisRowIndex, thisIndex, x, x);
        }
        
        for (var x = 0; x < extraColsLeft; x++) {
          createTile(thisRowIndex, thisIndex, -(x + 1), (extraColsLeft + x));
        }
      }

      gridWallStartingOffsetLeft = (gridWallWidth / 2) - ((imgWidths[0] / 2) + gridPadding);
      gridWallStartingOffsetTop = (gridWallHeight / 2) - ((gridHeight / 2) + gridPadding);

      var easingInterval;
      var currentGridPos = gridWall.offset();

      $(gridWall).pep({
        drag: function(ev, obj){
          currentGridPos = gridWall.offset();
          updateWallPos();
        },
        cssEaseDuration: "750",
        cssEaseString: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
        start: () => {
          //$(".grid-item").addClass("gridactive");
        },
        ignoreRightClick: true,
        shouldPreventDefault: false,
        stop: function() {
          //$(".grid-item").removeClass("gridactive");
          clearInterval(easingInterval);
          easingInterval = setInterval(() => {
            if (!clickDisabled) {
              updateWallPos();
            }
          }, 20);
        },
        rest: function() {
          clearInterval(easingInterval);
        },
      });

      $.pep.toggleAll(true);
      $(gridWall).css("left", gridWallStartingOffsetLeft + "px");
      $(gridWall).css("top", gridWallStartingOffsetTop + "px");

      $(".view-all").click(() => {
        setTimeout(() => {
          $.pep.toggleAll(true);
          clickDisabled = 0;
        }, 800);
      });

      var clickStartPos;
      var clickTimer = 0;
      var clickTimerInt;

      $(gridWall).mousedown((e) => {
        clickStartPos = currentGridPos;
        clickTimer = 0;
        clickTimerInt = setInterval(() => {
          clickTimer = clickTimer + 10;
        }, 10);
      });

      $(gridWall).mouseup((e) => {
        for (var i = 1; i < clickTimerInt; i++) {
          clearInterval(i);
        }
        if (currentGridPos) {
          if (currentGridPos.left == clickStartPos.left && currentGridPos.top == clickStartPos.top && !clickDisabled) {
            clickNext = 1;
          } else {
            if (clickNext) {
              clickNext = 0;
            }
          }
        }
        clickTimer = 0;
      });

      $(document).on('keyup', function(e) {
        if (e.key == "Escape") {
          $.pep.toggleAll(false);
          clickDisabled = 1;
        }
      });

      gridLoaded = 1;
    }

    function deleteRow(row, dir) {
      var thisIndex = row;
      var thisRow = $(".grid-row[row='" + row +"']");
      thisRow.remove();
    }

    function isTile(row, col) {
      var thisIndex = row;
      var thisTile = $(".grid-row[row='" + row +"']").find(".grid-tile[col='" + col +"']");
      if (thisTile) {
        return true;
      } else {
        return false;
      }
    }

    function deleteTile(row, col) {
      var thisIndex = row;
      var thisTile = $(".grid-row[row='" + row +"']").find(".grid-tile[col='" + col +"']");
      thisTile.remove();
    }

    function createRow(row, leftOffset) {
        var thisIndex = row;
        var thisRowIndex = indexToNumber(thisIndex, rowSplit);
        var thisRow = $(gridRowElm).clone();

        if (thisRowIndex == 1) {
          $(thisRow).css("left", "-100px");
        } else if (thisRowIndex == (rowSplit - 1)) {
          $(thisRow).css("left", "+100px");
        }

        $(thisRow).attr("row", thisIndex); 
        $(thisRow).css("top", ((gridHeight + (gridPadding * 2)) * thisIndex));
        $(thisRow).css("height", (gridHeight + (gridPadding * 2) + "px"));
        $(gridWall).append($(thisRow));


        if (thisIndex < 0) {
            thisRowIndex = rowSplit - indexToNumber(thisIndex, rowSplit);
            if (thisRowIndex == rowSplit) {
              thisRowIndex = 0;
            }
        }

        var thisRowGrp = rowGrps[thisRowIndex];

        var spaceToFill = ((gridWallWidth - (imgWidths[thisRowGrp[0]] + (gridPadding * 2))) / 2);

        var extraColsLeft;
        var extraColsRight;
        var totalOffsetLeft = 0;
        var totalOffsetRight = 0;
        var colCountLeft = 0;
        var colCountRight = 0;

        while (spaceToFill > totalOffsetLeft) {
          var reversed = thisRowGrp.length - indexToNumber(colCountLeft, thisRowGrp.length);
          var reversedNext = thisRowGrp.length - indexToNumber((colCountLeft + 1), thisRowGrp.length);
          if (reversed == thisRowGrp.length) {
            reversed = 0;
          }
          if (reversedNext == thisRowGrp.length) {
            reversedNext = 0;
          }
          totalOffsetLeft = totalOffsetLeft + imgWidths[thisRowGrp[reversed]];
          colCountLeft++;
          if ((totalOffsetLeft + imgWidths[thisRowGrp[reversedNext]]) > spaceToFill) {
            extraColsLeft = colCountLeft;
          }
        }
        while (spaceToFill > totalOffsetRight) {
          totalOffsetRight = totalOffsetRight + imgWidths[thisRowGrp[indexToNumber((colCountRight + 1), thisRowGrp.length)]];
          colCountRight++;
          if ((totalOffsetRight + imgWidths[thisRowGrp[indexToNumber((colCountRight + 1), thisRowGrp.length)]]) > spaceToFill) {
            extraColsRight = colCountRight + 1;
          }
        }

        var totalColsToRender = (extraColsLeft + extraColsRight) + 1;

        var colsInView = [];
        var accumOffset = 0;
        var colCount = 0;

        if (leftOffset > -1) { //view till höger, spawna in från vänster (-1 till -100)
          while (accumOffset < (leftOffset + (gridWallWidth / 2))) {
            var reversed = thisRowGrp.length - indexToNumber(colCount, thisRowGrp.length);
            var reversedNext = thisRowGrp.length - indexToNumber((colCount - 1), thisRowGrp.length);
            var reversedThird = thisRowGrp.length - indexToNumber((colCount - 2), thisRowGrp.length);
            if (reversed == thisRowGrp.length) {
              reversed = 0;
            }
            colCount++;

            accumOffset = accumOffset + (imgWidths[thisRowGrp[reversed]] + (gridPadding * 2));

            if ((((accumOffset - imgWidths[thisRowGrp[reversedNext]]) - imgWidths[thisRowGrp[reversedThird]])) > Math.abs(leftOffset)) {
              for (var i = 0; i < totalColsToRender; i++) {
                var reversed = thisRowGrp.length - indexToNumber(i, thisRowGrp.length);
                if (reversed == thisRowGrp.length) {
                  reversed = 0;
                }
                colsInView.push(reversed);
              }
              break;
            }
          }

          for (var x = 0; x < totalColsToRender; x++) {
            createTile(thisRowIndex, thisIndex, -((colCount - totalColsToRender) + x), colsInView[x]);
            lastSpawnedColLeft[thisIndex] = -((colCount - totalColsToRender) + x);
          }
        } else { //spawna från höger
          while (accumOffset < (Math.abs(leftOffset) + gridWallWidth)) {

            colCount++;
            accumOffset = accumOffset + (imgWidths[thisRowGrp[indexToNumber(colCount, thisRowGrp.length)]] + (gridPadding * 2));

            if (accumOffset > Math.abs(leftOffset)) {
              for (var i = 0; i < totalColsToRender; i++) {
                colsInView.push(indexToNumber(i, thisRowGrp.length));
              }
              break;
            }
          }

          for (var x = 0; x < totalColsToRender; x++) {
            createTile(thisRowIndex, thisIndex, (colCount + x), colsInView[x]);
            lastSpawnedColRight[thisIndex] = (colCount  + x);
          }
        }
    }
    
    var totalOffsetLeft = [];
    var totalOffsetRight = [];
    
    function createTile(rowIndex, row, col, index) {
      var thisRow = $(".grid-row[row='" + row +"']");
      var thisGrid;
      var thisWidth;
      var thisRowIndex = rowIndex;
      var thisRowGrp = rowGrps[thisRowIndex];
      var thisIndex = indexToNumber(col, thisRowGrp.length);

      if (col < 0) {
        thisIndex = thisRowGrp.length - indexToNumber(col, thisRowGrp.length);
        if (thisIndex == thisRowGrp.length) {
          thisIndex = 0;
        }
      }

      thisWidth = imgWidths[thisRowGrp[thisIndex]];
      thisUrl = gridLinks[thisRowGrp[thisIndex]];
      thisDarkBool = darkPages[thisRowGrp[thisIndex]];
      thisGrid = gridItems[thisRowGrp[thisIndex]];
      
      var thisOffset = 0;
      var firstWidth = imgWidths[thisRowGrp[0]];

      thisOffset = findColOffset(row, col);
      
      var thisTileElm = $(gridTileElm).clone();
      $(thisTileElm).attr("col", col);
      $(thisTileElm).attr("row", row);
      $(thisRow).append($(thisTileElm));
      var thisCol = $(thisTileElm);
      
      $(thisCol).attr("col", col);
      $(thisCol).attr("case", thisUrl);
      $(thisCol).attr("dark", thisDarkBool);
      $(thisCol).css("left", thisOffset + "px");
      $(thisCol).css("height", (gridHeight + (gridPadding * 2)) + "px");
      $(thisCol).css("width", (thisWidth + (gridPadding * 2)) + "px");
      $(thisCol).css("padding", gridPadding + "px");
      $(thisCol).append($(thisGrid).clone());
      var thisTile = $(thisCol).find(".grid-item")[0];
      $(thisTile).css("height", gridHeight + "px");
      $(thisTile).css("width", thisWidth + "px");
      $(thisTile).attr("onclick", "clickTile(" + row + ", " + col + ");");
      $(thisTile).mouseenter(() => {
        mouseHover();
      });
      $(thisTile).mouseleave(() => {
        mouseLeave();
      });
    }

    function findColOffset(row, col) {
      var thisRowIndex = indexToNumber(row, rowSplit);

      if (row < 0) {
          thisRowIndex = rowSplit - indexToNumber(row, rowSplit);
          if (thisRowIndex == rowSplit) {
            thisRowIndex = 0;
          }
      }

      var thisRowGrp = rowGrps[thisRowIndex];
      var thisColIndex = indexToNumber(col, thisRowGrp.length);

      var totalLeftOffset = 0;

      for (var i = 0; i < Math.abs(col); i++) {
        var colIndex;
        if (col > -1) {
          colIndex = indexToNumber(i, thisRowGrp.length);
        } else {
          colIndex = thisRowGrp.length - indexToNumber((i + 1), thisRowGrp.length);
          if (colIndex == thisRowGrp.length) {
            colIndex = 0;
          }
        }
        totalLeftOffset = totalLeftOffset + (imgWidths[thisRowGrp[colIndex]] + (gridPadding * 2));
      }

      if (col > -1) {
        return totalLeftOffset;
      } else {
        return -totalLeftOffset;
      }
    }

    var lastPos = 0;
    var accumDiff = 0;
    
    function updateWallPos() {
      if (!clickDisabled) {
        edgeDistance = 350;
        var currentPos = gridWall.offset();
        var difference;

        if (currentPos.left < lastPos) { //vänster
          difference = lastPos - currentPos.left;
        } else { //höger
          difference = -(currentPos.left - lastPos);
        }

        var totalRowHeight = gridHeight + (gridPadding * 2);

        var leftEdge = currentPos.left;
        var rightEdge = currentPos.left + gridWallWidth;

        var topEdge = currentPos.top;
        var bottomEdge = currentPos.top + gridWallHeight;

        if (topEdge > (((totalRowHeight * lastSpawnedRowTop) - ((gridPadding * 2) / 2)))) {
          createRow(-(lastSpawnedRowTop + 1), currentPos.left);
          deleteRow(lastSpawnedRowBottom);
          lastSpawnedRowBottom = lastSpawnedRowBottom - 1;
          lastSpawnedRowTop = lastSpawnedRowTop + 1;
        }

        if (((topEdge - ((gridWallHeight) - totalRowHeight))) < -(((totalRowHeight * lastSpawnedRowBottom) - ((gridPadding * 2) / 2)))) {
          createRow(lastSpawnedRowBottom + 1, currentPos.left);
          deleteRow(-lastSpawnedRowTop);
          lastSpawnedRowTop = lastSpawnedRowTop - 1;
          lastSpawnedRowBottom = lastSpawnedRowBottom + 1;
        }

        accumDiff = accumDiff + difference;

        var rowsOnScreen = (lastSpawnedRowTop + lastSpawnedRowBottom) + 1;
        for (var i = 0; i < rowsOnScreen; i++) {
          var row = $($(".grid-row")[i]).attr("row");
          var thisRowIndex = indexToNumber(row, rowSplit);
          if (row < 0) {
            thisRowIndex = rowSplit - indexToNumber(row, rowSplit);
            if (thisRowIndex == rowSplit) {
              thisRowIndex = 0;
            }
          }

          var thisRowGrp = rowGrps[thisRowIndex];
          var lastLeft = 0;
          var lastRight = 0;
          var maxLeftOffset = 0;
          var maxRightOffset = 0;

          var rowCols = [];

          $($(".grid-row[row='" + row +"']").find(".grid-tile")).each((e, v) => {
              rowCols.push($(v).attr("col"));
          });

          if (rowCols.length) {
            lastLeft = Math.min(...rowCols);
            lastRight = Math.max(...rowCols);
          }

          if (difference > -0.01) { //spawna till Höger
             if (-(leftEdge - gridWallWidth) > findColOffset(row, lastRight)) {
              createTile(thisRowIndex, row, (lastRight + 1));
              if (isTile(row, (lastLeft - 1))) {
                deleteTile(row, (lastLeft - 1));
              }
            }
          } else {
            if ((Math.abs(findColOffset(row, lastLeft)) < (leftEdge + (gridPadding * 4)) && leftEdge > 0) || (Math.abs(findColOffset(row, lastLeft)) > (Math.abs(leftEdge) - edgeDistance) && leftEdge < 0)) {
              createTile(thisRowIndex, row, (lastLeft - 1));
              if (isTile(row, (lastRight + 1))) {
                deleteTile(row, lastRight + 1);
              }
            }
          }
        }
        lastPos = currentPos.left;
      }
    }
  });

  $(window).resize(() => {
    gridWallWidth = $(window).width();
    gridWallHeight = $(window).height(); 
    extraRows = Math.ceil(((gridWallHeight - (gridHeight + (gridPadding * 2))) / 2) / (gridHeight + (gridPadding * 2)));
    rowsToRender = 2 + (extraRows * 2);
    updateWallPos();
    if ($(".shadowelm").length) {
      $(".shadowelm").each((e, v) => {
        var thisParent = $(v).parent();
        var thisImg = $(thisParent).find(".loadingimage");
        if (thisImg) {
          $(v).css("width", $(thisImg).width());
          $(v).css("height", $(thisImg).height());
          $(v).css("top", $(thisImg).css("top"));
          $(v).css("left", $(thisImg).css("left"));
        }
      });
    }
  });
  
  function indexToNumber (index, elems) {
      return Math.abs(index) % elems;
  }
  
  function splitToChunks(array, parts) {
      let result = [];
      for (let i = parts; i > 0; i--) {
          result.push(array.splice(0, Math.ceil(array.length / i)));
      }
      return result;
  }

  function clickTile(row, col) {
      var thisRow = $(".grid-row[row='" + row +"']");
      var thisTile = $(thisRow).find("[col='" + col +"']");
      var thisUrl = $(thisTile).attr("case");
      var thisDark = $(thisTile).attr("dark");
      if (clickNext) {
        if (thisDark == 1) {
          $(".loading-screen").addClass("dark");
        }
        clickDisabled = 1;
        $.pep.toggleAll(false);
        var targetDiv = $("#page-container");
        $("body").css("overflow", "hidden");
        anime({
          targets: ".nav-button",
          opacity: 0,
          easing: 'easeOutQuad',
          duration: 300,
          complete: () => {
            $(".nav-button").css("display", "none");
          }
        });
        $.ajax({
              url: thisUrl,
              type: "GET",
              dataType: 'html',
              success: function(html) {
                  var titleElm = html.match(/<title>(.*?)<\/title>/);
                  var docTitle = titleElm[1];
                  $(html).each((k, v) => {
                    if (v.id == "page-container") {
                      targetDiv.html(v.innerHTML);
                    }
                  })

                  if (thisDark == 1) {
                    $(".willswitch").each((k, v) => {
                      $(v).addClass("white");
                    });
                  }

                  $(window).scroll(function(){
                    function elementScrolled(elem)
                    {
                      var docViewTop = $(window).scrollTop();
                      var docViewBottom = docViewTop + $(window).height();
                      var extraOffset = 200;
                      if (is_mobile) {
                        extraOffset = 25;
                      }
                      var elemTop = $(elem).offset().top + extraOffset;
                      return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
                    }

                    $(".module-base").each((k, v) => {
                      if(elementScrolled($(v)) && !$(v).hasClass("appeared")) {
                        $(v).addClass("appeared");
                      }
                    });
                  });

                  $("#caselogo, .close-button").click(() => {
                    $("#caselogo, .close-button").off("click");
                    clickDisabled = 1;
                    $.pep.toggleAll(true);
                    anime({
                      targets: ".close-button",
                      opacity: 0,
                      easing: 'easeOutQuad',
                      duration: 500,
                      complete: () => {
                        $(".close-button").css("display", "none");
                      }
                    });

                    $(".loading-screen").css("display", "block");

                    disableScroll();

                    anime({
                      targets: ".loading-screen",
                      opacity: 1,
                      easing: 'easeOutQuint',
                      duration: 800,
                      complete: () => {
                          if (thisDark == 1) {
                            $(".body-home").removeClass("dark");
                          }
                          if (is_mobile) {
                            $("body").addClass("fixedbody");
                          }
                          $("#gridwrap").css("display", "block");
                          $(".page-container").css("display", "none");
                              anime({
                                targets: ".loading-screen",
                                opacity: 0,
                                easing: 'easeOutQuad',
                                duration: 800,
                                complete: () => {
                                  if (thisDark == 1) {
                                    $(".loading-screen").removeClass("dark");
                                  }
                                  clickDisabled = 0;
                                  enableScroll();
                                  $(".loading-screen").css("display", "none");
                                }
                              });
                              $(".nav-button").css("display", "block");
                              anime({
                                targets: ".nav-button",
                                opacity: 1,
                                easing: 'easeOutQuad',
                                duration: 500,
                                complete: () => {
                                  
                                }
                            });
                      }
                    });
                  });

                  var newLeft = $(thisTile).offset().left + gridPadding;
                  var newTop = $(thisTile).offset().top + gridPadding;

                  var ghostImg = $(thisTile).find(".grid-item").clone();
                  $(ghostImg).attr("id", "ghostimg");
                  ghostImg.css("left", newLeft);
                  ghostImg.css("top", newTop);
                  $(".loading-screen").append(ghostImg);
                  $(".loading-screen").css("display", "block");
                  targetDiv.css("overflow", "hidden");
                  anime({
                    targets: ".loading-screen",
                    opacity: 1,
                    easing: "easeInOutQuad",
                    duration: 200,
                    complete: () => {
                      if (thisDark == 1) {
                        $(".body-home").addClass("dark");
                      }
                      targetDiv.css("display", "block");
                      $("#gridwrap").css("display", "none");
                      var newDiffLeft = 0;
                      var newDiffTop = 0;
                      var gridLeft = ghostImg.offset().left + gridPadding;
                      var gridTop = ghostImg.offset().top + gridPadding;

                      var targetImg = targetDiv.find(".large-image");
                      targetImg.each((k, v) => {
                        if ($(v).hasClass("w-condition-invisible")) {
                          $(v).remove();
                        }
                      });

                      ghostImg.css("pointer-events", "none");

                      if (!is_mobile) {
                        targetDiv.css("overflow", "auto");
                      } else {
                        $("body").removeClass("fixedbody");
                      }

                      var animLeft;
                      var animTop;
                      setTimeout(() => {
                        const img = new Image();
                        var targetHeight;
                        var targetWidth;
                        img.onload = function() {
                          animLeft = targetDiv.find("#large-image").offset().left;
                          animTop = targetDiv.find("#large-image").offset().top;
                          targetHeight = targetDiv.find("#large-image").height();
                          targetWidth = ((this.width / this.height) * targetHeight);
                          anime({
                            targets: "#ghostimg",
                            left: animLeft,
                            top: animTop,
                            width: targetWidth,
                            height: targetHeight,
                            easing: 'easeOutQuint',
                            duration: 1300,
                            complete: () => {
                              anime({
                                targets: ".loading-screen",
                                opacity: 0,
                                easing: 'easeOutQuad',
                                duration: 500,
                                complete: () => {
                                  $("body").css("overflow-y", "auto");
                                  $(".loading-screen").css("display", "none");
                                  $(".loading-screen").html("");
                                  $(".close-button").css("display", "flex");
                                  anime({
                                    targets: ".close-button",
                                    opacity: 1,
                                    easing: 'easeOutQuad',
                                    duration: 300,
                                    complete: () => {
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                        img.src = $(thisTile).find(".imagevector").attr("src");
                      }, 800);
                    }
                  });
              }
          });
      }
    }
