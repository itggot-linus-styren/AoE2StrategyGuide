var previousItem;
var prevContainerId;
$(function() {/*
    $('body').click(function(event) {
        console.log(event.target);
    });*/
    previousItem = $('input[name=t]:checked', '#tabs');
    var contentId = $(previousItem).attr('class').split(" ")[0];
	var contentDiv = $('#' + contentId);   
    $(contentDiv).css('opacity', '1');
    $(contentDiv).css('pointer-events', 'auto');
    $(".content:not(#" + contentId + ")").hide();
	prevContainerId = '#' + contentId;
    $(".sticky-scroller").scroll(updateHeight);
});

function updateHeight() {
    var elem = $('#tabs');
    //var containerHeight = elem.offsetHeight;
    //var lastChild = elem.children().last();
    //var verticalOffset = $(lastChild).offset().top + $(lastChild).height();
    //console.log(verticalOffset);
    //$(elem).height(containerHeight - verticalOffset);
    var scrollOffset = Math.max(192 - $(".sticky-scroller").scrollTop(), 0);
    if (scrollOffset == 0) {
        $("#tabs").addClass("tabs-sticky");
    } else {
        $("#tabs").removeClass("tabs-sticky");
    }
}

function doTransition(that, usingTabs) {
    var oldContentDiv = null;
    if (previousItem != null) {
        var oldId = $(previousItem).attr('class').split(" ")[0];
		oldContentDiv = $('#' + oldId);
        oldContentDiv.removeClass('content-hide-remove');
        oldContentDiv.removeClass('content-hide-remove-backwards');
		if ($(that).isAfter(previousItem)) {
        	oldContentDiv.addClass('content-hide-add');
		} else {
        	oldContentDiv.addClass('content-hide-add-backwards');
		}
        if (usingTabs) {
            setTimeout(function() {
                oldContentDiv.css('opacity', '0');
            }, 500);
        }
    }

    contentDiv = null;
    if (usingTabs) {
        var contentId = $(that).attr('class').split(" ")[0];
        prevContainerId = '#' + contentId;
	    contentDiv = $(prevContainerId);
	    $(contentDiv).show();
    	$(contentDiv).addClass('transition-container');
	    contentDiv.css('opacity', '1');
    } else {
        contentDiv = $(that);
    }
	contentDiv.removeClass('content-hide-add').removeClass('content-hide-add-backwards');
	if ($(that).isAfter(previousItem)) {
		contentDiv.addClass('content-hide-remove');
	} else {
		contentDiv.addClass('content-hide-remove-backwards');
	}
    if (usingTabs) {
        setTimeout(function() {
            if (oldContentDiv != null)
                $(oldContentDiv).hide();
            $(contentDiv).removeClass('transition-container');
        }, 500);   
        previousItem = that;
    }
}

$('#tabs input[type="radio"]').click(function() {
    if (!$(this).is(':checked') || $(previousItem).attr('class').split(" ")[0] == $(this).attr('class').split(" ")[0])
        return;

    var that = this;
    if ($(".sticky-scroller").scrollTop() > 0) {
        var duration = Math.min(500 * $(".sticky-scroller").scrollTop() / 100, 400);
        $(".sticky-scroller").animate({scrollTop:$(".sticky-scroller").offset().top}, duration, "linear", function() {
            doTransition(that, true);
        });
    } else {
        doTransition(that, true);
    }
});
(function($) {
    $.fn.isAfter = function(sel){
        return this.prevAll().filter(sel).length !== 0;
    };

    $.fn.isBefore= function(sel){
        return this.nextAll().filter(sel).length !== 0;
    };
})(jQuery);
$("#drawer > ul > li > div > a").on('click', function() {
	var parentDiv = $(this).parent();
    parentDiv.addClass('drawer_list_item_active');
    setTimeout(function() {
        parentDiv.removeClass('drawer_list_item_active');
    }, 250);
});

// Close drawer and open container
function closeDrawerAndOpen(containerId) {
    $('#drawer-toggle').prop('checked', false);
    if (prevContainerId == containerId)
        return;
    previousItem = $('input[name=t]:checked', '#tabs');
    $('.' + containerId.slice(1, containerId.length)).prop('checked', true);
	//$(containerId).addClass('transition-container');
	var oldPrevContainerId = prevContainerId;
	$(containerId).show();//.css('display', 'flex');
	$(containerId).addClass('transition-container');
	$(prevContainerId).css('opacity', '0');
	$(containerId).css('opacity', '1');
	prevContainerId = containerId;
	setTimeout(function() {
		$(oldPrevContainerId).hide();//.css('display', 'none');
		$(prevContainerId).removeClass('transition-container');
	}, 100);
    doTransition(containerId, false);
    previousItem = $('input[name=t]:checked', '#tabs');
    console.log(previousItem);
}

// Slide toggle function
$(function () {
    $('nav').on('click', 'li', function () {
        $(this).children('ul').slideToggle(function() {
            $(this).toggleClass('in out');
        });
        
        $(this).siblings().find('ul').slideUp(function() {
            $(this).removeClass('in').addClass('out');
        });
    });
});

