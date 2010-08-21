(function($) {
    var debugMode = true;
    
    function debug(msg){
        if(debugMode && window.console && window.console.log){
            window.console.log(msg);
        }
    }
    
    $.fn.extend({
        accessibleAccordion: function(config){
            var defaults = {
                'handle': 'h3',
                'panel': '.panel',
                'speed': 'fast',
                'openClass': 'open',
                'activeClass': 'active',
                'toggle': true
            };
            this.options = $.extend(defaults, config);
            var o = this;
            return this.each(function(){
                var el = $(this);
                el.find(">li>" + o.options.panel).hide();
                el.find(">li " + o.options.handle).wrapInner('<a class="open-panel" href="#" />').click(function(event){
                    event.preventDefault();
                    var clicked = $(this);
                    var clickedLi = clicked.closest("li");
                    if ((clickedLi.hasClass(o.options.activeClass) && o.options.toggle) || !clickedLi.hasClass(o.options.activeClass)) {
                        var clickedPanel = clickedLi.find(">" + o.options.panel).first();
                        var openPanel = clickedLi.parent().find(">li>." + o.options.openClass);
                        clickedLi.parent().find('.' + o.options.activeClass).removeClass(o.options.activeClass);
                        if (clickedPanel.is(":hidden")) {
                            if (openPanel.length) {
                                openPanel.slideUp(o.options.speed);
                                openPanel.removeClass(o.options.openClass);
                            }
                            clickedPanel.slideDown(o.options.speed);
                            clickedPanel.addClass(o.options.openClass);
                            clickedLi.addClass(o.options.activeClass);
                        } else {
                            clickedPanel.slideUp(o.options.speed);
                            el.removeClass(o.options.openClass);
                        }
                    }
                });
                var toggle = o.options.toggle;
                if (!toggle) o.options.toggle = true;
                el.find(">li." + o.options.activeClass + " " + o.options.handle).click();
                if (!toggle) o.options.toggle = false;
            });
        }
    });
})(jQuery);