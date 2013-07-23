// page init
jQuery(function(){
	initOpenClose();
	initBackgroundResize();
	initSameHeight();
});

// open-close init
function initOpenClose() {
	jQuery('div.nav-holder').openClose({
		hideOnClickOutside: true,
		activeClass: 'active',
		opener: '.open',
		slider: '.nav-section',
		animSpeed: 400,
		effect: 'slide'
	});
}

// background stretching
function initBackgroundResize() {
	var holder = document.getElementById('bg');
	if(holder) {
		var images = holder.getElementsByTagName('img');
		for(var i = 0; i < images.length; i++) {
			BackgroundStretcher.stretchImage(images[i]);
		}
		BackgroundStretcher.setBgHolder(holder);
		
		// handle font resize
		jQuery(window).bind('fontresize', function(e){
			BackgroundStretcher.resizeAll();
		});
	}
}

// align blocks height
function initSameHeight() {
	jQuery('.footer-columns').sameHeight({
		elements: '.column',
		useMinHeight: true,
		flexible: true,
		multiLine: true
	});
}

/*
 * jQuery Open/Close plugin
 */
;(function($) {
	function OpenClose(options) {
		this.options = $.extend({
			addClassBeforeAnimation: true,
			hideOnClickOutside: false,
			activeClass:'active',
			opener:'.opener',
			slider:'.slide',
			animSpeed: 400,
			effect:'fade',
			event:'click'
		}, options);
		this.init();
	}
	OpenClose.prototype = {
		init: function() {
			if(this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.makeCallback('onInit');
			}
		},
		findElements: function() {
			this.holder = $(this.options.holder);
			this.opener = this.holder.find(this.options.opener);
			this.slider = this.holder.find(this.options.slider);

			if (!this.holder.hasClass(this.options.activeClass)) {
				this.slider.addClass(slideHiddenClass);
			}
		},
		attachEvents: function() {
			// add handler
			var self = this;
			this.eventHandler = function(e) {
				e.preventDefault();
				if (self.slider.hasClass(slideHiddenClass)) {
					self.showSlide();
				} else {
					self.hideSlide();
				}
			};
			self.opener.bind(self.options.event, this.eventHandler);

			// hover mode handler
			if(self.options.event === 'over') {
				self.opener.bind('mouseenter', function() {
					self.holder.removeClass(self.options.activeClass);
					self.opener.trigger(self.options.event);
				});
				self.holder.bind('mouseleave', function() {
					self.holder.addClass(self.options.activeClass);
					self.opener.trigger(self.options.event);
				});
			}

			// outside click handler
			self.outsideClickHandler = function(e) {
				if(self.options.hideOnClickOutside) {
					var target = $(e.target);
					if (!target.is(self.holder) && !target.closest(self.holder).length) {
						self.hideSlide();
					}
				}
			};
		},
		showSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.addClass(self.options.activeClass);
			}
			self.slider.removeClass(slideHiddenClass);
			$(document).bind('click', self.outsideClickHandler);

			self.makeCallback('animStart', true);
			toggleEffects[self.options.effect].show({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.addClass(self.options.activeClass);
					}
					self.makeCallback('animEnd', true);
				}
			});
		},
		hideSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.removeClass(self.options.activeClass);
			}
			$(document).unbind('click', self.outsideClickHandler);

			self.makeCallback('animStart', false);
			toggleEffects[self.options.effect].hide({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.removeClass(self.options.activeClass);
					}
					self.slider.addClass(slideHiddenClass);
					self.makeCallback('animEnd', false);
				}
			});
		},
		destroy: function() {
			this.slider.removeClass(slideHiddenClass).css({display:''});
			this.opener.unbind(this.options.event, this.eventHandler);
			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
			$(document).unbind('click', this.outsideClickHandler);
		},
		makeCallback: function(name) {
			if(typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// add stylesheet for slide on DOMReady
	var slideHiddenClass = 'js-slide-hidden';
	$(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + slideHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	});

	// animation effects
	var toggleEffects = {
		slide: {
			show: function(o) {
				o.box.stop(true).hide().slideDown(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function(o) {
				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function(o) {
				o.box.hide().show(0, o.complete);
			},
			hide: function(o) {
				o.box.hide(0, o.complete);
			}
		}
	};

	// jQuery plugin interface
	$.fn.openClose = function(opt) {
		return this.each(function() {
			jQuery(this).data('OpenClose', new OpenClose($.extend(opt, {holder: this})));
		});
	};
}(jQuery));

/*
 * jQuery SameHeight plugin
 */
;(function($){
	$.fn.sameHeight = function(opt) {
		var options = $.extend({
			skipClass: 'same-height-ignore',
			leftEdgeClass: 'same-height-left',
			rightEdgeClass: 'same-height-right',
			elements: '>*',
			flexible: false,
			multiLine: false,
			useMinHeight: false,
			biggestHeight: false
		},opt);
		return this.each(function(){
			var holder = $(this), postResizeTimer, ignoreResize;
			var elements = holder.find(options.elements).not('.' + options.skipClass);
			if(!elements.length) return;

			// resize handler
			function doResize() {
				elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
				if(options.multiLine) {
					// resize elements row by row
					resizeElementsByRows(elements, options);
				} else {
					// resize elements by holder
					resizeElements(elements, holder, options);
				}
			}
			doResize();

			// handle flexible layout / font resize
			var delayedResizeHandler = function() {
				if(!ignoreResize) {
					ignoreResize = true;
					doResize();
					clearTimeout(postResizeTimer);
					postResizeTimer = setTimeout(function() {
						doResize();
						setTimeout(function(){
							ignoreResize = false;
						}, 10);
					}, 100);
				}
			};

			// handle flexible/responsive layout
			if(options.flexible) {
				$(window).bind('resize orientationchange fontresize', delayedResizeHandler);
			}

			// handle complete page load including images and fonts
			$(window).bind('load', delayedResizeHandler);
		});
	};

	// detect css min-height support
	var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

	// get elements by rows
	function resizeElementsByRows(boxes, options) {
		var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
		boxes.each(function(ind){
			var curItem = $(this);
			if(curItem.offset().top === firstOffset) {
				currentRow = currentRow.add(this);
			} else {
				maxHeight = getMaxHeight(currentRow);
				maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
				currentRow = curItem;
				firstOffset = curItem.offset().top;
			}
		});
		if(currentRow.length) {
			maxHeight = getMaxHeight(currentRow);
			maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
		}
		if(options.biggestHeight) {
			boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
		}
	}

	// calculate max element height
	function getMaxHeight(boxes) {
		var maxHeight = 0;
		boxes.each(function(){
			maxHeight = Math.max(maxHeight, $(this).outerHeight());
		});
		return maxHeight;
	}

	// resize helper function
	function resizeElements(boxes, parent, options) {
		var calcHeight;
		var parentHeight = typeof parent === 'number' ? parent : parent.height();
		boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function(i){
			var element = $(this);
			var depthDiffHeight = 0;
			var isBorderBox = element.css('boxSizing') === 'border-box';

			if(typeof parent !== 'number') {
				element.parents().each(function(){
					var tmpParent = $(this);
					if(parent.is(this)) {
						return false;
					} else {
						depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
					}
				});
			}
			calcHeight = parentHeight - depthDiffHeight;
			calcHeight -= isBorderBox ? 0 : element.outerHeight() - element.height();

			if(calcHeight > 0) {
				element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
			}
		});
		boxes.filter(':first').addClass(options.leftEdgeClass);
		boxes.filter(':last').addClass(options.rightEdgeClass);
		return calcHeight;
	}
}(jQuery));

/*
 * jQuery FontResize Event
 */
jQuery.onFontResize = (function($) {
	$(function() {
		var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
		var resizeFrame = $('<iframe>').attr('id', randomID).addClass('font-resize-helper');

		// required styles
		resizeFrame.css({
			width: '100em',
			height: '10px',
			position: 'absolute',
			borderWidth: 0,
			top: '-9999px',
			left: '-9999px'
		}).appendTo('body');

		// use native IE resize event if possible
		if (window.attachEvent && !window.addEventListener) {
			resizeFrame.bind('resize', function () {
				$.onFontResize.trigger(resizeFrame[0].offsetWidth / 100);
			});
		}
		// use script inside the iframe to detect resize for other browsers
		else {
			var doc = resizeFrame[0].contentWindow.document;
			doc.open();
			doc.write('<scri' + 'pt>window.onload = function(){var em = parent.jQuery("#' + randomID + '")[0];window.onresize = function(){if(parent.jQuery.onFontResize){parent.jQuery.onFontResize.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
			doc.close();
		}
		jQuery.onFontResize.initialSize = resizeFrame[0].offsetWidth / 100;
	});
	return {
		// public method, so it can be called from within the iframe
		trigger: function (em) {
			$(window).trigger("fontresize", [em]);
		}
	};
}(jQuery));

// background stretch module
(function(){
	var isTouchDevice = (/MSIE 10.*Touch/.test(navigator.userAgent)) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
	BackgroundStretcher = {
		images: [],
		holders: [],
		viewWidth: 0,
		viewHeight: 0,
		ieFastMode: true,
		stretchBy: isTouchDevice ? 'page' : 'bg',
		init: function(){
			this.addHandlers();
			this.resizeAll();
			return this;
		},
		stretchImage: function(origImg) {
			// wrap image and apply smoothing
			var obj = this.prepareImage(origImg);
			
			// handle onload
			var img = new Image();
			img.onload = this.bind(function(){
				obj.iRatio = img.width / img.height;
				this.resizeImage(obj);
			});
			img.src = origImg.src;
			this.images.push(obj);
		},
		prepareImage: function(img) {
			var wrapper = document.createElement('span');
			img.parentNode.insertBefore(wrapper, img);
			wrapper.appendChild(img);
		
			if(/MSIE (6|7|8)/.test(navigator.userAgent) && img.tagName.toLowerCase() === 'img') {
				wrapper.style.position = 'absolute';
				wrapper.style.display = 'block';
				wrapper.style.zoom = 1;
				if(this.ieFastMode) {
					img.style.display = 'none';
					wrapper.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+img.src+'", sizingMethod="scale")'; // enable smoothing in IE6
					return wrapper;
				} else {
					img.style.msInterpolationMode = 'bicubic'; // IE7 smooth fix
					return img;
				}
			} else {
				return img;
			}
		},
		setBgHolder: function(obj) {
			if(this.stretchBy === 'window' || this.stretchBy === 'page') {
				this.holders.push(obj);
				this.resizeAll();
			}
		},
		resizeImage: function(obj) {
			if(obj.iRatio) {
				// calculate dimensions
				var dimensions = this.getProportion({
					ratio: obj.iRatio,
					maskWidth: this.viewWidth,
					maskHeight: this.viewHeight
				});
				// apply new styles
				obj.style.width = dimensions.width + 'px';
				obj.style.height = dimensions.height + 'px';
				obj.style.top = dimensions.top + 'px';
				obj.style.left = dimensions.left +'px';
			}
		},
		resizeHolder: function(obj) {
			obj.style.width = this.viewWidth+'px';
			obj.style.height = this.viewHeight+'px';
		},
		getProportion: function(data) {
			// calculate element coords to fit in mask
			var ratio = data.ratio || (data.elementWidth / data.elementHeight);
			var slideWidth = data.maskWidth, slideHeight = slideWidth / ratio;
			if(slideHeight < data.maskHeight) {
				slideHeight = data.maskHeight;
				slideWidth = slideHeight * ratio;
			}
			return {
				width: slideWidth,
				height: slideHeight,
				top: (data.maskHeight - slideHeight) / 2,
				left: (data.maskWidth - slideWidth) / 2
			}
		},
		resizeAll: function() {
			// crop holder width by window size
			for(var i = 0; i < this.holders.length; i++) {
				this.holders[i].style.width = '100%'; 
			}
			
			// delay required for IE to handle resize
			clearTimeout(this.resizeTimer);
			this.resizeTimer = setTimeout(this.bind(function(){
				// hide background holders
				for(var i = 0; i < this.holders.length; i++) {
					this.holders[i].style.display = 'none';
				}
				
				// calculate real page dimensions with hidden background blocks
				if(typeof this.stretchBy === 'string') {
					// resize by window or page dimensions
					if(this.stretchBy === 'window' || this.stretchBy === 'page') {
						this.viewWidth = this.stretchFunctions[this.stretchBy].width();
						this.viewHeight = this.stretchFunctions[this.stretchBy].height();
					}
					// resize by element dimensions (by id)
					else {
						var maskObject = document.getElementById(this.stretchBy);
						this.viewWidth = maskObject ? maskObject.offsetWidth : 0;
						this.viewHeight = maskObject ? maskObject.offsetHeight : 0;
					}
				} else {
					this.viewWidth = this.stretchBy.offsetWidth;
					this.viewHeight = this.stretchBy.offsetHeight;
				}
				
				// show and resize all background holders
				for(i = 0; i < this.holders.length; i++) {
					this.holders[i].style.display = 'block';
					this.resizeHolder(this.holders[i]);
				}
				for(i = 0; i < this.images.length; i++) {
					this.resizeImage(this.images[i]);
				}
			}),10);
		},
		addHandlers: function() {
			var handler = this.bind(this.resizeAll);
			if (window.addEventListener) {
				window.addEventListener('load', handler, false);
				window.addEventListener('resize', handler, false);
				window.addEventListener('orientationchange', handler, false);
			} else if (window.attachEvent) {
				window.attachEvent('onload', handler);
				window.attachEvent('onresize', handler);
			}
		},
		stretchFunctions: {
			window: {
				width: function() {
					return typeof window.innerWidth === 'number' ? window.innerWidth : document.documentElement.clientWidth;
				},
				height: function() {
					return typeof window.innerHeight === 'number' ? window.innerHeight : document.documentElement.clientHeight;
				}
			},
			page: {
				width: function() {
					return !document.body ? 0 : Math.max(
						Math.max(document.body.clientWidth, document.documentElement.clientWidth),
						Math.max(document.body.offsetWidth, document.body.scrollWidth)
					);
				},
				height: function() {
					return !document.body ? 0 : Math.max(
						Math.max(document.body.clientHeight, document.documentElement.clientHeight),
						Math.max(document.body.offsetHeight, document.body.scrollHeight)
					);
				}
			}
		},
		bind: function(fn, scope, args) {
			var newScope = scope || this;
			return function() {
				return fn.apply(newScope, args || arguments);
			}
		}
	}.init();
}());