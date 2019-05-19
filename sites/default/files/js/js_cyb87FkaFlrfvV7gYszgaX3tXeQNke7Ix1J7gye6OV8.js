jQuery(document).ready(function($) {
  if ($(".smooth-scroll").length>0) {
    $(".smooth-scroll a, a.smooth-scroll").click(function() {
      if (location.pathname.replace(/^\//,"") == this.pathname.replace(/^\//,"") && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $("[name=" + this.hash.slice(1) +"]");
        if (target.length) {
          $("html,body").animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  }
});
;
;
;

/**
 *  @file
 *  A simple jQuery Cycle Div Slideshow Rotator.
 */

/**
 * This will set our initial behavior, by starting up each individual slideshow.
 */
(function ($, Drupal, drupalSettings) {
    Drupal.behaviors.viewsSlideshowCycle = {
        attach: function (context) {
            $('.views_slideshow_cycle_main:not(.viewsSlideshowCycle-processed)', context).addClass('viewsSlideshowCycle-processed').each(function() {
                var fullId = '#' + $(this).attr('id');
                var settings = drupalSettings.viewsSlideshowCycle[fullId];
                settings.targetId = '#' + $(fullId + " :first").attr('id');

                settings.slideshowId = settings.targetId.replace('#views_slideshow_cycle_teaser_section_', '');
                // Pager after function.
                var pager_after_fn = function(curr, next, opts) {
                    // Need to do some special handling on first load.
                    var slideNum = opts.currSlide;
                    if (typeof settings.processedAfter == 'undefined' || !settings.processedAfter) {
                        settings.processedAfter = 1;
                        slideNum = (typeof settings.opts.startingSlide == 'undefined') ? 0 : settings.opts.startingSlide;
                    }
                    Drupal.viewsSlideshow.action({ "action": 'transitionEnd', "slideshowID": settings.slideshowId, "slideNum": slideNum });
                }
                // Pager before function.
                var pager_before_fn = function(curr, next, opts) {
                    var slideNum = opts.nextSlide;

                    // Remember last slide.
                    if (settings.remember_slide) {
                        createCookie(settings.vss_id, slideNum, settings.remember_slide_days);
                    }

                    // Make variable height.
                    if (!settings.fixed_height) {
                        //get the height of the current slide
                        var $ht = $(next).height();
                        //set the container's height to that of the current slide
                        $(next).parent().animate({height: $ht});
                    }

                    // Need to do some special handling on first load.
                    if (typeof settings.processedBefore == 'undefined' || !settings.processedBefore) {
                        settings.processedBefore = 1;
                        slideNum = (typeof opts.startingSlide == 'undefined') ? 0 : opts.startingSlide;
                    }

                    Drupal.viewsSlideshow.action({ "action": 'transitionBegin', "slideshowID": settings.slideshowId, "slideNum": slideNum });
                }
                settings.loaded = false;

                settings.opts = {
                    speed:settings.speed,
                    timeout:settings.timeout,
                    delay:settings.delay,
                    sync:settings.sync,
                    random:settings.random,
                    nowrap:settings.nowrap,
                    after:pager_after_fn,
                    before:pager_before_fn,
                    cleartype:(settings.cleartype)? true : false,
                    cleartypeNoBg:(settings.cleartypenobg)? true : false
                }

                // Set the starting slide if we are supposed to remember the slide
                if (settings.remember_slide) {
                    var startSlide = readCookie(settings.vss_id);
                    if (startSlide == null) {
                        startSlide = 0;
                    }
                    settings.opts.startingSlide = parseInt(startSlide);
                }

                if (settings.effect == 'none') {
                    settings.opts.speed = 1;
                }
                else {
                    settings.opts.fx = settings.effect;
                }

                // Take starting item from fragment.
                var hash = location.hash;
                if (hash) {
                    var hash = hash.replace('#', '');
                    var aHash = hash.split(';');
                    var aHashLen = aHash.length;

                    // Loop through all the possible starting points.
                    for (var i = 0; i < aHashLen; i++) {
                        // Split the hash into two parts. One part is the slideshow id the
                        // other is the slide number.
                        var initialInfo = aHash[i].split(':');
                        // The id in the hash should match our slideshow.
                        // The slide number chosen shouldn't be larger than the number of
                        // slides we have.
                        if (settings.slideshowId == initialInfo[0] && settings.num_divs > initialInfo[1]) {
                            settings.opts.startingSlide = parseInt(initialInfo[1]);
                        }
                    }
                }

                // Pause on hover.
                if (settings.pause) {
                    var mouseIn = function() {
                        Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": settings.slideshowId });
                    }

                    var mouseOut = function() {
                        Drupal.viewsSlideshow.action({ "action": 'play', "slideshowID": settings.slideshowId });
                    }

                    if (jQuery.fn.hoverIntent) {
                        $('#views_slideshow_cycle_teaser_section_' + settings.vss_id).hoverIntent(mouseIn, mouseOut);
                    }
                    else {
                        $('#views_slideshow_cycle_teaser_section_' + settings.vss_id).hover(mouseIn, mouseOut);
                    }
                }

                // Pause on clicking of the slide.
                if (settings.pause_on_click) {
                    $('#views_slideshow_cycle_teaser_section_' + settings.vss_id).click(function() {
                        Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": settings.slideshowId, "force": true });
                    });
                }

                if (typeof JSON != 'undefined' && typeof settings.advanced_options != 'undefined') {
                    var advancedOptions = JSON.parse(settings.advanced_options);
                    for (var option in advancedOptions) {
                        switch(option) {

                            // Standard Options
                            case "activePagerClass":
                            case "allowPagerClickBubble":
                            case "autostop":
                            case "autostopCount":
                            case "backwards":
                            case "bounce":
                            case "cleartype":
                            case "cleartypeNoBg":
                            case "containerResize":
                            case "continuous":
                            case "delay":
                            case "easeIn":
                            case "easeOut":
                            case "easing":
                            case "fastOnEvent":
                            case "fit":
                            case "fx":
                            case "height":
                            case "manualTrump":
                            case "metaAttr":
                            case "next":
                            case "nowrap":
                            case "pager":
                            case "pagerEvent":
                            case "pause":
                            case "pauseOnPagerHover":
                            case "prev":
                            case "prevNextEvent":
                            case "random":
                            case "randomizeEffects":
                            case "requeueOnImageNotLoaded":
                            case "requeueTimeout":
                            case "rev":
                            case "slideExpr":
                            case "slideResize":
                            case "speed":
                            case "speedIn":
                            case "speedOut":
                            case "startingSlide":
                            case "sync":
                            case "timeout":
                            case "width":
                                var optionValue = advancedOptions[option];
                                optionValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(optionValue);
                                settings.opts[option] = optionValue;
                                break;

                            // These process options that look like {top:50, bottom:20}
                            case "animIn":
                            case "animOut":
                            case "cssBefore":
                            case "cssAfter":
                            case "shuffle":
                                var cssValue = advancedOptions[option];
                                cssValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(cssValue);
                                settings.opts[option] = eval('(' + cssValue + ')');
                                break;

                            // These options have their own functions.
                            case "after":
                                var afterValue = advancedOptions[option];
                                afterValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(afterValue);
                                // transition callback (scope set to element that was shown): function(currSlideElement, nextSlideElement, options, forwardFlag)
                                settings.opts[option] = function(currSlideElement, nextSlideElement, options, forwardFlag) {
                                    pager_after_fn(currSlideElement, nextSlideElement, options);
                                    eval(afterValue);
                                }
                                break;

                            case "before":
                                var beforeValue = advancedOptions[option];
                                beforeValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(beforeValue);
                                // transition callback (scope set to element to be shown):     function(currSlideElement, nextSlideElement, options, forwardFlag)
                                settings.opts[option] = function(currSlideElement, nextSlideElement, options, forwardFlag) {
                                    pager_before_fn(currSlideElement, nextSlideElement, options);
                                    eval(beforeValue);
                                }
                                break;

                            case "end":
                                var endValue = advancedOptions[option];
                                endValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(endValue);
                                // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
                                settings.opts[option] = function(options) {
                                    eval(endValue);
                                }
                                break;

                            case "fxFn":
                                var fxFnValue = advancedOptions[option];
                                fxFnValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(fxFnValue);
                                // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
                                settings.opts[option] = function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag) {
                                    eval(fxFnValue);
                                }
                                break;

                            case "onPagerEvent":
                                var onPagerEventValue = advancedOptions[option];
                                onPagerEventValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(onPagerEventValue);
                                settings.opts[option] = function(zeroBasedSlideIndex, slideElement) {
                                    eval(onPagerEventValue);
                                }
                                break;

                            case "onPrevNextEvent":
                                var onPrevNextEventValue = advancedOptions[option];
                                onPrevNextEventValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(onPrevNextEventValue);
                                settings.opts[option] = function(isNext, zeroBasedSlideIndex, slideElement) {
                                    eval(onPrevNextEventValue);
                                }
                                break;

                            case "pagerAnchorBuilder":
                                var pagerAnchorBuilderValue = advancedOptions[option];
                                pagerAnchorBuilderValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(pagerAnchorBuilderValue);
                                // callback fn for building anchor links:  function(index, DOMelement)
                                settings.opts[option] = function(index, DOMelement) {
                                    var returnVal = '';
                                    eval(pagerAnchorBuilderValue);
                                    return returnVal;
                                }
                                break;

                            case "pagerClick":
                                var pagerClickValue = advancedOptions[option];
                                pagerClickValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(pagerClickValue);
                                // callback fn for pager clicks:    function(zeroBasedSlideIndex, slideElement)
                                settings.opts[option] = function(zeroBasedSlideIndex, slideElement) {
                                    eval(pagerClickValue);
                                }
                                break;

                            case "paused":
                                var pausedValue = advancedOptions[option];
                                pausedValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(pausedValue);
                                // undocumented callback when slideshow is paused:    function(cont, opts, byHover)
                                settings.opts[option] = function(cont, opts, byHover) {
                                    eval(pausedValue);
                                }
                                break;

                            case "resumed":
                                var resumedValue = advancedOptions[option];
                                resumedValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(resumedValue);
                                // undocumented callback when slideshow is resumed:    function(cont, opts, byHover)
                                settings.opts[option] = function(cont, opts, byHover) {
                                    eval(resumedValue);
                                }
                                break;

                            case "timeoutFn":
                                var timeoutFnValue = advancedOptions[option];
                                timeoutFnValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(timeoutFnValue);
                                settings.opts[option] = function(currSlideElement, nextSlideElement, options, forwardFlag) {
                                    eval(timeoutFnValue);
                                }
                                break;

                            case "updateActivePagerLink":
                                var updateActivePagerLinkValue = advancedOptions[option];
                                updateActivePagerLinkValue = Drupal.viewsSlideshowCycle.advancedOptionCleanup(updateActivePagerLinkValue);
                                // callback fn invoked to update the active pager link (adds/removes activePagerClass style)
                                settings.opts[option] = function(pager, currSlideIndex) {
                                    eval(updateActivePagerLinkValue);
                                }
                                break;
                        }
                    }
                }

                // If selected wait for the images to be loaded.
                // otherwise just load the slideshow.
                if (settings.wait_for_image_load) {
                    // For IE/Chrome/Opera we if there are images then we need to make
                    // sure the images are loaded before starting the slideshow.
                    settings.totalImages = $(settings.targetId + ' img').length;
                    if (settings.totalImages) {
                        settings.loadedImages = 0;

                        // Add a load event for each image.
                        $(settings.targetId + ' img').each(function() {
                            var $imageElement = $(this);
                            $imageElement.bind('load', function () {
                                Drupal.viewsSlideshowCycle.imageWait(fullId);
                            });

                            // Removing the source and adding it again will fire the load event.
                            var imgSrc = $imageElement.attr('src');
                            $imageElement.attr('src', '');
                            $imageElement.attr('src', imgSrc);
                        });

                        // We need to set a timeout so that the slideshow doesn't wait
                        // indefinitely for all images to load.
                        setTimeout("Drupal.viewsSlideshowCycle.load('" + fullId + "')", settings.wait_for_image_load_timeout);
                    }
                    else {
                        Drupal.viewsSlideshowCycle.load(fullId);
                    }
                }
                else {
                    Drupal.viewsSlideshowCycle.load(fullId);
                }
            });
        }
    };

    Drupal.viewsSlideshowCycle = Drupal.viewsSlideshowCycle || {};

    // Cleanup the values of advanced options.
    Drupal.viewsSlideshowCycle.advancedOptionCleanup = function(value) {
        value = $.trim(value);
        value = value.replace(/\n/g, '');
        if (!isNaN(parseInt(value))) {
            value = parseInt(value);
        }
        else if (value.toLowerCase() == 'true') {
            value = true;
        }
        else if (value.toLowerCase() == 'false') {
            value = false;
        }

        return value;
    }

    // This checks to see if all the images have been loaded.
    // If they have then it starts the slideshow.
    Drupal.viewsSlideshowCycle.imageWait = function(fullId) {
        if (++drupalSettings.viewsSlideshowCycle[fullId].loadedImages == drupalSettings.viewsSlideshowCycle[fullId].totalImages) {
            Drupal.viewsSlideshowCycle.load(fullId);
        }
    };

    // Start the slideshow.
    Drupal.viewsSlideshowCycle.load = function (fullId) {
        var settings = drupalSettings.viewsSlideshowCycle[fullId];

        // Make sure the slideshow isn't already loaded.
        if (!settings.loaded) {
            $(settings.targetId).cycle(settings.opts);
            settings.loaded = true;

            // Start Paused
            if (settings.start_paused) {
                Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": settings.slideshowId, "force": true });
            }

            // Pause if hidden.
            if (settings.pause_when_hidden) {
                var checkPause = function(settings) {
                    // If the slideshow is visible and it is paused then resume.
                    // otherwise if the slideshow is not visible and it is not paused then
                    // pause it.
                    var visible = viewsSlideshowCycleIsVisible(settings.targetId, settings.pause_when_hidden_type, settings.amount_allowed_visible);
                    if (visible) {
                        Drupal.viewsSlideshow.action({ "action": 'play', "slideshowID": settings.slideshowId });
                    }
                    else {
                        Drupal.viewsSlideshow.action({ "action": 'pause', "slideshowID": settings.slideshowId });
                    }
                }

                // Check when scrolled.
                $(window).scroll(function() {
                    checkPause(settings);
                });

                // Check when the window is resized.
                $(window).resize(function() {
                    checkPause(settings);
                });
            }
        }
    };

    Drupal.viewsSlideshowCycle.pause = function (options) {
        //Eat TypeError, cycle doesn't handle pause well if options isn't defined.
        try{
            if (options.pause_in_middle && $.fn.pause) {
                $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).pause();
            }
            else {
                $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle('pause');
            }
        }
        catch(e){
            if(!e instanceof TypeError){
                throw e;
            }
        }
    };

    Drupal.viewsSlideshowCycle.play = function (options) {
        drupalSettings.viewsSlideshowCycle['#views_slideshow_cycle_main_' + options.slideshowID].paused = false;
        if (options.pause_in_middle && $.fn.resume) {
            $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).resume();
        }
        else {
            $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle('resume');
        }
    };

    Drupal.viewsSlideshowCycle.previousSlide = function (options) {
        $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle('prev');
    };

    Drupal.viewsSlideshowCycle.nextSlide = function (options) {
        $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle('next');
    };

    Drupal.viewsSlideshowCycle.goToSlide = function (options) {
        $('#views_slideshow_cycle_teaser_section_' + options.slideshowID).cycle(options.slideNum);
    };

    // Verify that the value is a number.
    function IsNumeric(sText) {
        var ValidChars = "0123456789";
        var IsNumber=true;
        var Char;

        for (var i=0; i < sText.length && IsNumber == true; i++) {
            Char = sText.charAt(i);
            if (ValidChars.indexOf(Char) == -1) {
                IsNumber = false;
            }
        }
        return IsNumber;
    }

    /**
     * Cookie Handling Functions
     */
    function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else {
            var expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }

    /**
     * Checks to see if the slide is visible enough.
     * elem = element to check.
     * type = The way to calculate how much is visible.
     * amountVisible = amount that should be visible. Either in percent or px. If
     *                it's not defined then all of the slide must be visible.
     *
     * Returns true or false
     */
    function viewsSlideshowCycleIsVisible(elem, type, amountVisible) {
        // Get the top and bottom of the window;
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var docViewLeft = $(window).scrollLeft();
        var docViewRight = docViewLeft + $(window).width();

        // Get the top, bottom, and height of the slide;
        var elemTop = $(elem).offset().top;
        var elemHeight = $(elem).height();
        var elemBottom = elemTop + elemHeight;
        var elemLeft = $(elem).offset().left;
        var elemWidth = $(elem).width();
        var elemRight = elemLeft + elemWidth;
        var elemArea = elemHeight * elemWidth;

        // Calculate what's hiding in the slide.
        var missingLeft = 0;
        var missingRight = 0;
        var missingTop = 0;
        var missingBottom = 0;

        // Find out how much of the slide is missing from the left.
        if (elemLeft < docViewLeft) {
            missingLeft = docViewLeft - elemLeft;
        }

        // Find out how much of the slide is missing from the right.
        if (elemRight > docViewRight) {
            missingRight = elemRight - docViewRight;
        }

        // Find out how much of the slide is missing from the top.
        if (elemTop < docViewTop) {
            missingTop = docViewTop - elemTop;
        }

        // Find out how much of the slide is missing from the bottom.
        if (elemBottom > docViewBottom) {
            missingBottom = elemBottom - docViewBottom;
        }

        // If there is no amountVisible defined then check to see if the whole slide
        // is visible.
        if (type == 'full') {
            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
            && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop)
            && (elemLeft >= docViewLeft) && (elemRight <= docViewRight)
            && (elemLeft <= docViewRight) && (elemRight >= docViewLeft));
        }
        else if(type == 'vertical') {
            var verticalShowing = elemHeight - missingTop - missingBottom;

            // If user specified a percentage then find out if the current shown percent
            // is larger than the allowed percent.
            // Otherwise check to see if the amount of px shown is larger than the
            // allotted amount.
            if (amountVisible.indexOf('%')) {
                return (((verticalShowing/elemHeight)*100) >= parseInt(amountVisible));
            }
            else {
                return (verticalShowing >= parseInt(amountVisible));
            }
        }
        else if(type == 'horizontal') {
            var horizontalShowing = elemWidth - missingLeft - missingRight;

            // If user specified a percentage then find out if the current shown percent
            // is larger than the allowed percent.
            // Otherwise check to see if the amount of px shown is larger than the
            // allotted amount.
            if (amountVisible.indexOf('%')) {
                return (((horizontalShowing/elemWidth)*100) >= parseInt(amountVisible));
            }
            else {
                return (horizontalShowing >= parseInt(amountVisible));
            }
        }
        else if(type == 'area') {
            var areaShowing = (elemWidth - missingLeft - missingRight) * (elemHeight - missingTop - missingBottom);

            // If user specified a percentage then find out if the current shown percent
            // is larger than the allowed percent.
            // Otherwise check to see if the amount of px shown is larger than the
            // allotted amount.
            if (amountVisible.indexOf('%')) {
                return (((areaShowing/elemArea)*100) >= parseInt(amountVisible));
            }
            else {
                return (areaShowing >= parseInt(amountVisible));
            }
        }
    }
})(jQuery, Drupal, drupalSettings);
;
;
(function ($, Drupal, drupalSettings) {
  'use strict';
  Drupal.viewsSlideshow = Drupal.viewsSlideshow || {};
  var pagerLocation;
  var slideNum;
  var error;
  var excludeMethods;
  /**
   * Views Slideshow Controls
   */
  Drupal.viewsSlideshowControls = Drupal.viewsSlideshowControls || {};

  /**
   * Implement the play hook for controls.
   */
  Drupal.viewsSlideshowControls.play = function (options) {
    // Route the control call to the correct control type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof drupalSettings.viewsSlideshowControls[options.slideshowID].top.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowControls[options.slideshowID].top.type].play == 'function') {
        Drupal[drupalSettings.viewsSlideshowControls[options.slideshowID].top.type].play(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof drupalSettings.viewsSlideshowControls[options.slideshowID].bottom.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowControls[options.slideshowID].bottom.type].play == 'function') {
        Drupal[drupalSettings.viewsSlideshowControls[options.slideshowID].bottom.type].play(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };

  /**
   * Implement the pause hook for controls.
   */
  Drupal.viewsSlideshowControls.pause = function (options) {
    // Route the control call to the correct control type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof drupalSettings.viewsSlideshowControls[options.slideshowID].top.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowControls[options.slideshowID].top.type].pause == 'function') {
        Drupal[drupalSettings.viewsSlideshowControls[options.slideshowID].top.type].pause(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof drupalSettings.viewsSlideshowControls[options.slideshowID].bottom.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowControls[options.slideshowID].bottom.type].pause == 'function') {
        Drupal[drupalSettings.viewsSlideshowControls[options.slideshowID].bottom.type].pause(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };


  /**
   * Views Slideshow Text Controls
   */

  // Add views slieshow api calls for views slideshow text controls.
  Drupal.behaviors.viewsSlideshowControlsText = {
    attach: function (context) {

      // Process previous link
      $('.views_slideshow_controls_text_previous:not(.views-slideshow-controls-text-previous-processed)', context).addClass('views-slideshow-controls-text-previous-processed').each(function () {
        var uniqueID = $(this).attr('id').replace('views_slideshow_controls_text_previous_', '');
        $(this).click(function () {
          Drupal.viewsSlideshow.action({"action": 'previousSlide', "slideshowID": uniqueID});
          return false;
        });
      });

      // Process next link
      $('.views_slideshow_controls_text_next:not(.views-slideshow-controls-text-next-processed)', context).addClass('views-slideshow-controls-text-next-processed').each(function () {
        var uniqueID = $(this).attr('id').replace('views_slideshow_controls_text_next_', '');
        $(this).click(function () {
          Drupal.viewsSlideshow.action({"action": 'nextSlide', "slideshowID": uniqueID});
          return false;
        });
      });

      // Process pause link
      $('.views_slideshow_controls_text_pause:not(.views-slideshow-controls-text-pause-processed)', context).addClass('views-slideshow-controls-text-pause-processed').each(function () {
        var uniqueID = $(this).attr('id').replace('views_slideshow_controls_text_pause_', '');
        $(this).click(function () {
          if (drupalSettings.viewsSlideshow[uniqueID].paused) {
            Drupal.viewsSlideshow.action({"action": 'play', "slideshowID": uniqueID, "force": true});
          }
          else {
            Drupal.viewsSlideshow.action({"action": 'pause', "slideshowID": uniqueID, "force": true});
          }
          return false;
        });
      });
    }
  };

  Drupal.viewsSlideshowControlsText = Drupal.viewsSlideshowControlsText || {};

  /**
   * Implement the pause hook for text controls.
   */
  Drupal.viewsSlideshowControlsText.pause = function (options) {
    var pauseText = Drupal.theme.viewsSlideshowControlsPause ? Drupal.theme('viewsSlideshowControlsPause') : '';
    var $element = $('#views_slideshow_controls_text_pause_' + options.slideshowID);
    $element.find('a').text(pauseText);
    $element.removeClass('views-slideshow-controls-text-status-play');
    $element.addClass('views-slideshow-controls-text-status-pause');
  };

  /**
   * Implement the play hook for text controls.
   */
  Drupal.viewsSlideshowControlsText.play = function (options) {
    var playText = Drupal.theme.viewsSlideshowControlsPlay ? Drupal.theme('viewsSlideshowControlsPlay') : '';
    var $element = $('#views_slideshow_controls_text_pause_' + options.slideshowID);
    $element.find('a').text(playText);
    $element.removeClass('views-slideshow-controls-text-status-pause');
    $element.addClass('views-slideshow-controls-text-status-play');
  };

  // Theme the resume control.
  Drupal.theme.viewsSlideshowControlsPause = function () {
    return Drupal.t('Resume');
  };

  // Theme the pause control.
  Drupal.theme.viewsSlideshowControlsPlay = function () {
    return Drupal.t('Pause');
  };

  /**
   * Views Slideshow Pager
   */
  Drupal.viewsSlideshowPager = Drupal.viewsSlideshowPager || {};

  /**
   * Implement the transitionBegin hook for pagers.
   */
  Drupal.viewsSlideshowPager.transitionBegin = function (options) {
    // Route the pager call to the correct pager type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof drupalSettings.viewsSlideshowPager != "undefined" && typeof drupalSettings.viewsSlideshowPager[options.slideshowID].top.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].top.type].transitionBegin == 'function') {
        Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].top.type].transitionBegin(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof drupalSettings.viewsSlideshowPager != "undefined" && typeof drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type].transitionBegin == 'function') {
        Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type].transitionBegin(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };

  /**
   * Implement the goToSlide hook for pagers.
   */
  Drupal.viewsSlideshowPager.goToSlide = function (options) {
    // Route the pager call to the correct pager type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof drupalSettings.viewsSlideshowPager[options.slideshowID].top.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].top.type].goToSlide == 'function') {
        Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].top.type].goToSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type].goToSlide == 'function') {
        Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type].goToSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };

  /**
   * Implement the previousSlide hook for pagers.
   */
  Drupal.viewsSlideshowPager.previousSlide = function (options) {
    // Route the pager call to the correct pager type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof drupalSettings.viewsSlideshowPager[options.slideshowID].top.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].top.type].previousSlide == 'function') {
        Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].top.type].previousSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type].previousSlide == 'function') {
        Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type].previousSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };

  /**
   * Implement the nextSlide hook for pagers.
   */
  Drupal.viewsSlideshowPager.nextSlide = function (options) {
    // Route the pager call to the correct pager type.
    // Need to use try catch so we don't have to check to make sure every part
    // of the object is defined.
    try {
      if (typeof drupalSettings.viewsSlideshowPager[options.slideshowID].top.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].top.type].nextSlide == 'function') {
        Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].top.type].nextSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }

    try {
      if (typeof drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type != "undefined" && typeof Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type].nextSlide == 'function') {
        Drupal[drupalSettings.viewsSlideshowPager[options.slideshowID].bottom.type].nextSlide(options);
      }
    }
    catch(err) {
      // Don't need to do anything on error.
    }
  };


  /**
   * Views Slideshow Pager Fields
   */

  // Add views slieshow api calls for views slideshow pager fields.
  Drupal.behaviors.viewsSlideshowPagerFields = {
    attach: function (context) {
      // Process pause on hover.
      $('.views_slideshow_pager_field:not(.views-slideshow-pager-field-processed)', context).addClass('views-slideshow-pager-field-processed').each(function () {
        // Parse out the location and unique id from the full id.
        var pagerInfo = $(this).attr('id').split('_');
        var location = pagerInfo[2];
        pagerInfo.splice(0, 3);
        var uniqueID = pagerInfo.join('_');

        // Add the activate and pause on pager hover event to each pager item.
        if (drupalSettings.viewsSlideshowPagerFields[uniqueID][location].activatePauseOnHover) {
          $(this).children().each(function (index, pagerItem) {
            var mouseIn = function () {
              Drupal.viewsSlideshow.action({"action": 'goToSlide', "slideshowID": uniqueID, "slideNum": index});
              Drupal.viewsSlideshow.action({"action": 'pause', "slideshowID": uniqueID});
            };

            var mouseOut = function () {
              Drupal.viewsSlideshow.action({"action": 'play', "slideshowID": uniqueID});
            };

            if (jQuery.fn.hoverIntent) {
              $(pagerItem).hoverIntent(mouseIn, mouseOut);
            }
            else {
              $(pagerItem).hover(mouseIn, mouseOut);
            }
          });
        }
        else {
          $(this).children().each(function (index, pagerItem) {
            $(pagerItem).click(function () {
              Drupal.viewsSlideshow.action({"action": 'goToSlide', "slideshowID": uniqueID, "slideNum": index});
            });
          });
        }
      });
    }
  };

  Drupal.viewsSlideshowPagerFields = Drupal.viewsSlideshowPagerFields || {};

  /**
   * Implement the transitionBegin hook for pager fields pager.
   */
  Drupal.viewsSlideshowPagerFields.transitionBegin = function (options) {
    for (pagerLocation in drupalSettings.viewsSlideshowPager[options.slideshowID]) {
      if (drupalSettings.viewsSlideshowPager[options.slideshowID]) {
        // Remove active class from pagers
        $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').removeClass('active');

        // Add active class to active pager.
        $('#views_slideshow_pager_field_item_'+ pagerLocation + '_' + options.slideshowID + '_' + options.slideNum).addClass('active');
      }
    }
  };

  /**
   * Implement the goToSlide hook for pager fields pager.
   */
  Drupal.viewsSlideshowPagerFields.goToSlide = function (options) {
    for (pagerLocation in drupalSettings.viewsSlideshowPager[options.slideshowID]) {
      if (drupalSettings.viewsSlideshowPager[options.slideshowID]) {
        // Remove active class from pagers
        $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').removeClass('active');

        // Add active class to active pager.
        $('#views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_' + options.slideNum).addClass('active');
      }
    }
  };

  /**
   * Implement the previousSlide hook for pager fields pager.
   */
  Drupal.viewsSlideshowPagerFields.previousSlide = function (options) {
    for (pagerLocation in drupalSettings.viewsSlideshowPager[options.slideshowID]) {
      if (drupalSettings.viewsSlideshowPager[options.slideshowID]) {
        // Get the current active pager.
        var pagerNum = $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"].active').attr('id').replace('views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_', '');

        // If we are on the first pager then activate the last pager.
        // Otherwise activate the previous pager.
        if (pagerNum === 0) {
          pagerNum = $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').length() - 1;
        }
        else {
          pagerNum--;
        }

        // Remove active class from pagers
        $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').removeClass('active');

        // Add active class to active pager.
        $('#views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_' + pagerNum).addClass('active');
      }
    }
  };

  /**
   * Implement the nextSlide hook for pager fields pager.
   */
  Drupal.viewsSlideshowPagerFields.nextSlide = function (options) {
    for (pagerLocation in drupalSettings.viewsSlideshowPager[options.slideshowID]) {
      if (drupalSettings.viewsSlideshowPager[options.slideshowID]) {
        // Get the current active pager.
        var pagerNum = $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"].active').attr('id').replace('views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_', '');
        var totalPagers = $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').length();

        // If we are on the last pager then activate the first pager.
        // Otherwise activate the next pager.
        pagerNum++;
        if (pagerNum === totalPagers) {
          pagerNum = 0;
        }

        // Remove active class from pagers
        $('[id^="views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '"]').removeClass('active');

        // Add active class to active pager.
        $('#views_slideshow_pager_field_item_' + pagerLocation + '_' + options.slideshowID + '_' + slideNum).addClass('active');
      }
    }
  };

  // Copy the pager hooks from fields pager to the bullets one.
  Drupal.viewsSlideshowPagerBullets = Drupal.viewsSlideshowPagerFields || {};

  /**
   * Views Slideshow Slide Counter
   */

  Drupal.viewsSlideshowSlideCounter = Drupal.viewsSlideshowSlideCounter || {};

  /**
   * Implement the transitionBegin for the slide counter.
   */
  Drupal.viewsSlideshowSlideCounter.transitionBegin = function (options) {
    $('#views_slideshow_slide_counter_' + options.slideshowID + ' .num').text(options.slideNum + 1);
  };

  /**
   * This is used as a router to process actions for the slideshow.
   */
  Drupal.viewsSlideshow.action = function (options) {
    // Set default values for our return status.
    var status = {
      'value': true,
      'text': ''
    };

    // If an action isn't specified return false.
    if (typeof options.action == 'undefined' || options.action === '') {
      status.value = false;
      status.text =  Drupal.t('There was no action specified.');
      return error;
    }

    // If we are using pause or play switch paused state accordingly.
    if (options.action === 'pause') {
      drupalSettings.viewsSlideshow[options.slideshowID].paused = 1;
      // If the calling method is forcing a pause then mark it as such.
      if (options.force) {
        drupalSettings.viewsSlideshow[options.slideshowID].pausedForce = 1;
      }
    }
    else if (options.action === 'play') {
      // If the slideshow isn't forced pause or we are forcing a play then play
      // the slideshow.
      // Otherwise return telling the calling method that it was forced paused.
      if (!drupalSettings.viewsSlideshow[options.slideshowID].pausedForce || options.force) {
        drupalSettings.viewsSlideshow[options.slideshowID].paused = 0;
        drupalSettings.viewsSlideshow[options.slideshowID].pausedForce = 0;
      }
      else {
        status.value = false;
        status.text += ' ' + Drupal.t('This slideshow is forced paused.');
        return status;
      }
    }

    // We use a switch statement here mainly just to limit the type of actions
    // that are available.
    switch (options.action) {
      case "goToSlide":
      case "transitionBegin":
      case "transitionEnd":
        // The three methods above require a slide number. Checking if it is
        // defined and it is a number that is an integer.
        if (typeof options.slideNum == 'undefined' || typeof options.slideNum !== 'number' || parseInt(options.slideNum) !== (options.slideNum - 0)) {
          status.value = false;
          status.text = Drupal.t('An invalid integer was specified for slideNum.');
        }
      case "pause":
      case "play":
      case "nextSlide":
      case "previousSlide":
        // Grab our list of methods.
        var methods = drupalSettings.viewsSlideshow[options.slideshowID]['methods'];

        // if the calling method specified methods that shouldn't be called then
        // exclude calling them.
        var excludeMethodsObj = {};
        if (typeof options.excludeMethods !== 'undefined') {
          // We need to turn the excludeMethods array into an object so we can use the in
          // function.
          for (var i=0; i < excludeMethods.length; i++) {
            excludeMethodsObj[excludeMethods[i]] = '';
          }
        }

        // Call every registered method and don't call excluded ones.
        for (var i = 0; i < methods[options.action].length; i++) {
          if (Drupal[methods[options.action][i]] !== 'undefined' && typeof Drupal[methods[options.action][i]][options.action] == 'function' && !(methods[options.action][i] in excludeMethodsObj)) {
            Drupal[methods[options.action][i]][options.action](options);
          }
        }
        break;

      // If it gets here it's because it's an invalid action.
      default:
        status.value = false;
        status.text = Drupal.t('An invalid action "@action" was specified.', {"@action": options.action});
    }
    return status;
  };
})(jQuery, Drupal, drupalSettings);
;
/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):window.jQuery||window.Zepto)}(function(a){var b,c,d,e,f,g,h="Close",i="BeforeClose",j="AfterClose",k="BeforeAppend",l="MarkupParse",m="Open",n="Change",o="mfp",p="."+o,q="mfp-ready",r="mfp-removing",s="mfp-prevent-close",t=function(){},u=!!window.jQuery,v=a(window),w=function(a,c){b.ev.on(o+a+p,c)},x=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},y=function(c,d){b.ev.triggerHandler(o+c,d),b.st.callbacks&&(c=c.charAt(0).toLowerCase()+c.slice(1),b.st.callbacks[c]&&b.st.callbacks[c].apply(b,a.isArray(d)?d:[d]))},z=function(c){return c===g&&b.currTemplate.closeBtn||(b.currTemplate.closeBtn=a(b.st.closeMarkup.replace("%title%",b.st.tClose)),g=c),b.currTemplate.closeBtn},A=function(){a.magnificPopup.instance||(b=new t,b.init(),a.magnificPopup.instance=b)},B=function(){var a=document.createElement("p").style,b=["ms","O","Moz","Webkit"];if(void 0!==a.transition)return!0;for(;b.length;)if(b.pop()+"Transition"in a)return!0;return!1};t.prototype={constructor:t,init:function(){var c=navigator.appVersion;b.isLowIE=b.isIE8=document.all&&!document.addEventListener,b.isAndroid=/android/gi.test(c),b.isIOS=/iphone|ipad|ipod/gi.test(c),b.supportsTransition=B(),b.probablyMobile=b.isAndroid||b.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),d=a(document),b.popupsCache={}},open:function(c){var e;if(c.isObj===!1){b.items=c.items.toArray(),b.index=0;var g,h=c.items;for(e=0;e<h.length;e++)if(g=h[e],g.parsed&&(g=g.el[0]),g===c.el[0]){b.index=e;break}}else b.items=a.isArray(c.items)?c.items:[c.items],b.index=c.index||0;if(b.isOpen)return void b.updateItemHTML();b.types=[],f="",c.mainEl&&c.mainEl.length?b.ev=c.mainEl.eq(0):b.ev=d,c.key?(b.popupsCache[c.key]||(b.popupsCache[c.key]={}),b.currTemplate=b.popupsCache[c.key]):b.currTemplate={},b.st=a.extend(!0,{},a.magnificPopup.defaults,c),b.fixedContentPos="auto"===b.st.fixedContentPos?!b.probablyMobile:b.st.fixedContentPos,b.st.modal&&(b.st.closeOnContentClick=!1,b.st.closeOnBgClick=!1,b.st.showCloseBtn=!1,b.st.enableEscapeKey=!1),b.bgOverlay||(b.bgOverlay=x("bg").on("click"+p,function(){b.close()}),b.wrap=x("wrap").attr("tabindex",-1).on("click"+p,function(a){b._checkIfClose(a.target)&&b.close()}),b.container=x("container",b.wrap)),b.contentContainer=x("content"),b.st.preloader&&(b.preloader=x("preloader",b.container,b.st.tLoading));var i=a.magnificPopup.modules;for(e=0;e<i.length;e++){var j=i[e];j=j.charAt(0).toUpperCase()+j.slice(1),b["init"+j].call(b)}y("BeforeOpen"),b.st.showCloseBtn&&(b.st.closeBtnInside?(w(l,function(a,b,c,d){c.close_replaceWith=z(d.type)}),f+=" mfp-close-btn-in"):b.wrap.append(z())),b.st.alignTop&&(f+=" mfp-align-top"),b.fixedContentPos?b.wrap.css({overflow:b.st.overflowY,overflowX:"hidden",overflowY:b.st.overflowY}):b.wrap.css({top:v.scrollTop(),position:"absolute"}),(b.st.fixedBgPos===!1||"auto"===b.st.fixedBgPos&&!b.fixedContentPos)&&b.bgOverlay.css({height:d.height(),position:"absolute"}),b.st.enableEscapeKey&&d.on("keyup"+p,function(a){27===a.keyCode&&b.close()}),v.on("resize"+p,function(){b.updateSize()}),b.st.closeOnContentClick||(f+=" mfp-auto-cursor"),f&&b.wrap.addClass(f);var k=b.wH=v.height(),n={};if(b.fixedContentPos&&b._hasScrollBar(k)){var o=b._getScrollbarSize();o&&(n.marginRight=o)}b.fixedContentPos&&(b.isIE7?a("body, html").css("overflow","hidden"):n.overflow="hidden");var r=b.st.mainClass;return b.isIE7&&(r+=" mfp-ie7"),r&&b._addClassToMFP(r),b.updateItemHTML(),y("BuildControls"),a("html").css(n),b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo||a(document.body)),b._lastFocusedEl=document.activeElement,setTimeout(function(){b.content?(b._addClassToMFP(q),b._setFocus()):b.bgOverlay.addClass(q),d.on("focusin"+p,b._onFocusIn)},16),b.isOpen=!0,b.updateSize(k),y(m),c},close:function(){b.isOpen&&(y(i),b.isOpen=!1,b.st.removalDelay&&!b.isLowIE&&b.supportsTransition?(b._addClassToMFP(r),setTimeout(function(){b._close()},b.st.removalDelay)):b._close())},_close:function(){y(h);var c=r+" "+q+" ";if(b.bgOverlay.detach(),b.wrap.detach(),b.container.empty(),b.st.mainClass&&(c+=b.st.mainClass+" "),b._removeClassFromMFP(c),b.fixedContentPos){var e={marginRight:""};b.isIE7?a("body, html").css("overflow",""):e.overflow="",a("html").css(e)}d.off("keyup"+p+" focusin"+p),b.ev.off(p),b.wrap.attr("class","mfp-wrap").removeAttr("style"),b.bgOverlay.attr("class","mfp-bg"),b.container.attr("class","mfp-container"),!b.st.showCloseBtn||b.st.closeBtnInside&&b.currTemplate[b.currItem.type]!==!0||b.currTemplate.closeBtn&&b.currTemplate.closeBtn.detach(),b.st.autoFocusLast&&b._lastFocusedEl&&a(b._lastFocusedEl).focus(),b.currItem=null,b.content=null,b.currTemplate=null,b.prevHeight=0,y(j)},updateSize:function(a){if(b.isIOS){var c=document.documentElement.clientWidth/window.innerWidth,d=window.innerHeight*c;b.wrap.css("height",d),b.wH=d}else b.wH=a||v.height();b.fixedContentPos||b.wrap.css("height",b.wH),y("Resize")},updateItemHTML:function(){var c=b.items[b.index];b.contentContainer.detach(),b.content&&b.content.detach(),c.parsed||(c=b.parseEl(b.index));var d=c.type;if(y("BeforeChange",[b.currItem?b.currItem.type:"",d]),b.currItem=c,!b.currTemplate[d]){var f=b.st[d]?b.st[d].markup:!1;y("FirstMarkupParse",f),f?b.currTemplate[d]=a(f):b.currTemplate[d]=!0}e&&e!==c.type&&b.container.removeClass("mfp-"+e+"-holder");var g=b["get"+d.charAt(0).toUpperCase()+d.slice(1)](c,b.currTemplate[d]);b.appendContent(g,d),c.preloaded=!0,y(n,c),e=c.type,b.container.prepend(b.contentContainer),y("AfterChange")},appendContent:function(a,c){b.content=a,a?b.st.showCloseBtn&&b.st.closeBtnInside&&b.currTemplate[c]===!0?b.content.find(".mfp-close").length||b.content.append(z()):b.content=a:b.content="",y(k),b.container.addClass("mfp-"+c+"-holder"),b.contentContainer.append(b.content)},parseEl:function(c){var d,e=b.items[c];if(e.tagName?e={el:a(e)}:(d=e.type,e={data:e,src:e.src}),e.el){for(var f=b.types,g=0;g<f.length;g++)if(e.el.hasClass("mfp-"+f[g])){d=f[g];break}e.src=e.el.attr("data-mfp-src"),e.src||(e.src=e.el.attr("href"))}return e.type=d||b.st.type||"inline",e.index=c,e.parsed=!0,b.items[c]=e,y("ElementParse",e),b.items[c]},addGroup:function(a,c){var d=function(d){d.mfpEl=this,b._openClick(d,a,c)};c||(c={});var e="click.magnificPopup";c.mainEl=a,c.items?(c.isObj=!0,a.off(e).on(e,d)):(c.isObj=!1,c.delegate?a.off(e).on(e,c.delegate,d):(c.items=a,a.off(e).on(e,d)))},_openClick:function(c,d,e){var f=void 0!==e.midClick?e.midClick:a.magnificPopup.defaults.midClick;if(f||!(2===c.which||c.ctrlKey||c.metaKey||c.altKey||c.shiftKey)){var g=void 0!==e.disableOn?e.disableOn:a.magnificPopup.defaults.disableOn;if(g)if(a.isFunction(g)){if(!g.call(b))return!0}else if(v.width()<g)return!0;c.type&&(c.preventDefault(),b.isOpen&&c.stopPropagation()),e.el=a(c.mfpEl),e.delegate&&(e.items=d.find(e.delegate)),b.open(e)}},updateStatus:function(a,d){if(b.preloader){c!==a&&b.container.removeClass("mfp-s-"+c),d||"loading"!==a||(d=b.st.tLoading);var e={status:a,text:d};y("UpdateStatus",e),a=e.status,d=e.text,b.preloader.html(d),b.preloader.find("a").on("click",function(a){a.stopImmediatePropagation()}),b.container.addClass("mfp-s-"+a),c=a}},_checkIfClose:function(c){if(!a(c).hasClass(s)){var d=b.st.closeOnContentClick,e=b.st.closeOnBgClick;if(d&&e)return!0;if(!b.content||a(c).hasClass("mfp-close")||b.preloader&&c===b.preloader[0])return!0;if(c===b.content[0]||a.contains(b.content[0],c)){if(d)return!0}else if(e&&a.contains(document,c))return!0;return!1}},_addClassToMFP:function(a){b.bgOverlay.addClass(a),b.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),b.wrap.removeClass(a)},_hasScrollBar:function(a){return(b.isIE7?d.height():document.body.scrollHeight)>(a||v.height())},_setFocus:function(){(b.st.focus?b.content.find(b.st.focus).eq(0):b.wrap).focus()},_onFocusIn:function(c){return c.target===b.wrap[0]||a.contains(b.wrap[0],c.target)?void 0:(b._setFocus(),!1)},_parseMarkup:function(b,c,d){var e;d.data&&(c=a.extend(d.data,c)),y(l,[b,c,d]),a.each(c,function(c,d){if(void 0===d||d===!1)return!0;if(e=c.split("_"),e.length>1){var f=b.find(p+"-"+e[0]);if(f.length>0){var g=e[1];"replaceWith"===g?f[0]!==d[0]&&f.replaceWith(d):"img"===g?f.is("img")?f.attr("src",d):f.replaceWith(a("<img>").attr("src",d).attr("class",f.attr("class"))):f.attr(e[1],d)}}else b.find(p+"-"+c).html(d)})},_getScrollbarSize:function(){if(void 0===b.scrollbarSize){var a=document.createElement("div");a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),b.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return b.scrollbarSize}},a.magnificPopup={instance:null,proto:t.prototype,modules:[],open:function(b,c){return A(),b=b?a.extend(!0,{},b):{},b.isObj=!0,b.index=c||0,this.instance.open(b)},close:function(){return a.magnificPopup.instance&&a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&#215;</button>',tClose:"Close (Esc)",tLoading:"Loading...",autoFocusLast:!0}},a.fn.magnificPopup=function(c){A();var d=a(this);if("string"==typeof c)if("open"===c){var e,f=u?d.data("magnificPopup"):d[0].magnificPopup,g=parseInt(arguments[1],10)||0;f.items?e=f.items[g]:(e=d,f.delegate&&(e=e.find(f.delegate)),e=e.eq(g)),b._openClick({mfpEl:e},d,f)}else b.isOpen&&b[c].apply(b,Array.prototype.slice.call(arguments,1));else c=a.extend(!0,{},c),u?d.data("magnificPopup",c):d[0].magnificPopup=c,b.addGroup(d,c);return d};var C,D,E,F="inline",G=function(){E&&(D.after(E.addClass(C)).detach(),E=null)};a.magnificPopup.registerModule(F,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){b.types.push(F),w(h+"."+F,function(){G()})},getInline:function(c,d){if(G(),c.src){var e=b.st.inline,f=a(c.src);if(f.length){var g=f[0].parentNode;g&&g.tagName&&(D||(C=e.hiddenClass,D=x(C),C="mfp-"+C),E=f.after(D).detach().removeClass(C)),b.updateStatus("ready")}else b.updateStatus("error",e.tNotFound),f=a("<div>");return c.inlineElement=f,f}return b.updateStatus("ready"),b._parseMarkup(d,{},c),d}}});var H,I="ajax",J=function(){H&&a(document.body).removeClass(H)},K=function(){J(),b.req&&b.req.abort()};a.magnificPopup.registerModule(I,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){b.types.push(I),H=b.st.ajax.cursor,w(h+"."+I,K),w("BeforeChange."+I,K)},getAjax:function(c){H&&a(document.body).addClass(H),b.updateStatus("loading");var d=a.extend({url:c.src,success:function(d,e,f){var g={data:d,xhr:f};y("ParseAjax",g),b.appendContent(a(g.data),I),c.finished=!0,J(),b._setFocus(),setTimeout(function(){b.wrap.addClass(q)},16),b.updateStatus("ready"),y("AjaxContentAdded")},error:function(){J(),c.finished=c.loadError=!0,b.updateStatus("error",b.st.ajax.tError.replace("%url%",c.src))}},b.st.ajax.settings);return b.req=a.ajax(d),""}}});var L,M=function(c){if(c.data&&void 0!==c.data.title)return c.data.title;var d=b.st.image.titleSrc;if(d){if(a.isFunction(d))return d.call(b,c);if(c.el)return c.el.attr(d)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var c=b.st.image,d=".image";b.types.push("image"),w(m+d,function(){"image"===b.currItem.type&&c.cursor&&a(document.body).addClass(c.cursor)}),w(h+d,function(){c.cursor&&a(document.body).removeClass(c.cursor),v.off("resize"+p)}),w("Resize"+d,b.resizeImage),b.isLowIE&&w("AfterChange",b.resizeImage)},resizeImage:function(){var a=b.currItem;if(a&&a.img&&b.st.image.verticalFit){var c=0;b.isLowIE&&(c=parseInt(a.img.css("padding-top"),10)+parseInt(a.img.css("padding-bottom"),10)),a.img.css("max-height",b.wH-c)}},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,L&&clearInterval(L),a.isCheckingImgSize=!1,y("ImageHasSize",a),a.imgHidden&&(b.content&&b.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var c=0,d=a.img[0],e=function(f){L&&clearInterval(L),L=setInterval(function(){return d.naturalWidth>0?void b._onImageHasSize(a):(c>200&&clearInterval(L),c++,void(3===c?e(10):40===c?e(50):100===c&&e(500)))},f)};e(1)},getImage:function(c,d){var e=0,f=function(){c&&(c.img[0].complete?(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("ready")),c.hasSize=!0,c.loaded=!0,y("ImageLoadComplete")):(e++,200>e?setTimeout(f,100):g()))},g=function(){c&&(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("error",h.tError.replace("%url%",c.src))),c.hasSize=!0,c.loaded=!0,c.loadError=!0)},h=b.st.image,i=d.find(".mfp-img");if(i.length){var j=document.createElement("img");j.className="mfp-img",c.el&&c.el.find("img").length&&(j.alt=c.el.find("img").attr("alt")),c.img=a(j).on("load.mfploader",f).on("error.mfploader",g),j.src=c.src,i.is("img")&&(c.img=c.img.clone()),j=c.img[0],j.naturalWidth>0?c.hasSize=!0:j.width||(c.hasSize=!1)}return b._parseMarkup(d,{title:M(c),img_replaceWith:c.img},c),b.resizeImage(),c.hasSize?(L&&clearInterval(L),c.loadError?(d.addClass("mfp-loading"),b.updateStatus("error",h.tError.replace("%url%",c.src))):(d.removeClass("mfp-loading"),b.updateStatus("ready")),d):(b.updateStatus("loading"),c.loading=!0,c.hasSize||(c.imgHidden=!0,d.addClass("mfp-loading"),b.findImageSize(c)),d)}}});var N,O=function(){return void 0===N&&(N=void 0!==document.createElement("p").style.MozTransform),N};a.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(a){return a.is("img")?a:a.find("img")}},proto:{initZoom:function(){var a,c=b.st.zoom,d=".zoom";if(c.enabled&&b.supportsTransition){var e,f,g=c.duration,j=function(a){var b=a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),d="all "+c.duration/1e3+"s "+c.easing,e={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},f="transition";return e["-webkit-"+f]=e["-moz-"+f]=e["-o-"+f]=e[f]=d,b.css(e),b},k=function(){b.content.css("visibility","visible")};w("BuildControls"+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.content.css("visibility","hidden"),a=b._getItemToZoom(),!a)return void k();f=j(a),f.css(b._getOffset()),b.wrap.append(f),e=setTimeout(function(){f.css(b._getOffset(!0)),e=setTimeout(function(){k(),setTimeout(function(){f.remove(),a=f=null,y("ZoomAnimationEnded")},16)},g)},16)}}),w(i+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.st.removalDelay=g,!a){if(a=b._getItemToZoom(),!a)return;f=j(a)}f.css(b._getOffset(!0)),b.wrap.append(f),b.content.css("visibility","hidden"),setTimeout(function(){f.css(b._getOffset())},16)}}),w(h+d,function(){b._allowZoom()&&(k(),f&&f.remove(),a=null)})}},_allowZoom:function(){return"image"===b.currItem.type},_getItemToZoom:function(){return b.currItem.hasSize?b.currItem.img:!1},_getOffset:function(c){var d;d=c?b.currItem.img:b.st.zoom.opener(b.currItem.el||b.currItem);var e=d.offset(),f=parseInt(d.css("padding-top"),10),g=parseInt(d.css("padding-bottom"),10);e.top-=a(window).scrollTop()-f;var h={width:d.width(),height:(u?d.innerHeight():d[0].offsetHeight)-g-f};return O()?h["-moz-transform"]=h.transform="translate("+e.left+"px,"+e.top+"px)":(h.left=e.left,h.top=e.top),h}}});var P="iframe",Q="//about:blank",R=function(a){if(b.currTemplate[P]){var c=b.currTemplate[P].find("iframe");c.length&&(a||(c[0].src=Q),b.isIE8&&c.css("display",a?"block":"none"))}};a.magnificPopup.registerModule(P,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){b.types.push(P),w("BeforeChange",function(a,b,c){b!==c&&(b===P?R():c===P&&R(!0))}),w(h+"."+P,function(){R()})},getIframe:function(c,d){var e=c.src,f=b.st.iframe;a.each(f.patterns,function(){return e.indexOf(this.index)>-1?(this.id&&(e="string"==typeof this.id?e.substr(e.lastIndexOf(this.id)+this.id.length,e.length):this.id.call(this,e)),e=this.src.replace("%id%",e),!1):void 0});var g={};return f.srcAction&&(g[f.srcAction]=e),b._parseMarkup(d,g,c),b.updateStatus("ready"),d}}});var S=function(a){var c=b.items.length;return a>c-1?a-c:0>a?c+a:a},T=function(a,b,c){return a.replace(/%curr%/gi,b+1).replace(/%total%/gi,c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=b.st.gallery,e=".mfp-gallery";return b.direction=!0,c&&c.enabled?(f+=" mfp-gallery",w(m+e,function(){c.navigateByImgClick&&b.wrap.on("click"+e,".mfp-img",function(){return b.items.length>1?(b.next(),!1):void 0}),d.on("keydown"+e,function(a){37===a.keyCode?b.prev():39===a.keyCode&&b.next()})}),w("UpdateStatus"+e,function(a,c){c.text&&(c.text=T(c.text,b.currItem.index,b.items.length))}),w(l+e,function(a,d,e,f){var g=b.items.length;e.counter=g>1?T(c.tCounter,f.index,g):""}),w("BuildControls"+e,function(){if(b.items.length>1&&c.arrows&&!b.arrowLeft){var d=c.arrowMarkup,e=b.arrowLeft=a(d.replace(/%title%/gi,c.tPrev).replace(/%dir%/gi,"left")).addClass(s),f=b.arrowRight=a(d.replace(/%title%/gi,c.tNext).replace(/%dir%/gi,"right")).addClass(s);e.click(function(){b.prev()}),f.click(function(){b.next()}),b.container.append(e.add(f))}}),w(n+e,function(){b._preloadTimeout&&clearTimeout(b._preloadTimeout),b._preloadTimeout=setTimeout(function(){b.preloadNearbyImages(),b._preloadTimeout=null},16)}),void w(h+e,function(){d.off(e),b.wrap.off("click"+e),b.arrowRight=b.arrowLeft=null})):!1},next:function(){b.direction=!0,b.index=S(b.index+1),b.updateItemHTML()},prev:function(){b.direction=!1,b.index=S(b.index-1),b.updateItemHTML()},goTo:function(a){b.direction=a>=b.index,b.index=a,b.updateItemHTML()},preloadNearbyImages:function(){var a,c=b.st.gallery.preload,d=Math.min(c[0],b.items.length),e=Math.min(c[1],b.items.length);for(a=1;a<=(b.direction?e:d);a++)b._preloadItem(b.index+a);for(a=1;a<=(b.direction?d:e);a++)b._preloadItem(b.index-a)},_preloadItem:function(c){if(c=S(c),!b.items[c].preloaded){var d=b.items[c];d.parsed||(d=b.parseEl(c)),y("LazyLoad",d),"image"===d.type&&(d.img=a('<img class="mfp-img" />').on("load.mfploader",function(){d.hasSize=!0}).on("error.mfploader",function(){d.hasSize=!0,d.loadError=!0,y("LazyLoadError",d)}).attr("src",d.src)),d.preloaded=!0}}}});var U="retina";a.magnificPopup.registerModule(U,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=b.st.retina,c=a.ratio;c=isNaN(c)?c():c,c>1&&(w("ImageHasSize."+U,function(a,b){b.img.css({"max-width":b.img[0].naturalWidth/c,width:"100%"})}),w("ElementParse."+U,function(b,d){d.src=a.replaceSrc(d,c)}))}}}}),A()});;
(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.mtMagnificPopupFieldImage = {
    attach: function (context, settings) {
      $(context).find('.field--name-field-image a.image-popup').once('mtMagnificPopupFieldImageInit').magnificPopup({
        type:"image",
        removalDelay: 300,
        mainClass: "mfp-fade",
        gallery: {
          enabled: true, // set to true to enable gallery
        },
        image: {
          titleSrc: function(item) {
            return item.el.closest('.overlay-container').children()[1].title || '';
          }
        }
    });
    }
  };
})(jQuery, Drupal, drupalSettings);
;
jQuery(document).ready(function($) {
  $(".to-top").click(function() {
    $("body,html").animate({scrollTop:0},800);
  });
});
;
