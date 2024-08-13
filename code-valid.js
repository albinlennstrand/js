var code_status = false;
	$(document).ready(function() {
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
    
    $(".faq-drawer").each((k, v) => {
    	var thisH = $(v).find(".faq-text").height();
      $(v).attr("t-h", thisH);
      $(v).click(() => {
      	if ($(v).hasClass("open")) {
        	$(v).removeClass("open");
        	$(v).find(".faq-text").css("height", "0px");
        } else {
        	$(v).addClass("open");
        	$(v).find(".faq-text").css("height", $(v).attr("t-h") + "px");
        }
      });
    });
    $(".faq-text").css("height", "0px");
    $(".faq-section").addClass("active");
  });
	var timezone = "Australia/Sydney";
  if (getUrlParameter('referral')) {
  	$("#ref-code").val(getUrlParameter('referral'));
    $("#ref-name").focus();
    $(".ref-status").removeClass("fail");
    $(".ref-status").removeClass("valid");
    $(".ref-status").removeClass("hide");
    setTimeout(() => {
    	validateCode();
    }, 1000);
  }
  
  $('#ref-code').blur(function() {
  	validateCode();
  });
  
  $("#ref-code").keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      $('#ref-code').blur();
      return false;
    }
  });
  
  $("#ref-email").keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      $("#sub-btn").click();
      return false;
    }
  });
  
	$("#sub-btn").click(() => {
  	if ($("#ref-name").val().length > 2 && $("#ref-email").val().length > 2) {
      var url = 'https://hooks.zapier.com/hooks/catch/19305570/22pz0h7/';
      var refcode = $("#ref-code").val(); 
      var params = {
        code: refcode,
        name: $("#ref-name").val(),
        email: $("#ref-email").val()
      };
			$("#status-load").addClass("active");
      $("#form-block").addClass("hide");
      $.get(url, params, function(response) {
      	$("#status-load").removeClass("active");
				if (code_status) {
        	$("#status-succ").addClass("active");
        } else {
        	$("#status-wait").addClass("active");
        }
      }).fail(function(error) {
        console.log('Error:', error);
      });
    } else {
    	alert("Please fill in all required fields.");
    }
  });
  
  function isInMemory(code) {
  	if ($.inArray(code, ref_resp) !== -1 || $.inArray(code, ref_resp_invalid) !== -1 || $.inArray(code, ref_resp_used) !== -1) {
     return true;
    } else {
   		return false;
    }
  }
  
  function validateCode() {
  	var refcode = $("#ref-code").val(); 
    if (refcode.length < 1) {
    	$(".ref-status").removeClass("fail");
      $(".ref-status").removeClass("valid");
      $(".wait-info").removeClass("active");
      $(".ref-status").addClass("hide");
      $(".stat-msg").removeClass("active");
      $("#sub-btn").text("Join waiting list");
      code_status = false;
    } else {
    	$(".ref-status").removeClass("fail");
      $(".ref-status").removeClass("valid");
      $(".ref-status").removeClass("hide");
      $(".wait-info").removeClass("active");
      $(".stat-msg").removeClass("active");
      $("#sub-btn").text("Sign up");
      if ($.inArray(refcode, ref_resp) !== -1 || $.inArray(refcode, ref_resp_invalid) !== -1 || $.inArray(refcode, ref_resp_used) !== -1) {
        setTimeout(() => {
          if ($.inArray(refcode, ref_resp) !== -1) {
            $(".ref-status").removeClass("fail");
            $(".ref-status").removeClass("hide");
            $(".ref-status").addClass("valid");
            code_status = true;
            $(".wait-info").removeClass("active");
            $(".stat-msg.valid").addClass("active");
            $("#sub-btn").text("Sign up for Beta");
          } else {
            $(".ref-status").removeClass("valid");
            $(".ref-status").removeClass("hide");
            $(".ref-status").addClass("fail");
            $(".wait-info").addClass("active");
            $("#sub-btn").text("Join waiting list");
            if ($.inArray(refcode, ref_resp_used) !== -1) {
              $(".stat-msg.used").addClass("active");
            } else {
              $(".stat-msg.fail").addClass("active");
            }
            code_status = false;
          }
        }, 1000);
      } else {
        var url = 'https://hooks.zapier.com/hooks/catch/19305570/229sbpq/';
        var params = {
          code: refcode,
          name: $("#ref-name").val(),
          email: $("#ref-email").val()
        };

        $.get(url, params, function(response) {
          var didResp = 0;
          var respInt = setInterval(() => {

            $.ajax({
              url: "/referral-responses/" + refcode.toLowerCase(),
              type: "GET",
              dataType: 'html',
              success: function(html) {
                var updTime;
                var respStatus;
                $(html).each((k, v) => {
                  if (v.id === "response-str") {
                    respStatus = $(v).text();
                  }
                });

                didResp = 1;
                clearInterval(respInt);
                if (respStatus == "success") {
                  $(".ref-status").removeClass("fail");
                  $(".ref-status").removeClass("hide");
                  $(".ref-status").addClass("valid");
                  $(".stat-msg.valid").addClass("active");
                  $(".wait-info").removeClass("active");
                  if (!isInMemory(refcode)) {
                    ref_resp.push(refcode);
                  }
                  $("#sub-btn").text("Sign up for Beta");
                  code_status = true;
                }
                if (respStatus == "fail") {
                  $(".ref-status").removeClass("valid");
                  $(".ref-status").removeClass("hide");
                  $(".ref-status").addClass("fail");
                  $(".stat-msg.fail").addClass("active");
                  $(".wait-info").addClass("active");
                  $("#sub-btn").text("Join waiting list");
                  code_status = false;
                  if (!isInMemory(refcode)) {
                    ref_resp_invalid.push(refcode);
                  }
                }
                if (respStatus == "used") {
                  $(".ref-status").removeClass("valid");
                  $(".ref-status").removeClass("hide");
                  $(".ref-status").addClass("fail");
                  $(".stat-msg.used").addClass("active");
                  $(".wait-info").addClass("active");
                  $("#sub-btn").text("Join waiting list");
                  code_status = false;
                  if (!isInMemory(refcode)) {
                    ref_resp_used.push(refcode);
                  }
                }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                  console.log("error");
                }
              }
            });
          }, 2000);

        }).fail(function(error) {
          console.log('Error:', error);
        });
      }
    }
  }
  
  function getUrlParameter(name) {
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(window.location.href);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
