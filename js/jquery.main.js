/*! HTML5 Shiv v3.6 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed */
/*@cc_on(function(l,f){function m(){var a=e.elements;return"string"==typeof a?a.split(" "):a}function i(a){var b=n[a[o]];b||(b={},h++,a[o]=h,n[h]=b);return b}function p(a,b,c){b||(b=f);if(g)return b.createElement(a);c||(c=i(b));b=c.cache[a]?c.cache[a].cloneNode():r.test(a)?(c.cache[a]=c.createElem(a)).cloneNode():c.createElem(a);return b.canHaveChildren&&!s.test(a)?c.frag.appendChild(b):b}function t(a,b){if(!b.cache)b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag();
a.createElement=function(c){return!e.shivMethods?b.createElem(c):p(c,a,b)};a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/\w+/g,function(a){b.createElem(a);b.frag.createElement(a);return'c("'+a+'")'})+");return n}")(e,b.frag)}function q(a){a||(a=f);var b=i(a);if(e.shivCSS&&!j&&!b.hasCSS){var c,d=a;c=d.createElement("p");d=d.getElementsByTagName("head")[0]||d.documentElement;c.innerHTML="x<style>article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}</style>";
c=d.insertBefore(c.lastChild,d.firstChild);b.hasCSS=!!c}g||t(a,b);return a}var k=l.html5||{},s=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,r=/^<|^(?:a|b|button|code|div|fieldset|form|h1|h2|h3|h4|h5|h6|i|iframe|img|input|label|li|link|ol|option|p|param|q|script|select|span|strong|style|table|tbody|td|textarea|tfoot|th|thead|tr|ul)$/i,j,o="_html5shiv",h=0,n={},g;(function(){try{var a=f.createElement("a");a.innerHTML="<xyz></xyz>";j="hidden"in a;var b;if(!(b=1==a.childNodes.length)){f.createElement("a");
var c=f.createDocumentFragment();b="undefined"==typeof c.cloneNode||"undefined"==typeof c.createDocumentFragment||"undefined"==typeof c.createElement}g=b}catch(d){g=j=!0}})();var e={elements:k.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:!1!==k.shivCSS,supportsUnknownElements:g,shivMethods:!1!==k.shivMethods,type:"default",shivDocument:q,createElement:p,createDocumentFragment:function(a,
b){a||(a=f);if(g)return a.createDocumentFragment();for(var b=b||i(a),c=b.frag.cloneNode(),d=0,e=m(),h=e.length;d<h;d++)c.createElement(e[d]);return c}};l.html5=e;q(f)})(this,document)@*/

// page init
jQuery(function(){
	// clear inputs on focus function
	initInputs();
});

jQuery(window).load(function(){
	initCallForm();
	fixIE8();
	initProjects();
})

// clear inputs on focus
function initInputs() {
	PlaceholderInput.replaceByOptions({
		// filter options
		clearInputs: true,
		clearTextareas: true,
		clearPasswords: true,
		skipClass: 'default',
		
		// input options
		wrapWithElement: false,
		showUntilTyping: false,
		getParentByClass: false,
		placeholderAttr: 'value'
	});
}

function initCallForm(){
	var activeClass = 'active';
	var speed = 500;
	$('.call-ask').each(function(){
		var block = $(this);
		var link = $('.green-button', block);
		var form = $('.drop-form', block);
		var t;
		form.css('opacity', 0);

		$('body').click(function(){
			if (block.hasClass(activeClass)) {
				link.trigger('click')
			}
		})
		block.click(function(e){
			e.stopPropagation();
		})

		link.click(function(e){
			e.preventDefault();
			if (block.hasClass(activeClass)){
				form.css('opacity', 0);
				if (t) clearTimeout(t)
				t = setTimeout(function(){
					block.removeClass(activeClass)
				}, speed)
			}
			else {
				if (t) clearTimeout(t)
				block.addClass(activeClass);
				setTimeout(function(){
					form.css('opacity', 1);	
				}, 10)
				
			}
		})
	})
}

function fixIE8(){
	if (navigator.appName == 'Microsoft Internet Explorer' && navigator.appVersion.indexOf('MSIE 8.0') != -1) {
		var speed = 300;
		$('.service-item').each(function(){
			var block = $(this);
			var details = $('.details', block);
			details.css('opacity', 0);
			block.on({
				'mouseenter': function(){
					details.stop().animate({
						'opacity': 1
					},speed)
				},
				'mouseleave': function(){
					details.stop().animate({
						'opacity': 0
					},speed)
				}
			})
		})

		$('.project').each(function(){
			var block = $(this);
			var details = $('.description', block);
			details.css('opacity', 0);
			block.on({
				'mouseenter': function(){
					details.stop().animate({
						'opacity': 1
					},speed)
				},
				'mouseleave': function(){
					details.stop().animate({
						'opacity': 0
					},speed)
				}
			})
		})
	}
}

