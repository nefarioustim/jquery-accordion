/*!
 * jQuery Accordion widget
 * http://nefariousdesigns.co.uk/projects/widgets/accordion/
 * 
 * Source code: http://github.com/nefarioustim/jquery-accordion/
 *
 * Copyright © 2010 Tim Huegdon
 * http://timhuegdon.com
 */
 
(function($) {
    var debugMode = false;
    
    function debug(msg) {
        if (!debugMode) { return; }
        if (window.console && window.console.log){
            window.console.log(msg);
        } else {
            alert(msg);
        }
    }
    
    $.fn.accordion = function(config) {
        var defaults = {
            "handle": "h3",
            "panel": ".panel",
            "speed": 200,
            "easing": "swing",
            "canOpenMultiple": false,
            "canToggle": false,
            "activeClassPanel": "open",
            "activeClassLi": "active",
            "lockedClass": "locked",
            "loadingClass": "loading"
        };
        
        if (config) {
            $.extend(defaults, config);
        }
        
        this.each(function() {
            var accordion   = $(this),
                reset       = {
                    height: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0
                },
                panels      = accordion.find(">li>" + defaults.panel)
                                .each(function() {
                                    var el = $(this);
                                    el
                                        .removeClass(defaults.loadingClass)
                                        .css("visibility", "hidden")
                                        .data("dimensions", {
                                            marginTop:      el.css("marginTop"),
                                            marginBottom:   el.css("marginBottom"),
                                            paddingTop:     el.css("paddingTop"),
                                            paddingBottom:  el.css("paddingBottom"),
                                            height:         this.offsetHeight - parseInt(el.css("paddingTop")) - parseInt(el.css("paddingBottom"))
                                        })
                                        .bind("panel-open.accordion", function(e, clickedLi) {
                                            var panel = $(this);
                                            clickedLi.addClass(defaults.activeClassLi);
                                            panel
                                                .css($.extend({overflow: "hidden"}, reset))
                                                .addClass(defaults.activeClassPanel)
                                                .show()
                                                .animate($.browser.msie && parseInt($.browser.version) < 8 ? panel.data("dimensions") : $.extend({opacity: 1}, panel.data("dimensions")), {
                                                    duration:   defaults.speed,
                                                    easing:     defaults.easing,
                                                    queue:      false,
                                                    complete:   function(e) {
                                                        if ($.browser.msie) {
                                                            this.style.removeAttribute('filter');
                                                        }
                                                        $(this).removeAttr("style");
                                                    }
                                                });
                                        })
                                        .bind("panel-close.accordion", function(e) {
                                            var panel = $(this);
                                            panel.closest("li").removeClass(defaults.activeClassLi);
                                            panel
                                                .removeClass(defaults.activeClassPanel)
                                                .css({
                                                    overflow: "hidden"
                                                })
                                                .animate($.browser.msie && parseInt($.browser.version) < 8 ? reset : $.extend({opacity: 0}, reset), {
                                                    duration:   defaults.speed,
                                                    easing:     defaults.easing,
                                                    queue:      false,
                                                    complete:   function(e) {
                                                        if ($.browser.msie) {
                                                            this.style.removeAttribute('filter');
                                                        }
                                                        panel.hide();
                                                    }
                                                });
                                        })
                                        .hide()
                                        .css("visibility", "visible");
                                    
                                    return el;
                                }),
                handles     = accordion.find(
                                " > li > "
                                + defaults.handle
                            )
                                .wrapInner('<a class="accordion-opener" href="#open-panel" />');
            
            accordion
                .find(
                    " > li."
                    + defaults.activeClassLi
                    + " > "
                    + defaults.panel
                    + ", > li."
                    + defaults.lockedClass
                    + " > "
                    + defaults.panel
                )
                .show()
                .addClass(defaults.activeClassPanel);
            
            var active = accordion.find(
                " > li."
                + defaults.activeClassLi
                + ", > li."
                + defaults.lockedClass
            );
            
            if (!defaults.canToggle && active.length < 1) {
                accordion
                    .find(" > li")
                    .first()
                    .addClass(defaults.activeClassLi)
                    .find(" > " + defaults.panel)
                    .addClass(defaults.activeClassPanel)
                    .show();
            }
            
            accordion.delegate(".accordion-opener", "click", function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                var clicked     = $(this),
                    clickedLi   = clicked.closest("li"),
                    panel       = clickedLi.find(">" + defaults.panel).first(),
                    open        = accordion.find(
                        " > li:not(."
                        + defaults.lockedClass
                        + ") > "
                        + defaults.panel
                        + "."
                        + defaults.activeClassPanel
                    );
                
                if (!clickedLi.hasClass(defaults.lockedClass)) {
                    if (panel.is(":visible")) {
                        if (defaults.canToggle) {
                            panel.trigger("panel-close");
                        }
                    } else {
                        panel.trigger("panel-open", [clickedLi]);
                        if (!defaults.canOpenMultiple) {
                            open.trigger("panel-close");
                        }
                    }
                }
            });
        });
        
        return this;
    };
})(jQuery);