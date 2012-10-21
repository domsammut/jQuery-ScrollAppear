/*
* jQuery ScrollAppear 0.9.1
* Copyright (c) 2012 Dom Sammut
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
*
* Requires jQuery v 1.7.0 +
* Documentation at http://www.domsammut.com
*/

/*jslint browser: true*/
/*global jQuery*/
/*jslint unparam: true*/

(function ($) {
    "use strict";

    var action = {

        init : function (params) {

            var settings = $.prototype.extend({
                AddClass		: 'scrollshow',
                DelayEffect		: 0,
                EffectDuration	: 'fast',
                ElementAffect	: 'div',
                ElementsToShow	: 3,
                NumberOfScrolls : 100,
                PixelOffset		: 0,
                Timeout			: 1000,
                TriggerIntent	: true,
                TriggerType		: 'scroll'
            }, params);

            action.settings = settings;
            action.settings.t = $(this);
            action.BindEvent();
            action.GatherElements();

            return this;
        },
        InternalSettings : {
            counter			: 0,
            ShowElements	: [],
            BoolTimeout		: false,
            NumOfEl			: 0
        },
        BindEvent : function () {
            $(window).on(action.settings.TriggerType, function (e) {
                e.stopImmediatePropagation();
                action.CheckScroll();
            });
            return this;
        },
        UnbindEvent : function () {
            $(window).off(action.settings.TriggerType);
            return this;
        },
        ResetCounter : function () {
            action.InternalSettings.counter = 0;
            return this;
        },
        GatherElements : function () {
            this.el = $(action.settings.ElementAffect);
            for (this.g = 0; this.g < this.el.length; this.g += 1) {
                if (action.CheckClassArray(this.el[this.g]) === false) {
                    action.InternalSettings.ShowElements.push(this.el[this.g]);
                }
            }
            action.InternalSettings.ResetElements = action.InternalSettings.ShowElements.slice();
            action.InternalSettings.NumOfEl = action.InternalSettings.ShowElements.length;
            return this;
        },
        CheckCount : function () {
            if (action.InternalSettings.ShowElements.length > 1) {
                if (action.InternalSettings.counter <=  action.settings.NumberOfScrolls) {
                    return true;
                }
            }
            return false;
        },
        CheckScroll : function () {
            if (action.InternalSettings.BoolTimeout === false) {
                if (action.CheckCount() === true) {
                    if (action.GetElementPosition() === true) {

                        action.InternalSettings.BoolTimeout = true;

                        action.ShowElements();

                        /*
                        * Prevent mass scroll appear by default
                        *
                        * This can be disabled by using the following settings:
                        *	Timeout : 0,
                        *	TriggerIntent : false
                        */
                        setTimeout(function () {

                            action.InternalSettings.BoolTimeout = false;

                            if (action.settings.TriggerIntent === true) {
                                action.CheckScroll();
                            }

                        }, action.settings.Timeout);
                    }
                }
            }
        },
        ShowElements : function () {
        /*
        * This is where the effects are applied. Change to your liking.
        * This currently isn't a parameter.
        */
            if (action.CheckCount() === true) {
                var count = 0;
                while (count < action.settings.ElementsToShow) {
                    $(action.InternalSettings.ShowElements[count]).hide();
                    $(action.InternalSettings.ShowElements[count]).addClass(action.settings.AddClass);
                    $(action.InternalSettings.ShowElements[count]).delay(count * action.settings.DelayEffect).fadeIn(action.settings.EffectDuration);
                    count += 1;
                }
                action.InternalSettings.ShowElements.splice(0, action.settings.ElementsToShow); //remove this element
                action.InternalSettings.counter += 1;
            }
            return this;
        },
        HideElements : function (amount) {
            if (action.InternalSettings.counter !== 0) {
                if (amount === "all") {
                    for (this.a = 0; this.a < action.InternalSettings.ResetElements.length; this.a += 1) {
                        $(action.InternalSettings.ResetElements[this.a]).removeClass(action.settings.AddClass);
                    }
                    action.InternalSettings.counter = 0;
                    action.InternalSettings.NumOfEl = 0;
                    action.InternalSettings.ShowElements = [];
                    action.InternalSettings.ResetElements = [];
                    action.GatherElements();
                } else {

                    try {
                        if (typeof amount === "number") {
                            //hide from last shown
                            var c = 1, pos = action.InternalSettings.ResetElements.length - action.InternalSettings.ShowElements.length;

                            while ((amount >= c) &&  (action.InternalSettings.ShowElements.length  <=  action.InternalSettings.NumOfEl)) {

                                $(action.InternalSettings.ResetElements[pos - c]).removeClass(action.settings.AddClass);
                                action.InternalSettings.ShowElements.splice(0, 0, action.InternalSettings.ResetElements[pos - c]);

                                c += 1;
                            }

                        } else {
                            $.error("Parameter passed in must be numerical or a string that matches 'all'.");
                        }

                    } catch (e) {
                        $.error("Parameter passed in must be numerical or a string that matches 'all'.");
                    }
                }
            }
            return this;
        },
        Destroy : function () {
            action.UnbindEvent();
            action.ResetCounter();
            action.settings = [];
            action.InternalSettings = {counter : 0, ShowElements : [], BoolTimeout : false, NumOfEl : 0};
            return this;
        },
        GetElementPosition : function () {

            this.top = action.settings.t.offset().top - action.settings.PixelOffset;
            this.left = action.settings.t.offset().left;
            this.width =  action.settings.t.width();
            this.height = action.settings.t.height();

            return (
                this.top >= window.pageYOffset &&
                this.left >= window.pageXOffset &&
                ((this.top + this.height)) <= (window.pageYOffset + window.innerHeight) &&
                (this.left + this.width) <= (window.pageXOffset + window.innerWidth)
            );

        },
        DomUpdate : function () {
            action.InternalSettings.ShowElements = [];
            action.InternalSettings.ResetElements = [];
            action.GatherElements();

        },
        CheckClassArray : function (el) {
            action.CheckClassArray.el = $(el);

            if (action.settings.AddClass.indexOf(' ') > 0) {
                var list = action.settings.AddClass.split(' ');

                for (this.c = 0; this.c < list.length; this.c += 1) {
                    if (action.CheckClassArray.el.hasClass(list[this.c])) {
                        return true;
                    }
                }
            } else {
                if (action.CheckClassArray.el.hasClass(action.settings.AddClass)) {
                    return true;
                }
            }
            return false;

        }
    };

	$.prototype.ScrollAppear = function (method) {
		if (action[method]) {
			return action[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
        if (typeof method === "object" || !method) {
			return action.init.apply(this, arguments);
        }
        $.error("Action " + method + " does not exist, ensure you have spelt it correctly along with correct letter case.");
	};

	$.each(['append', 'appendTo',  'html', 'prepend', 'prependTo', 'after', 'before', 'insertBefore', 'insertAfter', 'remove', 'unwrap', 'wrap', 'wrapAll', 'wrapInner'], function (index, trigger) {
		var prev = $.prototype[trigger];
		if (prev) {
			$.prototype[trigger] = function () {
				var passthrough = prev.apply(this, arguments);
				$.prototype.ScrollAppear('DomUpdate');
				return passthrough;
			};
		}
	});
}(jQuery));