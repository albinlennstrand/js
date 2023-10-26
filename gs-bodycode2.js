  let start = null;

    window.addEventListener('touchstart', function(e) {
        start = e.changedTouches[0];
    });
   
    
  var animTimeout;
  let didInit = false, animating, currentIndex = -1, allowScroll = true, slidePos, lastSwipeDelta = null, belowSlide = false;
  
   window.addEventListener('touchmove', function(e) {
      let end = e.changedTouches[0];

      if(end.screenY - start.screenY > 0)
      {
          lastSwipeDelta = -1;
      }
      else if(end.screenY - start.screenY < 0)
      {
          lastSwipeDelta = 1;
      }
    });
  
  function isElementInView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top + $(elem).height();
    var elemBottom = elemTop + $(elem).height();

    return (elemTop <= docViewBottom && elemBottom >= docViewTop);
  }
  
  $(window).resize(() => {
    slidePos = $("#slide-marker").offset().top + $("#pagewrap").scrollTop();
  });
  
  $(document).ready(() => {
    slidePos = $("#slide-marker").offset().top + $("#pagewrap").scrollTop();
    $('#pagewrap').on('scroll mousewheel', function(e){
      var delta = e.originalEvent.deltaY;
      if (lastSwipeDelta !== null) {
        delta = lastSwipeDelta;
      }
      if (!allowScroll) {
        if (delta > 0) { //DOWN
          if ((currentIndex + 1) < $(".bg").length) {
            !animating && gotoSection(currentIndex + 1, 1);
          } else {
            if (!animating) {
              $("#slide-wrap").removeClass("fixed");
              allowScroll = true;
              belowSlide = true;
            }
          }
        } else if (delta !== undefined) { //UP
            if ((currentIndex - 1) > -1) {
              !animating && gotoSection(currentIndex - 1, -1);
            } else { //SCROLL UP
              if (!animating) {
                belowSlide = false;
                allowScroll = true;
                animating = true;
                clearTimeout(animTimeout);
                animTimeout = setTimeout(() => {
                  animating = false;
                }, 500);
              }
            }
        }
        e.preventDefault();
        e.stopPropagation();
        if (!allowScroll) {
          allowScroll = true;
          $("#pagewrap").scrollTop(slidePos + 1);
          allowScroll = false;
        }
        return false;
      } else {
        if (delta > 0) { //DOWN
          if (!animating && allowScroll && ($("#pagewrap").scrollTop() > (slidePos - ($(window).height() - 50)) && !belowSlide)) {
            if (!didInit) {
              gotoSection(0, 1);
              didInit = true;
            }
          }
          if (!animating && allowScroll && ($("#pagewrap").scrollTop() > slidePos) && !belowSlide) {
            allowScroll = false;
            animating = true;
            clearTimeout(animTimeout);
            animTimeout = setTimeout(() => {
              animating = false;
            }, 500);
          }
        } else if (delta !== undefined) {
          if (!animating && allowScroll && ($("#pagewrap").scrollTop() < (slidePos + 50)) && belowSlide) {
            allowScroll = false;
            $("#slide-wrap").addClass("fixed");
            animating = true;
            clearTimeout(animTimeout);
            animTimeout = setTimeout(() => {
              animating = false;
            }, 500);
          }
        }
      }
    })
  });
            
  gsap.registerPlugin(Observer);

  let sections = document.querySelectorAll("section"),
    images = document.querySelectorAll(".bg"),
    headings = gsap.utils.toArray(".section-heading"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    splitHeadings = headings.map(
    (heading) =>
      [heading]
  ),
    wrap = gsap.utils.wrap(0, sections.length);

  gsap.set(outerWrappers, { xPercent: 100 });
  gsap.set(innerWrappers, { xPercent: -100 });

  function gotoSection(index, direction) {
    index = wrap(index); // make sure it's valid
    animating = true;
    gsap.to($(".section-heading"), { opacity: 0, duration: 0.3, ease: "power1.inOut" });
    console.log(headings);
    let fromTop = direction === -1,
      dFactor = fromTop ? -1 : 1,
      tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => {
          gsap.to($(".section-heading"), { opacity: 1, duration: 0.3, ease: "power1.inOut" });
          animating = false;
        }
      });
    if (currentIndex >= 0) {
      // The first time this function runs, current is -1
      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.to(images[currentIndex], { xPercent: -15 * dFactor }).set(
        sections[currentIndex],
        { autoAlpha: 0 }
      );
    }
    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo(
      [outerWrappers[index], innerWrappers[index]],
      { xPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
      { xPercent: 0 },
      0
    )
      .fromTo(images[index], { xPercent: 15 * dFactor }, { xPercent: 0 }, 0);

    currentIndex = index;
  }
