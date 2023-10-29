    let start = null;

    window.addEventListener('touchstart', function(e) {
        start = e.changedTouches[0];
    });
   
    
  var animTimeout;
  let didInit = false, isAnimating, currentIndex = -1, allowScroll = true, slidePos, lastSwipeDelta = null, belowSlide = false;
  
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
  
  $(document).ready(() => {
    $('body').on('scroll mousewheel', function(e){
      var delta = e.originalEvent.deltaY;
      if (!allowScroll) {
        updateSliderPos(lenisScroll, delta);
      }
    });
  });

  function updateSliderPos(lenisSc, delta) {
      if (lastSwipeDelta !== null) {
        delta = lastSwipeDelta;
      }
      if (!allowScroll) {
        if (delta > 0) { //DOWN
          if ((currentIndex + 1) < $("#slide-wrap").find(".bg").length) {
            !isAnimating && gotoSection(currentIndex + 1, 1);
          } else {
            if (!isAnimating) {
              $("#slide-wrap").removeClass("fixed");
              allowScroll = true;
              belowSlide = true;
              lenis.start();
            }
          }
        } else if (delta !== undefined) { //UP
            if ((currentIndex - 1) > -1) {
              !isAnimating && gotoSection(currentIndex - 1, -1);
            } else { //SCROLL UP
              if (!isAnimating) {
                $("#slide-wrap").removeClass("fixed");
                belowSlide = false;
                allowScroll = true;
                lenis.start();
                isAnimating = true;
                clearTimeout(animTimeout);
                animTimeout = setTimeout(() => {
                  isAnimating = false;
                }, 500);
              }
            }
        }
      } else {
        if (delta > 0) { //DOWN
          if (!didInit && lenisSc > ($(".slide-wrap").offset().top + 100) && !belowSlide) {
            belowSlide = true;
            gotoSection(("#slide-wrap > .bg").length, -1);
            didInit = true;
          }
          if (!isAnimating && allowScroll && (lenisSc > ($(".slide-wrap").offset().top - ($(window).height() - 50)) && !belowSlide)) {
            if (!didInit) {
              gotoSection(0, 1);
            }
          }
          if (!isAnimating && allowScroll && (lenisSc > $(".slide-wrap").offset().top) && !belowSlide) {
            allowScroll = false;
            $("#slide-wrap").addClass("fixed");
            lenis.stop();
            isAnimating = true;
            clearTimeout(animTimeout);
            animTimeout = setTimeout(() => {
              isAnimating = false;
            }, 500);
          }
          if (!didInit && (lenisSc > $(".slide-wrap").offset().top) && !belowSlide) {
            allowScroll = false;
            $("#slide-wrap").addClass("fixed");
            lenis.stop();
            isAnimating = true;
            clearTimeout(animTimeout);
            animTimeout = setTimeout(() => {
              isAnimating = false;
            }, 500);
          }
        } else if (delta !== undefined) {
          if (!isAnimating && allowScroll && (lenisSc < ($(".slide-wrap").offset().top + 25)) && belowSlide) {
            allowScroll = false;
            $("#slide-wrap").addClass("fixed");
            lenis.stop();
            isAnimating = true;
            clearTimeout(animTimeout);
            animTimeout = setTimeout(() => {
              isAnimating = false;
            }, 500);
          }
        }
      }
    }
  
           
  gsap.registerPlugin(Observer);

  let sections = document.getElementById('pagewrap').querySelectorAll("section"),
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
    isAnimating = true;
    gsap.to($(".section-heading"), { opacity: 0, duration: 0.3, ease: "power1.inOut" });
    let fromTop = direction === -1,
      dFactor = fromTop ? -1 : 1,
      tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => {
          gsap.to($(".section-heading"), { opacity: 1, duration: 0.3, ease: "power1.inOut" });
          isAnimating = false;
          if (!didInit) {
            didInit = true;
          }
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
  