function initProjects(){
	var speed = 400;
	$('.projects-block:has(.filters-list)').each(function(){
		var holder = $(this);
		var filters = $('.filters-list li', holder);
		var target = $('.projects-holder', holder)
		var projects = $('.project', target);
		var btn = $('.btn-add', holder);
		var currentFilter = false;
		var activeClass = 'active';
		var filteredClass = 'filtered';
		var fake = target.clone().css({
			'width': target.width(),
			'position': 'absolute',
			'left': -99999
		});
		var t;
		fake.appendTo(holder);

		function setPositions(){
			projects.each(function(ind){
				var project = $(this);
				var projectF = fake.find('.project:eq(' + ind +')');
				if (projectF.is(':visible')) {
					project.css({
						'position':'absolute',
						'top': projectF.position().top,
						'left': projectF.position().left
					})	
				}
			})
			target.css({
				'height': fake.height()
			})
		}

		function setAnimation(els){
			els.css({
				'-webkit-transition': 'all 0.3s ease',
				'-moz-transition': 'all 0.3s ease',
				'-o-transition': 'all 0.3s ease',
				'-ms-transition': 'all 0.3s ease',
				'transition': 'all 0.3s ease'
			})
		}
		function removeAnimation(els){
			els.css({
				'-webkit-transition': 'none',
				'-moz-transition': 'none',
				'-o-transition': 'none',
				'-ms-transition': 'none',
				'transition': 'none',
			})
		}

		function filterProjects(){
			if (t) clearTimeout(t)
			var projectsF = fake.find('.project');
			target.css({
				'height': fake.height()
			})
			setPositions();
			setAnimation(projects);
			setAnimation(target);
			projectsF.removeClass(filteredClass).show();
			projects.removeClass(filteredClass)


			if (currentFilter){
				var filters = currentFilter ? currentFilter.split('/') : false;

				if (filters) {
					projectsF.each(function(ind){
						var project = $(this);
						var realProject = projects.eq(ind);
						var val = project.find('.categories').length > 0 ? project.find('.categories').val() : '';
						for (var ind in filters){
							if (val.indexOf(filters[ind]) != -1) {
								project.addClass(filteredClass);
								realProject.addClass(filteredClass)
							}
						}
					})	
				}
			}
			else {
				projectsF.addClass(filteredClass);
				projects.addClass(filteredClass);
			}

			projectsF.filter(':not(.filtered)').hide();
			projects.filter(':not(.filtered)').css('opacity', 0);
			projects.filter('.filtered').css('opacity', 1);
			setPositions();
			

			t = setTimeout(function(){
				removeAnimation(projects);
				removeAnimation(target);
			}, speed)
		}

		filters.each(function(){
			var filter = $(this);
			var link = $('a', filter);

			link.click(function(e){
				e.preventDefault();
				if (link.attr('href') == 'all') {
					currentFilter = false;
					filters.removeClass(activeClass);
				}
				else {
					if (filter.hasClass(activeClass)) {
						filter.removeClass(activeClass);

						if (currentFilter.length == 0){
							currentFilter = false;
						}
						else {
							var pos = currentFilter.indexOf(link.attr('href'));
							if (currentFilter == link.attr('href')) {
								currentFilter = false;
							}
							else if (pos > 0) {
								currentFilter = currentFilter.replace('/' + link.attr('href'), '');
							}
							else {
								currentFilter = currentFilter.replace(link.attr('href') + '/', '');
							}
						}
						
					}
					else {
						filter.addClass(activeClass);
						currentFilter = currentFilter ? currentFilter +  "/" + link.attr('href') : link.attr('href');
						
					}
				}
				
				filterProjects();
			})
		})

		var newBlock;
		btn.click(function(e){
			e.preventDefault();
			$.ajax({
				url: btn.attr('href'),
				dataType: 'html',
				success: function(msg){
					newBlock = $(msg);
					newBlock.appendTo($('body')).css({
						'position': 'absolute',
						'left': -99999
					})
					var newProjects = newBlock.find('.project');
					if (newProjects.length > 0) {
						appendProjects(newProjects);	
					}
					else {
						btn.fadeOut();
					}
				},
				error: function(){
					alert('Error loading')
				}
			})
			

		})

		function appendProjects(elems){
			target.css({
				'height': target.height()
			})
			var elemsF = elems.clone().appendTo(fake);
			elemsF.hide();
			elems.appendTo(target);
			projects = target.find('.project');
			filterProjects();
			newBlock.remove();
		}
	})
}

