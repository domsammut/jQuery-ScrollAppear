/*
* jQuery ScrollAppear 0.9 
* Copyright (c) 2012 Dom Sammut
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
*
* Requires jQuery v 1.7.0 +
* Documentation at http://www.domsammut.com
*/


(function($) {
"use strict";

		var action = {
			init				: function ( params ) {
			
				var settings = $.prototype.extend( {
					'ElementAffect'		: 'div',
					'PixelOffset'		: 0,
					'NumberOfScrolls'	: 100,
					'Timeout'			: 1000,
					'DelayEffect'		: 110,
					'ElementsToShow'	: 3,
					'Animation'			: 'slideDown()',
					'AddClass'			: 'show',
					'TriggerType'		: 'scroll'
				}, params);
				
				action.settings = settings;
				action.settings.t = $(this);
				action.BindEvent();
				action.GatherElements();

				return this;
					
			},  
			InternalSettings	: {
				counter			: 0,
				ShowElements	: [],
				BOLtimeout		: false
			}, 
			BindEvent			: function() {
				$(window).on(action.settings.TriggerType, function(event) {
					event.preventDefault();
					action.CheckScroll(); 
				});
				return this;
			},
			UnbindEvent			: function() {
				$(window).off(action.settings.TriggerType);
				return this;
			},
			ResetCounter		: function() {
				action.InternalSettings.counter = 0;
				return this;
			},
			GatherElements		: function() {
				this.el = $(action.settings.ElementAffect);
				for(this.g=0;this.g<this.el.length;this.g++) {
					if( action.CheckClassArray(this.el[this.g]) === false ) {		
						action.InternalSettings.ShowElements.push(this.el[this.g]);
					}
				}
				action.InternalSettings.ResetElements = action.InternalSettings.ShowElements.slice();		
			},
			CheckCount			: function() {
				if(action.InternalSettings.ShowElements.length > 1 ) {
					if( action.InternalSettings.counter <=  action.settings.NumberOfScrolls) {
						return true;
					}
				}
				return false;
			},
			CheckScroll			: function() {	
				if(action.InternalSettings.BOLtimeout === false) {
					if(action.CheckCount() === true) {
						if(action.GetElementPosition() === true) {
							action.InternalSettings.BOLtimeout = true;
							action.ShowElements();
							setTimeout(function(){action.InternalSettings.BOLtimeout = false;}, action.settings.Timeout);
						}	
					} 
				}
			},
			ShowElements		: function() {
				if(action.CheckCount() === true) {
					var count = 0;
					while(count < action.settings.ElementsToShow) {
						$(action.InternalSettings.ShowElements[count]).hide();
						$(action.InternalSettings.ShowElements[count]).addClass(action.settings.AddClass);
						$(action.InternalSettings.ShowElements[count]).delay(count * action.settings.DelayEffect).fadeIn('50');
						count++;
					}
					action.InternalSettings.ShowElements.splice(0,action.settings.ElementsToShow); //remove this element
					action.InternalSettings.counter++;
				} 
				return this;
			},
			HideElements		: function( amount ) {
				if(amount==='all') {
					for(this.a=0;this.a<action.InternalSettings.ResetElements.length;this.a++) {
						$(action.InternalSettings.ResetElements[this.a]).removeClass(action.settings.AddClass);
					}
					action.InternalSettings.counter = 0;
					action.InternalSettings.ShowElements = [];
					action.InternalSettings.ResetElements = [];
					action.GatherElements();
				}
				return this;
			},
			Destroy				: function() {
				action.UnbindEvent();
				action.ResetCounter();
				action.settings = [];
				action.InternalSettings = {counter : 0, ShowElements : [], BOLtimeout : false};
				return this;
			},
			GetElementPosition	: function() {
	
				this.top = action.settings.t.offset().top - action.settings.PixelOffset;
				this.left = action.settings.t.offset().left;
				this.width =  action.settings.t.width();
				this.height = action.settings.t.height();
				
				return (
					this.top >= window.pageYOffset &&
					this.left >= window.pageXOffset &&
					((this.top + this.height) ) <= (window.pageYOffset + window.innerHeight) &&
					(this.left + this.width) <= (window.pageXOffset + window.innerWidth)
				);
				
			},
			DomUpdate			: function() {
				action.InternalSettings.ShowElements = [];
				action.InternalSettings.ResetElements = [];
				action.GatherElements();
			},
			CheckClassArray		: function(el) {
				action.CheckClassArray.el = $(el);
			
				if(action.settings.AddClass.indexOf(' ') > 0) {
					var list = action.settings.AddClass.split(' ');
					for(var c in list) {
						if( action.CheckClassArray.el.hasClass(list[c]) ) {
							return true;
						}
					}
				} else {
					if( action.CheckClassArray.el.hasClass(action.settings.AddClass) ) {
						return true;
					}
				}
				return false;

			}
		};
	
	$.prototype.ScrollAppear = function( method ) {
		
		if(action[method]) {
			return action[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || ! method) {
			return action.init.apply(this, arguments);
		} else {
			$.error("Method " + method + " does not exist, ensure you have spelt it correctly along with correct letter case");
		}
		
	};	
	
	
	$.each(['append', 'appendTo',  'html', 'prepend', 'prependTo', 'after', 'before', 'insertBefore', 'insertAfter', 'remove', 'unwrap', 'wrap', 'wrapAll', 'wrapInner'], function(index, trigger) {
		var prev = $.prototype[trigger];
		if(prev) {
			$.prototype[trigger] = function() {
				var passthrough = prev.apply(this, arguments);
				$.prototype.ScrollAppear('DomUpdate');
				return passthrough;
			};
		}
	});
		
}) (jQuery);