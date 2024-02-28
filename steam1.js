$(document).ready(() => {   
  	var ingrBlockInst = $(".ingr-block").clone();
  	var currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });
    
    $("#ingr-submit").click(() => {
    	var errors = [];
    	$(currIngrList).each((k, v) => {
      	if (!corrIngrList.includes(v)) {
        	errors.push(v);
          totalErrs++;
        } else {
        	validAnswers.push(v);
        }
      });
      
      reloadIngrList();
      
      if (errors.length > 0) {
      	$(errors).each((k, v) => {
        	$("#ingr-tag-" + v).click();
          $("#ingr-" + v).addClass("errored");
        });
        clearTimeout(errTimeout);
        errTimeout = setTimeout(() => {
        	$(".ingr-label").removeClass("errored");
        }, 3000);
      } else if (currIngrList.length == corrIngrList.length) {
      	$(".meal-heading").addClass("hidden");
      	$(".ingredient-list").addClass("hidden");
        $(".ingr-pool").addClass("hidden");
        $(".validate-block").addClass("hidden");
        $(".ingr-list").height($(".ingr-list").height());
        setTimeout(() => {
        	$(".win-screen").css("display", "block");
        	$(".ingr-list").outerHeight(($(window).outerHeight() - $(".header").outerHeight()));
          setTimeout(() => {
          	$(".err-count").text(totalErrs);
            $(".win-screen").addClass("active");
            $(".back-block").addClass("active");
          }, 500);
        }, 300);
      }
    });
    
    $(document).mouseup(() => {
    	$(".ingr-label").removeClass("hovered");
    });
    function reloadIngrList() {
    	$(".ingredient-list").find(".ingr-block").remove();
    	$(corrIngrList).each((k, v) => {
      	var newIngrBlock = ingrBlockInst.clone();
        newIngrBlock.find(".ingr-num").text(k + 1);
        if (typeof currIngrList[k] !== "undefined") {
        	newIngrBlock.find(".ingr-para").text($("#ingr-" + currIngrList[k]).find(".ingr-para-drag").text());
          newIngrBlock.find(".ingr-tag-wrap").addClass("active");
          newIngrBlock.attr("id", "ingr-tag-" + currIngrList[k]);
          newIngrBlock.click(() => {
         		if (!validAnswers.includes(currIngrList[k])) {
              $("#ingr-" + currIngrList[k]).removeClass("active");
              currIngrList = jQuery.grep(currIngrList, function(value) {
                return value != currIngrList[k];
              });
              reloadIngrList();
            }
          });
					if (validAnswers.includes(currIngrList[k])) {
          	newIngrBlock.find(".ingr-tag-wrap").addClass("corr");
            newIngrBlock.find(".ingr-tag").addClass("corr");
            newIngrBlock.find(".right-content").addClass("corr");
            newIngrBlock.find(".x-btn").addClass("corr");
          }
        }
      	newIngrBlock.insertBefore($(".drop-box"));
      });
      setTimeout(() => {
        dropbox.top = $(".ingr-list").offset().top;
        dropbox.bot = $(".ingr-list").offset().top + $(".ingr-list").outerHeight();
      }, 100);
    }
    reloadIngrList();
  	$(".ingr-label").each((k, v) => {
    	$(v).attr("id", "ingr-" + k);
    	$("#ingr-" + k).draggable({
      	revert: true,
        revertDuration: 0,
        start: function() {
          if (!$(".drop-box").hasClass("hovered")) {
            $(".drop-box").addClass("hovered");
            $(".drop-block").addClass("active");
          }
          $("#ingr-" + k).addClass("hovered");
        },
        drag: function() {
        	 if (currentMousePos.y > dropbox.top && currentMousePos.y < (dropbox.bot)) {
    				if (!$(".drop-block").hasClass("hovered")) {
            	$(".drop-block").addClass("hovered");
            }
           } else {
           	if ($(".drop-block").hasClass("hovered")) {
            	$(".drop-block").removeClass("hovered");
            }
           }
        },
        stop: function() {
          if ($(".drop-box").hasClass("hovered")) {
            $(".drop-box").removeClass("hovered");
            $(".drop-block").removeClass("active");
          }
          if (currentMousePos.y > dropbox.top && currentMousePos.y < (dropbox.bot)) {
            if (currIngrList.length < corrIngrList.length) {
            	if (!currIngrList.includes(k)) {
              	currIngrList.push(k);
                $("#ingr-" + k).addClass("active");
                reloadIngrList();
              }
            }
          }
          console.log(currentMousePos.x);
        }
      });
    });
});