// placeholder class
;(function(){
	var placeholderCollection = [];
	PlaceholderInput = function() {
		this.options = {
			element:null,
			showUntilTyping:false,
			wrapWithElement:false,
			getParentByClass:false,
			showPasswordBullets:false,
			placeholderAttr:'value',
			inputFocusClass:'focus',
			inputActiveClass:'text-active',
			parentFocusClass:'parent-focus',
			parentActiveClass:'parent-active',
			labelFocusClass:'label-focus',
			labelActiveClass:'label-active',
			fakeElementClass:'input-placeholder-text'
		};
		placeholderCollection.push(this);
		this.init.apply(this,arguments);
	};
	PlaceholderInput.refreshAllInputs = function(except) {
		for(var i = 0; i < placeholderCollection.length; i++) {
			if(except !== placeholderCollection[i]) {
				placeholderCollection[i].refreshState();
			}
		}
	};
	PlaceholderInput.replaceByOptions = function(opt) {
		var inputs = [].concat(
			convertToArray(document.getElementsByTagName('input')),
			convertToArray(document.getElementsByTagName('textarea'))
		);
		for(var i = 0; i < inputs.length; i++) {
			if(inputs[i].className.indexOf(opt.skipClass) < 0) {
				var inputType = getInputType(inputs[i]);
				var placeholderValue = inputs[i].getAttribute('placeholder');
				if(opt.focusOnly || (opt.clearInputs && (inputType === 'text' || inputType === 'email' || placeholderValue)) ||
					(opt.clearTextareas && inputType === 'textarea') ||
					(opt.clearPasswords && inputType === 'password')
				) {
					new PlaceholderInput({
						element:inputs[i],
						focusOnly: opt.focusOnly,
						wrapWithElement:opt.wrapWithElement,
						showUntilTyping:opt.showUntilTyping,
						getParentByClass:opt.getParentByClass,
						showPasswordBullets:opt.showPasswordBullets,
						placeholderAttr: placeholderValue ? 'placeholder' : opt.placeholderAttr
					});
				}
			}
		}
	};
	PlaceholderInput.prototype = {
		init: function(opt) {
			this.setOptions(opt);
			if(this.element && this.element.PlaceholderInst) {
				this.element.PlaceholderInst.refreshClasses();
			} else {
				this.element.PlaceholderInst = this;
				if(this.elementType !== 'radio' || this.elementType !== 'checkbox' || this.elementType !== 'file') {
					this.initElements();
					this.attachEvents();
					this.refreshClasses();
				}
			}
		},
		setOptions: function(opt) {
			for(var p in opt) {
				if(opt.hasOwnProperty(p)) {
					this.options[p] = opt[p];
				}
			}
			if(this.options.element) {
				this.element = this.options.element;
				this.elementType = getInputType(this.element);
				if(this.options.focusOnly) {
					this.wrapWithElement = false;
				} else {
					if(this.elementType === 'password' && this.options.showPasswordBullets) {
						this.wrapWithElement = false;
					} else {
						this.wrapWithElement = this.elementType === 'password' || this.options.showUntilTyping ? true : this.options.wrapWithElement;
					}
				}
				this.setPlaceholderValue(this.options.placeholderAttr);
			}
		},
		setPlaceholderValue: function(attr) {
			this.origValue = (attr === 'value' ? this.element.defaultValue : (this.element.getAttribute(attr) || ''));
			if(this.options.placeholderAttr !== 'value') {
				this.element.removeAttribute(this.options.placeholderAttr);
			}
		},
		initElements: function() {
			// create fake element if needed
			if(this.wrapWithElement) {
				this.fakeElement = document.createElement('span');
				this.fakeElement.className = this.options.fakeElementClass;
				this.fakeElement.innerHTML += this.origValue;
				this.fakeElement.style.color = getStyle(this.element, 'color');
				this.fakeElement.style.position = 'absolute';
				this.element.parentNode.insertBefore(this.fakeElement, this.element);
				
				if(this.element.value === this.origValue || !this.element.value) {
					this.element.value = '';
					this.togglePlaceholderText(true);
				} else {
					this.togglePlaceholderText(false);
				}
			} else if(!this.element.value && this.origValue.length) {
				this.element.value = this.origValue;
			}
			// get input label
			if(this.element.id) {
				this.labels = document.getElementsByTagName('label');
				for(var i = 0; i < this.labels.length; i++) {
					if(this.labels[i].htmlFor === this.element.id) {
						this.labelFor = this.labels[i];
						break;
					}
				}
			}
			// get parent node (or parentNode by className)
			this.elementParent = this.element.parentNode;
			if(typeof this.options.getParentByClass === 'string') {
				var el = this.element;
				while(el.parentNode) {
					if(hasClass(el.parentNode, this.options.getParentByClass)) {
						this.elementParent = el.parentNode;
						break;
					} else {
						el = el.parentNode;
					}
				}
			}
		},
		attachEvents: function() {
			this.element.onfocus = bindScope(this.focusHandler, this);
			this.element.onblur = bindScope(this.blurHandler, this);
			if(this.options.showUntilTyping) {
				this.element.onkeydown = bindScope(this.typingHandler, this);
				this.element.onpaste = bindScope(this.typingHandler, this);
			}
			if(this.wrapWithElement) this.fakeElement.onclick = bindScope(this.focusSetter, this);
		},
		togglePlaceholderText: function(state) {
			if(!this.element.readOnly && !this.options.focusOnly) {
				if(this.wrapWithElement) {
					this.fakeElement.style.display = state ? '' : 'none';
				} else {
					this.element.value = state ? this.origValue : '';
				}
			}
		},
		focusSetter: function() {
			this.element.focus();
		},
		focusHandler: function() {
			clearInterval(this.checkerInterval);
			this.checkerInterval = setInterval(bindScope(this.intervalHandler,this), 1);
			this.focused = true;
			if(!this.element.value.length || this.element.value === this.origValue) {
				if(!this.options.showUntilTyping) {
					this.togglePlaceholderText(false);
				}
			}
			this.refreshClasses();
		},
		blurHandler: function() {
			clearInterval(this.checkerInterval);
			this.focused = false;
			if(!this.element.value.length || this.element.value === this.origValue) {
				this.togglePlaceholderText(true);
			}
			this.refreshClasses();
			PlaceholderInput.refreshAllInputs(this);
		},
		typingHandler: function() {
			setTimeout(bindScope(function(){
				if(this.element.value.length) {
					this.togglePlaceholderText(false);
					this.refreshClasses();
				}
			},this), 10);
		},
		intervalHandler: function() {
			if(typeof this.tmpValue === 'undefined') {
				this.tmpValue = this.element.value;
			}
			if(this.tmpValue != this.element.value) {
				PlaceholderInput.refreshAllInputs(this);
			}
		},
		refreshState: function() {
			if(this.wrapWithElement) {
				if(this.element.value.length && this.element.value !== this.origValue) {
					this.togglePlaceholderText(false);
				} else if(!this.element.value.length) {
					this.togglePlaceholderText(true);
				}
			}
			this.refreshClasses();
		},
		refreshClasses: function() {
			this.textActive = this.focused || (this.element.value.length && this.element.value !== this.origValue);
			this.setStateClass(this.element, this.options.inputFocusClass,this.focused);
			this.setStateClass(this.elementParent, this.options.parentFocusClass,this.focused);
			this.setStateClass(this.labelFor, this.options.labelFocusClass,this.focused);
			this.setStateClass(this.element, this.options.inputActiveClass, this.textActive);
			this.setStateClass(this.elementParent, this.options.parentActiveClass, this.textActive);
			this.setStateClass(this.labelFor, this.options.labelActiveClass, this.textActive);
		},
		setStateClass: function(el,cls,state) {
			if(!el) return; else if(state) addClass(el,cls); else removeClass(el,cls);
		}
	};
	
	// utility functions
	function convertToArray(collection) {
		var arr = [];
		for (var i = 0, ref = arr.length = collection.length; i < ref; i++) {
			arr[i] = collection[i];
		}
		return arr;
	}
	function getInputType(input) {
		return (input.type ? input.type : input.tagName).toLowerCase();
	}
	function hasClass(el,cls) {
		return el.className ? el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : false;
	}
	function addClass(el,cls) {
		if (!hasClass(el,cls)) el.className += " "+cls;
	}
	function removeClass(el,cls) {
		if (hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
	}
	function bindScope(f, scope) {
		return function() {return f.apply(scope, arguments);};
	}
	function getStyle(el, prop) {
		if (document.defaultView && document.defaultView.getComputedStyle) {
			return document.defaultView.getComputedStyle(el, null)[prop];
		} else if (el.currentStyle) {
			return el.currentStyle[prop];
		} else {
			return el.style[prop];
		}
	}
}());