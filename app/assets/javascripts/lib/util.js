Util = {
	android: function() {
		var agent = navigator.userAgent.toLowerCase(); 
		var otherBrowser = (agent.indexOf("series60") != -1) || (agent.indexOf("symbian") != -1) || (agent.indexOf("windows ce") != -1) || (agent.indexOf("blackberry") != -1); 
		var mobileOS = typeof orientation != 'undefined' ? true : false; 
		var touchOS = ('ontouchstart' in document.documentElement) ? true : false; 
		var iOS = (navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || 
				(navigator.platform.indexOf("iPad") != -1) ? true : false; 
		return (agent.indexOf("android") != -1) || (!iOS && !otherBrowser && touchOS && mobileOS) ? true : false; 
	},
    initial: function(scope) {
        scope.IE = jQuery.browser.msie === true;
        scope.FIREFOX = jQuery.browser.mozilla === true;
        scope.OPERA = jQuery.browser.opera === true;
        scope.WEBKIT = jQuery.browser.webkit === true;
        scope.SAFARI = jQuery.browser.webkit === true && (navigator.vendor.indexOf("Apple Computer, Inc.")>=0);
        scope.CHROME = jQuery.browser.webkit === true && (navigator.vendor.indexOf("Google Inc.")>=0);
        scope.iPod = navigator.platform === 'iPod' && jQuery.browser.webkit === true && (navigator.vendor.indexOf("Apple Computer, Inc.")>=0);
        scope.iPad = navigator.platform === 'iPad' && jQuery.browser.webkit === true && (navigator.vendor.indexOf("Apple Computer, Inc.")>=0);
        scope.iPhone = navigator.platform === 'iPhone' && jQuery.browser.webkit === true && (navigator.vendor.indexOf("Apple Computer, Inc.")>=0);
        scope.iDevice = scope.iPad || scope.iPod || scope.iPhone;
        scope.ANDROID = this.android();
        scope.WINDOWSPHONE = /Windows Phone/i.test(navigator.userAgent);
        scope.VERSION = jQuery.browser.version;
        scope.PHONE = /Windows Phone|Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    getIsMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    componentFromDom: function(klass, dom) {
        var target = $(dom);
        while (target && !target.hasClass(klass)) {
            target = target.parent();
        }
        return Ext.getCmp(target.attr('id'));
    },
    isString: function(value) {
        return typeof value === 'string'
    },
    requestCallback: function(method, url, id, params, data, callback) {
        mainurl = $(location).attr('href');
        mainurl = '/' + mainurl.split('/page/')[1].split('?')[0];
        if (url) {
            if (url[0] != '/') {
                mainurl += '/';
            }
            mainurl += url;
        }
        if (id != undefined) {
            mainurl += '/' + id;
        }
        var config = {
            url: Ext.urlAppend(mainurl, Ext.urlEncode(params)),
            type: method,
            async: true,
            success: function(response) {
                if (Ext.isString(response))
                {
                    response = Ext.JSON.decode(response);
                }
                if (response.success)
                {
                    function success()
                    {
                        if (callback)
                        {
                            callback(response.data);
                        }
                    }
					if (response.message)
					{
						Ext.Msg.alert('message', response.message, success);
					}
					else
					{
                        success();
					}
                }
                else
                {
                    Ext.Msg.alert('error', response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown){
                Ext.Msg.alert(textStatus, errorThrown);
            }
        }
        if (method == 'PUT' || method == 'POST') {
            config.beforeSend = function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))};
        }
        if (data) {
            config.data = "data=" + encodeURIComponent(JSON.stringify(data));
        }
       $.ajax(config);
    },
    // call: function(fn, data, callback) {
        // $.ajax({
            // url: $(location).attr('href')+'?function='+fn,
            // type: 'POST',
            // data: "data=" + encodeURIComponent(JSON.stringify(data)),
            // success: function(returnData) {
                // if (callback) {
                    // callback(returnData.data);
                // }
            // }
        // });
    // },
    getScreenSize: function() {
        var width = document.body.parentNode.clientWidth;
        var height = document.body.parentNode.clientHeight;
        return { width: width, height: height };
    },
    genCode: function(len, existFn) {
        var result = '';
        do {
            for (var i=0; i<len; i++) {
                result += String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
        while (existFn && existFn(result));
        return result;
    },
    toFloat: function(value) {
        if (value) {
            if (value == null) {
                return 0;
            }
            else if (Ext.isString(value)) {
                var cleanstr = value.replace(/,/g,'');
                return parseFloat(cleanstr);
            }
            else {
                return value;
            }
        }
        else {
            return 0;
        }
    },
    bindClick: function(elements, callback) {
        var touchflag = false;
        var startX;
        var startY;
        if (WINDOWSPHONE) {
            elements.bind('MSPointerDown', function(event) {
                var touch = event.originalEvent;
                startX = touch.pageX;
                startY = touch.pageY;
                touchflag = true;
            });
            elements.bind('MSPointerMove', function(event) {
                var touch = event.originalEvent;
                if (Math.abs(touch.pageX - startX) > 10 || Math.abs(touch.pageY - startY) > 10) {
                    touchflag = false;
                }
            });
            elements.bind('MSPointerUp', function(event) {
                if (touchflag) {
                    callback(this);
                }
                touchflag = false;
            });
        }
        else if (iDevice) {
            elements.bind('touchstart', function(event) {
                var touch = event.originalEvent.touches[0];
                startX = touch.pageX;
                startY = touch.pageY;
                touchflag = true;
            });
            elements.bind('touchmove', function(event) {
                var touch = event.originalEvent.touches[0];
                if (Math.abs(touch.pageX - startX) > 10 || Math.abs(touch.pageY - startY) > 10) {
                    touchflag = false;
                }
            });
            elements.bind('touchend', function(event) {
                if (touchflag) {
                    callback(this);
                }
                touchflag = false;
            });
        }
        else {
            elements.bind('mousedown', function(event) {
                var touch = event;
                startX = touch.pageX;
                startY = touch.pageY;
                touchflag = true;
            });
            elements.bind('mousemove', function(event) {
                var touch = event;
                if (Math.abs(touch.pageX - startX) > 10 || Math.abs(touch.pageY - startY) > 10) {
                    touchflag = false;
                }
            });
            elements.bind('mouseup', function(event) {
                if (touchflag) {
                    callback(this);
                }
                touchflag = false;
            });
        }
    },
    dateToStr: function(date) {
        return Ext.util.Format.date(date, "Y-m-d");
    },
}