// Ripple function
(function(){
	"use strict";

	var colour1 = "#FF1744";
	var colour2 = "#FFFFFFAA";
	var opacity = 0.1;
	var ripple_within_elements = ['input', 'button', 'a', 'label'];
	var ripple_without_diameter = 0;

	var overlays = {
		items: [],
		get: function(){
			var $element;
			for(var i = 0; i < overlays.items.length; i++){
				$element = overlays.items[i];
				if($element.transition_phase === false) {
					$element.transition_phase = 0;
					return $element;
				}
			}
			$element = document.createElement("div");
			$element.style.position = "absolute";
			$element.style.opacity = opacity;
			//$element.style.outline = "10px solid red";
			$element.style.pointerEvents = "none";		
			$element.style.background = "-webkit-radial-gradient(" + colour1 + " 64%, rgba(0,0,0,0) 65%) no-repeat";
			$element.style.background = "radial-gradient(" + colour1 + " 64%, rgba(0,0,0,0) 65%) no-repeat";
			$element.style.transform = "translateZ(0)";
            $element.style.zIndex = "2";
			$element.transition_phase = 0;
			$element.rid = overlays.items.length;
			$element.next_transition = overlays.next_transition_generator($element);
			document.body.appendChild($element);
			overlays.items.push($element);
			return $element;
		},
		next_transition_generator: function($element){
			return function(){
				$element.transition_phase++;
				switch($element.transition_phase){
					case 1:
						$element.style[transition] = "all 500ms cubic-bezier(0.165, 0.840, 0.440, 1.000)";
						$element.style.backgroundSize = $element.ripple_backgroundSize;
						$element.style.backgroundPosition = $element.ripple_backgroundPosition;
						setTimeout($element.next_transition, 0.2 * 1000); //now I know transitionend is better but it fires multiple times when multiple properties are animated, so this is simpler code and (imo) worth tiny delays
						break;
					case 2:
						$element.style[transition] = "opacity 0.15s ease-in-out";
						$element.style.opacity = 0;
						setTimeout($element.next_transition, 0.15 * 1000);
						break;
					case 3:
						overlays.recycle($element);
						break;
				}
			};
		},
		recycle: function($element){
			$element.style.display = "none";
			$element.style[transition] = "none";
			if($element.timer) clearTimeout($element.timer);
			$element.transition_phase = false;
		}
	};

	var transition = function(){
		var i,
			el = document.createElement('div'),
			transitions = {
				'WebkitTransition':'webkitTransition',
				'transition':'transition',
				'OTransition':'otransition',
				'MozTransition':'transition'
			};
		for (i in transitions) {
			if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
				return transitions[i];
			}
		}
	}();

	var click = function(event){
		var $element = overlays.get(),
			touch,
			x,
			y;

		touch = event.touches ? event.touches[0] : event;

		$element.style[transition] = "none";
		$element.style.backgroundSize = "3px 3px";
		$element.style.opacity = opacity;

        var target = touch.target;

		if(ripple_within_elements.indexOf(touch.target.nodeName.toLowerCase()) > -1) {
			x = touch.offsetX;
			y = touch.offsetY;

			if (target.className == "card__button") {	
				$element.style.background = "-webkit-radial-gradient(" + colour1 + " 64%, rgba(0,0,0,0) 65%) no-repeat";
				$element.style.background = "radial-gradient(" + colour1 + " 64%, rgba(0,0,0,0) 65%) no-repeat";
			} else {
				$element.style.background = "-webkit-radial-gradient(" + colour2 + " 64%, rgba(0,0,0,0) 65%) no-repeat";
				$element.style.background = "radial-gradient(" + colour2 + " 64%, rgba(0,0,0,0) 65%) no-repeat";
			}
			
			var dimensions = target.getBoundingClientRect();
			if(!x || !y){
				x = (touch.clientX || touch.x) - dimensions.left;
				y = (touch.clientY || touch.y) - dimensions.top;
			}
			$element.style.backgroundPosition = x + "px " + y + "px";
			$element.style.width = dimensions.width + "px";
			$element.style.height = dimensions.height + "px";
			$element.style.left = (dimensions.left) + "px";
			$element.style.top = (dimensions.top + document.body.scrollTop + document.documentElement.scrollTop) + "px";
			var computed_style = window.getComputedStyle(event.target);
			for (var key in computed_style) {
				if (key.toString().indexOf("adius") > -1) {
					if(computed_style[key]) {
						$element.style[key] = computed_style[key];
					}
				} else if(parseInt(key, 10).toString() === key && computed_style[key].indexOf("adius") > -1){
					$element.style[computed_style[key]] = computed_style[computed_style[key]];
				}
			}
			$element.style.backgroundPosition = x + "px " + y + "px";
			$element.ripple_backgroundPosition = (x - dimensions.width)  + "px " + (y - dimensions.width) + "px";
			$element.ripple_backgroundSize = (dimensions.width * 2) + "px " + (dimensions.width * 2) + "px";
		} else { //click was outside of ripple element
			x = touch.clientX || touch.x || touch.pageX;
			y = touch.clientY || touch.y || touch.pageY;
			
			$element.style.borderRadius = "0px";
			$element.style.left = (x - ripple_without_diameter / 2) + "px";
			$element.style.top = (document.body.scrollTop + document.documentElement.scrollTop + y - ripple_without_diameter / 2) + "px";
			$element.ripple_backgroundSize = ripple_without_diameter + "px " + ripple_without_diameter + "px";
			$element.style.width = ripple_without_diameter + "px";
			$element.style.height = ripple_without_diameter + "px";
			$element.style.backgroundPosition = "center center";
			$element.ripple_backgroundPosition = "center center";
			$element.ripple_backgroundSize = ripple_without_diameter + "px " + ripple_without_diameter + "px";
		}
		$element.ripple_x = x;
		$element.ripple_y = y;
		$element.style.display = "block";
		setTimeout($element.next_transition, 20);
	};

	if('ontouchstart' in window || 'onmsgesturechange' in window){
		document.addEventListener("touchstart", click, false);
	} else {
		document.addEventListener("click", click, false);
	}
}());
